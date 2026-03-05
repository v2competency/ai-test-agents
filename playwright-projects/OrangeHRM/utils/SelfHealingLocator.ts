// utils/SelfHealingLocator.ts
import { Page, Locator } from '@playwright/test';
import * as path from 'path';
import { AIObserver } from './AIObserver';
import { HealingReporter } from './HealingReporter';
import { ILocatorStrategy } from './LocatorStrategy';
import { saveHealedSelector } from './HealingPatcher';

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
    // Primary, cached, and fallback selectors all compete — first match wins
    const candidates: { selector: string; method: HealingMethod }[] = [];

    // Add primary first (highest priority)
    candidates.push({ selector: element.primary, method: 'primary' });

    // Add cached selector if available
    const cached = this.cache.get(element.name);
    if (cached && cached !== element.primary) {
      candidates.push({ selector: cached, method: 'cache' });
    }

    // Add fallbacks
    for (const fallback of element.fallbacks) {
      if (!candidates.some(c => c.selector === fallback)) {
        candidates.push({ selector: fallback, method: 'fallback' });
      }
    }

    // Race all candidates — whichever element becomes visible first wins
    const raceResult = await this.raceSelectors(candidates, timeout);

    if (raceResult) {
      const { locator, selector, method } = raceResult;
      if (method !== 'primary') {
        console.log(`[SelfHealing] Primary failed, ${method} worked for "${element.name}": ${selector}`);
        this.cache.set(element.name, selector);
      }
      this.reporter.record(element.name, element.primary, selector, method, Date.now() - start);
      return locator;
    }

    // All static selectors failed — clear stale cache
    if (cached) {
      this.cache.delete(element.name);
    }

    console.log(`[SelfHealing] All static selectors failed for "${element.name}". Attempting AI healing...`);

    // PHASE 2: AI Visual Analysis (only reached if ALL static selectors failed)
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

    // All healing strategies failed
    const elapsed = Date.now() - start;
    console.log(`[SelfHealing] ALL strategies failed for "${element.name}" after ${elapsed}ms`);
    this.reporter.record(element.name, element.primary, null, 'failed', elapsed);
    throw new Error(`[Self-Healing Failed] Could not locate element: ${element.name} - ${element.description}`);
  }

  /**
   * Race multiple selectors in parallel — first visible match wins
   */
  private async raceSelectors(
    candidates: { selector: string; method: HealingMethod }[],
    timeout: number
  ): Promise<{ locator: Locator; selector: string; method: HealingMethod } | null> {
    type RaceResult = { locator: Locator; selector: string; method: HealingMethod };

    // Wrap each candidate so rejections (selector not found) resolve as null instead
    const racers = candidates.map(({ selector, method }) => {
      const locator = this.page.locator(selector).first();
      return locator
        .waitFor({ state: 'visible', timeout })
        .then((): RaceResult | null => ({ locator, selector, method }))
        .catch((): RaceResult | null => null);
    });

    // Timeout fallback
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), timeout));

    // Promise.race returns the first settled — since failures resolve as null,
    // we need to wait for the first NON-null result
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

      // Absolute timeout safety net
      timeoutPromise.then(() => {
        if (!resolved) {
          resolved = true;
          resolve(null);
        }
      });
    });
  }

  /**
   * Fill an input element with self-healing
   */
  async fill(element: ElementDefinition, value: string): Promise<void> {
    const locator = await this.locate(element);
    await locator.fill(value);
  }

  /**
   * Click an element with self-healing
   */
  async click(element: ElementDefinition): Promise<void> {
    const locator = await this.locate(element);
    await locator.click();
  }

  /**
   * Get text content of an element with self-healing
   */
  async getText(element: ElementDefinition): Promise<string> {
    const locator = await this.locate(element);
    return await locator.textContent() || '';
  }

  /**
   * Check if element is visible (skips AI healing to avoid slow API calls for existence checks)
   */
  async isVisible(element: ElementDefinition, timeout = 3000): Promise<boolean> {
    const perTierTimeout = Math.max(timeout / 3, 1000);

    // Try primary selector
    try {
      const locator = this.page.locator(element.primary);
      await locator.waitFor({ state: 'visible', timeout: perTierTimeout });
      return true;
    } catch {
      // Primary failed
    }

    // Try cache
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

    // Try fallbacks
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

  /**
   * Select option from dropdown with self-healing
   */
  async selectOption(element: ElementDefinition, value: string): Promise<void> {
    const locator = await this.locate(element);
    await locator.selectOption(value);
  }

  /**
   * Get healing statistics report
   */
  getReport(): string {
    return this.reporter.generateReport();
  }

  /**
   * Save healing report to file
   */
  async saveReport(path: string): Promise<void> {
    await this.reporter.save(path);
  }

  /**
   * Get raw healing statistics
   */
  getStatistics() {
    return this.reporter.getStatistics();
  }

  /**
   * Clear the selector cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}
