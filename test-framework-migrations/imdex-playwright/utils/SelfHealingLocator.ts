import { Page, Locator } from '@playwright/test';
import { AIObserver } from './AIObserver';
import { ElementDefinition } from '../config/elements';

/**
 * Healing result interface
 * Tracks the healing process for reporting
 */
interface HealingResult {
  elementDescription: string;
  originalSelector: string;
  healedSelector: string | null;
  healingMethod: 'primary' | 'cache' | 'fallback' | 'ai' | 'failed';
  timestamp: Date;
  originalSeleniumLocator?: string;
}

/**
 * Self-Healing Locator Utility
 * Migrated from: HealeniumListener.java
 * Original framework: Healenium (EPAM) self-healing engine
 *
 * This utility provides AI-powered self-healing capabilities:
 * 1. Tries primary selector
 * 2. Checks healing cache
 * 3. Tries fallback selectors
 * 4. Uses AI (Anthropic Claude) to find element
 */
export class SelfHealingLocator {
  private page: Page;
  private healingCache: Map<string, string> = new Map();
  private healingHistory: HealingResult[] = [];
  private aiObserver: AIObserver;
  private enabled: boolean;

  constructor(page: Page, enableAI = true) {
    this.page = page;
    this.aiObserver = new AIObserver();
    this.enabled = process.env.ENABLE_SELF_HEALING !== 'false';
  }

  /**
   * Locate element with self-healing capabilities
   * Migrated from: HealeniumListener.onFailure() + healNewLocator()
   *
   * @param elementDef - Element definition with primary and fallback selectors
   * @param options - Optional timeout configuration
   * @returns Playwright Locator
   */
  async locate(
    elementDef: ElementDefinition,
    options?: { timeout?: number }
  ): Promise<Locator> {
    const timeout = options?.timeout || 5000;
    const { primary, fallbacks, description, originalLocator } = elementDef;

    // Strategy 1: Try primary selector
    try {
      const locator = this.page.locator(primary);
      await locator.waitFor({ state: 'visible', timeout: timeout / 3 });
      this.recordHealing(description, primary, primary, 'primary', originalLocator);
      return locator;
    } catch {
      console.log(`[SelfHealing] Primary selector failed: ${primary}`);
      if (originalLocator) {
        console.log(`[SelfHealing] Original Selenium locator: ${originalLocator}`);
      }
    }

    // If self-healing is disabled, throw immediately
    if (!this.enabled) {
      throw new Error(`[SelfHealing] Element not found and healing disabled: ${description}`);
    }

    // Strategy 2: Check healing cache
    const cachedSelector = this.healingCache.get(primary);
    if (cachedSelector) {
      try {
        const locator = this.page.locator(cachedSelector);
        await locator.waitFor({ state: 'visible', timeout: timeout / 3 });
        this.recordHealing(description, primary, cachedSelector, 'cache', originalLocator);
        console.log(`[SelfHealing] Used cached selector: ${cachedSelector}`);
        return locator;
      } catch {
        console.log(`[SelfHealing] Cached selector also failed: ${cachedSelector}`);
        this.healingCache.delete(primary);
      }
    }

    // Strategy 3: Try fallback selectors
    for (const fallback of fallbacks) {
      try {
        const locator = this.page.locator(fallback);
        const timeoutPerFallback = timeout / (fallbacks.length + 1);
        await locator.waitFor({ state: 'visible', timeout: timeoutPerFallback });

        // Cache successful fallback
        this.healingCache.set(primary, fallback);
        this.recordHealing(description, primary, fallback, 'fallback', originalLocator);
        console.log(`[SelfHealing] Healed using fallback: ${fallback}`);
        return locator;
      } catch {
        continue;
      }
    }

    // Strategy 4: AI-powered healing
    if (this.aiObserver.isEnabled()) {
      try {
        console.log(`[SelfHealing] Attempting AI-powered healing for: ${description}`);
        const screenshot = await this.page.screenshot({ type: 'png' });
        const pageContent = await this.page.content();

        const aiSelector = await this.aiObserver.findElement(
          screenshot,
          description,
          pageContent
        );

        if (aiSelector) {
          const locator = this.page.locator(aiSelector);
          await locator.waitFor({ state: 'visible', timeout: timeout / 3 });

          // Cache AI-generated selector
          this.healingCache.set(primary, aiSelector);
          this.recordHealing(description, primary, aiSelector, 'ai', originalLocator);
          console.log(`[SelfHealing] AI healed with: ${aiSelector}`);
          return locator;
        }
      } catch (error) {
        console.log(`[SelfHealing] AI healing failed: ${error}`);
      }
    }

    // All strategies failed
    this.recordHealing(description, primary, null, 'failed', originalLocator);
    throw new Error(`[SelfHealing] Could not locate element: ${description}`);
  }

  /**
   * Record healing attempt for reporting
   * Migrated from: HealeniumListener.saveElementsForHealing()
   */
  private recordHealing(
    description: string,
    originalSelector: string,
    healedSelector: string | null,
    method: 'primary' | 'cache' | 'fallback' | 'ai' | 'failed',
    originalSeleniumLocator?: string
  ): void {
    this.healingHistory.push({
      elementDescription: description,
      originalSelector,
      healedSelector,
      healingMethod: method,
      timestamp: new Date(),
      originalSeleniumLocator
    });

    if (method !== 'primary' && method !== 'failed') {
      console.log(`[SelfHealing] ${method.toUpperCase()}: ${originalSelector} → ${healedSelector}`);
    }
  }

  /**
   * Get healing statistics
   */
  getHealingStats(): {
    total: number;
    healed: number;
    failed: number;
    byMethod: Record<string, number>;
  } {
    const stats = {
      total: this.healingHistory.length,
      healed: 0,
      failed: 0,
      byMethod: {
        primary: 0,
        cache: 0,
        fallback: 0,
        ai: 0,
        failed: 0
      } as Record<string, number>
    };

    for (const result of this.healingHistory) {
      stats.byMethod[result.healingMethod]++;
      if (result.healingMethod === 'failed') {
        stats.failed++;
      } else if (result.healingMethod !== 'primary') {
        stats.healed++;
      }
    }

    return stats;
  }

  /**
   * Generate healing report
   * Migrated from: Healenium report generation
   */
  generateReport(): string {
    const stats = this.getHealingStats();
    const healedItems = this.healingHistory.filter(
      h => h.healingMethod !== 'primary' && h.healingMethod !== 'failed'
    );

    const report = [
      '='.repeat(70),
      'SELF-HEALING LOCATOR REPORT',
      '='.repeat(70),
      '',
      'Migrated from: Healenium (EPAM) self-healing engine',
      '',
      'STATISTICS:',
      '-'.repeat(70),
      `Total Locate Attempts: ${stats.total}`,
      `Primary Success: ${stats.byMethod.primary}`,
      `Healed (Cache): ${stats.byMethod.cache}`,
      `Healed (Fallback): ${stats.byMethod.fallback}`,
      `Healed (AI): ${stats.byMethod.ai}`,
      `Failed: ${stats.byMethod.failed}`,
      '',
      'Healing Success Rate: ' +
        (stats.total > 0
          ? `${((stats.healed / stats.total) * 100).toFixed(1)}%`
          : 'N/A'),
      ''
    ];

    if (healedItems.length > 0) {
      report.push('HEALING DETAILS:');
      report.push('-'.repeat(70));

      for (const item of healedItems) {
        report.push(`Element: ${item.elementDescription}`);
        if (item.originalSeleniumLocator) {
          report.push(`  Original Selenium: ${item.originalSeleniumLocator}`);
        }
        report.push(`  Primary Selector: ${item.originalSelector}`);
        report.push(`  Healed To: ${item.healedSelector}`);
        report.push(`  Method: ${item.healingMethod.toUpperCase()}`);
        report.push(`  Time: ${item.timestamp.toISOString()}`);
        report.push('-'.repeat(70));
      }
    }

    if (stats.byMethod.failed > 0) {
      report.push('');
      report.push('FAILED ELEMENTS:');
      report.push('-'.repeat(70));

      const failedItems = this.healingHistory.filter(h => h.healingMethod === 'failed');
      for (const item of failedItems) {
        report.push(`Element: ${item.elementDescription}`);
        report.push(`  Selector: ${item.originalSelector}`);
        if (item.originalSeleniumLocator) {
          report.push(`  Original: ${item.originalSeleniumLocator}`);
        }
        report.push('-'.repeat(70));
      }
    }

    report.push('');
    report.push('='.repeat(70));

    return report.join('\n');
  }

  /**
   * Clear healing cache
   */
  clearCache(): void {
    this.healingCache.clear();
  }

  /**
   * Clear healing history
   */
  clearHistory(): void {
    this.healingHistory = [];
  }

  /**
   * Export healing cache for persistence
   */
  exportCache(): Record<string, string> {
    return Object.fromEntries(this.healingCache);
  }

  /**
   * Import healing cache from persistence
   */
  importCache(cache: Record<string, string>): void {
    this.healingCache = new Map(Object.entries(cache));
  }
}
