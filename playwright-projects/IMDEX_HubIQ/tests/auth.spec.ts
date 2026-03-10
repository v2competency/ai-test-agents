// tests/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
const authData = require('../data/authData.json') as any;
const users = require('../data/users.json') as any;

let loginPage: LoginPage;
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.navigate();
});

// ============================================================
// Positive Scenarios @smoke @regression
// ============================================================
test.describe('Authentication - Positive Scenarios @smoke @regression', () => {
  for (const scenario of authData.validScenarios) {
    test(`${scenario.id}: ${scenario.title}`, async ({ page }) => {
      await loginPage.login(scenario.username, scenario.password);
      await expect(page).not.toHaveURL(/login/i);

      const companyName = await dashboardPage.getCompanyName();
      expect(companyName).toContain(scenario.expectedCompany);

      const userName = await dashboardPage.getUserName();
      expect(userName).toContain(scenario.expectedUser);
    });
  }

  test('TC_AUTH_003: Login with Remember Me', async ({ page }) => {
    const scenario = authData.rememberMeScenario;
    await loginPage.enterUsername(scenario.username);
    await loginPage.enterPassword(scenario.password);
    await loginPage.checkRememberMe();
    await loginPage.clickSignIn();
    await loginPage.waitForPageLoad();
    await expect(page).not.toHaveURL(/login/i);
  });

  test('TC_AUTH_004: Logout from application', async ({ page }) => {
    await loginPage.login(users.admin.username, users.admin.password);
    await dashboardPage.logout();
    expect(loginPage.isOnLoginPage()).toBeTruthy();
  });

  test('TC_AUTH_005: Navigate to Forgot Password', async () => {
    await loginPage.clickForgotPassword();
    expect(loginPage.getCurrentUrl()).toContain('forgot');
  });
});

// ============================================================
// UI Verification @regression
// ============================================================
test.describe('Authentication - UI Verification @regression', () => {
  test('Login page displays IMDEX logo', async () => {
    const logoVisible = await loginPage.isLogoDisplayed();
    expect(logoVisible).toBeTruthy();
  });

  test('Password field is masked', async () => {
    const isMasked = await loginPage.isPasswordMasked();
    expect(isMasked).toBeTruthy();
  });

  test('Sign In button is visible', async () => {
    const isVisible = await loginPage.isSignInButtonVisible();
    expect(isVisible).toBeTruthy();
  });

  test('Forgot password link is visible', async () => {
    const isVisible = await loginPage.isForgotPasswordLinkVisible();
    expect(isVisible).toBeTruthy();
  });
});

// ============================================================
// Negative Scenarios @regression @negative
// ============================================================
test.describe('Authentication - Negative Scenarios @regression @negative', () => {
  for (const scenario of authData.invalidScenarios) {
    test(`${scenario.id}: ${scenario.title}`, async () => {
      await loginPage.login(scenario.username, scenario.password);

      const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
      expect(isErrorDisplayed).toBeTruthy();

      expect(loginPage.isOnLoginPage()).toBeTruthy();
    });
  }
});

// ============================================================
// Empty Field Validation @validation @negative
// ============================================================
test.describe('Authentication - Empty Field Validation @validation @negative', () => {
  for (const scenario of authData.emptyFieldTests) {
    test(`${scenario.id}: ${scenario.title}`, async () => {
      if (scenario.username !== '') {
        await loginPage.enterUsername(scenario.username);
      }
      if (scenario.password !== '') {
        await loginPage.enterPassword(scenario.password);
      }
      await loginPage.clickSignIn();

      const hasError = await loginPage.isValidationErrorDisplayed() || await loginPage.isErrorMessageDisplayed();
      expect(hasError).toBeTruthy();
      expect(loginPage.isOnLoginPage()).toBeTruthy();
    });
  }
});

// ============================================================
// Boundary Tests @boundary
// ============================================================
test.describe('Authentication - Boundary Tests @boundary', () => {
  for (const scenario of authData.boundaryTests) {
    test(`${scenario.id}: ${scenario.title}`, async () => {
      await loginPage.login(scenario.username, scenario.password);
      // Verify no server crash - either error message or login page
      const isOnLogin = loginPage.isOnLoginPage();
      const hasError = await loginPage.isErrorMessageDisplayed();
      expect(isOnLogin || hasError).toBeTruthy();
    });
  }
});

// ============================================================
// Security Tests @security
// ============================================================
test.describe('Authentication - Security Tests @security', () => {
  test('TC_AUTH_400: SQL injection in username field', async () => {
    const scenario = authData.securityTests[0];
    await loginPage.login(scenario.username, scenario.password);

    // Verify no SQL error - should show normal login error
    expect(loginPage.isOnLoginPage()).toBeTruthy();
    const hasError = await loginPage.isErrorMessageDisplayed();
    expect(hasError).toBeTruthy();
  });

  test('TC_AUTH_401: XSS in username field', async ({ page }) => {
    const scenario = authData.securityTests[1];
    await loginPage.enterUsername(scenario.username);
    await loginPage.enterPassword(scenario.password);
    await loginPage.clickSignIn();

    // Verify no script execution - check page hasn't been compromised
    const dialogTriggered = await page.evaluate(() => {
      return (window as any).__xssTriggered === true;
    });
    expect(dialogTriggered).toBeFalsy();
  });

  test('TC_AUTH_402: Session management after logout', async ({ page }) => {
    // Login first
    await loginPage.login(users.admin.username, users.admin.password);
    await dashboardPage.waitForPageLoad();

    // Logout
    await dashboardPage.logout();

    // Try to access protected page directly
    await page.goto('/Home/Dashboard');
    await loginPage.waitForPageLoad();

    // Should be redirected to login
    expect(loginPage.isOnLoginPage()).toBeTruthy();
  });
});
