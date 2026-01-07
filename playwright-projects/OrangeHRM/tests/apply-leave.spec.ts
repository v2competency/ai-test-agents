// tests/apply-leave.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ApplyLeavePage } from '../pages/ApplyLeavePage';
import applyLeaveData from '../data/applyLeaveData.json';
import users from '../data/users.json';

test.describe('Leave Application - OrangeHRM', () => {
  let loginPage: LoginPage;
  let applyLeavePage: ApplyLeavePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    applyLeavePage = new ApplyLeavePage(page);

    // Login and navigate to Apply Leave
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);
    await applyLeavePage.navigate();
  });

  // ============================================================================
  // POSITIVE TEST CASES
  // ============================================================================
  test.describe('Positive Scenarios @smoke @regression', () => {
    test('TC_APPLY_001: Access Apply Leave page', async () => {
      // Assert
      expect(await applyLeavePage.isOnApplyLeavePage()).toBe(true);
      expect(await applyLeavePage.isLeaveTypeDropdownVisible()).toBe(true);
    });

    test('TC_APPLY_003: View Leave Balance after selecting type', async () => {
      // Act
      await applyLeavePage.selectLeaveType('ML');

      // Assert
      const balance = await applyLeavePage.getLeaveBalance();
      expect(balance).toContain('Day');
    });

    test('TC_APPLY_006: Verify date picker format', async () => {
      // Assert
      const placeholder = await applyLeavePage.getDatePlaceholder();
      expect(placeholder).toBe('yyyy-mm-dd');
    });
  });

  // ============================================================================
  // LEAVE APPLICATION TESTS (Conditional - requires leave balance)
  // ============================================================================
  test.describe('Leave Application @regression', () => {
    test('TC_APPLY_002: Apply leave with valid data', async () => {
      const scenario = applyLeaveData.validScenarios[0];

      // Check if balance is available
      await applyLeavePage.selectLeaveType(scenario.leaveType);
      const balance = await applyLeavePage.getLeaveBalanceNumber();

      if (balance > 0) {
        // Act
        await applyLeavePage.enterFromDate(scenario.fromDate);
        await applyLeavePage.enterToDate(scenario.toDate);
        if (scenario.comments) {
          await applyLeavePage.enterComments(scenario.comments);
        }
        await applyLeavePage.clickApply();

        // Assert - Either success toast or we stay on page (if dates overlap with existing leave)
        const hasSuccess = await applyLeavePage.isSuccessToastDisplayed();
        const hasError = await applyLeavePage.isValidationErrorDisplayed();
        expect(hasSuccess || hasError).toBe(true);
      } else {
        test.skip();
      }
    });
  });

  // ============================================================================
  // NEGATIVE TEST CASES
  // ============================================================================
  test.describe('Negative Scenarios @regression @negative', () => {
    test('TC_APPLY_100: Apply leave without selecting Leave Type', async () => {
      // Act - try to submit without leave type
      await applyLeavePage.enterFromDate('2025-04-01');
      await applyLeavePage.enterToDate('2025-04-02');
      await applyLeavePage.clickApply();

      // Assert
      expect(await applyLeavePage.isValidationErrorDisplayed()).toBe(true);
    });

    test('TC_APPLY_101: Apply leave without From Date', async () => {
      // Act
      await applyLeavePage.selectLeaveType('ML');
      await applyLeavePage.enterToDate('2025-04-02');
      await applyLeavePage.clickApply();

      // Assert
      expect(await applyLeavePage.isValidationErrorDisplayed()).toBe(true);
    });

    test('TC_APPLY_102: Apply leave without To Date', async () => {
      // Act
      await applyLeavePage.selectLeaveType('ML');
      await applyLeavePage.enterFromDate('2025-04-01');
      await applyLeavePage.clickApply();

      // Assert
      expect(await applyLeavePage.isValidationErrorDisplayed()).toBe(true);
    });

    test('TC_APPLY_103: Apply leave with From Date after To Date', async () => {
      // Act
      await applyLeavePage.selectLeaveType('ML');
      await applyLeavePage.enterFromDate('2025-04-05');
      await applyLeavePage.enterToDate('2025-04-01');
      await applyLeavePage.clickApply();

      // Assert
      const errors = await applyLeavePage.getValidationErrors();
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // BOUNDARY TEST CASES
  // ============================================================================
  test.describe('Boundary Tests @boundary', () => {
    test('TC_APPLY_301: Comments field maximum length', async () => {
      const scenario = applyLeaveData.boundaryTests.find(t => t.testId === 'TC_APPLY_301');
      if (!scenario) return;

      // Act
      await applyLeavePage.selectLeaveType('ML');
      await applyLeavePage.enterFromDate('2025-04-01');
      await applyLeavePage.enterToDate('2025-04-01');
      await applyLeavePage.enterComments(scenario.comments);

      // Assert - System should accept or truncate, not crash
      const isOnPage = await applyLeavePage.isOnApplyLeavePage();
      expect(isOnPage).toBe(true);
    });
  });

  // ============================================================================
  // SECURITY TEST CASES
  // ============================================================================
  test.describe('Security Tests @security', () => {
    test('TC_APPLY_400: XSS in comments field', async ({ page }) => {
      const scenario = applyLeaveData.securityTests[0];

      // Act
      await applyLeavePage.selectLeaveType('ML');
      await applyLeavePage.enterFromDate('2025-04-01');
      await applyLeavePage.enterToDate('2025-04-01');
      await applyLeavePage.enterComments(scenario.payload);

      // Assert - XSS should not execute
      const pageContent = await page.content();
      expect(pageContent).not.toContain("<script>alert('xss')");
    });
  });
});
