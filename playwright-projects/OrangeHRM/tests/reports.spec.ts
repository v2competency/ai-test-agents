// tests/reports.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ReportsPage } from '../pages/ReportsPage';
import reportsData from '../data/reportsData.json';
import users from '../data/users.json';

test.describe('Reports - OrangeHRM', () => {
  let loginPage: LoginPage;
  let reportsPage: ReportsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    reportsPage = new ReportsPage(page);

    // Login
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);
  });

  // ============================================================================
  // LEAVE USAGE REPORT TESTS
  // ============================================================================
  test.describe('Leave Usage Report @smoke @regression', () => {
    test.beforeEach(async () => {
      await reportsPage.navigateToLeaveUsageReport();
    });

    test('TC_RPT_001: Access Leave Entitlements and Usage Report', async () => {
      // Assert
      expect(await reportsPage.isOnLeaveUsageReportPage()).toBe(true);
    });

    test('TC_RPT_002: Generate report by Leave Type', async () => {
      // Act
      await reportsPage.selectGenerateForLeaveType();
      await reportsPage.selectLeavePeriod('2025');
      await reportsPage.clickGenerate();

      // Assert
      expect(await reportsPage.isOnLeaveUsageReportPage()).toBe(true);
    });

    test('TC_RPT_003: Generate report by Employee', async () => {
      // Act
      await reportsPage.selectGenerateForEmployee();
      await reportsPage.selectLeavePeriod('2025');
      await reportsPage.clickGenerate();

      // Assert
      expect(await reportsPage.isOnLeaveUsageReportPage()).toBe(true);
    });

    test('TC_RPT_100: Generate report without required Leave Period', async () => {
      // Act - Try to generate without selecting leave period
      await reportsPage.clickGenerate();

      // Assert
      expect(await reportsPage.isValidationErrorDisplayed()).toBe(true);
    });
  });

  // ============================================================================
  // MY LEAVE USAGE REPORT TESTS
  // ============================================================================
  test.describe('My Leave Usage Report @regression', () => {
    test.beforeEach(async () => {
      await reportsPage.navigateToMyLeaveUsageReport();
    });

    test('TC_RPT_008: Access My Leave Usage Report', async () => {
      // Assert
      expect(await reportsPage.isOnMyLeaveUsageReportPage()).toBe(true);
    });

    test('TC_RPT_009: Generate My Leave Usage Report', async () => {
      // Act
      await reportsPage.selectLeavePeriod('2025');
      await reportsPage.clickGenerate();

      // Assert
      expect(await reportsPage.isOnMyLeaveUsageReportPage()).toBe(true);
      expect(await reportsPage.isReportTableVisible()).toBe(true);
    });
  });
});
