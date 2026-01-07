// pages/BasePage.ts
import { Page, Locator } from '@playwright/test';
import { SelfHealingLocator, ElementDefinition } from '../utils/SelfHealingLocator';

export abstract class BasePage {
  readonly page: Page;
  readonly healer: SelfHealingLocator;

  // Common element definitions
  protected readonly loadingSpinnerDef: ElementDefinition = {
    name: 'loadingSpinner',
    description: 'Loading spinner/overlay',
    primary: '.oxd-loading-spinner',
    fallbacks: ['.oxd-loading-spinner-container', '.loading', '[class*="spinner"]', '[class*="loading"]'],
    type: 'container'
  };

  protected readonly toastMessageDef: ElementDefinition = {
    name: 'toastMessage',
    description: 'Toast notification message',
    primary: '.oxd-toast',
    fallbacks: ['.oxd-toast-content', '.toast', '.notification', '[role="alert"]'],
    type: 'text'
  };

  protected readonly toastSuccessDef: ElementDefinition = {
    name: 'toastSuccess',
    description: 'Success toast notification',
    primary: '.oxd-toast--success',
    fallbacks: ['.oxd-toast-content--success', '.toast-success', '.alert-success'],
    type: 'text'
  };

  protected readonly toastErrorDef: ElementDefinition = {
    name: 'toastError',
    description: 'Error toast notification',
    primary: '.oxd-toast--error',
    fallbacks: ['.oxd-toast-content--error', '.toast-error', '.alert-danger'],
    type: 'text'
  };

  constructor(page: Page) {
    this.page = page;
    this.healer = new SelfHealingLocator(page);
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for loading spinner to disappear
   */
  async waitForSpinnerToDisappear(timeout = 30000): Promise<void> {
    try {
      const spinner = this.page.locator(this.loadingSpinnerDef.primary);
      await spinner.waitFor({ state: 'hidden', timeout });
    } catch {
      // Spinner may not be present, that's okay
    }
  }

  /**
   * Get toast message text
   */
  async getToastMessage(): Promise<string> {
    try {
      const toast = await this.healer.locate(this.toastMessageDef, 5000);
      return await toast.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Check if success toast is displayed
   */
  async isSuccessToastDisplayed(): Promise<boolean> {
    return await this.healer.isVisible(this.toastSuccessDef, 5000);
  }

  /**
   * Check if error toast is displayed
   */
  async isErrorToastDisplayed(): Promise<boolean> {
    return await this.healer.isVisible(this.toastErrorDef, 5000);
  }

  /**
   * Wait for toast to disappear
   */
  async waitForToastToDisappear(timeout = 5000): Promise<void> {
    try {
      const toast = this.page.locator(this.toastMessageDef.primary);
      await toast.waitFor({ state: 'hidden', timeout });
    } catch {
      // Toast may have already disappeared
    }
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({
      path: `reports/screenshots/${name}_${timestamp}.png`,
      fullPage: true
    });
  }

  /**
   * Get current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get healing report
   */
  getHealingReport(): string {
    return this.healer.getReport();
  }

  /**
   * Save healing report to file
   */
  async saveHealingReport(path: string): Promise<void> {
    await this.healer.saveReport(path);
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Press keyboard key
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Wait for specific time (use sparingly)
   */
  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
}
