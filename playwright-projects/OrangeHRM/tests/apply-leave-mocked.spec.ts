// tests/apply-leave-mocked.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ApplyLeavePage } from '../pages/ApplyLeavePage';
import { MockHandler } from '../mocks/mockHandler';
import users from '../data/users.json';

test.describe('Leave Application - OrangeHRM (Mocked) @mocked', () => {
  let loginPage: LoginPage;
  let applyLeavePage: ApplyLeavePage;
  let mockHandler: MockHandler;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    applyLeavePage = new ApplyLeavePage(page);
    mockHandler = new MockHandler(page);

    // Setup default mocks before navigation
    await mockHandler.setupLeaveMocks();

    // Login and navigate to Apply Leave
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);
    await applyLeavePage.navigate();
  });

  test.afterEach(async () => {
    await mockHandler.clearMocks();
  });

  test('TC_MOCK_001: View leave balance with mocked data', async () => {
    // Act - Select leave type to trigger balance API call
    await applyLeavePage.selectLeaveType('ML');

    // Assert - Balance should show from mock data (0.5 days)
    const balance = await applyLeavePage.getLeaveBalance();
    expect(balance).toContain('Day');
  });

  test('TC_MOCK_002: Apply leave with mocked success response', async ({ page }) => {
    // Setup mock for successful leave application
    await mockHandler.mockApplyLeaveSuccess();

    // Act - Fill and submit leave application using direct locators
    // Select leave type
    await page.locator('.oxd-select-text-input').first().click();
    await page.locator('.oxd-select-option:has-text("ML")').click();

    // Wait for balance to load indicating leave type is selected
    await page.waitForSelector('text=/Day\\(s\\)/');

    // Fill dates using placeholder-based locators
    const fromDate = page.locator('input[placeholder="yyyy-mm-dd"]').first();
    await fromDate.clear();
    await fromDate.fill('2026-02-10');
    await page.keyboard.press('Escape');

    const toDate = page.locator('input[placeholder="yyyy-mm-dd"]').last();
    await toDate.clear();
    await toDate.fill('2026-02-10');
    await page.keyboard.press('Escape');

    // Fill comments
    await page.locator('textarea').fill('Test leave with mock');

    // Submit
    await page.locator('button[type="submit"]').click();

    // Assert - Should show success with mocked response
    const hasSuccess = await applyLeavePage.isSuccessToastDisplayed();
    expect(hasSuccess).toBe(true);
  });
});
