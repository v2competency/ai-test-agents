// tests/e2e/e2e-flows.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { ViewDataPage } from '../../pages/ViewDataPage';
import { AddProjectPage } from '../../pages/AddProjectPage';
import { AddDrillholePage } from '../../pages/AddDrillholePage';
import { CoreOrientationsPage } from '../../pages/CoreOrientationsPage';
import { ApproveSurveysPage } from '../../pages/ApproveSurveysPage';
const e2eData = require('../../data/e2eData.json') as any;
const users = require('../../data/users.json') as any;

// ============================================================
// E2E Flows @e2e @regression
// ============================================================
test.describe('E2E Flows @e2e @regression', () => {
  test('E2E_001: Complete View Data flow - Login to Logout', async ({ page }) => {
    const flow = e2eData.flows[0];

    // Step 1-2: Navigate and login
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);

    // Step 3: Verify Dashboard loads
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForPageLoad();
    const isPendingVisible = await dashboardPage.isPendingDataSectionVisible();
    expect(isPendingVisible).toBeTruthy();

    // Step 4-5: Navigate to View > Data
    const viewDataPage = new ViewDataPage(page);
    await viewDataPage.navigate();

    // Step 6: Select project
    await viewDataPage.selectProject(flow.project);

    // Step 7: Select tool
    await viewDataPage.selectTool(flow.tool);

    // Step 8: Click View Data
    await viewDataPage.clickViewData();
    await viewDataPage.waitForPageLoad();

    // Step 9: Verify drillholes table
    const rowCount = await viewDataPage.getDrillholesTableRowCount();
    expect(rowCount).toBeGreaterThan(0);

    // Step 10-11: Logout
    await dashboardPage.logout();

    // Step 12: Verify redirected to login
    expect(loginPage.isOnLoginPage()).toBeTruthy();
  });

  test('E2E_002: Complete Add Project and Add Drillhole flow', async ({ page }) => {
    const flow = e2eData.flows[1];

    // Login
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);

    // Navigate to Add Project
    const addProjectPage = new AddProjectPage(page);
    await addProjectPage.navigate();

    // Create project
    await addProjectPage.enterProjectName(flow.project);
    await addProjectPage.clickAdd();
    await addProjectPage.waitForPageLoad();

    // Navigate to Add Drillhole
    const addDrillholePage = new AddDrillholePage(page);
    await addDrillholePage.navigate();

    // Select project and create drillhole
    await addDrillholePage.selectProject(flow.project);
    await addDrillholePage.enterDrillholeName(flow.drillhole);
    await addDrillholePage.enterDip(String(flow.dip));
    await addDrillholePage.enterTrueNorthAzimuth(String(flow.azimuth));
    await addDrillholePage.enterPlannedDepth(String(flow.depth));
    await addDrillholePage.clickAdd();
    await addDrillholePage.waitForPageLoad();

    // Navigate to View > Data and verify
    const viewDataPage = new ViewDataPage(page);
    await viewDataPage.navigate();
    await viewDataPage.selectProject(flow.project);
  });

  test('E2E_003: Assign Core Orientation and Approve Survey flow', async ({ page }) => {
    const flow = e2eData.flows[2];

    // Login
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);

    // Navigate to Assign > Core Orientations
    const coreOrientationsPage = new CoreOrientationsPage(page);
    await coreOrientationsPage.navigate();

    // Assign core orientation
    await coreOrientationsPage.clickAssign();
    await coreOrientationsPage.selectModalProject(flow.project);
    await coreOrientationsPage.selectModalDrillhole(flow.drillhole);
    await coreOrientationsPage.clickModalAdd();
    await coreOrientationsPage.clickModalAssign();
    await coreOrientationsPage.waitForPageLoad();

    // Navigate to Approve > Surveys
    const approveSurveysPage = new ApproveSurveysPage(page);
    await approveSurveysPage.navigate();

    // Search for project
    await approveSurveysPage.enterSearch('DemoProj');
    await approveSurveysPage.clickSearch();
    await approveSurveysPage.waitForPageLoad();

    // Click on EZ-GYRO count for drillhole
    await approveSurveysPage.clickToolCount(flow.drillhole, 'EZ-GYRO');
    await approveSurveysPage.waitForPageLoad();

    // Set configurations
    await approveSurveysPage.selectAzimuthMode('True North');

    // Accept QA, Approve, Save
    await approveSurveysPage.clickAcceptQA();
    await approveSurveysPage.clickApprove();
    await approveSurveysPage.clickSave();
    await approveSurveysPage.waitForPageLoad();
  });

  test('E2E_004: Dashboard navigation to all major modules', async ({ page }) => {
    // Login
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForPageLoad();

    // Navigate to Assign > Core Orientations
    await dashboardPage.sidebar.navigateToSubMenu('Assign', 'assignCoreOrientations');
    await page.waitForLoadState('networkidle');

    // Navigate to Approve > Surveys
    await dashboardPage.sidebar.navigateToSubMenu('Approve', 'approveSurveys');
    await page.waitForLoadState('networkidle');

    // Navigate to View > Data
    await dashboardPage.sidebar.navigateToSubMenu('View', 'viewData');
    await page.waitForLoadState('networkidle');

    // Return to Dashboard
    await dashboardPage.sidebar.navigateTo('Dashboard');
    await dashboardPage.waitForPageLoad();
  });
});
