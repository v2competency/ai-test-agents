import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly pageUrl: string = '/checkout-complete.html';

  // Locators
  readonly pageTitle: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly completeImage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator('.title, [data-test="title"]');
    this.completeHeader = page.locator('.complete-header, [data-test="complete-header"]');
    this.completeText = page.locator('.complete-text, [data-test="complete-text"]');
    this.completeImage = page.locator('.pony_express, img.pony_express');
    this.backHomeButton = page.locator('[data-test="back-to-products"], #back-to-products');
  }

  // Navigation
  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  async isOnPage(): Promise<boolean> {
    return this.page.url().includes('checkout-complete');
  }

  // Actions
  async clickBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }

  // Verification
  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  async getCompleteHeader(): Promise<string> {
    return await this.completeHeader.textContent() || '';
  }

  async getCompleteText(): Promise<string> {
    return await this.completeText.textContent() || '';
  }

  async isCompleteHeaderDisplayed(): Promise<boolean> {
    return await this.completeHeader.isVisible();
  }

  async isBackHomeButtonVisible(): Promise<boolean> {
    return await this.backHomeButton.isVisible();
  }

  async isOrderConfirmationDisplayed(): Promise<boolean> {
    const header = await this.getCompleteHeader();
    return header.toLowerCase().includes('thank you');
  }
}
