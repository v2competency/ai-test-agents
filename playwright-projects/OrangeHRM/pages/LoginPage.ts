// pages/LoginPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ElementDefinition } from '../utils/SelfHealingLocator';

export class LoginPage extends BasePage {
  readonly pageUrl = 'web/index.php/auth/login';

  // Element definitions with fallback selectors
  private readonly usernameInputDef: ElementDefinition = {
    name: 'usernameInput',
    description: 'Username input field on login page',
    primary: 'input[name="username"]',
    fallbacks: [
      '[placeholder="Username"]',
      '.oxd-input[name="username"]',
      'input.oxd-input:first-of-type',
      '.orangehrm-login-form input:first-of-type'
    ],
    type: 'input'
  };

  private readonly passwordInputDef: ElementDefinition = {
    name: 'passwordInput',
    description: 'Password input field on login page',
    primary: 'input[name="password"]',
    fallbacks: [
      '[placeholder="Password"]',
      'input[type="password"]',
      '.oxd-input[name="password"]',
      '.orangehrm-login-form input[type="password"]'
    ],
    type: 'input'
  };

  private readonly loginButtonDef: ElementDefinition = {
    name: 'loginButton',
    description: 'Login submit button',
    primary: 'button[type="submit"]',
    fallbacks: [
      '.orangehrm-login-button',
      'button.oxd-button--main',
      'button:has-text("Login")',
      '.oxd-form button'
    ],
    type: 'button'
  };

  private readonly errorMessageDef: ElementDefinition = {
    name: 'errorMessage',
    description: 'Login error message alert',
    primary: '.oxd-alert-content-text',
    fallbacks: [
      '.oxd-alert--error',
      '.oxd-alert',
      '[role="alert"]',
      '.orangehrm-login-error'
    ],
    type: 'text'
  };

  private readonly validationErrorDef: ElementDefinition = {
    name: 'validationError',
    description: 'Field validation error message',
    primary: '.oxd-input-field-error-message',
    fallbacks: [
      '.oxd-input-group__message',
      'span.oxd-text--span',
      '.validation-error'
    ],
    type: 'text'
  };

  private readonly forgotPasswordLinkDef: ElementDefinition = {
    name: 'forgotPasswordLink',
    description: 'Forgot your password link',
    primary: '.orangehrm-login-forgot-header',
    fallbacks: [
      'p:has-text("Forgot your password")',
      'a:has-text("Forgot")',
      '.oxd-text--p:has-text("Forgot")'
    ],
    type: 'link'
  };

  private readonly logoDef: ElementDefinition = {
    name: 'logo',
    description: 'OrangeHRM logo on login page',
    primary: '.orangehrm-login-branding img',
    fallbacks: [
      'img[alt*="OrangeHRM"]',
      '.orangehrm-login-logo',
      '.oxd-brand-banner img'
    ],
    type: 'container'
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  /**
   * Check if on login page
   */
  async isOnLoginPage(): Promise<boolean> {
    return this.page.url().includes('/auth/login');
  }

  /**
   * Enter username
   */
  async enterUsername(username: string): Promise<void> {
    await this.healer.fill(this.usernameInputDef, username);
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<void> {
    await this.healer.fill(this.passwordInputDef, password);
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    await this.healer.click(this.loginButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  /**
   * Complete login flow
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  /**
   * Check if error message is displayed
   */
  async isErrorDisplayed(): Promise<boolean> {
    return await this.healer.isVisible(this.errorMessageDef, 3000);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.healer.getText(this.errorMessageDef);
  }

  /**
   * Check if validation error is displayed
   */
  async isValidationErrorDisplayed(): Promise<boolean> {
    return await this.healer.isVisible(this.validationErrorDef, 3000);
  }

  /**
   * Get validation error messages
   */
  async getValidationErrors(): Promise<string[]> {
    const errors = this.page.locator(this.validationErrorDef.primary);
    const count = await errors.count();
    const errorTexts: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await errors.nth(i).textContent();
      if (text) errorTexts.push(text);
    }
    return errorTexts;
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.healer.click(this.forgotPasswordLinkDef);
    await this.waitForPageLoad();
  }

  /**
   * Check if logo is displayed
   */
  async isLogoDisplayed(): Promise<boolean> {
    return await this.healer.isVisible(this.logoDef);
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    const button = await this.healer.locate(this.loginButtonDef);
    return await button.isEnabled();
  }

  /**
   * Get username input value
   */
  async getUsernameValue(): Promise<string> {
    const input = await this.healer.locate(this.usernameInputDef);
    return await input.inputValue();
  }

  /**
   * Check if password is masked
   */
  async isPasswordMasked(): Promise<boolean> {
    const passwordInput = await this.healer.locate(this.passwordInputDef);
    const inputType = await passwordInput.getAttribute('type');
    return inputType === 'password';
  }

  /**
   * Check social media links are present
   */
  async areSocialLinksPresent(): Promise<boolean> {
    const socialContainer = this.page.locator('.orangehrm-login-footer-sm');
    return await socialContainer.isVisible();
  }

  /**
   * Get copyright text
   */
  async getCopyrightText(): Promise<string> {
    const copyright = this.page.locator('.orangehrm-copyright');
    return await copyright.textContent() || '';
  }
}
