import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly stepOneUrl: string = '/checkout-step-one.html';
  readonly stepTwoUrl: string = '/checkout-step-two.html';

  // Step One - Your Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly checkoutInfoForm: Locator;

  // Step Two - Overview
  readonly cartItems: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly itemTotal: Locator;
  readonly taxTotal: Locator;
  readonly grandTotal: Locator;
  readonly finishButton: Locator;

  // Error
  readonly errorContainer: Locator;

  constructor(page: Page) {
    super(page);

    // Step One Locators
    this.firstNameInput = page.locator('[data-test="firstName"], #first-name');
    this.lastNameInput = page.locator('[data-test="lastName"], #last-name');
    this.postalCodeInput = page.locator('[data-test="postalCode"], #postal-code');
    this.continueButton = page.locator('[data-test="continue"], #continue');
    this.cancelButton = page.locator('[data-test="cancel"], #cancel');
    this.checkoutInfoForm = page.locator('.checkout_info');

    // Step Two Locators
    this.cartItems = page.locator('.cart_item');
    this.paymentInfo = page.locator('.summary_value_label').first();
    this.shippingInfo = page.locator('.summary_value_label').nth(1);
    this.itemTotal = page.locator('.summary_subtotal_label');
    this.taxTotal = page.locator('.summary_tax_label');
    this.grandTotal = page.locator('.summary_total_label, [data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"], #finish');

    // Error Locator
    this.errorContainer = page.locator('[data-test="error"], .error-message-container h3');
  }

  // Navigation
  async navigateToStepOne(): Promise<void> {
    await this.page.goto(this.stepOneUrl);
    await this.waitForPageLoad();
  }

  async navigateToStepTwo(): Promise<void> {
    await this.page.goto(this.stepTwoUrl);
    await this.waitForPageLoad();
  }

  async isOnStepOne(): Promise<boolean> {
    return this.page.url().includes('checkout-step-one');
  }

  async isOnStepTwo(): Promise<boolean> {
    return this.page.url().includes('checkout-step-two');
  }

  // Step One Actions
  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async fillPostalCode(postalCode: string): Promise<void> {
    await this.postalCodeInput.fill(postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillPostalCode(postalCode);
  }

  async completeStepOne(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillCheckoutInfo(firstName, lastName, postalCode);
    await this.clickContinue();
    await this.waitForSpinnerToDisappear();
  }

  // Step Two Actions
  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }

  // Verification - Step One
  async getCheckoutError(): Promise<string> {
    await this.errorContainer.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorContainer.textContent() || '';
  }

  async isCheckoutErrorDisplayed(): Promise<boolean> {
    return await this.errorContainer.isVisible();
  }

  // Verification - Step Two
  async getPaymentInfo(): Promise<string> {
    return await this.paymentInfo.textContent() || '';
  }

  async getShippingInfo(): Promise<string> {
    return await this.shippingInfo.textContent() || '';
  }

  async getItemTotal(): Promise<string> {
    const text = await this.itemTotal.textContent() || '';
    return text.replace('Item total: ', '');
  }

  async getTaxTotal(): Promise<string> {
    const text = await this.taxTotal.textContent() || '';
    return text.replace('Tax: ', '');
  }

  async getGrandTotal(): Promise<string> {
    const text = await this.grandTotal.textContent() || '';
    return text.replace('Total: ', '');
  }

  async getItemTotalValue(): Promise<number> {
    const text = await this.getItemTotal();
    return parseFloat(text.replace('$', ''));
  }

  async getTaxTotalValue(): Promise<number> {
    const text = await this.getTaxTotal();
    return parseFloat(text.replace('$', ''));
  }

  async getGrandTotalValue(): Promise<number> {
    const text = await this.getGrandTotal();
    return parseFloat(text.replace('$', ''));
  }

  async getCartItemNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async getOverviewItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async isFinishButtonVisible(): Promise<boolean> {
    return await this.finishButton.isVisible();
  }

  async isCancelButtonVisible(): Promise<boolean> {
    return await this.cancelButton.isVisible();
  }
}
