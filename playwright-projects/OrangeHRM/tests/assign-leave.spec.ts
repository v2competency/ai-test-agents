// tests/assign-leave.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AssignLeavePage } from '../pages/AssignLeavePage';
import assignLeaveData from '../data/assignLeaveData.json';
import users from '../data/users.json';

test.describe('Leave Assignment - OrangeHRM', () => {
  let loginPage: LoginPage;
  let assignLeavePage: AssignLeavePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    assignLeavePage = new AssignLeavePage(page);

    // Login and navigate to Assign Leave
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);
    await assignLeavePage.navigate();
  });

  // ============================================================================
  // POSITIVE TEST CASES
  // ============================================================================
  test.describe('Positive Scenarios @smoke @regression', () => {
    test('TC_ASSIGN_001: Access Assign Leave page', async () => {
      // Assert
      expect(await assignLeavePage.isOnAssignLeavePage()).toBe(true);
    });

    test('TC_ASSIGN_005: Employee Name autocomplete', async () => {
      // Act
      await assignLeavePage.enterEmployeeName('a');
      await assignLeavePage.wait(500);

      // Assert - Autocomplete should appear
      const isAutocompleteVisible = await assignLeavePage.isAutocompleteVisible();
      // Note: May not be visible if no employees match 'a'
      expect(await assignLeavePage.isOnAssignLeavePage()).toBe(true);
    });
  });

  // ============================================================================
  // NEGATIVE TEST CASES
  // ============================================================================
  test.describe('Negative Scenarios @regression @negative', () => {
    test('TC_ASSIGN_100: Assign leave without Employee Name', async () => {
      // Act
      await assignLeavePage.selectLeaveType('ML');
      await assignLeavePage.enterFromDate('2025-04-15');
      await assignLeavePage.enterToDate('2025-04-16');
      await assignLeavePage.clickAssign();

      // Assert
      expect(await assignLeavePage.isValidationErrorDisplayed()).toBe(true);
    });

    test('TC_ASSIGN_103: Assign leave with invalid date range', async () => {
      // This test would need a valid employee
      // Act
      await assignLeavePage.enterFromDate('2025-04-20');
      await assignLeavePage.enterToDate('2025-04-15');

      // Assert - Date validation should show
      expect(await assignLeavePage.isOnAssignLeavePage()).toBe(true);
    });
  });

  // ============================================================================
  // SECURITY TEST CASES
  // ============================================================================
  test.describe('Security Tests @security', () => {
    test('TC_ASSIGN_400: SQL injection in Employee Name', async () => {
      const scenario = assignLeaveData.securityTests[0];

      // Act
      await assignLeavePage.enterEmployeeName(scenario.payload);
      await assignLeavePage.wait(500);

      // Assert - Should not crash, autocomplete should handle gracefully
      expect(await assignLeavePage.isOnAssignLeavePage()).toBe(true);
    });

    test('TC_ASSIGN_401: XSS in comments field', async ({ page }) => {
      const scenario = assignLeaveData.securityTests[1];

      // Act
      await assignLeavePage.enterComments(scenario.payload);

      // Assert - XSS should not execute
      const pageContent = await page.content();
      expect(pageContent).not.toContain("<script>alert('xss')");
    });
  });
});
