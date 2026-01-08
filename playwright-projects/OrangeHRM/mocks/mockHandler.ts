import { Page, Route } from '@playwright/test';
import leaveApiResponses from './leave-api-responses.json';

export interface MockConfig {
  leaveTypesEligible?: object;
  leaveBalance?: object;
  applyLeaveResponse?: object;
}

export class MockHandler {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Setup all leave-related API mocks with default or custom responses
   */
  async setupLeaveMocks(config: MockConfig = {}): Promise<void> {
    const baseUrl = '**/api/v2/leave/**';

    // Mock leave types eligible endpoint
    await this.page.route('**/api/v2/leave/leave-types/eligible', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(config.leaveTypesEligible || leaveApiResponses.leaveTypesEligible),
      });
    });

    // Mock leave balance endpoint (with dynamic leave type ID)
    await this.page.route('**/api/v2/leave/leave-balance/leave-type/**', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(config.leaveBalance || leaveApiResponses.leaveBalance),
      });
    });

    // Mock apply leave endpoint
    await this.page.route('**/api/v2/leave/leave-requests', async (route: Route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(config.applyLeaveResponse || leaveApiResponses.applyLeaveSuccess),
        });
      } else {
        await route.continue();
      }
    });
  }

  /**
   * Setup mock for leave types with custom data
   */
  async mockLeaveTypes(response: object): Promise<void> {
    await this.page.route('**/api/v2/leave/leave-types/eligible', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    });
  }

  /**
   * Setup mock for leave balance with custom data
   */
  async mockLeaveBalance(response: object): Promise<void> {
    await this.page.route('**/api/v2/leave/leave-balance/leave-type/**', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    });
  }

  /**
   * Setup mock for apply leave with success response
   */
  async mockApplyLeaveSuccess(response?: object): Promise<void> {
    await this.page.route('**/api/v2/leave/leave-requests', async (route: Route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(response || leaveApiResponses.applyLeaveSuccess),
        });
      } else {
        await route.continue();
      }
    });
  }

  /**
   * Setup mock for apply leave with error response
   */
  async mockApplyLeaveError(statusCode: number = 422, response?: object): Promise<void> {
    await this.page.route('**/api/v2/leave/leave-requests', async (route: Route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: statusCode,
          contentType: 'application/json',
          body: JSON.stringify(response || leaveApiResponses.applyLeaveError),
        });
      } else {
        await route.continue();
      }
    });
  }

  /**
   * Setup mock with zero balance for testing insufficient balance scenarios
   */
  async mockZeroBalance(): Promise<void> {
    const zeroBalanceResponse = {
      ...leaveApiResponses.leaveBalance,
      data: {
        ...leaveApiResponses.leaveBalance.data,
        balance: {
          ...leaveApiResponses.leaveBalance.data.balance,
          entitled: 2,
          used: 2,
          balance: 0,
        },
      },
    };

    await this.mockLeaveBalance(zeroBalanceResponse);
  }

  /**
   * Remove all route handlers
   */
  async clearMocks(): Promise<void> {
    await this.page.unrouteAll();
  }
}

// Export default mock responses for direct access
export { leaveApiResponses };
