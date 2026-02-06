import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Playwright Configuration
 * Migrated from: QAF application.properties + testng configs
 *
 * Original settings:
 * - env.baseurl=https://www.imdex.com
 * - selenium.wait.timeout=60000
 * - Platform support: Desktop + Mobile
 */
export default defineConfig({
  // Test directory
  testDir: './tests',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if test.only is left in code
  forbidOnly: !!process.env.CI,

  // Retry failed tests
  retries: process.env.CI ? 2 : 1,

  // Number of workers
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-report' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }]
  ],

  // Global settings for all tests
  use: {
    // Base URL for all tests
    baseURL: process.env.BASE_URL || 'https://www.imdex.com',

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video recording
    video: 'on-first-retry',

    // Default timeout for actions
    actionTimeout: 30000,

    // Navigation timeout (migrated from selenium.wait.timeout=60000)
    navigationTimeout: 60000,
  },

  // Global timeout per test
  timeout: 120000,

  // Expect timeout
  expect: {
    timeout: 10000,
  },

  // Output directory for artifacts
  outputDir: 'reports/test-artifacts',

  // Projects for different browsers and devices
  projects: [
    // Desktop Chrome (primary - from original Selenium)
    {
      name: 'desktop-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Desktop Firefox
    {
      name: 'desktop-firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Desktop Safari
    {
      name: 'desktop-safari',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Mobile Chrome (from original platform=android config)
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },

    // Mobile Safari (from original platform=ios config)
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 12'],
      },
    },
  ],

  // Web server configuration (optional - for local development)
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
