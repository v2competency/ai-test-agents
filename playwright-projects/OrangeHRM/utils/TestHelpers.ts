// utils/TestHelpers.ts
import { Page, expect } from '@playwright/test';

/**
 * Wait for network to be idle
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Wait for a specific URL pattern
 */
export async function waitForUrl(page: Page, urlPattern: string | RegExp, timeout = 10000): Promise<void> {
  await page.waitForURL(urlPattern, { timeout });
}

/**
 * Take a screenshot with timestamp
 */
export async function takeTimestampedScreenshot(page: Page, name: string): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `reports/screenshots/${name}_${timestamp}.png`;
  await page.screenshot({ path: fileName, fullPage: true });
  return fileName;
}

/**
 * Retry an action with exponential backoff
 */
export async function retryAction<T>(
  action: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Generate a random string
 */
export function generateRandomString(length = 10): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random email
 */
export function generateRandomEmail(): string {
  return `test_${generateRandomString(8)}@example.com`;
}

/**
 * Format date for OrangeHRM date inputs (yyyy-mm-dd)
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date formatted
 */
export function getTodayFormatted(): string {
  return formatDate(new Date());
}

/**
 * Get a future date formatted
 */
export function getFutureDateFormatted(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return formatDate(date);
}

/**
 * Soft assertion that doesn't fail immediately
 */
export class SoftAssert {
  private errors: string[] = [];

  expect(condition: boolean, message: string): void {
    if (!condition) {
      this.errors.push(message);
    }
  }

  expectEqual<T>(actual: T, expected: T, message: string): void {
    if (actual !== expected) {
      this.errors.push(`${message}: Expected "${expected}" but got "${actual}"`);
    }
  }

  expectContains(actual: string, expected: string, message: string): void {
    if (!actual.includes(expected)) {
      this.errors.push(`${message}: Expected "${actual}" to contain "${expected}"`);
    }
  }

  assertAll(): void {
    if (this.errors.length > 0) {
      throw new Error(`Soft assertion failures:\n${this.errors.join('\n')}`);
    }
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getErrors(): string[] {
    return [...this.errors];
  }
}

/**
 * OrangeHRM specific helpers
 */
export const OrangeHRMHelpers = {
  /**
   * Parse leave balance string to number
   */
  parseLeaveBalance(balanceText: string): number {
    const match = balanceText.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  },

  /**
   * Parse record count from "(X) Record Found" text
   */
  parseRecordCount(text: string): number {
    const match = text.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  },

  /**
   * Get leave period string
   */
  getLeavePeriod(startDate: string, endDate: string): string {
    return `${startDate} - ${endDate}`;
  }
};
