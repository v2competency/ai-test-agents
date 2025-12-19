import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly pageUrl: string = '/';

  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginLogo: Locator;
  readonly loginCredentials: Locator;
  readonly errorMessageContainer: Locator;
  readonly errorButton: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput = page.locator('[data-test="username"], #user-name, input[name="user-name"]');
    this.passwordInput = page.locator('[data-test="password"], #password, input[name="password"]');
    this.loginButton = page.locator('[data-test="login-button"], #login-button, input[type="submit"]');
    this.loginLogo = page.locator('.login_logo, .app_logo');
    this.loginCredentials = page.locator('.login_credentials_wrap, #login_credentials');
    this.errorMessageContainer = page.locator('[data-test="error"], .error-message-container h3');
    this.errorButton = page.locator('[data-test="error-button"], .error-button');
  }

  // Navigation
  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  async isOnPage(): Promise<boolean> {
    return this.page.url().endsWith('/') || this.page.url().includes('saucedemo.com') && !this.page.url().includes('inventory');
  }

  // Actions
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
    await this.waitForSpinnerToDisappear();
  }

  async loginAndWaitForInventory(username: string, password: string): Promise<void> {
    await this.login(username, password);
    await this.page.waitForURL('**/inventory.html', { timeout: 30000 });
  }

  // Verification
  async getLoginError(): Promise<string> {
    await this.errorMessageContainer.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessageContainer.textContent() || '';
  }

  async isLoginErrorDisplayed(): Promise<boolean> {
    return await this.errorMessageContainer.isVisible();
  }

  async isLoginPageDisplayed(): Promise<boolean> {
    return await this.loginButton.isVisible();
  }

  async isLogoDisplayed(): Promise<boolean> {
    return await this.loginLogo.isVisible();
  }

  async isUsernameFieldVisible(): Promise<boolean> {
    return await this.usernameInput.isVisible();
  }

  async isPasswordFieldVisible(): Promise<boolean> {
    return await this.passwordInput.isVisible();
  }

  async dismissError(): Promise<void> {
    if (await this.errorButton.isVisible()) {
      await this.errorButton.click();
    }
  }
}
