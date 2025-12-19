import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly pageUrl: string = '/cart.html';

  // Locators
  readonly pageTitle: Locator;
  readonly cartList: Locator;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly cartQuantityLabels: Locator;
  readonly cartDescriptionLabels: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator('.title, [data-test="title"]');
    this.cartList = page.locator('.cart_list, [data-test="cart-list"]');
    this.cartItems = page.locator('.cart_item, [data-test="inventory-item"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"], #continue-shopping');
    this.checkoutButton = page.locator('[data-test="checkout"], #checkout');
    this.cartQuantityLabels = page.locator('.cart_quantity');
    this.cartDescriptionLabels = page.locator('.cart_desc_label');
  }

  // Navigation
  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  async isOnPage(): Promise<boolean> {
    return this.page.url().includes('cart.html');
  }

  // Actions
  async clickContinueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async removeItem(productName: string): Promise<void> {
    const productId = productName.toLowerCase().replace(/\s+/g, '-');
    const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
    await removeButton.click();
  }

  // Verification
  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async isCartEmpty(): Promise<boolean> {
    return (await this.getCartItemCount()) === 0;
  }

  async getCartItemNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async getCartItemPrices(): Promise<string[]> {
    return await this.page.locator('.inventory_item_price').allTextContents();
  }

  async isProductInCart(productName: string): Promise<boolean> {
    const names = await this.getCartItemNames();
    return names.includes(productName);
  }

  async getProductQuantity(productName: string): Promise<string> {
    const cartItem = this.page.locator('.cart_item', { has: this.page.locator(`.inventory_item_name:has-text("${productName}")`) });
    return await cartItem.locator('.cart_quantity').textContent() || '0';
  }

  async getProductPrice(productName: string): Promise<string> {
    const cartItem = this.page.locator('.cart_item', { has: this.page.locator(`.inventory_item_name:has-text("${productName}")`) });
    return await cartItem.locator('.inventory_item_price').textContent() || '$0.00';
  }

  async isContinueShoppingVisible(): Promise<boolean> {
    return await this.continueShoppingButton.isVisible();
  }

  async isCheckoutButtonVisible(): Promise<boolean> {
    return await this.checkoutButton.isVisible();
  }
}
