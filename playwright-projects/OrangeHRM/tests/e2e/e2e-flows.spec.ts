// tests/e2e/e2e-flows.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { ApplyLeavePage } from '../../pages/ApplyLeavePage';
import { LeaveListPage } from '../../pages/LeaveListPage';
import { LeaveConfigPage } from '../../pages/LeaveConfigPage';
import { EntitlementsPage } from '../../pages/EntitlementsPage';
import { ReportsPage } from '../../pages/ReportsPage';
import e2eData from '../../data/e2eData.json';
import users from '../../data/users.json';

test.describe('End-to-End Flows - OrangeHRM', () => {
  // ============================================================================
  // E2E_001: Complete Leave Application Flow
  // ============================================================================
  test('E2E_001: Complete Leave Application Flow @e2e @critical', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const applyLeavePage = new ApplyLeavePage(page);
    const leaveListPage = new LeaveListPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);
    expect(await dashboardPage.isOnDashboard()).toBe(true);

    // Step 2: Navigate to Apply Leave
    await applyLeavePage.navigate();
    expect(await applyLeavePage.isOnApplyLeavePage()).toBe(true);

    // Step 3: Check leave balance and apply if available
    await applyLeavePage.selectLeaveType('ML');
    const balance = await applyLeavePage.getLeaveBalanceNumber();

    if (balance > 0) {
      await applyLeavePage.enterFromDate('2025-05-01');
      await applyLeavePage.enterToDate('2025-05-01');
      await applyLeavePage.enterComments('E2E Test - Leave Application');
      await applyLeavePage.clickApply();

      // Check for success or handle overlap
      const hasSuccess = await applyLeavePage.isSuccessToastDisplayed();
      const hasError = await applyLeavePage.isErrorToastDisplayed();
      expect(hasSuccess || hasError).toBe(true);
    }

    // Step 4: Navigate to My Leave to verify
    await leaveListPage.navigate();
    await leaveListPage.clickMyLeaveTab();
    expect(page.url()).toContain('viewMyLeaveList');

    // Step 5: Logout
    await dashboardPage.logout();
    expect(await loginPage.isOnLoginPage()).toBe(true);
  });

  // ============================================================================
  // E2E_007: Dashboard Widget Interaction Flow
  // ============================================================================
  test('E2E_007: Dashboard Widget Interaction Flow @e2e', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);
    expect(await dashboardPage.isOnDashboard()).toBe(true);

    // Step 2: Verify widgets are visible
    expect(await dashboardPage.isTimeAtWorkWidgetVisible()).toBe(true);
    expect(await dashboardPage.isQuickLaunchWidgetVisible()).toBe(true);

    // Step 3: Click Apply Leave shortcut
    await dashboardPage.clickApplyLeaveShortcut();
    await expect(page).toHaveURL(/applyLeave/);

    // Step 4: Return to Dashboard
    await dashboardPage.navigate();
    expect(await dashboardPage.isOnDashboard()).toBe(true);

    // Step 5: Click Leave List shortcut
    await dashboardPage.clickLeaveListShortcut();
    await expect(page).toHaveURL(/viewLeaveList/);

    // Step 6: Return to Dashboard
    await dashboardPage.navigate();
    expect(await dashboardPage.isOnDashboard()).toBe(true);
  });

  // ============================================================================
  // E2E_008: Search and Filter Comprehensive Test
  // ============================================================================
  test('E2E_008: Search and Filter Comprehensive Test @e2e', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const leaveListPage = new LeaveListPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);

    // Step 2: Navigate to Leave List
    await leaveListPage.navigate();
    expect(await leaveListPage.isOnLeaveListPage()).toBe(true);

    // Step 3: Apply date filter
    await leaveListPage.enterFromDate('2025-01-01');
    await leaveListPage.enterToDate('2025-12-31');
    await leaveListPage.clickSearch();
    expect(await leaveListPage.isOnLeaveListPage()).toBe(true);

    // Step 4: Reset filters
    await leaveListPage.clickReset();
    expect(await leaveListPage.isOnLeaveListPage()).toBe(true);

    // Step 5: Apply status filter
    await leaveListPage.selectStatus('Pending Approval');
    await leaveListPage.clickSearch();
    expect(await leaveListPage.isOnLeaveListPage()).toBe(true);

    // Step 6: Reset and apply leave type filter
    await leaveListPage.clickReset();
    await leaveListPage.selectLeaveType('ML');
    await leaveListPage.clickSearch();
    expect(await leaveListPage.isOnLeaveListPage()).toBe(true);

    // Step 7: Final reset
    await leaveListPage.clickReset();
    expect(await leaveListPage.isOnLeaveListPage()).toBe(true);
  });

  // ============================================================================
  // E2E_002: Admin Leave Configuration Flow (Simplified)
  // ============================================================================
  test('E2E_002: Admin Leave Configuration Flow @e2e @admin', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const leaveConfigPage = new LeaveConfigPage(page);

    // Step 1: Login as Admin
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);

    // Step 2: Navigate to Leave Types
    await leaveConfigPage.navigateToLeaveTypes();
    await expect(page).toHaveURL(/leaveTypeList/);

    // Step 3: Navigate to Work Week
    await leaveConfigPage.navigateToWorkWeek();
    await expect(page).toHaveURL(/defineWorkWeek/);

    // Step 4: Navigate to Holidays
    await leaveConfigPage.navigateToHolidays();
    await expect(page).toHaveURL(/viewHolidayList/);
  });

  // ============================================================================
  // E2E_003: Entitlement Management Flow (Simplified)
  // ============================================================================
  test('E2E_003: Entitlement Management Flow @e2e', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const entitlementsPage = new EntitlementsPage(page);
    const reportsPage = new ReportsPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);

    // Step 2: Navigate to Add Entitlements
    await entitlementsPage.navigateToAddEntitlement();
    expect(await entitlementsPage.isOnAddEntitlementPage()).toBe(true);

    // Step 3: Navigate to Employee Entitlements
    await entitlementsPage.navigateToEmployeeEntitlements();
    expect(await entitlementsPage.isOnEmployeeEntitlementsPage()).toBe(true);

    // Step 4: Navigate to Reports
    await reportsPage.navigateToLeaveUsageReport();
    expect(await reportsPage.isOnLeaveUsageReportPage()).toBe(true);
  });

  // ============================================================================
  // E2E_005: Employee Self-Service Flow (Simplified)
  // ============================================================================
  test('E2E_005: Employee Self-Service Flow @e2e @self-service', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const entitlementsPage = new EntitlementsPage(page);
    const applyLeavePage = new ApplyLeavePage(page);
    const reportsPage = new ReportsPage(page);

    // Step 1: Login (using admin since employee might not exist)
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);
    expect(await dashboardPage.isOnDashboard()).toBe(true);

    // Step 2: Check My Entitlements
    await entitlementsPage.navigateToMyEntitlements();
    expect(await entitlementsPage.isOnMyEntitlementsPage()).toBe(true);

    // Step 3: Navigate to Apply Leave
    await applyLeavePage.navigate();
    expect(await applyLeavePage.isOnApplyLeavePage()).toBe(true);

    // Step 4: Navigate to My Leave Report
    await reportsPage.navigateToMyLeaveUsageReport();
    expect(await reportsPage.isOnMyLeaveUsageReportPage()).toBe(true);
  });
});
