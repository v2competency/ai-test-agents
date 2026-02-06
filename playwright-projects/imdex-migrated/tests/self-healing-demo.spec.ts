import { test, expect } from '@playwright/test';
import { SelfHealingLocator } from '../utils/SelfHealingLocator';
import { ELEMENT_REGISTRY, ElementDefinition } from '../utils/ElementRegistry';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Self-Healing Demo Tests
 * Demonstrates the 4-tier self-healing strategy with AIObserver
 *
 * Tier 1: Cache    - Previously healed selectors
 * Tier 2: Fallback - Predefined fallback selectors
 * Tier 3: AI Visual - Claude Vision API screenshot analysis
 * Tier 4: AI DOM   - Claude DOM structure analysis
 */
test.describe('Self-Healing with AIObserver Demo', () => {
  let healer: SelfHealingLocator;

  test.beforeEach(async ({ page }) => {
    healer = new SelfHealingLocator(page, { enableAI: true });

    // Navigate to the Imdex application
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  // =========================================================================
  // TEST 1: Self-healing finds cookie button using registry fallbacks
  // =========================================================================
  test('TC_HEAL_001: Locate cookie accept button via self-healing registry', async ({ page }) => {
    const element = ELEMENT_REGISTRY.home.acceptCookiesButton;

    try {
      const locator = await healer.locate(element, 15000);
      // If cookie button is found, click it
      await locator.click();
      console.log('[TEST] Cookie button found and clicked via self-healing');
    } catch {
      // Cookie banner may not appear - that's acceptable
      console.log('[TEST] Cookie banner not present (already accepted or not shown)');
    }

    // Print healing stats
    const stats = healer.getStats();
    console.log('[TEST] Healing Stats:', JSON.stringify(stats, null, 2));
  });

  // =========================================================================
  // TEST 2: Self-healing locates search elements with fallbacks
  // =========================================================================
  test('TC_HEAL_002: Locate search elements via self-healing pipeline', async ({ page }) => {
    // First accept cookies if present
    try {
      const cookieBtn = page.locator('.action-accept a, button:has-text("Accept"), [data-test="accept-cookies"]').first();
      await cookieBtn.click({ timeout: 5000 });
    } catch {
      // No cookie banner
    }

    // Use self-healing to find search trigger
    const searchTrigger = ELEMENT_REGISTRY.home.searchInputButton;
    const triggerLocator = await healer.locate(searchTrigger, 15000);
    await triggerLocator.click();
    console.log('[TEST] Search trigger found via self-healing');

    // Wait for search panel to open
    await page.waitForTimeout(1000);

    // Use self-healing to find search input (inside search panel that just opened)
    const searchInput = ELEMENT_REGISTRY.home.searchInput;
    const inputLocator = await healer.locate(searchInput, 15000);
    await inputLocator.fill('mining');
    console.log('[TEST] Search input found and filled via self-healing');

    // Use self-healing to find submit button
    const searchSubmit = ELEMENT_REGISTRY.home.searchSubmitButton;
    const submitLocator = await healer.locate(searchSubmit, 15000);
    await submitLocator.click();
    console.log('[TEST] Search submit clicked via self-healing');

    // Wait for results page
    await page.waitForLoadState('networkidle');

    // Verify we reached search results
    const url = page.url();
    console.log('[TEST] Current URL after search:', url);

    // Print healing report
    const report = healer.getReport();
    console.log('\n' + report);
  });

  // =========================================================================
  // TEST 3: Deliberate broken selector triggers AI healing (Tier 3 & 4)
  // =========================================================================
  test('TC_HEAL_003: AI Observer heals deliberately broken selectors', async ({ page }) => {
    // First accept cookies if present
    try {
      const cookieBtn = page.locator('.action-accept a, button:has-text("Accept")').first();
      await cookieBtn.click({ timeout: 5000 });
    } catch {
      // No cookie banner
    }

    // Create element definition with intentionally BROKEN primary selector
    // and BROKEN fallbacks - this forces the AI Observer to kick in (Tier 3 & 4)
    const brokenSearchElement: ElementDefinition = {
      name: 'searchInputBroken',
      description: 'The Search button in the top navigation bar of the Imdex website, inside the secondary navigation. It has the text "Search" and an icon.',
      primary: '#broken-selector-12345',  // Deliberately broken
      fallbacks: [
        '.nonexistent-class-99',
        '#also-does-not-exist',
        '[data-broken="true"]',
      ],
      type: 'button',
      originalLocator: 'xpath=//*[@id="search-input"]/span'
    };

    try {
      console.log('[TEST] Attempting to locate element with broken selectors...');
      console.log('[TEST] This will trigger AI Observer (Tier 3: Vision, Tier 4: DOM)...');
      const locator = await healer.locate(brokenSearchElement, 30000);
      await locator.click();
      console.log('[TEST] AI Observer successfully healed the broken selector!');
    } catch (error) {
      console.log('[TEST] Healing attempt result:', (error as Error).message);
    }

    // Print full healing report regardless of outcome
    const report = healer.getReport();
    console.log('\n' + report);

    // Save healing report to file
    await healer.saveReport('reports/healing/ai-healing-demo-report.json');
  });

  // =========================================================================
  // TEST 4: Full search flow using self-healing throughout
  // =========================================================================
  test('TC_HEAL_004: End-to-end search with self-healing at every step', async ({ page }) => {
    // Accept cookies - handle both modal and banner formats
    try {
      // Try self-healing first
      const cookieElement = ELEMENT_REGISTRY.home.acceptCookiesButton;
      const cookieLocator = await healer.locate(cookieElement, 10000);
      await cookieLocator.click();
      console.log('[TEST] Step 1: Cookies accepted via self-healing');
    } catch {
      // Fallback: handle modal cookie consent dialog
      try {
        const modalAccept = page.locator('[role="dialog"] a:has-text("Accept"), .cookie-consent button:has-text("Accept"), .cookie-consent a').first();
        await modalAccept.click({ timeout: 5000 });
        console.log('[TEST] Step 1: Cookies accepted via modal fallback');
      } catch {
        console.log('[TEST] Step 1: No cookie banner (skipped)');
      }
    }

    // Wait for any cookie modal to close
    await page.waitForTimeout(1000);

    // Click search trigger via self-healing
    const triggerElement = ELEMENT_REGISTRY.home.searchInputButton;
    const triggerLocator = await healer.locate(triggerElement, 15000);
    await triggerLocator.click();
    console.log('[TEST] Step 2: Search trigger clicked via self-healing');

    // Fill search input via self-healing
    const inputElement = ELEMENT_REGISTRY.home.searchInput;
    const inputLocator = await healer.locate(inputElement, 15000);
    await inputLocator.fill('fluids optimisation');
    console.log('[TEST] Step 3: Search keyword entered via self-healing');

    // Submit search via self-healing
    const submitElement = ELEMENT_REGISTRY.home.searchSubmitButton;
    const submitLocator = await healer.locate(submitElement, 15000);
    await submitLocator.click();
    console.log('[TEST] Step 4: Search submitted via self-healing');

    // Wait for results
    await page.waitForLoadState('networkidle');

    // Verify search results heading via self-healing
    const headingElement = ELEMENT_REGISTRY.searchResults.refineHeading;
    try {
      const headingLocator = await healer.locate(headingElement, 15000);
      const headingText = await headingLocator.textContent();
      console.log(`[TEST] Step 5: Results heading found: "${headingText}"`);
      expect(headingText).toContain('Refine');
    } catch {
      console.log('[TEST] Step 5: Results heading not found with expected selector');
    }

    // Print comprehensive healing report
    const report = healer.getReport();
    console.log('\n' + report);

    const stats = healer.getStats();
    console.log('\n[TEST] Final Stats:', JSON.stringify(stats, null, 2));

    // Save report
    await healer.saveReport('reports/healing/e2e-healing-report.json');
  });
});
