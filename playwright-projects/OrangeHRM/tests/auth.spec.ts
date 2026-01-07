// tests/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import authData from '../data/authData.json';
import users from '../data/users.json';

test.describe('Authentication - OrangeHRM', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test.afterAll(async () => {
    // Healing reports would be saved here if needed
  });

  // ============================================================================
  // POSITIVE TEST CASES
  // ============================================================================
  test.describe('Positive Scenarios @smoke @regression', () => {
    for (const scenario of authData.validScenarios) {
      test(`${scenario.testId}: ${scenario.description}`, async ({ page }) => {
        // Act
        await loginPage.login(scenario.username, scenario.password);

        // Wait for navigation to complete after login
        await page.waitForURL(/dashboard/, { timeout: 15000 });

        // Assert
        if (scenario.expectedRedirect) {
          await expect(page).toHaveURL(new RegExp(scenario.expectedRedirect));
        }
        expect(await dashboardPage.isOnDashboard()).toBe(true);
      });
    }
  });

  // ============================================================================
  // UI VERIFICATION TESTS
  // ============================================================================
  test.describe('UI Verification @regression', () => {
    test('TC_AUTH_002: Verify username field accepts input', async () => {
      // Act
      await loginPage.enterUsername('testuser');

      // Assert
      const value = await loginPage.getUsernameValue();
      expect(value).toBe('testuser');
    });

    test('TC_AUTH_003: Verify password field masks characters', async () => {
      // Assert
      const isMasked = await loginPage.isPasswordMasked();
      expect(isMasked).toBe(true);
    });

    test('TC_AUTH_004: Verify Login button is clickable and functional', async () => {
      // Assert
      const isEnabled = await loginPage.isLoginButtonEnabled();
      expect(isEnabled).toBe(true);
    });

    test('TC_AUTH_005: Verify Forgot Password link is accessible', async () => {
      // Act
      await loginPage.clickForgotPassword();

      // Assert
      expect(loginPage.getCurrentUrl()).toContain('requestPasswordResetCode');
    });

    test('TC_AUTH_006: Verify OrangeHRM logo is displayed', async () => {
      // Assert
      const isLogoVisible = await loginPage.isLogoDisplayed();
      expect(isLogoVisible).toBe(true);
    });

    test('TC_AUTH_007: Verify social media links are present', async () => {
      // Assert
      const areSocialLinksPresent = await loginPage.areSocialLinksPresent();
      expect(areSocialLinksPresent).toBe(true);
    });

    test('TC_AUTH_008: Verify copyright information is displayed', async ({ page }) => {
      // Look for copyright text in the login page footer area
      const copyrightLocator = page.locator('.orangehrm-login-footer, .oxd-text--p, p').filter({ hasText: /orange|copyright|©/i });

      // Assert - check if any copyright element exists
      const count = await copyrightLocator.count();
      if (count > 0) {
        const copyrightText = await copyrightLocator.first().textContent() || '';
        expect(copyrightText.toLowerCase()).toMatch(/orange|copyright|©/i);
      } else {
        // Fallback: check page contains OrangeHRM branding somewhere
        const pageContent = await page.content();
        expect(pageContent.toLowerCase()).toContain('orangehrm');
      }
    });
  });

  // ============================================================================
  // NEGATIVE TEST CASES
  // ============================================================================
  test.describe('Negative Scenarios @regression @negative', () => {
    for (const scenario of authData.invalidScenarios) {
      test(`${scenario.testId}: ${scenario.description}`, async () => {
        // Act
        await loginPage.login(scenario.username, scenario.password);

        // Assert
        expect(await loginPage.isOnLoginPage()).toBe(true);
        expect(await loginPage.isErrorDisplayed()).toBe(true);

        const errorMsg = await loginPage.getErrorMessage();
        expect(errorMsg.toLowerCase()).toContain(scenario.expectedError.toLowerCase());
      });
    }
  });

  // ============================================================================
  // EMPTY FIELD VALIDATION
  // ============================================================================
  test.describe('Empty Field Validation @validation @negative', () => {
    for (const scenario of authData.emptyFieldTests) {
      test(`${scenario.testId}: ${scenario.description}`, async ({ page }) => {
        // Act
        await loginPage.enterUsername(scenario.username);
        await loginPage.enterPassword(scenario.password);
        await loginPage.clickLogin();

        // Assert - should stay on login page
        expect(await loginPage.isOnLoginPage()).toBe(true);

        // Check for validation errors - at least one should be shown
        const validationErrors = page.locator('.oxd-input-field-error-message, .oxd-input-group__message');
        const errorCount = await validationErrors.count();
        expect(errorCount).toBeGreaterThanOrEqual(1);
      });
    }
  });

  // ============================================================================
  // BOUNDARY TEST CASES
  // ============================================================================
  test.describe('Boundary Tests @boundary', () => {
    for (const scenario of authData.boundaryTests) {
      test(`${scenario.testId}: ${scenario.description}`, async () => {
        // Act
        await loginPage.login(scenario.username, scenario.password);

        // Assert - System should handle gracefully
        const isOnLogin = await loginPage.isOnLoginPage();
        const hasError = await loginPage.isErrorDisplayed() || await loginPage.isValidationErrorDisplayed();

        // Either stays on login with error, or system handles appropriately
        expect(isOnLogin || hasError).toBe(true);
      });
    }
  });

  // ============================================================================
  // SECURITY TEST CASES
  // ============================================================================
  test.describe('Security Tests @security', () => {
    for (const scenario of authData.securityTests) {
      test(`${scenario.testId}: ${scenario.description}`, async ({ page }) => {
        // Act - inject payload
        if (scenario.targetField === 'username') {
          await loginPage.enterUsername(scenario.payload);
          await loginPage.enterPassword(scenario.password || 'any');
        } else {
          await loginPage.enterUsername(scenario.username || 'admin');
          await loginPage.enterPassword(scenario.payload);
        }
        await loginPage.clickLogin();

        // Wait for page to stabilize after login attempt
        await page.waitForLoadState('domcontentloaded');

        // Assert - application handles gracefully
        const pageContent = await page.content();

        if (scenario.category === 'xss') {
          expect(pageContent).not.toContain("<script>alert('xss')");
          expect(pageContent).not.toContain('onerror=');
        }

        if (scenario.category === 'sql_injection') {
          // Should not show database errors
          expect(pageContent.toLowerCase()).not.toContain('sql');
          expect(pageContent.toLowerCase()).not.toContain('syntax error');
        }

        // Should either show error or stay on login page
        const isOnLogin = await loginPage.isOnLoginPage();
        expect(isOnLogin).toBe(true);
      });
    }

    test('TC_AUTH_406: Direct URL access without authentication', async ({ page }) => {
      // Clear session
      await page.context().clearCookies();

      // Try to access dashboard directly (use relative path without leading slash)
      await page.goto('web/index.php/dashboard/index');

      // Should redirect to login - wait for redirect
      await page.waitForURL(/auth\/login/, { timeout: 10000 });
      expect(await loginPage.isOnLoginPage()).toBe(true);
    });

    test('TC_AUTH_407: Logout functionality', async ({ page }) => {
      // Login first
      await loginPage.login(users.admin.username, users.admin.password);

      // Wait for dashboard to load
      await page.waitForURL(/dashboard/, { timeout: 15000 });
      expect(await dashboardPage.isOnDashboard()).toBe(true);

      // Logout
      await dashboardPage.logout();

      // Should be on login page - wait for redirect
      await page.waitForURL(/auth\/login/, { timeout: 10000 });
      expect(await loginPage.isOnLoginPage()).toBe(true);

      // Try to access dashboard again (use relative path)
      await page.goto('web/index.php/dashboard/index');

      // Should redirect to login
      await page.waitForURL(/auth\/login/, { timeout: 10000 });
      expect(await loginPage.isOnLoginPage()).toBe(true);
    });
  });
});
