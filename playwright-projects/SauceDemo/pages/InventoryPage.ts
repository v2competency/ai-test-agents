import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly pageUrl: string = '/inventory.html';

  // Locators
  readonly pageTitle: Locator;
  readonly productList: Locator;
  readonly productItems: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryContainer: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator('.title, [data-test="title"]');
    this.productList = page.locator('.inventory_list, [data-test="inventory-list"]');
    this.productItems = page.locator('.inventory_item, [data-test="inventory-item"]');
    this.sortDropdown = page.locator('.product_sort_container, [data-test="product-sort-container"]');
    this.inventoryContainer = page.locator('#inventory_container, .inventory_container');
  }

  // Navigation
  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  async isOnPage(): Promise<boolean> {
    return this.page.url().includes('inventory.html');
  }

  // Product Actions
  async addProductToCart(productName: string): Promise<void> {
    const productId = this.getProductDataTestId(productName);
    const addButton = this.page.locator(`[data-test="add-to-cart-${productId}"]`);
    await addButton.click();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const productId = this.getProductDataTestId(productName);
    const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
    await removeButton.click();
  }

  async isProductInCart(productName: string): Promise<boolean> {
    const productId = this.getProductDataTestId(productName);
    const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
    return await removeButton.isVisible();
  }

  async clickProductLink(productName: string): Promise<void> {
    await this.page.locator(`.inventory_item_name:has-text("${productName}")`).click();
  }

  private getProductDataTestId(productName: string): string {
    return productName.toLowerCase().replace(/\s+/g, '-');
  }

  // Sorting
  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getSortValue(): Promise<string> {
    return await this.sortDropdown.inputValue();
  }

  // Verification
  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  async getProductNames(): Promise<string[]> {
    const names = await this.page.locator('.inventory_item_name').allTextContents();
    return names;
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.page.locator('.inventory_item_price').allTextContents();
    return priceTexts.map(p => parseFloat(p.replace('$', '')));
  }

  async getFirstProductName(): Promise<string> {
    return await this.page.locator('.inventory_item_name').first().textContent() || '';
  }

  async getFirstProductPrice(): Promise<number> {
    const priceText = await this.page.locator('.inventory_item_price').first().textContent() || '0';
    return parseFloat(priceText.replace('$', ''));
  }

  async isProductListVisible(): Promise<boolean> {
    return await this.productList.isVisible();
  }

  async isSortDropdownVisible(): Promise<boolean> {
    return await this.sortDropdown.isVisible();
  }

  async addAllProductsToCart(): Promise<void> {
    const productNames = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)'
    ];
    for (const name of productNames) {
      await this.addProductToCart(name);
    }
  }

  async removeAllProductsFromCart(): Promise<void> {
    const removeButtons = this.page.locator('button[data-test^="remove-"]');
    const count = await removeButtons.count();
    for (let i = count - 1; i >= 0; i--) {
      await removeButtons.nth(i).click();
    }
  }
}
