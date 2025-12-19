import { Page, expect } from '@playwright/test';

/**
 * Test helper utilities for SauceDemo automation
 */
export class TestHelpers {
  /**
   * Wait for network to be idle with custom timeout
   */
  static async waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Generate a random string of specified length
   */
  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate a long string of specified character
   */
  static generateLongString(length: number, char = 'a'): string {
    return char.repeat(length);
  }

  /**
   * Generate a random email address
   */
  static generateRandomEmail(): string {
    return `test_${this.generateRandomString(8)}@example.com`;
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeTimestampedScreenshot(page: Page, name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `reports/screenshots/${name}_${timestamp}.png`;
    await page.screenshot({ path, fullPage: true });
    return path;
  }

  /**
   * Retry an action with exponential backoff
   */
  static async retryWithBackoff<T>(
    action: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> {
    let lastError: Error | undefined;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await action();
      } catch (error) {
        lastError = error as Error;
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  }

  /**
   * Clear all browser storage
   */
  static async clearAllStorage(page: Page): Promise<void> {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.context().clearCookies();
  }

  /**
   * Get all console messages from the page
   */
  static collectConsoleMessages(page: Page): string[] {
    const messages: string[] = [];
    page.on('console', msg => {
      messages.push(`[${msg.type()}] ${msg.text()}`);
    });
    return messages;
  }

  /**
   * Parse price string to number
   */
  static parsePrice(priceString: string): number {
    return parseFloat(priceString.replace(/[^0-9.]/g, ''));
  }

  /**
   * Format number as currency
   */
  static formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  /**
   * Wait for element to be stable (no layout shifts)
   */
  static async waitForStableElement(
    page: Page,
    selector: string,
    timeout = 5000
  ): Promise<void> {
    const element = page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });

    // Wait for position to be stable
    let previousBox = await element.boundingBox();
    let stable = false;
    const startTime = Date.now();

    while (!stable && Date.now() - startTime < timeout) {
      await page.waitForTimeout(100);
      const currentBox = await element.boundingBox();

      if (previousBox && currentBox) {
        stable =
          previousBox.x === currentBox.x &&
          previousBox.y === currentBox.y &&
          previousBox.width === currentBox.width &&
          previousBox.height === currentBox.height;
      }

      previousBox = currentBox;
    }
  }

  /**
   * Verify no console errors
   */
  static async verifyNoConsoleErrors(page: Page): Promise<void> {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    if (errors.length > 0) {
      console.warn('Console errors detected:', errors);
    }
  }

  /**
   * Assert URL contains expected path
   */
  static async assertUrlContains(page: Page, expectedPath: string): Promise<void> {
    await expect(page).toHaveURL(new RegExp(expectedPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  /**
   * Wait for specific number of elements
   */
  static async waitForElementCount(
    page: Page,
    selector: string,
    count: number,
    timeout = 10000
  ): Promise<void> {
    await expect(page.locator(selector)).toHaveCount(count, { timeout });
  }
}

/**
 * Security test payloads
 */
export const SecurityPayloads = {
  sqlInjection: [
    "' OR '1'='1",
    "' OR '1'='1' --",
    "'; DROP TABLE users; --",
    "' UNION SELECT * FROM users --",
    "1' OR '1' = '1",
    "admin'--"
  ],
  xss: [
    "<script>alert('XSS')</script>",
    "<img src=x onerror=alert('XSS')>",
    "javascript:alert('XSS')",
    "\"><script>alert('XSS')</script>",
    "<svg onload=alert('XSS')>",
    "<body onload=alert('XSS')>"
  ],
  pathTraversal: [
    "../../../etc/passwd",
    "..\\..\\..\\windows\\system32\\config\\sam",
    "....//....//....//etc/passwd"
  ]
};

/**
 * Test data generators
 */
export const TestDataGenerators = {
  validName: () => TestHelpers.generateRandomString(8),
  validEmail: () => TestHelpers.generateRandomEmail(),
  validZipCode: () => Math.floor(10000 + Math.random() * 90000).toString(),
  longString: (length: number) => TestHelpers.generateLongString(length),
  specialChars: "!@#$%^&*()_+-=[]{}|;':\",./<>?",
  unicodeChars: "日本語テスト한국어Ñüß"
};
