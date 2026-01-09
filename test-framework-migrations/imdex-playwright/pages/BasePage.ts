import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object
 * Provides common functionality for all page objects
 * Migrated from: QAF CommonStep utilities
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for page to fully load
   * Migrated from: QAFTestBase.pause() after navigation
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    // Use shorter timeout for networkidle, continue if it takes too long
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      // Site may have persistent network activity, continue anyway
    });
  }

  /**
   * Get an element with auto-wait
   * Migrated from: QAF element() method
   */
  protected getElement(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Click on an element
   * Migrated from: CommonStep.click()
   */
  async click(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  /**
   * Fill text into an input
   * Migrated from: CommonStep.sendKeys()
   */
  async fill(selector: string, text: string): Promise<void> {
    await this.page.locator(selector).fill(text);
  }

  /**
   * Get text content from element
   * Migrated from: element.getText()
   */
  async getText(selector: string): Promise<string> {
    return await this.page.locator(selector).textContent() || '';
  }

  /**
   * Check if element is visible
   * Migrated from: element.isDisplayed()
   */
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Wait for element to be visible
   * Migrated from: WebDriverWait.until(visibilityOf)
   */
  async waitForVisible(selector: string, timeout = 30000): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   * Migrated from: WebDriverWait.until(invisibilityOf)
   */
  async waitForHidden(selector: string, timeout = 30000): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
  }

  /**
   * Verify element is present
   * Migrated from: CommonStep.verifyPresent()
   */
  async verifyPresent(selector: string): Promise<boolean> {
    try {
      await this.page.locator(selector).waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Take screenshot
   * Migrated from: selenium.success.screenshots
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `reports/screenshots/${name}.png` });
  }

  /**
   * Check if running on mobile viewport
   * Migrated from: getValue("platform").equalsIgnoreCase("mobile")
   */
  isMobileViewport(): boolean {
    const viewport = this.page.viewportSize();
    return viewport ? viewport.width < 768 : false;
  }
}
