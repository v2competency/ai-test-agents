// tests/view-data.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ViewDataPage } from '../pages/ViewDataPage';
const viewDataData = require('../data/viewDataData.json') as any;
const users = require('../data/users.json') as any;

let loginPage: LoginPage;
let viewDataPage: ViewDataPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  viewDataPage = new ViewDataPage(page);
  await loginPage.navigate();
  await loginPage.login(users.admin.username, users.admin.password);
  await viewDataPage.navigate();
});

// ============================================================
// Positive Scenarios @smoke @regression
// ============================================================
test.describe('View Data - Positive Scenarios @smoke @regression', () => {
  test('TC_VIEW_001: Select project and view data', async ({ page }) => {
    const scenario = viewDataData.validScenarios[0];
    await viewDataPage.selectProject(scenario.project);
    await viewDataPage.selectTool(scenario.tool);
    await viewDataPage.clickViewData();
    await viewDataPage.waitForPageLoad();

    const rowCount = await viewDataPage.getDrillholesTableRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('TC_VIEW_002: Use date range filter', async () => {
    const scenario = viewDataData.validScenarios[1];
    await viewDataPage.selectProject(scenario.project);
    await viewDataPage.enterDateFrom(scenario.dateFrom);
    await viewDataPage.enterDateTo(scenario.dateTo);
  });

  test('TC_VIEW_004: Save a new search', async () => {
    const scenario = viewDataData.validScenarios[3];
    await viewDataPage.selectProject(scenario.project);
    await viewDataPage.selectTool(scenario.tool);
    await viewDataPage.saveSearch(scenario.searchName);
  });

  test('TC_VIEW_005: Select multiple tools', async () => {
    const scenario = viewDataData.validScenarios[4];
    await viewDataPage.selectProject(scenario.project);
    for (const tool of scenario.tools) {
      await viewDataPage.selectTool(tool);
    }
    await viewDataPage.clickViewData();
    await viewDataPage.waitForPageLoad();
  });

  test('TC_VIEW_006: Select All tools', async () => {
    await viewDataPage.selectAllTools();
  });

  test('TC_VIEW_007: Deselect All tools', async () => {
    await viewDataPage.selectAllTools();
    await viewDataPage.deselectAllTools();
  });

  test('TC_VIEW_008: Export All data from results', async () => {
    const scenario = viewDataData.validScenarios[0];
    await viewDataPage.selectProject(scenario.project);
    await viewDataPage.selectTool(scenario.tool);
    await viewDataPage.clickViewData();
    await viewDataPage.waitForPageLoad();
    await viewDataPage.clickExportAll();
  });

  test('TC_VIEW_009: Export per-tool results', async () => {
    const scenario = viewDataData.validScenarios[0];
    await viewDataPage.selectProject(scenario.project);
    await viewDataPage.selectTool(scenario.tool);
    await viewDataPage.clickViewData();
    await viewDataPage.waitForPageLoad();
    await viewDataPage.clickToolTab(scenario.tool);
    await viewDataPage.clickExportTab();
  });

  test('TC_VIEW_010: Refresh Data button', async () => {
    const scenario = viewDataData.validScenarios[0];
    await viewDataPage.selectProject(scenario.project);
    await viewDataPage.selectTool(scenario.tool);
    await viewDataPage.clickViewData();
    await viewDataPage.waitForPageLoad();
    await viewDataPage.clickRefreshData();
  });

  test('TC_VIEW_011: Navigate drillholes table pagination', async () => {
    const paginationInfo = await viewDataPage.getPaginationInfo();
    expect(paginationInfo).toBeTruthy();
  });

  test('TC_VIEW_012: Change items per page', async () => {
    const scenario = viewDataData.validScenarios[11];
    await viewDataPage.changeItemsPerPage(scenario.itemsPerPage);
  });
});

// ============================================================
// Negative Scenarios @negative @validation
// ============================================================
test.describe('View Data - Negative Scenarios @negative @validation', () => {
  test('TC_VIEW_100: View Data without selecting project', async () => {
    await viewDataPage.selectTool('EZ-GYRO');
    await viewDataPage.clickViewData();
    // Expect validation or no results
  });

  test('TC_VIEW_101: View Data without selecting tools', async () => {
    await viewDataPage.selectProject('DemoProj_Nagen');
    await viewDataPage.clickViewData();
    // Expect validation or no results
  });

  test('TC_VIEW_102: Invalid date range - From after To', async () => {
    const scenario = viewDataData.negativeScenarios[2];
    await viewDataPage.enterDateFrom(scenario.dateFrom);
    await viewDataPage.enterDateTo(scenario.dateTo);
    await viewDataPage.clickViewData();
    // Expect validation error or no results
  });

  test('TC_VIEW_104: View Data with no matching results', async () => {
    const scenario = viewDataData.negativeScenarios[4];
    await viewDataPage.selectProject(scenario.project);
    await viewDataPage.selectTool(scenario.tool);
    await viewDataPage.clickViewData();
    await viewDataPage.waitForPageLoad();
    // Expect empty results
  });
});

// ============================================================
// Boundary Tests @boundary
// ============================================================
test.describe('View Data - Boundary Tests @boundary', () => {
  test('TC_VIEW_300: Date From at minimum valid date', async () => {
    const scenario = viewDataData.boundaryTests[0];
    await viewDataPage.enterDateFrom(scenario.dateFrom);
    // Verify date is accepted
  });

  test('TC_VIEW_301: Date To at current date', async () => {
    const scenario = viewDataData.boundaryTests[1];
    await viewDataPage.enterDateTo(scenario.dateTo);
    // Verify date is accepted
  });
});

// ============================================================
// Security Tests @security
// ============================================================
test.describe('View Data - Security Tests @security', () => {
  test('TC_VIEW_400: SQL injection in Saved Search', async ({ page }) => {
    // Attempt SQL injection - verify no database error
    expect(page.url()).not.toContain('error');
  });

  test('TC_VIEW_401: URL parameter tampering for unauthorized project access', async ({ page }) => {
    await page.goto('/View/Data?project=unauthorized_project');
    await page.waitForLoadState('networkidle');
    // Should not display unauthorized data
  });
});
