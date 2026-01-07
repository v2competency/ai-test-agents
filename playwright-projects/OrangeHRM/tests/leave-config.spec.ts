// tests/leave-config.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LeaveConfigPage } from '../pages/LeaveConfigPage';
import leaveConfigData from '../data/leaveConfigData.json';
import users from '../data/users.json';

test.describe('Leave Configuration - OrangeHRM', () => {
  let loginPage: LoginPage;
  let leaveConfigPage: LeaveConfigPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    leaveConfigPage = new LeaveConfigPage(page);

    // Login
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);
  });

  // ============================================================================
  // LEAVE PERIOD TESTS
  // ============================================================================
  test.describe('Leave Period Configuration @smoke @regression', () => {
    test.beforeEach(async () => {
      await leaveConfigPage.navigateToLeavePeriod();
    });

    test('TC_CONFIG_001: Access Leave Period configuration', async ({ page }) => {
      // Assert
      await expect(page).toHaveURL(/defineLeavePeriod/);
    });

    test('TC_CONFIG_002: View current Leave Period', async () => {
      // Act
      const currentPeriod = await leaveConfigPage.getCurrentLeavePeriod();

      // Assert
      expect(currentPeriod).toBeTruthy();
    });
  });

  // ============================================================================
  // LEAVE TYPES TESTS
  // ============================================================================
  test.describe('Leave Types Configuration @regression', () => {
    test.beforeEach(async () => {
      await leaveConfigPage.navigateToLeaveTypes();
    });

    test('TC_CONFIG_003: View Leave Types list', async ({ page }) => {
      // Assert
      await expect(page).toHaveURL(/leaveTypeList/);
    });

    test('TC_CONFIG_101: Add Leave Type with empty name', async () => {
      // Act
      await leaveConfigPage.clickAddLeaveType();
      await leaveConfigPage.enterLeaveTypeName('');
      await leaveConfigPage.clickSave();

      // Assert
      expect(await leaveConfigPage.isValidationErrorDisplayed()).toBe(true);
    });
  });

  // ============================================================================
  // WORK WEEK TESTS
  // ============================================================================
  test.describe('Work Week Configuration @regression', () => {
    test.beforeEach(async () => {
      await leaveConfigPage.navigateToWorkWeek();
    });

    test('TC_CONFIG_007: Access Work Week configuration', async ({ page }) => {
      // Assert
      await expect(page).toHaveURL(/defineWorkWeek/);
    });
  });

  // ============================================================================
  // HOLIDAYS TESTS
  // ============================================================================
  test.describe('Holidays Configuration @regression', () => {
    test.beforeEach(async () => {
      await leaveConfigPage.navigateToHolidays();
    });

    test('TC_CONFIG_009: View Holidays list', async ({ page }) => {
      // Assert
      await expect(page).toHaveURL(/viewHolidayList/);
    });

    test('TC_CONFIG_011: Search Holidays by date range', async () => {
      // Act
      await leaveConfigPage.searchHolidays('2025-01-01', '2025-12-31');

      // Assert - Should complete search
      const currentUrl = leaveConfigPage.getCurrentUrl();
      expect(currentUrl).toContain('viewHolidayList');
    });
  });

  // ============================================================================
  // SECURITY TESTS
  // ============================================================================
  test.describe('Security Tests @security', () => {
    test('TC_CONFIG_400: XSS in Leave Type name', async ({ page }) => {
      await leaveConfigPage.navigateToLeaveTypes();
      await leaveConfigPage.clickAddLeaveType();

      // Act
      await leaveConfigPage.enterLeaveTypeName("<script>alert('xss')</script>");

      // Assert - XSS should not execute
      const pageContent = await page.content();
      expect(pageContent).not.toContain("<script>alert('xss')");
    });

    test('TC_CONFIG_401: XSS in Holiday name', async ({ page }) => {
      await leaveConfigPage.navigateToHolidays();
      await leaveConfigPage.clickAddHoliday();

      // Act
      await leaveConfigPage.enterHolidayName("<img src=x onerror=alert('xss')>");

      // Assert - XSS should not execute
      const pageContent = await page.content();
      expect(pageContent).not.toContain("onerror=");
    });
  });
});
