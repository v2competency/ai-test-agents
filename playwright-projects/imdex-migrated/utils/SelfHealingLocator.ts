import { Page, Locator } from '@playwright/test';
import { AIObserver } from './AIObserver';
import { HealingReporter } from './HealingReporter';
import { ElementDefinition } from './ElementRegistry';

/**
 * Self-Healing Locator with 4-Tier Healing Strategy
 * Migrated from: Healenium integration (HealeniumListener.java)
 *
 * Original Healenium flow:
 * 1. Save DOM structure for reference
 * 2. Detect broken locators
 * 3. Find new valid locators using similarity
 * 4. Update locator cache
 *
 * New 4-Tier Healing Strategy:
 * 1. Cache: Check previously healed selectors
 * 2. Fallbacks: Try predefined fallback selectors
 * 3. AI Visual: Screenshot analysis with Claude Vision
 * 4. AI DOM: Full DOM analysis with Claude
 */
export class SelfHealingLocator {
  private page: Page;
  private healingCache: Map<string, string> = new Map();
  private aiObserver: AIObserver;
  private reporter: HealingReporter;

  constructor(page: Page, options?: { enableAI?: boolean }) {
    this.page = page;
    this.aiObserver = new AIObserver(options?.enableAI ?? true);
    this.reporter = new HealingReporter();
  }

  /**
   * Safely create a locator that handles strict mode violations
   * Uses .first() to resolve when multiple elements match
   */
  private safeLocator(selector: string): Locator {
    return this.page.locator(selector).first();
  }

  /**
   * Locate element with self-healing capabilities
   * Enhanced from Healenium's healing approach
   */
  async locate(element: ElementDefinition, timeout = 10000): Promise<Locator> {
    const startTime = Date.now();
    const { primary, fallbacks, description, originalLocator } = element;

    // Try primary selector first
    try {
      const locator = this.safeLocator(primary);
      await locator.waitFor({ state: 'visible', timeout: timeout / 4 });
      return locator;
    } catch {
      console.log(`[SelfHealing] Primary selector failed: ${primary}`);
      if (originalLocator) {
        console.log(`[SelfHealing] Original (Selenium): ${originalLocator}`);
      }
    }

    // TIER 1: Check healing cache
    const cachedSelector = this.healingCache.get(element.name);
    if (cachedSelector) {
      try {
        const locator = this.safeLocator(cachedSelector);
        await locator.waitFor({ state: 'visible', timeout: timeout / 4 });
        this.reporter.record({
          element: element.name,
          original: primary,
          healed: cachedSelector,
          tier: 'cache',
          duration: Date.now() - startTime,
          originalSelenium: originalLocator
        });
        return locator;
      } catch {
        console.log(`[SelfHealing] Cached selector failed: ${cachedSelector}`);
        this.healingCache.delete(element.name);
      }
    }

    // TIER 2: Try fallback selectors
    for (const fallback of fallbacks) {
      try {
        const locator = this.safeLocator(fallback);
        await locator.waitFor({ state: 'visible', timeout: timeout / (fallbacks.length + 2) });
        this.healingCache.set(element.name, fallback);
        this.reporter.record({
          element: element.name,
          original: primary,
          healed: fallback,
          tier: 'fallback',
          duration: Date.now() - startTime,
          originalSelenium: originalLocator
        });
        console.log(`[SelfHealing] Healed with fallback: ${fallback}`);
        return locator;
      } catch {
        continue;
      }
    }

    // TIER 3: AI Visual Analysis
    if (this.aiObserver.isEnabled()) {
      try {
        const screenshot = await this.page.screenshot({ type: 'png' });
        const aiSelector = await this.aiObserver.findByVision(
          screenshot,
          description,
          element.type || 'button'
        );

        if (aiSelector) {
          const locator = this.safeLocator(aiSelector);
          await locator.waitFor({ state: 'visible', timeout: timeout / 4 });
          this.healingCache.set(element.name, aiSelector);
          this.reporter.record({
            element: element.name,
            original: primary,
            healed: aiSelector,
            tier: 'ai_visual',
            duration: Date.now() - startTime,
            originalSelenium: originalLocator
          });
          console.log(`[SelfHealing] Healed with AI Visual: ${aiSelector}`);
          return locator;
        }
      } catch (error) {
        console.log(`[SelfHealing] AI Visual analysis failed: ${error}`);
      }

      // TIER 4: AI DOM Analysis
      try {
        const html = await this.page.content();
        const aiSelector = await this.aiObserver.findByDOM(
          html,
          description,
          element.type || 'button'
        );

        if (aiSelector) {
          const locator = this.safeLocator(aiSelector);
          await locator.waitFor({ state: 'visible', timeout: timeout / 4 });
          this.healingCache.set(element.name, aiSelector);
          this.reporter.record({
            element: element.name,
            original: primary,
            healed: aiSelector,
            tier: 'ai_dom',
            duration: Date.now() - startTime,
            originalSelenium: originalLocator
          });
          console.log(`[SelfHealing] Healed with AI DOM: ${aiSelector}`);
          return locator;
        }
      } catch (error) {
        console.log(`[SelfHealing] AI DOM analysis failed: ${error}`);
      }
    }

    // All healing attempts failed
    this.reporter.record({
      element: element.name,
      original: primary,
      healed: null,
      tier: 'failed',
      duration: Date.now() - startTime,
      originalSelenium: originalLocator
    });

    throw new Error(
      `[SelfHealing] Could not locate element: ${description}\n` +
      `Primary: ${primary}\n` +
      `Original Selenium: ${originalLocator || 'N/A'}`
    );
  }

  /**
   * Get healing report as string
   */
  getReport(): string {
    return this.reporter.generateReport();
  }

  /**
   * Save healing report to file
   */
  async saveReport(filePath: string): Promise<void> {
    await this.reporter.save(filePath);
  }

  /**
   * Get healing statistics
   */
  getStats() {
    return this.reporter.getStats();
  }

  /**
   * Clear healing cache
   */
  clearCache(): void {
    this.healingCache.clear();
  }
}
