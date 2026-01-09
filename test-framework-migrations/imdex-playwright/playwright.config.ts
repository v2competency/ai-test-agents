import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Playwright Configuration
 * Migrated from: application.properties + env.properties
 * Original framework: QAF (QMetry Automation Framework) / Selenium WebDriver
 */
export default defineConfig({
  // Test directory
  testDir: './tests',

  // Parallel execution (QAF required TestNG parallel configuration)
  fullyParallel: true,

  // Fail fast on CI
  forbidOnly: !!process.env.CI,

  // Retry failed tests
  // Migrated from: retry.count = 0
  retries: process.env.CI ? 2 : 0,

  // Worker threads
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  // Migrated from: QAF HTML Dashboard
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }]
  ],

  // Shared settings for all projects
  use: {
    // Migrated from: env.baseurl = https://www.imdex.com
    baseURL: process.env.BASE_URL || 'https://www.imdex.com',

    // Migrated from: selenium.success.screenshots = 1
    screenshot: 'only-on-failure',

    // Enhanced: Trace on retry (not available in Selenium)
    trace: 'on-first-retry',

    // Enhanced: Video recording
    video: 'on-first-retry',

    // Viewport size for desktop
    viewport: { width: 1920, height: 1080 },

    // Migrated from: selenium.wait.timeout = 30000
    actionTimeout: 30000,

    // Navigation timeout
    navigationTimeout: 30000,

    // Headless mode
    headless: process.env.HEADLESS !== 'false',

    // Ignore HTTPS errors
    // Migrated from: chrome args --ignore-certificate-errors
    ignoreHTTPSErrors: true,
  },

  // Global timeout
  timeout: 60000,

  // Expect timeout
  expect: {
    timeout: 10000,
  },

  // Browser projects
  // Migrated from: platform property (desktop/mobile)
  projects: [
    {
      name: 'desktop-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'mobile-pixel7',
      // Migrated from: chrome.additional.capabilities with Pixel 7 emulation
      use: {
        ...devices['Pixel 7'],
      },
    },
    // Additional browser configurations (easy to add in Playwright)
    // {
    //   name: 'desktop-firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'desktop-webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Output folder
  outputDir: 'reports/test-artifacts/',

  // Web server (optional - run app before tests)
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
