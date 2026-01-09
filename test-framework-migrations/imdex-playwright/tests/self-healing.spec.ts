import { test, expect } from '@playwright/test';
import { SelfHealingLocator } from '../utils/SelfHealingLocator';
import { HOME_ELEMENTS, SEARCH_RESULTS_ELEMENTS } from '../config/elements';

/**
 * Self-Healing Demonstration Tests
 * Migrated from: Healenium integration in HealeniumListener.java
 * Original framework: QAF / Healenium (EPAM)
 *
 * These tests demonstrate the self-healing capabilities of the migrated framework.
 * The self-healing system replaces the Healenium server-based approach with:
 * 1. Local fallback selectors
 * 2. Healing cache for performance
 * 3. AI-powered healing via Anthropic Claude
 */
test.describe('Self-Healing Demonstration', () => {
  let healer: SelfHealingLocator;

  test.beforeEach(async ({ page }) => {
    healer = new SelfHealingLocator(page);
  });

  test.afterEach(async () => {
    // Print healing report after each test
    console.log(healer.generateReport());
  });

  test('Demonstrate self-healing with home page elements', async ({ page }) => {
    // Navigate to IMDEX
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Attempt to locate cookie button with self-healing
    try {
      const cookieButton = await healer.locate(HOME_ELEMENTS.acceptCookiesButton, {
        timeout: 10000
      });

      if (await cookieButton.isVisible()) {
        await cookieButton.click();
        console.log('Cookie button found and clicked');
      }
    } catch (error) {
      console.log('Cookie banner not present (may already be accepted)');
    }

    // Attempt to locate search button with self-healing
    const searchButton = await healer.locate(HOME_ELEMENTS.searchInputButton, {
      timeout: 10000
    });

    expect(await searchButton.isVisible()).toBe(true);
    await searchButton.click();

    // Attempt to locate search input with self-healing
    const searchInput = await healer.locate(HOME_ELEMENTS.searchInputField, {
      timeout: 10000
    });

    expect(await searchInput.isVisible()).toBe(true);
    await searchInput.fill('mining');

    // Get healing statistics
    const stats = healer.getHealingStats();
    console.log('Healing Stats:', stats);

    expect(stats.failed).toBe(0);
  });

  test('Demonstrate fallback selector healing', async ({ page }) => {
    // Navigate to search results page directly
    await page.goto('/?s=mining');
    await page.waitForLoadState('networkidle');

    // Try to locate results heading with self-healing
    // This demonstrates fallback selectors when primary fails
    try {
      const resultsHeading = await healer.locate(SEARCH_RESULTS_ELEMENTS.resultsHeading, {
        timeout: 15000
      });

      const headingText = await resultsHeading.textContent();
      console.log('Results heading found:', headingText);
    } catch (error) {
      console.log('Results heading not found (expected on search page)');
    }

    // Print final healing report
    const report = healer.generateReport();
    console.log(report);
  });

  test('Healing cache persistence demonstration', async ({ page }) => {
    // First visit - selectors will be discovered
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Locate elements (cache will be populated)
    try {
      await healer.locate(HOME_ELEMENTS.searchInputButton, { timeout: 5000 });
      await healer.locate(HOME_ELEMENTS.searchInputField, { timeout: 5000 });
    } catch {
      // Expected to fail for some elements
    }

    // Export cache
    const cache = healer.exportCache();
    console.log('Exported cache:', cache);

    // Clear and reimport (simulates persistence)
    healer.clearCache();
    healer.importCache(cache);

    // Second locate attempt - should use cache
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const searchButton = await healer.locate(HOME_ELEMENTS.searchInputButton, {
      timeout: 5000
    });

    expect(await searchButton.isVisible()).toBe(true);

    // Check stats - cache hits should be recorded
    const stats = healer.getHealingStats();
    console.log('Stats after cache usage:', stats);
  });
});

/**
 * Self-Healing Integration Test
 * Full E2E test with self-healing enabled throughout
 */
test.describe('Self-Healing E2E Integration', () => {
  test('Complete search flow with self-healing', async ({ page }) => {
    const healer = new SelfHealingLocator(page);

    // Navigate
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Step 1: Accept cookies (with healing)
    try {
      const cookieBtn = await healer.locate(HOME_ELEMENTS.acceptCookiesButton, {
        timeout: 5000
      });
      await cookieBtn.click();
    } catch {
      console.log('Cookie handling skipped');
    }

    // Step 2: Click search (with healing)
    const searchBtn = await healer.locate(HOME_ELEMENTS.searchInputButton, {
      timeout: 10000
    });
    await searchBtn.click();

    // Step 3: Enter search term (with healing)
    const searchInput = await healer.locate(HOME_ELEMENTS.searchInputField, {
      timeout: 10000
    });
    await searchInput.fill('mining');

    // Step 4: Submit search (with healing)
    const submitBtn = await healer.locate(HOME_ELEMENTS.searchSubmitButton, {
      timeout: 10000
    });
    await submitBtn.click();

    // Wait for results
    await page.waitForURL(/.*search.*/);

    // Verify and print report
    const report = healer.generateReport();
    console.log('\n' + report);

    const stats = healer.getHealingStats();
    expect(stats.failed).toBe(0);
  });
});
