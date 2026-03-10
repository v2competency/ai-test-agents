// utils/StandardLocator.ts
import { Page, Locator } from '@playwright/test';
import { ElementDefinition } from './SelfHealingLocator';
import { HealingStatistics } from './HealingReporter';
import { ILocatorStrategy } from './LocatorStrategy';

export class StandardLocator implements ILocatorStrategy {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async locate(element: ElementDefinition, timeout = 15000): Promise<Locator> {
    const locator = this.page.locator(element.primary);
    await locator.waitFor({ state: 'visible', timeout });
    return locator;
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
    try {
      const locator = await this.locate(element, timeout);
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  async selectOption(element: ElementDefinition, value: string): Promise<void> {
    const locator = await this.locate(element);
    await locator.selectOption(value);
  }

  getReport(): string {
    return 'AI healing is disabled. Running in standard mode.';
  }

  async saveReport(_path: string): Promise<void> {
    // No-op in standard mode
  }

  getStatistics(): HealingStatistics {
    return {
      totalAttempts: 0,
      primaryHits: 0,
      cacheHits: 0,
      fallbackHits: 0,
      aiVisualHits: 0,
      aiDomHits: 0,
      failures: 0,
      averageHealingTime: 0,
      healingRate: 100
    };
  }

  clearCache(): void {
    // No-op in standard mode
  }
}
