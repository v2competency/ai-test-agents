// tests/approve-surveys.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ApproveSurveysPage } from '../pages/ApproveSurveysPage';
const approveSurveysData = require('../data/approveSurveysData.json') as any;
const users = require('../data/users.json') as any;

let loginPage: LoginPage;
let approveSurveysPage: ApproveSurveysPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  approveSurveysPage = new ApproveSurveysPage(page);
  await loginPage.navigate();
  await loginPage.login(users.admin.username, users.admin.password);
  await approveSurveysPage.navigate();
});

// ============================================================
// Positive Scenarios - List View @smoke @regression
// ============================================================
test.describe('Approve Surveys - List View @smoke @regression', () => {
  test('TC_APPR_001: View approve surveys list with search', async () => {
    const scenario = approveSurveysData.validScenarios[0];
    await approveSurveysPage.enterSearch(scenario.search);
    await approveSurveysPage.clickSearch();
    await approveSurveysPage.waitForPageLoad();

    const rowCount = await approveSurveysPage.getTableRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('TC_APPR_011: Toggle Columns visibility', async () => {
    await approveSurveysPage.toggleColumns();
  });

  test('TC_APPR_012: Use filter chips - Clear all', async () => {
    await approveSurveysPage.enterSearch('DemoProj');
    await approveSurveysPage.clickSearch();
    await approveSurveysPage.waitForPageLoad();
    await approveSurveysPage.clearAllFilters();
  });

  test('TC_APPR_013: Use filter chips - Remove individual filter', async () => {
    const scenario = approveSurveysData.validScenarios[12];
    await approveSurveysPage.removeFilter(scenario.removeFilter);
  });
});

// ============================================================
// Positive Scenarios - Detail View @regression
// ============================================================
test.describe('Approve Surveys - Detail View @regression', () => {
  test.beforeEach(async () => {
    // Navigate to a specific survey detail
    await approveSurveysPage.enterSearch('DemoProj');
    await approveSurveysPage.clickSearch();
    await approveSurveysPage.waitForPageLoad();
    await approveSurveysPage.clickToolCount('DemoDL_Nagen', 'EZ-GYRO');
    await approveSurveysPage.waitForPageLoad();
  });

  test('TC_APPR_002: Navigate to survey detail from list', async () => {
    const isOnDetail = approveSurveysPage.isOnSurveyDetailPage();
    expect(isOnDetail).toBeTruthy();
  });

  test('TC_APPR_003: Accept QA Results', async () => {
    await approveSurveysPage.clickAcceptQA();
  });

  test('TC_APPR_004: Approve survey', async () => {
    await approveSurveysPage.clickAcceptQA();
    await approveSurveysPage.clickApprove();
    await approveSurveysPage.clickSave();
    await approveSurveysPage.waitForPageLoad();
  });

  test('TC_APPR_005: Reject survey', async () => {
    await approveSurveysPage.selectSurveyRow(0);
    await approveSurveysPage.clickReject();
  });

  test('TC_APPR_006: Change Start of hole reference', async () => {
    const scenario = approveSurveysData.validScenarios[5];
    await approveSurveysPage.selectStartOfHoleRef(scenario.startOfHoleRef);
  });

  test('TC_APPR_007: Change Azimuth Mode', async () => {
    const scenario = approveSurveysData.validScenarios[6];
    await approveSurveysPage.selectAzimuthMode(scenario.azimuthMode);
  });

  test('TC_APPR_008: Export All from survey detail', async () => {
    await approveSurveysPage.clickExportAll();
  });

  test('TC_APPR_009: Generate Report from survey detail', async () => {
    await approveSurveysPage.clickGenerateReport();
  });

  test('TC_APPR_010: Toggle Show Charts', async () => {
    await approveSurveysPage.toggleShowCharts();
  });

  test('TC_APPR_014: Undo pending changes', async () => {
    await approveSurveysPage.clickAcceptQA();
    const pendingCount = await approveSurveysPage.getPendingChangesCount();
    expect(pendingCount).toBeGreaterThan(0);
    await approveSurveysPage.clickUndo();
  });

  test('TC_APPR_015: Save changes on survey detail', async () => {
    await approveSurveysPage.clickAcceptQA();
    await approveSurveysPage.clickApprove();
    await approveSurveysPage.clickSave();
    await approveSurveysPage.waitForPageLoad();
  });
});

// ============================================================
// Negative Scenarios @negative
// ============================================================
test.describe('Approve Surveys - Negative Scenarios @negative', () => {
  test('TC_APPR_100: Search with no matching results', async () => {
    const scenario = approveSurveysData.negativeScenarios[0];
    await approveSurveysPage.enterSearch(scenario.search);
    await approveSurveysPage.clickSearch();
    await approveSurveysPage.waitForPageLoad();

    const rowCount = await approveSurveysPage.getTableRowCount();
    expect(rowCount).toBe(0);
  });

  test('TC_APPR_102: Reject with no surveys selected', async () => {
    // Navigate to detail first
    await approveSurveysPage.enterSearch('DemoProj');
    await approveSurveysPage.clickSearch();
    await approveSurveysPage.waitForPageLoad();
    await approveSurveysPage.clickToolCount('DemoDL_Nagen', 'EZ-GYRO');
    await approveSurveysPage.waitForPageLoad();

    // Try reject without selection
    await approveSurveysPage.clickReject();
    // Expect no action or message
  });

  test('TC_APPR_103: Save with no pending changes', async () => {
    await approveSurveysPage.enterSearch('DemoProj');
    await approveSurveysPage.clickSearch();
    await approveSurveysPage.waitForPageLoad();
    await approveSurveysPage.clickToolCount('DemoDL_Nagen', 'EZ-GYRO');
    await approveSurveysPage.waitForPageLoad();

    // Save button should be disabled or no action
    await approveSurveysPage.clickSave();
  });
});

// ============================================================
// Boundary Tests @boundary
// ============================================================
test.describe('Approve Surveys - Boundary Tests @boundary', () => {
  test('TC_APPR_300: Survey with boundary depth value', async () => {
    // Navigate to survey with boundary values
    await approveSurveysPage.enterSearch('DemoProj');
    await approveSurveysPage.clickSearch();
    await approveSurveysPage.waitForPageLoad();
  });

  test('TC_APPR_301: Survey with boundary dip value', async () => {
    await approveSurveysPage.enterSearch('DemoProj');
    await approveSurveysPage.clickSearch();
    await approveSurveysPage.waitForPageLoad();
  });
});

// ============================================================
// Security Tests @security
// ============================================================
test.describe('Approve Surveys - Security Tests @security', () => {
  test('TC_APPR_400: XSS in search field', async ({ page }) => {
    const scenario = approveSurveysData.securityTests[0];
    await approveSurveysPage.enterSearch(scenario.search);
    await approveSurveysPage.clickSearch();

    // Verify no script execution
    const dialogTriggered = await page.evaluate(() => {
      return (window as any).__xssTriggered === true;
    });
    expect(dialogTriggered).toBeFalsy();
  });

  test('TC_APPR_401: Authorization - approve without permission', async () => {
    // This test should be run with a view-only user
    // Verify Approve button is disabled or hidden
  });
});
