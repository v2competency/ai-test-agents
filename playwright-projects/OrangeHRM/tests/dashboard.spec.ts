// tests/dashboard.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import dashboardData from '../data/dashboardData.json';
import users from '../data/users.json';

test.describe('Dashboard - OrangeHRM', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // Login before each test
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);
    await dashboardPage.waitForPageLoad();
  });

  // ============================================================================
  // POSITIVE TEST CASES
  // ============================================================================
  test.describe('Positive Scenarios @smoke @regression', () => {
    test('TC_DASH_001: Verify Dashboard loads after login', async ({ page }) => {
      // Assert
      expect(await dashboardPage.isOnDashboard()).toBe(true);
      await expect(page).toHaveURL(/dashboard\/index/);
    });

    test('TC_DASH_002: Verify left navigation menu items', async () => {
      // Act
      const visibleMenuItems = await dashboardPage.getVisibleMenuItems();

      // Assert - Check for key menu items
      const expectedItems = ['leave', 'admin', 'pim', 'dashboard'];
      for (const item of expectedItems) {
        expect(visibleMenuItems).toContain(item);
      }
    });

    test('TC_DASH_003: Verify Time at Work widget', async () => {
      // Assert
      const isVisible = await dashboardPage.isTimeAtWorkWidgetVisible();
      expect(isVisible).toBe(true);
    });

    test('TC_DASH_004: Verify My Actions widget', async () => {
      // Assert
      const isVisible = await dashboardPage.isMyActionsWidgetVisible();
      expect(isVisible).toBe(true);
    });

    test('TC_DASH_005: Verify Quick Launch shortcuts', async () => {
      // Assert
      const isVisible = await dashboardPage.isQuickLaunchWidgetVisible();
      expect(isVisible).toBe(true);
    });

    test('TC_DASH_006: Navigate to Leave module from Quick Launch', async ({ page }) => {
      // Act
      await dashboardPage.clickApplyLeaveShortcut();

      // Assert
      await expect(page).toHaveURL(/leave\/applyLeave/);
    });

    test('TC_DASH_007: Verify user profile dropdown', async () => {
      // Act
      await dashboardPage.clickUserDropdown();

      // Assert - Logout option should be visible
      const logoutLink = dashboardPage.page.locator('a:has-text("Logout")');
      await expect(logoutLink).toBeVisible();
    });

    test('TC_DASH_008: Verify Upgrade button presence', async () => {
      // Assert
      const isVisible = await dashboardPage.isUpgradeButtonVisible();
      expect(isVisible).toBe(true);
    });

    test('TC_DASH_009: Navigate to each main menu item', async ({ page }) => {
      // Test Leave menu
      await dashboardPage.navigateToLeave();
      await expect(page).toHaveURL(/leave/);

      // Navigate back and test Admin
      await dashboardPage.navigate();
      await dashboardPage.navigateToAdmin();
      await expect(page).toHaveURL(/admin/);

      // Navigate back and test PIM
      await dashboardPage.navigate();
      await dashboardPage.navigateToPIM();
      await expect(page).toHaveURL(/pim/);
    });

    test('TC_DASH_010: Collapse and expand sidebar', async () => {
      // Initial state
      const initialState = await dashboardPage.isSidebarCollapsed();

      // Toggle sidebar
      await dashboardPage.toggleSidebar();
      await dashboardPage.wait(500);

      // Check state changed
      const newState = await dashboardPage.isSidebarCollapsed();
      expect(newState).not.toBe(initialState);

      // Toggle back
      await dashboardPage.toggleSidebar();
      await dashboardPage.wait(500);

      // Should be back to initial state
      const finalState = await dashboardPage.isSidebarCollapsed();
      expect(finalState).toBe(initialState);
    });
  });

  // ============================================================================
  // QUICK LAUNCH NAVIGATION TESTS
  // ============================================================================
  test.describe('Quick Launch Navigation @regression', () => {
    test('Navigate to Assign Leave from Quick Launch', async ({ page }) => {
      await dashboardPage.clickAssignLeaveShortcut();
      await expect(page).toHaveURL(/leave\/assignLeave/);
    });

    test('Navigate to Leave List from Quick Launch', async ({ page }) => {
      await dashboardPage.clickLeaveListShortcut();
      await expect(page).toHaveURL(/leave\/viewLeaveList/);
    });

    test('Navigate to My Leave from Quick Launch', async ({ page }) => {
      await dashboardPage.clickMyLeaveShortcut();
      await expect(page).toHaveURL(/leave\/viewMyLeaveList/);
    });
  });

  // ============================================================================
  // USER PROFILE TESTS
  // ============================================================================
  test.describe('User Profile @regression', () => {
    test('Get logged in username', async () => {
      // Act
      const username = await dashboardPage.getLoggedInUsername();

      // Assert
      expect(username).toBeTruthy();
    });

    test('Logout from dashboard', async () => {
      // Act
      await dashboardPage.logout();

      // Assert
      expect(await loginPage.isOnLoginPage()).toBe(true);
    });
  });
});
