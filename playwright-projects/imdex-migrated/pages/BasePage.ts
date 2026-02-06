import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object
 * Provides common methods and utilities for all page objects
 * Migrated from: QAF CommonStep methods
 */
export abstract class BasePage {
  readonly page: Page;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingSpinner = page.locator('.loading, .spinner, [data-loading="true"]');
  }

  /**
   * Wait for page to fully load
   * Migrated from: QAF implicit waits
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for any loading spinners to disappear
   */
  async waitForSpinnerToDisappear(): Promise<void> {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `reports/screenshots/${name}.png`,
      fullPage: true
    });
  }

  /**
   * Check if running on mobile viewport
   */
  isMobile(): boolean {
    const viewport = this.page.viewportSize();
    return viewport ? viewport.width < 768 : false;
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for element and click
   * Migrated from: QAF click() with auto-wait
   */
  async clickWhenReady(locator: Locator, timeout = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
    await locator.click();
  }
}
