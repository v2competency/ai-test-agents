// utils/SelfHealingLocator.ts
import { Page, Locator } from '@playwright/test';
import * as path from 'path';
import { AIObserver } from './AIObserver';
import { HealingReporter } from './HealingReporter';
import { ILocatorStrategy } from './LocatorStrategy';
import { saveHealedSelector, saveBrokenFallbacks } from './HealingPatcher';

export interface ElementDefinition {
  name: string;
  description: string;
  primary: string;
  fallbacks: string[];
  type: 'input' | 'button' | 'link' | 'text' | 'container' | 'dropdown' | 'checkbox' | 'radio' | 'textarea';
}

export type HealingMethod = 'primary' | 'cache' | 'fallback' | 'ai_visual' | 'ai_dom' | 'failed';

export class SelfHealingLocator implements ILocatorStrategy {
  private page: Page;
  private cache: Map<string, string> = new Map();
  private aiObserver: AIObserver;
  private reporter: HealingReporter;

  private static readonly RECORDS_FILE = path.join(__dirname, '..', 'reports', 'healing-records.json');

  constructor(page: Page) {
    this.page = page;
    this.aiObserver = new AIObserver();
    this.reporter = new HealingReporter();

    // Persist healing records when the page closes (end of each test)
    page.on('close', () => {
      this.reporter.persistRecords(SelfHealingLocator.RECORDS_FILE);
    });
  }

  /**
   * Locate an element using the 4-tier self-healing strategy
   * Phase 1: Race primary + cache + fallbacks in parallel (fast path)
   * Phase 2: AI Visual Analysis (only if all static selectors failed)
   * Phase 3: AI DOM Analysis (only if vision failed)
   */
  async locate(element: ElementDefinition, timeout = 15000): Promise<Locator> {
    const start = Date.now();
    const aiTimeout = 5000;

    // PHASE 1: Race all known selectors in parallel
    const candidates: { selector: string; method: HealingMethod }[] = [];

    candidates.push({ selector: element.primary, method: 'primary' });

    const cached = this.cache.get(element.name);
    if (cached && cached !== element.primary) {
      candidates.push({ selector: cached, method: 'cache' });
    }

    for (const fallback of element.fallbacks) {
      if (!candidates.some(c => c.selector === fallback)) {
        candidates.push({ selector: fallback, method: 'fallback' });
      }
    }

    const raceResult = await this.raceSelectors(candidates, timeout);

    if (raceResult) {
      const { locator, selector, method } = raceResult;
      if (method !== 'primary') {
        console.log(`[SelfHealing] Primary failed, ${method} worked for "${element.name}": ${selector}`);
        this.cache.set(element.name, selector);
      }
      this.reporter.record(element.name, element.primary, selector, method, Date.now() - start);

      this.validateFallbacks(element, selector).catch(() => { /* ignore */ });

      return locator;
    }

    if (cached) {
      this.cache.delete(element.name);
    }

    console.log(`[SelfHealing] All static selectors failed for "${element.name}". Attempting AI healing...`);

    // PHASE 2: AI Visual Analysis
    if (this.aiObserver.isEnabled()) {
      try {
        console.log(`[SelfHealing] AI Visual analysis for "${element.name}"...`);
        const screenshot = await this.page.screenshot({ type: 'png' });
        const aiSelector = await this.aiObserver.findByVision(screenshot, element.description, element.type);

        if (aiSelector) {
          console.log(`[SelfHealing] AI Vision suggested: ${aiSelector}`);
          const locator = this.page.locator(aiSelector);
          await locator.first().waitFor({ state: 'visible', timeout: aiTimeout });
          console.log(`[SelfHealing] AI Vision healed "${element.name}" with: ${aiSelector}`);
          this.cache.set(element.name, aiSelector);
          this.reporter.record(element.name, element.primary, aiSelector, 'ai_visual', Date.now() - start);
          saveHealedSelector({
            elementName: element.name,
            originalSelector: element.primary,
            healedSelector: aiSelector,
            method: 'ai_visual',
            timestamp: new Date().toISOString()
          });
          if (element.fallbacks.length > 0) {
            saveBrokenFallbacks({
              elementName: element.name,
              brokenFallbacks: element.fallbacks,
              workingSelector: aiSelector,
              timestamp: new Date().toISOString()
            });
          }
          return locator.first();
        } else {
          console.log(`[SelfHealing] AI Vision returned no selector for "${element.name}"`);
        }
      } catch (error) {
        console.log(`[SelfHealing] AI Vision failed for "${element.name}":`, (error as Error).message);
      }

      // PHASE 3: AI DOM Analysis
      try {
        console.log(`[SelfHealing] AI DOM analysis for "${element.name}"...`);
        const html = await this.page.content();
        const aiSelector = await this.aiObserver.findByDOM(html, element.description, element.type);

        if (aiSelector) {
          console.log(`[SelfHealing] AI DOM suggested: ${aiSelector}`);
          const locator = this.page.locator(aiSelector);
          await locator.first().waitFor({ state: 'visible', timeout: aiTimeout });
          console.log(`[SelfHealing] AI DOM healed "${element.name}" with: ${aiSelector}`);
          this.cache.set(element.name, aiSelector);
          this.reporter.record(element.name, element.primary, aiSelector, 'ai_dom', Date.now() - start);
          saveHealedSelector({
            elementName: element.name,
            originalSelector: element.primary,
            healedSelector: aiSelector,
            method: 'ai_dom',
            timestamp: new Date().toISOString()
          });
          if (element.fallbacks.length > 0) {
            saveBrokenFallbacks({
              elementName: element.name,
              brokenFallbacks: element.fallbacks,
              workingSelector: aiSelector,
              timestamp: new Date().toISOString()
            });
          }
          return locator.first();
        } else {
          console.log(`[SelfHealing] AI DOM returned no selector for "${element.name}"`);
        }
      } catch (error) {
        console.log(`[SelfHealing] AI DOM failed for "${element.name}":`, (error as Error).message);
      }
    } else {
      console.log(`[SelfHealing] AI Observer is disabled. Skipping AI healing.`);
    }

    if (element.fallbacks.length > 0) {
      saveBrokenFallbacks({
        elementName: element.name,
        brokenFallbacks: element.fallbacks,
        workingSelector: '',
        timestamp: new Date().toISOString()
      });
    }

    const elapsed = Date.now() - start;
    console.log(`[SelfHealing] ALL strategies failed for "${element.name}" after ${elapsed}ms`);
    this.reporter.record(element.name, element.primary, null, 'failed', elapsed);
    throw new Error(`[Self-Healing Failed] Could not locate element: ${element.name} - ${element.description}`);
  }

  private async raceSelectors(
    candidates: { selector: string; method: HealingMethod }[],
    timeout: number
  ): Promise<{ locator: Locator; selector: string; method: HealingMethod } | null> {
    type RaceResult = { locator: Locator; selector: string; method: HealingMethod };

    const racers = candidates.map(({ selector, method }) => {
      const locator = this.page.locator(selector).first();
      return locator
        .waitFor({ state: 'visible', timeout })
        .then((): RaceResult | null => ({ locator, selector, method }))
        .catch((): RaceResult | null => null);
    });

    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), timeout));

    return new Promise<RaceResult | null>((resolve) => {
      let resolved = false;
      let pending = racers.length;

      for (const racer of racers) {
        racer.then((result) => {
          if (result && !resolved) {
            resolved = true;
            resolve(result);
          }
          pending--;
          if (pending === 0 && !resolved) {
            resolve(null);
          }
        });
      }

      timeoutPromise.then(() => {
        if (!resolved) {
          resolved = true;
          resolve(null);
        }
      });
    });
  }

  private async validateFallbacks(element: ElementDefinition, workingSelector: string): Promise<void> {
    const allSelectors = [element.primary, ...element.fallbacks];
    const brokenFallbacks: string[] = [];

    for (const selector of allSelectors) {
      if (selector === workingSelector) continue;

      try {
        const count = await this.page.locator(selector).count();
        if (count === 0) {
          brokenFallbacks.push(selector);
        }
      } catch {
        brokenFallbacks.push(selector);
      }
    }

    if (brokenFallbacks.length > 0) {
      const brokenFallbacksOnly = brokenFallbacks.filter(s => element.fallbacks.includes(s));
      if (brokenFallbacksOnly.length > 0) {
        console.log(`[SelfHealing] Broken fallbacks for "${element.name}": ${brokenFallbacksOnly.join(', ')}`);
        saveBrokenFallbacks({
          elementName: element.name,
          brokenFallbacks: brokenFallbacksOnly,
          workingSelector,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async fill(element: ElementDefinition, value: string): Promise<void> {
    const locator = await this.locate(element);
    await locator.fill(value);
  }

  async click(element: ElementDefinition): Promise<void> {
    const locator = await this.locate(element);
    await locator.click();
  }

  async getText(element: ElementDefinition): Promise<string> {
    const locator = await this.locate(element);
    return await locator.textContent() || '';
  }

  async isVisible(element: ElementDefinition, timeout = 3000): Promise<boolean> {
    const perTierTimeout = Math.max(timeout / 3, 1000);

    try {
      const locator = this.page.locator(element.primary);
      await locator.waitFor({ state: 'visible', timeout: perTierTimeout });
      return true;
    } catch {
      // Primary failed
    }

    const cached = this.cache.get(element.name);
    if (cached) {
      try {
        const locator = this.page.locator(cached);
        await locator.waitFor({ state: 'visible', timeout: perTierTimeout });
        return true;
      } catch {
        this.cache.delete(element.name);
      }
    }

    for (const fallback of element.fallbacks) {
      try {
        const locator = this.page.locator(fallback);
        const count = await locator.count();
        if (count > 0 && await locator.first().isVisible()) {
          this.cache.set(element.name, fallback);
          return true;
        }
      } catch {
        continue;
      }
    }

    return false;
  }

  async selectOption(element: ElementDefinition, value: string): Promise<void> {
    const locator = await this.locate(element);
    await locator.selectOption(value);
  }

  getReport(): string {
    return this.reporter.generateReport();
  }

  async saveReport(path: string): Promise<void> {
    await this.reporter.save(path);
  }

  getStatistics() {
    return this.reporter.getStatistics();
  }

  clearCache(): void {
    this.cache.clear();
  }
}
