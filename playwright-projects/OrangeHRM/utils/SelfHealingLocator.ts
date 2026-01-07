// utils/SelfHealingLocator.ts
import { Page, Locator } from '@playwright/test';
import { AIObserver } from './AIObserver';
import { HealingReporter } from './HealingReporter';

export interface ElementDefinition {
  name: string;
  description: string;
  primary: string;
  fallbacks: string[];
  type: 'input' | 'button' | 'link' | 'text' | 'container' | 'dropdown' | 'checkbox' | 'radio' | 'textarea';
}

export type HealingMethod = 'primary' | 'cache' | 'fallback' | 'ai_visual' | 'ai_dom' | 'failed';

export class SelfHealingLocator {
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
  async locate(element: ElementDefinition, timeout = 5000): Promise<Locator> {
    const start = Date.now();

    // Try primary selector first
    try {
      const locator = this.page.locator(element.primary);
      await locator.waitFor({ state: 'visible', timeout: timeout / 4 });
      this.reporter.record(element.name, element.primary, element.primary, 'primary', Date.now() - start);
      return locator;
    } catch {
      // Primary failed, continue to healing strategies
    }

    // TIER 1: Check cache for previously healed selector
    const cached = this.cache.get(element.name);
    if (cached) {
      try {
        const locator = this.page.locator(cached);
        await locator.waitFor({ state: 'visible', timeout: timeout / 4 });
        this.reporter.record(element.name, element.primary, cached, 'cache', Date.now() - start);
        return locator;
      } catch {
        // Cache miss, remove stale entry
        this.cache.delete(element.name);
      }
    }

    // TIER 2: Try fallback selectors
    for (const fallback of element.fallbacks) {
      try {
        const locator = this.page.locator(fallback);
        await locator.waitFor({ state: 'visible', timeout: timeout / 6 });
        this.cache.set(element.name, fallback);
        this.reporter.record(element.name, element.primary, fallback, 'fallback', Date.now() - start);
        return locator;
      } catch {
        continue;
      }
    }

    // TIER 3 & 4: AI-powered healing
    if (this.aiObserver.isEnabled()) {
      // Tier 3: Visual analysis using screenshot
      const screenshot = await this.page.screenshot({ type: 'png' });
      let aiSelector = await this.aiObserver.findByVision(screenshot, element.description, element.type);

      if (aiSelector) {
        try {
          const locator = this.page.locator(aiSelector);
          await locator.waitFor({ state: 'visible', timeout: timeout / 4 });
          this.cache.set(element.name, aiSelector);
          this.reporter.record(element.name, element.primary, aiSelector, 'ai_visual', Date.now() - start);
          return locator;
        } catch {
          // AI visual failed, try DOM analysis
        }
      }

      // Tier 4: DOM analysis
      const html = await this.page.content();
      aiSelector = await this.aiObserver.findByDOM(html, element.description, element.type);

      if (aiSelector) {
        try {
          const locator = this.page.locator(aiSelector);
          await locator.waitFor({ state: 'visible', timeout: timeout / 4 });
          this.cache.set(element.name, aiSelector);
          this.reporter.record(element.name, element.primary, aiSelector, 'ai_dom', Date.now() - start);
          return locator;
        } catch {
          // AI DOM failed
        }
      }
    }

    // All healing strategies failed
    this.reporter.record(element.name, element.primary, null, 'failed', Date.now() - start);
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
   * Check if element is visible with self-healing
   */
  async isVisible(element: ElementDefinition, timeout = 3000): Promise<boolean> {
    try {
      const locator = await this.locate(element, timeout);
      return await locator.isVisible();
    } catch {
      return false;
    }
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
