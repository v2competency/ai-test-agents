import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import authData from '../data/authData.json';

test.describe('Authentication - SauceDemo', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  // ============================================================================
  // POSITIVE TEST CASES (TC_AUTH_001 - TC_AUTH_005)
  // ============================================================================
  test.describe('Positive Scenarios', () => {
    test('TC_AUTH_001: Successful login with standard_user', async ({ page }) => {
      const scenario = authData.validScenarios[0];

      await loginPage.login(scenario.username!, scenario.password!);

      await expect(page).toHaveURL(/inventory\.html/);
      const inventoryPage = new InventoryPage(page);
      expect(await inventoryPage.isProductListVisible()).toBe(true);
    });

    test('TC_AUTH_002: Successful login with problem_user', async ({ page }) => {
      const scenario = authData.validScenarios[1];

      await loginPage.login(scenario.username!, scenario.password!);

      await expect(page).toHaveURL(/inventory\.html/);
    });

    test('TC_AUTH_003: Successful login with performance_glitch_user', async ({ page }) => {
      const scenario = authData.validScenarios[2];

      await loginPage.login(scenario.username!, scenario.password!);

      await expect(page).toHaveURL(/inventory\.html/, { timeout: 30000 });
    });

    test('TC_AUTH_004: Successful login with error_user', async ({ page }) => {
      const scenario = authData.validScenarios[3];

      await loginPage.login(scenario.username!, scenario.password!);

      await expect(page).toHaveURL(/inventory\.html/);
    });

    test('TC_AUTH_005: Login page displays correctly', async () => {
      expect(await loginPage.isLogoDisplayed()).toBe(true);
      expect(await loginPage.isUsernameFieldVisible()).toBe(true);
      expect(await loginPage.isPasswordFieldVisible()).toBe(true);
      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
    });
  });

  // ============================================================================
  // NEGATIVE TEST CASES (TC_AUTH_100 - TC_AUTH_103)
  // ============================================================================
  test.describe('Negative Scenarios', () => {
    test('TC_AUTH_100: Login attempt with locked_out_user', async () => {
      const scenario = authData.invalidScenarios[0];

      await loginPage.login(scenario.username, scenario.password);

      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
      expect(await loginPage.isLoginErrorDisplayed()).toBe(true);
      const errorMsg = await loginPage.getLoginError();
      expect(errorMsg).toContain('locked out');
    });

    test('TC_AUTH_101: Login with invalid username', async () => {
      const scenario = authData.invalidScenarios[1];

      await loginPage.login(scenario.username, scenario.password);

      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
      expect(await loginPage.isLoginErrorDisplayed()).toBe(true);
      const errorMsg = await loginPage.getLoginError();
      expect(errorMsg).toContain('Username and password do not match');
    });

    test('TC_AUTH_102: Login with invalid password', async () => {
      const scenario = authData.invalidScenarios[2];

      await loginPage.login(scenario.username, scenario.password);

      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
      expect(await loginPage.isLoginErrorDisplayed()).toBe(true);
      const errorMsg = await loginPage.getLoginError();
      expect(errorMsg).toContain('Username and password do not match');
    });

    test('TC_AUTH_103: Login with username containing only spaces', async () => {
      const scenario = authData.invalidScenarios[3];

      await loginPage.login(scenario.username, scenario.password);

      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
      expect(await loginPage.isLoginErrorDisplayed()).toBe(true);
    });
  });

  // ============================================================================
  // EMPTY FIELD VALIDATION (TC_AUTH_200 - TC_AUTH_202)
  // ============================================================================
  test.describe('Empty Field Validation', () => {
    test('TC_AUTH_200: Login with empty username field', async () => {
      const scenario = authData.emptyFieldTests[0];

      await loginPage.login(scenario.username, scenario.password);

      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
      expect(await loginPage.isLoginErrorDisplayed()).toBe(true);
      const errorMsg = await loginPage.getLoginError();
      expect(errorMsg).toContain('Username is required');
    });

    test('TC_AUTH_201: Login with empty password field', async () => {
      const scenario = authData.emptyFieldTests[1];

      await loginPage.login(scenario.username, scenario.password);

      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
      expect(await loginPage.isLoginErrorDisplayed()).toBe(true);
      const errorMsg = await loginPage.getLoginError();
      expect(errorMsg).toContain('Password is required');
    });

    test('TC_AUTH_202: Login with both fields empty', async () => {
      const scenario = authData.emptyFieldTests[2];

      await loginPage.login(scenario.username, scenario.password);

      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
      expect(await loginPage.isLoginErrorDisplayed()).toBe(true);
      const errorMsg = await loginPage.getLoginError();
      expect(errorMsg).toContain('Username is required');
    });
  });

  // ============================================================================
  // BOUNDARY TEST CASES (TC_AUTH_300 - TC_AUTH_304)
  // ============================================================================
  test.describe('Boundary Tests', () => {
    test('TC_AUTH_300: Login with minimum length username (1 character)', async () => {
      const scenario = authData.boundaryTests[0];

      await loginPage.login(scenario.username, scenario.password);

      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
      expect(await loginPage.isLoginErrorDisplayed()).toBe(true);
    });

    test('TC_AUTH_301: Login with very long username (255+ characters)', async ({ page }) => {
      const scenario = authData.boundaryTests[1];

      await loginPage.login(scenario.username, scenario.password);

      // Application should handle gracefully without crash
      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
      expect(await loginPage.isLoginErrorDisplayed()).toBe(true);
    });

    test('TC_AUTH_302: Login with minimum length password (1 character)', async () => {
      const scenario = authData.boundaryTests[2];

      await loginPage.login(scenario.username, scenario.password);

      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
      expect(await loginPage.isLoginErrorDisplayed()).toBe(true);
    });

    test('TC_AUTH_303: Login with very long password (255+ characters)', async () => {
      const scenario = authData.boundaryTests[3];

      await loginPage.login(scenario.username, scenario.password);

      // Application should handle gracefully without crash
      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
      expect(await loginPage.isLoginErrorDisplayed()).toBe(true);
    });

    test('TC_AUTH_304: Login with special characters in username', async () => {
      const scenario = authData.boundaryTests[4];

      await loginPage.login(scenario.username, scenario.password);

      // Application should handle special characters gracefully
      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
      expect(await loginPage.isLoginErrorDisplayed()).toBe(true);
    });
  });

  // ============================================================================
  // SECURITY TEST CASES (TC_AUTH_400 - TC_AUTH_404)
  // ============================================================================
  test.describe('Security Tests', () => {
    test('TC_AUTH_400: SQL injection in username field', async ({ page }) => {
      const scenario = authData.securityTests[0];

      await loginPage.login(scenario.payload, scenario.password!);

      // Should reject SQL injection attempt
      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });

    test('TC_AUTH_401: SQL injection in password field', async ({ page }) => {
      const scenario = authData.securityTests[1];

      await loginPage.login(scenario.username!, scenario.payload);

      // Should reject SQL injection attempt
      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });

    test('TC_AUTH_402: XSS script injection in username field', async ({ page }) => {
      const scenario = authData.securityTests[2];

      await loginPage.login(scenario.payload, scenario.password!);

      // No JavaScript alert should execute
      const pageContent = await page.content();
      expect(pageContent).not.toContain("<script>alert('XSS')</script>");

      // Should remain on login page
      expect(await loginPage.isLoginPageDisplayed()).toBe(true);
    });

    test('TC_AUTH_403: Direct URL access to inventory without login', async ({ page, context }) => {
      // Clear cookies and storage
      await context.clearCookies();
      await page.evaluate(() => {
        sessionStorage.clear();
        localStorage.clear();
      });

      // Try to access inventory directly
      await page.goto('/inventory.html');

      // Should redirect to login or show error
      const url = page.url();
      const isOnLoginOrError = url.includes('saucedemo.com') && !url.includes('inventory.html') ||
                                await loginPage.isLoginErrorDisplayed().catch(() => false);
      expect(isOnLoginOrError || await page.locator('[data-test="error"]').isVisible().catch(() => false)).toBe(true);
    });

    test('TC_AUTH_404: Session validation after logout', async ({ page }) => {
      // First login
      await loginPage.loginAndWaitForInventory('standard_user', 'secret_sauce');

      const inventoryPage = new InventoryPage(page);

      // Logout
      await inventoryPage.logout();

      // Verify redirected to login
      await expect(page).toHaveURL(/saucedemo\.com\/?$/);

      // Try to go back
      await page.goBack();

      // Wait a moment for any redirect
      await page.waitForTimeout(1000);

      // Should not be able to access inventory with valid session
      // Either stays on login page, shows error, or redirects back to login
      const currentUrl = page.url();
      const loginPageVisible = await loginPage.isLoginPageDisplayed().catch(() => false);
      const hasError = await page.locator('[data-test="error"]').isVisible().catch(() => false);
      const onLoginPage = currentUrl.match(/saucedemo\.com\/?$/) !== null;

      // Test passes if any of these conditions are true
      expect(loginPageVisible || hasError || onLoginPage).toBe(true);
    });
  });
});
