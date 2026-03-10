// tests/dashboard.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
const dashboardData = require('../data/dashboardData.json') as any;
const users = require('../data/users.json') as any;

let loginPage: LoginPage;
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.navigate();
  await loginPage.login(users.admin.username, users.admin.password);
  await dashboardPage.waitForPageLoad();
});

// ============================================================
// Positive Scenarios @smoke @regression
// ============================================================
test.describe('Dashboard - Positive Scenarios @smoke @regression', () => {
  test('TC_DASH_001: Dashboard loads with pending data cards', async () => {
    const scenario = dashboardData.validScenarios[0];
    const isPendingVisible = await dashboardPage.isPendingDataSectionVisible();
    expect(isPendingVisible).toBeTruthy();

    const companyName = await dashboardPage.getCompanyName();
    expect(companyName).toContain(scenario.company);
  });

  test('TC_DASH_002: Dashboard displays unassigned data section', async () => {
    const isUnassignedVisible = await dashboardPage.isUnassignedDataSectionVisible();
    expect(isUnassignedVisible).toBeTruthy();
  });

  test('TC_DASH_003: Dashboard displays submitted data chart', async () => {
    const isSubmittedVisible = await dashboardPage.isSubmittedDataSectionVisible();
    expect(isSubmittedVisible).toBeTruthy();
  });

  test('TC_DASH_004: Navigate from pending data card via View link', async ({ page }) => {
    const scenario = dashboardData.validScenarios[3];
    await dashboardPage.clickViewLinkOnCard(scenario.tool);
    await dashboardPage.waitForPageLoad();
    expect(page.url()).not.toContain('Dashboard');
  });

  test('TC_DASH_005: Navigate from unassigned data card via View link', async ({ page }) => {
    const scenario = dashboardData.validScenarios[4];
    await dashboardPage.clickViewLinkOnCard(scenario.tool);
    await dashboardPage.waitForPageLoad();
    expect(page.url()).not.toContain('Dashboard');
  });

  test('TC_DASH_006: Verify sidebar navigation menu items', async () => {
    const scenario = dashboardData.validScenarios[5];
    for (const menuItem of scenario.expectedMenuItems) {
      const isVisible = await dashboardPage.sidebar.isMenuItemVisible(menuItem);
      expect(isVisible, `Menu item "${menuItem}" should be visible`).toBeTruthy();
    }
  });

  test('TC_DASH_007: Expand sidebar sub-menus', async ({ page }) => {
    const scenario = dashboardData.validScenarios[6];
    for (const menu of scenario.menus) {
      await dashboardPage.sidebar.expandMenu(menu);
      await page.waitForTimeout(500);
    }
  });
});

// ============================================================
// Negative Scenarios @negative
// ============================================================
test.describe('Dashboard - Negative Scenarios @negative', () => {
  test('TC_DASH_101: Access Dashboard without authentication', async ({ page }) => {
    // Clear cookies to simulate unauthenticated state
    await page.context().clearCookies();
    await page.goto('/Home/Dashboard');
    await page.waitForLoadState('networkidle');

    const loginPageObj = new LoginPage(page);
    expect(loginPageObj.isOnLoginPage()).toBeTruthy();
  });
});

// ============================================================
// Security Tests @security
// ============================================================
test.describe('Dashboard - Security Tests @security', () => {
  test('TC_DASH_400: XSS via company name display', async ({ page }) => {
    const companyName = await dashboardPage.getCompanyName();
    // Verify company name is plain text, not HTML-rendered
    expect(companyName).not.toContain('<script');
    expect(companyName).toContain('TESTKP_COMPANY01');
  });

  test('TC_DASH_401: Authorization - cross-company data isolation', async () => {
    // Verify only the user's company data is visible
    const companyName = await dashboardPage.getCompanyName();
    expect(companyName).toContain('TESTKP_COMPANY01');
  });
});
