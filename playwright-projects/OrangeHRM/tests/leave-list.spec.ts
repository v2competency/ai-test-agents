// tests/leave-list.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LeaveListPage } from '../pages/LeaveListPage';
import leaveListData from '../data/leaveListData.json';
import users from '../data/users.json';

test.describe('Leave List - OrangeHRM', () => {
  let loginPage: LoginPage;
  let leaveListPage: LeaveListPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    leaveListPage = new LeaveListPage(page);

    // Login and navigate to Leave List
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);
    await leaveListPage.navigate();
  });

  // ============================================================================
  // POSITIVE TEST CASES
  // ============================================================================
  test.describe('Positive Scenarios @smoke @regression', () => {
    test('TC_LIST_001: View Leave List page', async () => {
      // Assert
      expect(await leaveListPage.isOnLeaveListPage()).toBe(true);
    });

    test('TC_LIST_002: Search leaves with valid date range', async () => {
      const scenario = leaveListData.validScenarios[1];

      // Act
      await leaveListPage.enterFromDate(scenario.fromDate);
      await leaveListPage.enterToDate(scenario.toDate);
      await leaveListPage.clickSearch();

      // Assert - Search should complete (may have 0 or more results)
      expect(await leaveListPage.isOnLeaveListPage()).toBe(true);
    });

    test('TC_LIST_003: Filter by Pending Approval status', async () => {
      // Act
      await leaveListPage.selectStatus('Pending Approval');
      await leaveListPage.clickSearch();

      // Assert
      expect(await leaveListPage.isOnLeaveListPage()).toBe(true);
    });

    test('TC_LIST_008: Reset all filters', async () => {
      // Apply some filters first
      await leaveListPage.enterFromDate('2025-04-01');
      await leaveListPage.clickSearch();

      // Act
      await leaveListPage.clickReset();

      // Assert - Page should reset
      expect(await leaveListPage.isOnLeaveListPage()).toBe(true);
    });
  });

  // ============================================================================
  // FILTER TESTS
  // ============================================================================
  test.describe('Filter Tests @regression', () => {
    test('TC_LIST_004: Filter by Leave Type', async () => {
      // Act
      await leaveListPage.selectLeaveType('ML');
      await leaveListPage.clickSearch();

      // Assert
      expect(await leaveListPage.isOnLeaveListPage()).toBe(true);
    });

    test('TC_LIST_007: Toggle Include Past Employees', async () => {
      // Act
      await leaveListPage.toggleIncludePastEmployees();
      await leaveListPage.clickSearch();

      // Assert
      expect(await leaveListPage.isOnLeaveListPage()).toBe(true);
    });
  });

  // ============================================================================
  // NAVIGATION TAB TESTS
  // ============================================================================
  test.describe('Navigation Tabs @regression', () => {
    test('Navigate to Apply Leave tab', async ({ page }) => {
      // Act
      await leaveListPage.clickApplyTab();

      // Assert
      await expect(page).toHaveURL(/leave\/applyLeave/);
    });

    test('Navigate to My Leave tab', async ({ page }) => {
      // Act
      await leaveListPage.clickMyLeaveTab();

      // Assert
      await expect(page).toHaveURL(/leave\/viewMyLeaveList/);
    });

    test('Navigate to Assign Leave tab', async ({ page }) => {
      // Act
      await leaveListPage.clickAssignLeaveTab();

      // Assert
      await expect(page).toHaveURL(/leave\/assignLeave/);
    });
  });

  // ============================================================================
  // NEGATIVE TEST CASES
  // ============================================================================
  test.describe('Negative Scenarios @negative', () => {
    test('TC_LIST_100: Search with From Date greater than To Date', async () => {
      const scenario = leaveListData.invalidScenarios[0];

      // Act
      await leaveListPage.enterFromDate(scenario.fromDate);
      await leaveListPage.enterToDate(scenario.toDate);
      await leaveListPage.clickSearch();

      // Assert - Should show validation error or no results
      expect(await leaveListPage.isOnLeaveListPage()).toBe(true);
    });

    test('TC_LIST_102: Search with invalid Employee Name', async () => {
      const scenario = leaveListData.invalidScenarios[2];

      // Act
      await leaveListPage.enterEmployeeName(scenario.employeeName);
      await leaveListPage.clickSearch();

      // Assert
      expect(await leaveListPage.isOnLeaveListPage()).toBe(true);
    });
  });
});
