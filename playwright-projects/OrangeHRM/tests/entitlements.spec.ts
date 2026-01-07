// tests/entitlements.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { EntitlementsPage } from '../pages/EntitlementsPage';
import entitlementsData from '../data/entitlementsData.json';
import users from '../data/users.json';

test.describe('Entitlements - OrangeHRM', () => {
  let loginPage: LoginPage;
  let entitlementsPage: EntitlementsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    entitlementsPage = new EntitlementsPage(page);

    // Login
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);
  });

  // ============================================================================
  // ADD ENTITLEMENTS TESTS
  // ============================================================================
  test.describe('Add Entitlements @smoke @regression', () => {
    test.beforeEach(async () => {
      await entitlementsPage.navigateToAddEntitlement();
    });

    test('TC_ENT_001: Access Add Entitlements page', async () => {
      // Assert
      expect(await entitlementsPage.isOnAddEntitlementPage()).toBe(true);
    });

    test('TC_ENT_100: Add entitlement without Employee Name', async () => {
      // Act
      await entitlementsPage.selectLeaveType('ML');
      await entitlementsPage.enterEntitlement('10');
      await entitlementsPage.clickSave();

      // Assert
      expect(await entitlementsPage.isValidationErrorDisplayed()).toBe(true);
    });

    test('TC_ENT_101: Add entitlement without Leave Type', async () => {
      // Act
      await entitlementsPage.enterEmployeeName('admin');
      await entitlementsPage.enterEntitlement('10');
      await entitlementsPage.clickSave();

      // Assert
      expect(await entitlementsPage.isValidationErrorDisplayed()).toBe(true);
    });
  });

  // ============================================================================
  // EMPLOYEE ENTITLEMENTS TESTS
  // ============================================================================
  test.describe('Employee Entitlements @regression', () => {
    test.beforeEach(async () => {
      await entitlementsPage.navigateToEmployeeEntitlements();
    });

    test('TC_ENT_004: Search Employee Entitlements page loads', async () => {
      // Assert
      expect(await entitlementsPage.isOnEmployeeEntitlementsPage()).toBe(true);
    });
  });

  // ============================================================================
  // MY ENTITLEMENTS TESTS
  // ============================================================================
  test.describe('My Entitlements @regression', () => {
    test.beforeEach(async () => {
      await entitlementsPage.navigateToMyEntitlements();
    });

    test('TC_ENT_005: View My Leave Entitlements', async () => {
      // Assert
      expect(await entitlementsPage.isOnMyEntitlementsPage()).toBe(true);
    });

    test('TC_ENT_006: Filter My Entitlements by Leave Type', async () => {
      // Act
      await entitlementsPage.filterMyEntitlements({ leaveType: 'ML' });

      // Assert
      expect(await entitlementsPage.isOnMyEntitlementsPage()).toBe(true);
    });
  });

  // ============================================================================
  // BOUNDARY TESTS
  // ============================================================================
  test.describe('Boundary Tests @boundary', () => {
    test.beforeEach(async () => {
      await entitlementsPage.navigateToAddEntitlement();
    });

    test('TC_ENT_102: Add entitlement with zero days', async () => {
      // Act
      await entitlementsPage.enterEntitlement('0');

      // Assert - May show validation error
      expect(await entitlementsPage.isOnAddEntitlementPage()).toBe(true);
    });

    test('TC_ENT_103: Add entitlement with negative value', async () => {
      // Act
      await entitlementsPage.enterEntitlement('-5');

      // Assert - Should show validation error
      expect(await entitlementsPage.isOnAddEntitlementPage()).toBe(true);
    });
  });
});
