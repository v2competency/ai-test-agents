import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  readonly loadingSpinner: Locator;
  readonly errorMessage: Locator;
  readonly hamburgerMenu: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingSpinner = page.locator('[data-test="loading"], .loading, .spinner');
    this.errorMessage = page.locator('[data-test="error"], .error-message-container, [data-test="error-button"]').first();
    this.hamburgerMenu = page.locator('#react-burger-menu-btn');
    this.shoppingCartLink = page.locator('.shopping_cart_link, [data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge, [data-test="shopping-cart-badge"]');
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForSpinnerToDisappear(): Promise<void> {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent() || '';
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `reports/screenshots/${name}.png`, fullPage: true });
  }

  async getCartItemCount(): Promise<number> {
    const isVisible = await this.shoppingCartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.shoppingCartBadge.textContent();
    return parseInt(text || '0', 10);
  }

  async clickShoppingCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  async openHamburgerMenu(): Promise<void> {
    await this.hamburgerMenu.click();
    await this.page.waitForTimeout(500); // Wait for menu animation
  }

  async logout(): Promise<void> {
    await this.openHamburgerMenu();
    await this.page.locator('#logout_sidebar_link, [data-test="logout-sidebar-link"]').click();
  }

  async clearSessionStorage(): Promise<void> {
    await this.page.evaluate(() => {
      sessionStorage.clear();
      localStorage.clear();
    });
  }
}
