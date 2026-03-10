// tests/add-project.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AddProjectPage } from '../pages/AddProjectPage';
const addProjectData = require('../data/addProjectData.json') as any;
const users = require('../data/users.json') as any;

let loginPage: LoginPage;
let addProjectPage: AddProjectPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  addProjectPage = new AddProjectPage(page);
  await loginPage.navigate();
  await loginPage.login(users.admin.username, users.admin.password);
  await addProjectPage.navigate();
});

// ============================================================
// Positive Scenarios @smoke @regression
// ============================================================
test.describe('Add Project - Positive Scenarios @smoke @regression', () => {
  test('TC_PROJ_001: Add project with all required fields', async () => {
    const scenario = addProjectData.validScenarios[0];
    await addProjectPage.enterProjectName(scenario.project);
    await addProjectPage.selectCountry(scenario.country);
    await addProjectPage.selectCurrency(scenario.currency);
    await addProjectPage.selectUnit(scenario.unit);
    await addProjectPage.enterDescription(scenario.description);
    await addProjectPage.clickAdd();
    await addProjectPage.waitForPageLoad();

    const hasSuccess = await addProjectPage.isSuccessToastDisplayed();
    expect(hasSuccess).toBeTruthy();
  });

  test('TC_PROJ_002: Add project with Feet unit', async () => {
    const scenario = addProjectData.validScenarios[1];
    await addProjectPage.enterProjectName(scenario.project);
    await addProjectPage.selectUnit(scenario.unit);
    await addProjectPage.clickAdd();
    await addProjectPage.waitForPageLoad();
  });

  test('TC_PROJ_003: Add project with QA settings', async () => {
    const scenario = addProjectData.validScenarios[2];
    await addProjectPage.enterProjectName(scenario.project);
    await addProjectPage.enterDipTolerance(String(scenario.dipTolerance));
    await addProjectPage.enterAzimuthTolerance(String(scenario.azimuthTolerance));
    await addProjectPage.enterTargetTolerance(String(scenario.targetTolerance));
    await addProjectPage.enterMagneticDip(String(scenario.magneticDip));
    await addProjectPage.enterMagneticField(String(scenario.magneticField));
    await addProjectPage.enterMagneticDipTolerance(String(scenario.magneticDipTolerance));
    await addProjectPage.clickAdd();
    await addProjectPage.waitForPageLoad();
  });

  test('TC_PROJ_004: Add project with Project Group and Region', async () => {
    const scenario = addProjectData.validScenarios[3];
    await addProjectPage.enterProjectName(scenario.project);
    await addProjectPage.selectProjectGroup(scenario.projectGroup);
    await addProjectPage.selectProjectRegion(scenario.projectRegion);
    await addProjectPage.clickAdd();
    await addProjectPage.waitForPageLoad();
  });

  test('TC_PROJ_005: Add project with offsets', async () => {
    const scenario = addProjectData.validScenarios[4];
    await addProjectPage.enterProjectName(scenario.project);
    await addProjectPage.enterMineGridOffset(String(scenario.mineGridOffset));
    await addProjectPage.enterDeclinationOffset(String(scenario.declinationOffset));
    await addProjectPage.clickAdd();
    await addProjectPage.waitForPageLoad();
  });

  test('TC_PROJ_006: Add project with Approve Surveys and Azimuth Mode', async () => {
    const scenario = addProjectData.validScenarios[5];
    await addProjectPage.enterProjectName(scenario.project);
    await addProjectPage.selectApproveSurveys(scenario.approveSurveys);
    await addProjectPage.selectAzimuthMode(scenario.azimuthMode);
    await addProjectPage.selectFieldAppAzimuthMode(scenario.fieldAppAzimuthMode);
    await addProjectPage.clickAdd();
    await addProjectPage.waitForPageLoad();
  });

  test('TC_PROJ_007: Add project with Apply Field App Azimuth Mode checkbox', async () => {
    const scenario = addProjectData.validScenarios[6];
    await addProjectPage.enterProjectName(scenario.project);
    await addProjectPage.enterDeclinationOffset(String(scenario.declinationOffset));
    await addProjectPage.selectFieldAppAzimuthMode(scenario.fieldAppAzimuthMode);
    await addProjectPage.checkApplyFieldAppAzimuthMode();
    await addProjectPage.clickAdd();
    await addProjectPage.waitForPageLoad();
  });

  test('TC_PROJ_008: Cancel Add Project form', async ({ page }) => {
    await addProjectPage.enterProjectName('TestCancel');
    await addProjectPage.clickCancel();
    // Verify form is closed / user returned
  });
});

// ============================================================
// Negative Scenarios @negative @validation
// ============================================================
test.describe('Add Project - Negative Scenarios @negative @validation', () => {
  test('TC_PROJ_100: Add project with empty Project Name', async () => {
    const scenario = addProjectData.negativeScenarios[0];
    await addProjectPage.selectCountry(scenario.country);
    await addProjectPage.clickAdd();

    const hasError = await addProjectPage.isValidationErrorDisplayed();
    expect(hasError).toBeTruthy();
  });

  test('TC_PROJ_101: Add project with duplicate name', async () => {
    const scenario = addProjectData.negativeScenarios[1];
    await addProjectPage.enterProjectName(scenario.project);
    await addProjectPage.clickAdd();
    await addProjectPage.waitForPageLoad();

    const hasError = await addProjectPage.isErrorToastDisplayed() || await addProjectPage.isValidationErrorDisplayed();
    expect(hasError).toBeTruthy();
  });

  test('TC_PROJ_102: Add project with Mine Grid Offset outside range', async () => {
    const scenario = addProjectData.negativeScenarios[2];
    await addProjectPage.enterProjectName('TestOffsetRange');
    await addProjectPage.enterMineGridOffset(String(scenario.mineGridOffset));
    await addProjectPage.clickAdd();

    const hasError = await addProjectPage.isValidationErrorDisplayed();
    expect(hasError).toBeTruthy();
  });

  test('TC_PROJ_103: Add project with Declination Offset outside range', async () => {
    const scenario = addProjectData.negativeScenarios[3];
    await addProjectPage.enterProjectName('TestDeclRange');
    await addProjectPage.enterDeclinationOffset(String(scenario.declinationOffset));
    await addProjectPage.clickAdd();

    const hasError = await addProjectPage.isValidationErrorDisplayed();
    expect(hasError).toBeTruthy();
  });

  test('TC_PROJ_104: Add project with QA Dip Tolerance outside range', async () => {
    const scenario = addProjectData.negativeScenarios[4];
    await addProjectPage.enterProjectName('TestDipRange');
    await addProjectPage.enterDipTolerance(String(scenario.dipTolerance));
    await addProjectPage.clickAdd();

    const hasError = await addProjectPage.isValidationErrorDisplayed();
    expect(hasError).toBeTruthy();
  });

  test('TC_PROJ_200: Add project with only spaces in Project Name', async () => {
    const scenario = addProjectData.negativeScenarios[5];
    await addProjectPage.enterProjectName(scenario.project);
    await addProjectPage.clickAdd();

    const hasError = await addProjectPage.isValidationErrorDisplayed();
    expect(hasError).toBeTruthy();
  });
});

// ============================================================
// Boundary Tests @boundary
// ============================================================
test.describe('Add Project - Boundary Tests @boundary', () => {
  test('TC_PROJ_300: Project Name at exactly 50 characters', async () => {
    const scenario = addProjectData.boundaryTests[0];
    await addProjectPage.enterProjectName(scenario.project);
    await addProjectPage.clickAdd();
    // Should be accepted
  });

  test('TC_PROJ_301: Project Name exceeding 50 characters', async () => {
    const scenario = addProjectData.boundaryTests[1];
    await addProjectPage.enterProjectName(scenario.project);
    // Verify truncation or error
  });

  test('TC_PROJ_303: Mine Grid Offset at boundary -180', async () => {
    const scenario = addProjectData.boundaryTests[3];
    await addProjectPage.enterProjectName('TestBoundary303');
    await addProjectPage.enterMineGridOffset(String(scenario.mineGridOffset));
    await addProjectPage.clickAdd();
    // Should be accepted
  });

  test('TC_PROJ_304: Mine Grid Offset at boundary 180', async () => {
    const scenario = addProjectData.boundaryTests[4];
    await addProjectPage.enterProjectName('TestBoundary304');
    await addProjectPage.enterMineGridOffset(String(scenario.mineGridOffset));
    await addProjectPage.clickAdd();
    // Should be accepted
  });

  test('TC_PROJ_305: Dip Tolerance at boundary 0', async () => {
    const scenario = addProjectData.boundaryTests[5];
    await addProjectPage.enterProjectName('TestBoundary305');
    await addProjectPage.enterDipTolerance(String(scenario.dipTolerance));
    await addProjectPage.clickAdd();
  });

  test('TC_PROJ_306: Dip Tolerance at boundary 10', async () => {
    const scenario = addProjectData.boundaryTests[6];
    await addProjectPage.enterProjectName('TestBoundary306');
    await addProjectPage.enterDipTolerance(String(scenario.dipTolerance));
    await addProjectPage.clickAdd();
  });
});

// ============================================================
// Security Tests @security
// ============================================================
test.describe('Add Project - Security Tests @security', () => {
  test('TC_PROJ_400: SQL injection in Project Name', async () => {
    const scenario = addProjectData.securityTests[0];
    await addProjectPage.enterProjectName(scenario.project);
    await addProjectPage.clickAdd();
    // Verify no SQL execution - should show error or create with literal name
  });

  test('TC_PROJ_401: XSS in Project Description', async ({ page }) => {
    const scenario = addProjectData.securityTests[1];
    await addProjectPage.enterProjectName('TestXSSProject');
    await addProjectPage.enterDescription(scenario.description);
    await addProjectPage.clickAdd();

    // Verify script is not executed
    const dialogTriggered = await page.evaluate(() => {
      return (window as any).__xssTriggered === true;
    });
    expect(dialogTriggered).toBeFalsy();
  });
});
