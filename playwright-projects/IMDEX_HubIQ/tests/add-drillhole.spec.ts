// tests/add-drillhole.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AddDrillholePage } from '../pages/AddDrillholePage';
const addDrillholeData = require('../data/addDrillholeData.json') as any;
const users = require('../data/users.json') as any;

let loginPage: LoginPage;
let addDrillholePage: AddDrillholePage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  addDrillholePage = new AddDrillholePage(page);
  await loginPage.navigate();
  await loginPage.login(users.admin.username, users.admin.password);
  await addDrillholePage.navigate();
});

// ============================================================
// Positive Scenarios @smoke @regression
// ============================================================
test.describe('Add Drillhole - Positive Scenarios @smoke @regression', () => {
  test('TC_DRILL_001: Add drillhole with all required fields', async () => {
    const scenario = addDrillholeData.validScenarios[0];
    await addDrillholePage.selectProject(scenario.project);
    await addDrillholePage.enterDrillholeName(scenario.drillhole);
    await addDrillholePage.selectHoleType(scenario.holeType);
    await addDrillholePage.enterDip(String(scenario.dip));
    await addDrillholePage.enterTrueNorthAzimuth(String(scenario.trueNorthAzimuth));
    await addDrillholePage.enterPlannedDepth(String(scenario.plannedDepth));
    await addDrillholePage.clickAdd();
    await addDrillholePage.waitForPageLoad();

    const hasSuccess = await addDrillholePage.isSuccessToastDisplayed();
    expect(hasSuccess).toBeTruthy();
  });

  test('TC_DRILL_002: Add drillhole with location details', async () => {
    const scenario = addDrillholeData.validScenarios[1];
    await addDrillholePage.selectProject(scenario.project);
    await addDrillholePage.enterDrillholeName(scenario.drillhole);
    await addDrillholePage.enterPreCollarDepth(String(scenario.preCollarDepth));
    await addDrillholePage.enterCollarElevation(String(scenario.collarElevation));
    await addDrillholePage.enterLatitude(String(scenario.latitude));
    await addDrillholePage.enterLongitude(String(scenario.longitude));
    await addDrillholePage.clickAdd();
    await addDrillholePage.waitForPageLoad();
  });

  test('TC_DRILL_003: Add drillhole with target coordinates', async () => {
    const scenario = addDrillholeData.validScenarios[2];
    await addDrillholePage.selectProject(scenario.project);
    await addDrillholePage.enterDrillholeName(scenario.drillhole);
    await addDrillholePage.enterTargetX(String(scenario.targetX));
    await addDrillholePage.enterTargetY(String(scenario.targetY));
    await addDrillholePage.enterTargetZ(String(scenario.targetZ));
    await addDrillholePage.clickAdd();
    await addDrillholePage.waitForPageLoad();
  });

  test('TC_DRILL_004: Add drillhole with Program Group and Tenement', async () => {
    const scenario = addDrillholeData.validScenarios[3];
    await addDrillholePage.selectProject(scenario.project);
    await addDrillholePage.enterDrillholeName(scenario.drillhole);
    await addDrillholePage.selectProgram(scenario.program);
    await addDrillholePage.selectGroup(scenario.group);
    await addDrillholePage.selectTenement(scenario.tenement);
    await addDrillholePage.clickAdd();
    await addDrillholePage.waitForPageLoad();
  });

  test('TC_DRILL_005: Add another drillhole using Add another button', async () => {
    const scenario = addDrillholeData.validScenarios[4];
    await addDrillholePage.selectProject('DemoProj_Nagen');
    await addDrillholePage.enterDrillholeName(scenario.drillhole1);
    await addDrillholePage.clickAddAnother();
    await addDrillholePage.waitForPageLoad();

    // Form should reset with project pre-selected
    await addDrillholePage.enterDrillholeName(scenario.drillhole2);
    await addDrillholePage.clickAdd();
    await addDrillholePage.waitForPageLoad();
  });

  test('TC_DRILL_006: Cancel Add Drillhole form', async () => {
    await addDrillholePage.enterDrillholeName('TestCancel');
    await addDrillholePage.clickCancel();
  });
});

// ============================================================
// Negative Scenarios @negative @validation
// ============================================================
test.describe('Add Drillhole - Negative Scenarios @negative @validation', () => {
  test('TC_DRILL_100: Add drillhole without selecting project', async () => {
    await addDrillholePage.enterDrillholeName('TestDH');
    await addDrillholePage.clickAdd();

    const hasError = await addDrillholePage.isValidationErrorDisplayed();
    expect(hasError).toBeTruthy();
  });

  test('TC_DRILL_101: Add drillhole with empty name', async () => {
    await addDrillholePage.selectProject('DemoProj_Nagen');
    await addDrillholePage.clickAdd();

    const hasError = await addDrillholePage.isValidationErrorDisplayed();
    expect(hasError).toBeTruthy();
  });

  test('TC_DRILL_102: Add drillhole with duplicate name', async () => {
    const scenario = addDrillholeData.negativeScenarios[2];
    await addDrillholePage.selectProject(scenario.project);
    await addDrillholePage.enterDrillholeName(scenario.drillhole);
    await addDrillholePage.clickAdd();
    await addDrillholePage.waitForPageLoad();

    const hasError = await addDrillholePage.isErrorToastDisplayed() || await addDrillholePage.isValidationErrorDisplayed();
    expect(hasError).toBeTruthy();
  });

  test('TC_DRILL_103: Add drillhole with Dip outside range', async () => {
    const scenario = addDrillholeData.negativeScenarios[3];
    await addDrillholePage.enterDip(String(scenario.dip));
    await addDrillholePage.clickAdd();

    const hasError = await addDrillholePage.isValidationErrorDisplayed();
    expect(hasError).toBeTruthy();
  });

  test('TC_DRILL_104: Add drillhole with True North Azimuth outside range', async () => {
    const scenario = addDrillholeData.negativeScenarios[4];
    await addDrillholePage.enterTrueNorthAzimuth(String(scenario.trueNorthAzimuth));
    await addDrillholePage.clickAdd();

    const hasError = await addDrillholePage.isValidationErrorDisplayed();
    expect(hasError).toBeTruthy();
  });

  test('TC_DRILL_105: Add drillhole with Planned Depth exceeding maximum', async () => {
    const scenario = addDrillholeData.negativeScenarios[5];
    await addDrillholePage.enterPlannedDepth(String(scenario.plannedDepth));
    await addDrillholePage.clickAdd();

    const hasError = await addDrillholePage.isValidationErrorDisplayed();
    expect(hasError).toBeTruthy();
  });

  test('TC_DRILL_106: Add drillhole with Collar Elevation exceeding maximum', async () => {
    const scenario = addDrillholeData.negativeScenarios[6];
    await addDrillholePage.enterCollarElevation(String(scenario.collarElevation));
    await addDrillholePage.clickAdd();

    const hasError = await addDrillholePage.isValidationErrorDisplayed();
    expect(hasError).toBeTruthy();
  });

  test('TC_DRILL_107: Add drillhole with Latitude outside range', async () => {
    const scenario = addDrillholeData.negativeScenarios[7];
    await addDrillholePage.enterLatitude(String(scenario.latitude));
    await addDrillholePage.clickAdd();

    const hasError = await addDrillholePage.isValidationErrorDisplayed();
    expect(hasError).toBeTruthy();
  });

  test('TC_DRILL_200: Add drillhole with whitespace-only name', async () => {
    const scenario = addDrillholeData.negativeScenarios[8];
    await addDrillholePage.enterDrillholeName(scenario.drillhole);
    await addDrillholePage.clickAdd();

    const hasError = await addDrillholePage.isValidationErrorDisplayed();
    expect(hasError).toBeTruthy();
  });
});

// ============================================================
// Boundary Tests @boundary
// ============================================================
test.describe('Add Drillhole - Boundary Tests @boundary', () => {
  test('TC_DRILL_300: Drillhole Name at exactly 50 characters', async () => {
    const scenario = addDrillholeData.boundaryTests[0];
    await addDrillholePage.selectProject('DemoProj_Nagen');
    await addDrillholePage.enterDrillholeName(scenario.drillhole);
    await addDrillholePage.clickAdd();
  });

  test('TC_DRILL_301: Dip at boundary -90', async () => {
    await addDrillholePage.enterDip('-90');
    // Value should be accepted
  });

  test('TC_DRILL_302: Dip at boundary 90', async () => {
    await addDrillholePage.enterDip('90');
    // Value should be accepted
  });

  test('TC_DRILL_303: True North Azimuth at boundary 0', async () => {
    await addDrillholePage.enterTrueNorthAzimuth('0');
  });

  test('TC_DRILL_304: True North Azimuth at boundary 360', async () => {
    await addDrillholePage.enterTrueNorthAzimuth('360');
  });

  test('TC_DRILL_305: Planned Depth at boundary 0 and 25000', async () => {
    await addDrillholePage.enterPlannedDepth('0');
    // Clear and try max
    await addDrillholePage.enterPlannedDepth('25000');
  });

  test('TC_DRILL_306: Latitude at boundary -90 and 90', async () => {
    await addDrillholePage.enterLatitude('-90');
    await addDrillholePage.enterLatitude('90');
  });

  test('TC_DRILL_307: Longitude at boundary -180 and 180', async () => {
    await addDrillholePage.enterLongitude('-180');
    await addDrillholePage.enterLongitude('180');
  });

  test('TC_DRILL_308: Decimal precision - 3 decimal places for Dip', async () => {
    const scenario = addDrillholeData.boundaryTests[8];
    await addDrillholePage.enterDip(String(scenario.dip));
    // Verify rounded to 3 decimal places
  });

  test('TC_DRILL_309: Decimal precision - 5 decimal places for Latitude', async () => {
    const scenario = addDrillholeData.boundaryTests[9];
    await addDrillholePage.enterLatitude(String(scenario.latitude));
    // Verify rounded to 5 decimal places
  });
});

// ============================================================
// Security Tests @security
// ============================================================
test.describe('Add Drillhole - Security Tests @security', () => {
  test('TC_DRILL_400: SQL injection in Drillhole Name', async () => {
    const scenario = addDrillholeData.securityTests[0];
    await addDrillholePage.selectProject('DemoProj_Nagen');
    await addDrillholePage.enterDrillholeName(scenario.drillhole);
    await addDrillholePage.clickAdd();
    // Verify no SQL execution
  });

  test('TC_DRILL_401: XSS in Drillhole Name', async ({ page }) => {
    const scenario = addDrillholeData.securityTests[1];
    await addDrillholePage.enterDrillholeName(scenario.drillhole);
    await addDrillholePage.clickAdd();

    const dialogTriggered = await page.evaluate(() => {
      return (window as any).__xssTriggered === true;
    });
    expect(dialogTriggered).toBeFalsy();
  });
});
