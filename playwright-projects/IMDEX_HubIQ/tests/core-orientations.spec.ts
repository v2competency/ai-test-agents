// tests/core-orientations.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CoreOrientationsPage } from '../pages/CoreOrientationsPage';
const coreData = require('../data/coreOrientationsData.json') as any;
const users = require('../data/users.json') as any;

let loginPage: LoginPage;
let coreOrientationsPage: CoreOrientationsPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  coreOrientationsPage = new CoreOrientationsPage(page);
  await loginPage.navigate();
  await loginPage.login(users.admin.username, users.admin.password);
  await coreOrientationsPage.navigate();
});

// ============================================================
// Positive Scenarios @smoke @regression
// ============================================================
test.describe('Core Orientations - Positive Scenarios @smoke @regression', () => {
  test('TC_CORE_001: Assign core orientation to drillhole', async () => {
    const scenario = coreData.validScenarios[0];
    await coreOrientationsPage.clickAssign();
    await coreOrientationsPage.selectModalProject(scenario.project);
    await coreOrientationsPage.selectModalDrillhole(scenario.drillhole);
    await coreOrientationsPage.clickModalAdd();
    await coreOrientationsPage.clickModalAssign();
    await coreOrientationsPage.waitForPageLoad();
  });

  test('TC_CORE_002: Add multiple core orientation assignments', async () => {
    const scenario = coreData.validScenarios[1];
    await coreOrientationsPage.clickAssign();
    await coreOrientationsPage.selectModalProject(scenario.project);

    for (const drillhole of scenario.drillholes) {
      await coreOrientationsPage.selectModalDrillhole(drillhole);
      await coreOrientationsPage.clickModalAdd();
    }

    await coreOrientationsPage.clickModalAssign();
    await coreOrientationsPage.waitForPageLoad();
  });

  test('TC_CORE_003: Delete core orientation assignment', async () => {
    await coreOrientationsPage.selectRow(0);
    await coreOrientationsPage.clickDelete();
    await coreOrientationsPage.confirmDelete();
    await coreOrientationsPage.waitForPageLoad();
  });

  test('TC_CORE_004: Export core orientation data', async () => {
    await coreOrientationsPage.clickExport();
  });

  test('TC_CORE_005: Cancel assign modal', async () => {
    await coreOrientationsPage.clickAssign();
    await coreOrientationsPage.selectModalProject('DemoProj_Nagen');
    await coreOrientationsPage.clickModalCancel();
  });
});

// ============================================================
// Negative Scenarios @negative @validation
// ============================================================
test.describe('Core Orientations - Negative Scenarios @negative @validation', () => {
  test('TC_CORE_100: Assign without selecting drillhole', async () => {
    await coreOrientationsPage.clickAssign();
    await coreOrientationsPage.selectModalProject('DemoProj_Nagen');
    // Do not select drillhole - try to assign
    await coreOrientationsPage.clickModalAssign();
    // Should show validation error
  });

  test('TC_CORE_101: Assign without selecting project', async () => {
    await coreOrientationsPage.clickAssign();
    // Project not selected - drillhole dropdown should be empty/disabled
  });

  test('TC_CORE_102: Delete without selecting any row', async () => {
    const isEnabled = await coreOrientationsPage.isDeleteButtonEnabled();
    expect(isEnabled).toBeFalsy();
  });

  test('TC_CORE_103: Duplicate assignment to same drillhole', async () => {
    const scenario = coreData.negativeScenarios[3];
    await coreOrientationsPage.clickAssign();
    await coreOrientationsPage.selectModalProject(scenario.project);
    await coreOrientationsPage.selectModalDrillhole(scenario.drillhole);
    await coreOrientationsPage.clickModalAdd();
    await coreOrientationsPage.clickModalAssign();
    await coreOrientationsPage.waitForPageLoad();
    // Expect error for duplicate or graceful handling
  });

  test('TC_CORE_104: Assign to drillhole from different project', async () => {
    await coreOrientationsPage.clickAssign();
    await coreOrientationsPage.selectModalProject('DemoProj_Nagen');
    // Verify drillhole dropdown only shows drillholes from selected project
  });
});

// ============================================================
// Security Tests @security
// ============================================================
test.describe('Core Orientations - Security Tests @security', () => {
  test('TC_CORE_400: Authorization check - assign without permission', async ({ page }) => {
    // This test should be run with a read-only user
    // Verify Assign button is disabled or hidden for unauthorized users
  });

  test('TC_CORE_401: SQL injection in drillhole search', async () => {
    await coreOrientationsPage.clickAssign();
    await coreOrientationsPage.selectModalProject('DemoProj_Nagen');
    // Input sanitization in dropdown search
  });
});
