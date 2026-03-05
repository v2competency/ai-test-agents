// utils/SelfHealingLocator.ts
import { Page, Locator } from '@playwright/test';
import { AIObserver } from './AIObserver';
import { HealingReporter } from './HealingReporter';
import { ILocatorStrategy } from './LocatorStrategy';

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

  constructor(page: Page) {
    this.page = page;
    this.aiObserver = new AIObserver();
    this.reporter = new HealingReporter();
  }

  /**
   * Locate an element using the 4-tier self-healing strategy
   * Tier 1: Cache (previously healed selectors)
   * Tier 2: Fallback selectors
   * Tier 3: AI Visual Analysis
   * Tier 4: AI DOM Analysis
   */
  async locate(element: ElementDefinition, timeout = 15000): Promise<Locator> {
    const start = Date.now();
    // Short timeout for primary — if element exists with correct selector, it appears fast
    // This avoids wasting time when the selector is genuinely broken
    const primaryTimeout = Math.min(timeout, 5000);
    const healingTimeout = 3000;

    // Try primary selector first
    try {
      const locator = this.page.locator(element.primary);
      await locator.waitFor({ state: 'visible', timeout: primaryTimeout });
      this.reporter.record(element.name, element.primary, element.primary, 'primary', Date.now() - start);
      return locator;
    } catch {
      console.log(`[SelfHealing] Primary selector failed for "${element.name}": ${element.primary}`);
    }

    // TIER 1: Check cache for previously healed selector
    const cached = this.cache.get(element.name);
    if (cached) {
      try {
        const locator = this.page.locator(cached);
        await locator.waitFor({ state: 'visible', timeout: healingTimeout });
        console.log(`[SelfHealing] Cache hit for "${element.name}": ${cached}`);
        this.reporter.record(element.name, element.primary, cached, 'cache', Date.now() - start);
        return locator;
      } catch {
        console.log(`[SelfHealing] Cached selector stale for "${element.name}": ${cached}`);
        this.cache.delete(element.name);
      }
    }

    // TIER 2: Try fallback selectors
    for (const fallback of element.fallbacks) {
      try {
        const locator = this.page.locator(fallback);
        await locator.waitFor({ state: 'visible', timeout: healingTimeout / element.fallbacks.length });
        console.log(`[SelfHealing] Fallback worked for "${element.name}": ${fallback}`);
        this.cache.set(element.name, fallback);
        this.reporter.record(element.name, element.primary, fallback, 'fallback', Date.now() - start);
        return locator;
      } catch {
        continue;
      }
    }

    console.log(`[SelfHealing] All static selectors failed for "${element.name}". Attempting AI healing...`);

    // TIER 3 & 4: AI-powered healing (only reached if primary + fallbacks all failed)
    if (this.aiObserver.isEnabled()) {
      // Tier 3: Visual analysis using screenshot
      try {
        console.log(`[SelfHealing] Tier 3: AI Visual analysis for "${element.name}"...`);
        const screenshot = await this.page.screenshot({ type: 'png' });
        const aiSelector = await this.aiObserver.findByVision(screenshot, element.description, element.type);

        if (aiSelector) {
          console.log(`[SelfHealing] AI Vision suggested selector: ${aiSelector}`);
          const locator = this.page.locator(aiSelector);
          await locator.waitFor({ state: 'visible', timeout: healingTimeout });
          console.log(`[SelfHealing] AI Vision healed "${element.name}" with: ${aiSelector}`);
          this.cache.set(element.name, aiSelector);
          this.reporter.record(element.name, element.primary, aiSelector, 'ai_visual', Date.now() - start);
          return locator;
        } else {
          console.log(`[SelfHealing] AI Vision returned no selector for "${element.name}"`);
        }
      } catch (error) {
        console.log(`[SelfHealing] AI Vision failed for "${element.name}":`, (error as Error).message);
      }

      // Tier 4: DOM analysis
      try {
        console.log(`[SelfHealing] Tier 4: AI DOM analysis for "${element.name}"...`);
        const html = await this.page.content();
        const aiSelector = await this.aiObserver.findByDOM(html, element.description, element.type);

        if (aiSelector) {
          console.log(`[SelfHealing] AI DOM suggested selector: ${aiSelector}`);
          const locator = this.page.locator(aiSelector);
          await locator.waitFor({ state: 'visible', timeout: healingTimeout });
          console.log(`[SelfHealing] AI DOM healed "${element.name}" with: ${aiSelector}`);
          this.cache.set(element.name, aiSelector);
          this.reporter.record(element.name, element.primary, aiSelector, 'ai_dom', Date.now() - start);
          return locator;
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
        await locator.waitFor({ state: 'visible', timeout: perTierTimeout / element.fallbacks.length });
        this.cache.set(element.name, fallback);
        return true;
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
