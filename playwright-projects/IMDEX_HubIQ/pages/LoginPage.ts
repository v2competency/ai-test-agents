// pages/LoginPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ElementDefinition } from '../utils/SelfHealingLocator';

export class LoginPage extends BasePage {
  // ============================================================
  // Element Definitions
  // ============================================================
  private readonly usernameInputDef: ElementDefinition = {
    name: 'usernameInput',
    description: 'Username input field on IMDEX HUB-IQ login page',
    primary: 'input[name="Username"], input[name="username"]',
    fallbacks: [
      '#Username',
      'input[type="text"][placeholder*="user" i]',
      'input[type="email"]',
      'input[autocomplete="username"]'
    ],
    type: 'input'
  };

  private readonly passwordInputDef: ElementDefinition = {
    name: 'passwordInput',
    description: 'Password input field on IMDEX HUB-IQ login page',
    primary: 'input[name="Password"], input[name="password"]',
    fallbacks: [
      '#Password',
      'input[type="password"]',
      'input[autocomplete="current-password"]'
    ],
    type: 'input'
  };

  private readonly signInButtonDef: ElementDefinition = {
    name: 'signInButton',
    description: 'Sign In button on IMDEX HUB-IQ login page',
    primary: 'button[type="submit"]',
    fallbacks: [
      'button:has-text("Sign In")',
      'button:has-text("Sign in")',
      'button:has-text("Login")',
      'input[type="submit"]',
      '.btn-primary[type="submit"]'
    ],
    type: 'button'
  };

  private readonly errorMessageDef: ElementDefinition = {
    name: 'errorMessage',
    description: 'Login error message displayed after invalid credentials',
    primary: '.validation-summary-errors, .alert-danger',
    fallbacks: [
      '.error-message',
      '.login-error',
      '[class*="error"]',
      '.text-danger',
      '[role="alert"]'
    ],
    type: 'text'
  };

  private readonly forgotPasswordLinkDef: ElementDefinition = {
    name: 'forgotPasswordLink',
    description: 'Forgot password link on the login page',
    primary: 'a:has-text("Forgot password")',
    fallbacks: [
      'a:has-text("forgot")',
      'a[href*="forgot"]',
      'a[href*="reset"]',
      '.forgot-password'
    ],
    type: 'link'
  };

  private readonly ssoButtonDef: ElementDefinition = {
    name: 'ssoButton',
    description: 'Sign in with SSO button on login page',
    primary: 'button:has-text("Sign in with SSO")',
    fallbacks: [
      'a:has-text("SSO")',
      'button:has-text("SSO")',
      '.sso-login',
      '[class*="sso"]'
    ],
    type: 'button'
  };

  private readonly rememberMeCheckboxDef: ElementDefinition = {
    name: 'rememberMeCheckbox',
    description: 'Remember Me checkbox on login page',
    primary: 'input[type="checkbox"][name*="remember" i]',
    fallbacks: [
      '#RememberMe',
      'input[type="checkbox"]',
      'label:has-text("Remember") input'
    ],
    type: 'checkbox'
  };

  private readonly logoDef: ElementDefinition = {
    name: 'logo',
    description: 'IMDEX logo on the login page',
    primary: 'img[alt*="IMDEX" i], img[alt*="logo" i]',
    fallbacks: [
      '.logo',
      '.brand-logo',
      'img[src*="logo"]',
      '.login-logo img'
    ],
    type: 'container'
  };

  private readonly validationErrorDef: ElementDefinition = {
    name: 'validationError',
    description: 'Field validation error message on login form',
    primary: '.field-validation-error, .validation-message',
    fallbacks: [
      '.text-danger',
      '.invalid-feedback',
      '[class*="validation"]',
      '.error'
    ],
    type: 'text'
  };

  constructor(page: Page) {
    super(page);
  }

  // ============================================================
  // Navigation
  // ============================================================
  async navigate(): Promise<void> {
    await this.page.goto('/');
    await this.waitForPageLoad();
  }

  isOnLoginPage(): boolean {
    const url = this.getCurrentUrl();
    return url.includes('Account/Login') || url.includes('login') || url.endsWith('/');
  }

  // ============================================================
  // Actions
  // ============================================================
  async enterUsername(username: string): Promise<void> {
    await this.healer.fill(this.usernameInputDef, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.healer.fill(this.passwordInputDef, password);
  }

  async clickSignIn(): Promise<void> {
    await this.healer.click(this.signInButtonDef);
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickSignIn();
    await this.waitForPageLoad();
  }

  async clickForgotPassword(): Promise<void> {
    await this.healer.click(this.forgotPasswordLinkDef);
  }

  async clickSSO(): Promise<void> {
    await this.healer.click(this.ssoButtonDef);
  }

  async checkRememberMe(): Promise<void> {
    await this.healer.click(this.rememberMeCheckboxDef);
  }

  // ============================================================
  // Assertions / Getters
  // ============================================================
  async getErrorMessage(): Promise<string> {
    return await this.healer.getText(this.errorMessageDef);
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.healer.isVisible(this.errorMessageDef);
  }

  async getValidationError(): Promise<string> {
    return await this.healer.getText(this.validationErrorDef);
  }

  async isValidationErrorDisplayed(): Promise<boolean> {
    return await this.healer.isVisible(this.validationErrorDef);
  }

  async isLogoDisplayed(): Promise<boolean> {
    return await this.healer.isVisible(this.logoDef);
  }

  async isPasswordMasked(): Promise<boolean> {
    const locator = await this.healer.locate(this.passwordInputDef);
    const type = await locator.getAttribute('type');
    return type === 'password';
  }

  async isSignInButtonVisible(): Promise<boolean> {
    return await this.healer.isVisible(this.signInButtonDef);
  }

  async isForgotPasswordLinkVisible(): Promise<boolean> {
    return await this.healer.isVisible(this.forgotPasswordLinkDef);
  }

  async isSSOButtonVisible(): Promise<boolean> {
    return await this.healer.isVisible(this.ssoButtonDef);
  }
}
