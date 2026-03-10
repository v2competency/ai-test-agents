// pages/BasePage.ts
import { Page } from '@playwright/test';
import { ElementDefinition } from '../utils/SelfHealingLocator';
import { ILocatorStrategy, createLocatorStrategy } from '../utils/LocatorStrategy';

export abstract class BasePage {
  readonly page: Page;
  readonly healer: ILocatorStrategy;

  // Common element definitions
  protected readonly loadingSpinnerDef: ElementDefinition = {
    name: 'loadingSpinner',
    description: 'Loading spinner/overlay indicator',
    primary: '.spinner-border',
    fallbacks: ['.loading-spinner', '.loading', '[class*="spinner"]', '[class*="loading"]', '.overlay'],
    type: 'container'
  };

  protected readonly toastMessageDef: ElementDefinition = {
    name: 'toastMessage',
    description: 'Toast notification message',
    primary: '.toast',
    fallbacks: ['.toast-body', '.notification', '[role="alert"]', '.alert'],
    type: 'text'
  };

  protected readonly toastSuccessDef: ElementDefinition = {
    name: 'toastSuccess',
    description: 'Success toast notification',
    primary: '.toast-success',
    fallbacks: ['.alert-success', '.toast.bg-success', '[class*="success"]'],
    type: 'text'
  };

  protected readonly toastErrorDef: ElementDefinition = {
    name: 'toastError',
    description: 'Error toast notification',
    primary: '.toast-error',
    fallbacks: ['.alert-danger', '.toast.bg-danger', '[class*="error"]', '.alert-error'],
    type: 'text'
  };

  constructor(page: Page) {
    this.page = page;
    this.healer = createLocatorStrategy(page);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForSpinnerToDisappear(timeout = 30000): Promise<void> {
    try {
      const spinner = this.page.locator(this.loadingSpinnerDef.primary);
      await spinner.waitFor({ state: 'hidden', timeout });
    } catch {
      // Spinner may not be present, that's okay
    }
  }

  async getToastMessage(): Promise<string> {
    try {
      const toast = await this.healer.locate(this.toastMessageDef, 5000);
      return await toast.textContent() || '';
    } catch {
      return '';
    }
  }

  async isSuccessToastDisplayed(): Promise<boolean> {
    return await this.healer.isVisible(this.toastSuccessDef, 5000);
  }

  async isErrorToastDisplayed(): Promise<boolean> {
    return await this.healer.isVisible(this.toastErrorDef, 5000);
  }

  async waitForToastToDisappear(timeout = 5000): Promise<void> {
    try {
      const toast = this.page.locator(this.toastMessageDef.primary);
      await toast.waitFor({ state: 'hidden', timeout });
    } catch {
      // Toast may have already disappeared
    }
  }

  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({
      path: `reports/screenshots/${name}_${timestamp}.png`,
      fullPage: true
    });
  }

  getCurrentUrl(): string {
    return this.page.url();
  }

  getHealingReport(): string {
    return this.healer.getReport();
  }

  async saveHealingReport(path: string): Promise<void> {
    await this.healer.saveReport(path);
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
}
