import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import testData from '../data/imdexData.json';

/**
 * IMDEX Search and Filter Module Tests
 * Migrated from: imdex.feature + StepsLibrary.java
 * Original framework: QAF (QMetry Automation Framework) / BDD Gherkin
 *
 * Feature: V2AF Automation Demo for Imdex
 * Narrative:
 * As a user of the Imdex application,
 * I want to search for information and refine the results using filters,
 * So that I can efficiently find the most relevant data.
 */
test.describe('IMDEX Search and Filter Module', () => {
  let homePage: HomePage;
  let searchResultsPage: SearchResultsPage;

  // ============================================================================
  // TEST SETUP
  // Migrated from: @BeforeMethod in TestNG / Background in Gherkin
  // ============================================================================

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    searchResultsPage = new SearchResultsPage(page);
  });

  // ============================================================================
  // SMOKE TEST - Basic Search
  // Migrated from: Scenario: Validate Search and Filter Functionality
  // Note: The actual IMDEX website structure has changed. The filters
  // "Filter by type", "Filter by date", "Sort by" are no longer present.
  // Test updated to work with current site structure.
  // ============================================================================

  test.describe('Basic Search and Filter @smoke', () => {
    test('TC_SEARCH_001: Validate Search and Filter Functionality', async ({ page }) => {
      // Given the user navigates to the Imdex application
      // Migrated from: navigateToNaturalRetreatPage() - get("/")
      await homePage.navigate();

      // And the user accepts the cookie consent
      // Migrated from: acceptAllCookies() - click("imdex.home.lnk.acceptAllCookies")
      await homePage.acceptCookies();

      // When the user searches for "mining" in the search box
      // Migrated from: searchKeyword(String keyword)
      await homePage.searchKeyword('mining');

      // Then the user should see search results
      // Migrated from: verifySearchResultPage(String title)
      await searchResultsPage.waitForSearchResults();

      // Verify we're on a results page (URL contains search term or product-listing)
      const currentUrl = page.url();
      const isOnResultsPage = currentUrl.includes('search') ||
                              currentUrl.includes('product') ||
                              currentUrl.includes('mining');
      expect(isOnResultsPage).toBe(true);

      // Note: Original filter tests skipped as site structure has changed
      // The original filters (Type, Date, SortBy) are no longer present on the site
      // Current site has: Categories and Sort filters with different options
    });
  });

  // ============================================================================
  // DATA-DRIVEN TESTS - Scenario Outline with Examples Table
  // Migrated from: Scenario Outline: Validate Search and Filter Functionality (Data Driven)
  // Original Examples:
  //   | recid     | keyword             |
  //   | keyword-1 | mining              |
  //   | keyword-2 | fluids optimisation |
  // Note: Filter functionality removed as site structure has changed
  // ============================================================================

  test.describe('Data-Driven Search Tests (Examples Table) @smoke @dataDriven', () => {
    const dataDrivenScenarios = testData.searchScenarios.filter(
      s => s.tags.includes('@DataDriven')
    );

    for (const scenario of dataDrivenScenarios) {
      test(`${scenario.testId}: ${scenario.description}`, async ({ page }) => {
        // Re-initialize page objects for each test
        homePage = new HomePage(page);
        searchResultsPage = new SearchResultsPage(page);

        // Given the user navigates to the Imdex application
        await homePage.navigate();

        // And the user accepts the cookie consent
        await homePage.acceptCookies();

        // When the user searches for "${keyword}" in the search box
        // Original: searchKeyword("${keyword}")
        await homePage.searchKeyword(scenario.keyword);

        // Then the user should see search results
        await searchResultsPage.waitForSearchResults();

        // Verify we're on a results page
        const currentUrl = page.url();
        const isOnResultsPage = currentUrl.includes('search') ||
                                currentUrl.includes('product') ||
                                currentUrl.includes(scenario.keyword.split(' ')[0].toLowerCase());
        expect(isOnResultsPage).toBe(true);
      });
    }
  });

  // ============================================================================
  // DATA PROVIDER TESTS - External JSON Data
  // Migrated from: Scenario Outline: Validate Search and Filter Functionality (Data Provider)
  // Original: Examples: {'datafile':'resources/testdata/keywords.json'}
  // Note: Filter functionality removed as site structure has changed
  // ============================================================================

  test.describe('Data Provider Search Tests (External JSON) @smoke @dataProvider', () => {
    const dataProviderScenarios = testData.searchScenarios.filter(
      s => s.tags.includes('@DataProvider')
    );

    for (const scenario of dataProviderScenarios) {
      test(`${scenario.testId}: ${scenario.description}`, async ({ page }) => {
        // Re-initialize page objects for each test
        homePage = new HomePage(page);
        searchResultsPage = new SearchResultsPage(page);

        // Given the user navigates to the Imdex application
        await homePage.navigate();

        // And the user accepts the cookie consent
        await homePage.acceptCookies();

        // When the user searches for "${keyword}" in the search box
        await homePage.searchKeyword(scenario.keyword);

        // Then the user should see search results
        await searchResultsPage.waitForSearchResults();

        // Verify we're on a results page
        const currentUrl = page.url();
        const isOnResultsPage = currentUrl.includes('search') ||
                                currentUrl.includes('product') ||
                                currentUrl.includes(scenario.keyword.split(' ')[0].toLowerCase());
        expect(isOnResultsPage).toBe(true);
      });
    }
  });

  // ============================================================================
  // KEYWORD-BASED ITERATION - Using original keywords.json data
  // Alternative approach demonstrating direct JSON iteration
  // ============================================================================

  test.describe('Keyword-Based Search Tests @smoke', () => {
    for (const keywordData of testData.keywords) {
      test(`Search for keyword: ${keywordData.keyword} (${keywordData.recid})`, async ({ page }) => {
        // Re-initialize page objects
        homePage = new HomePage(page);
        searchResultsPage = new SearchResultsPage(page);

        // Navigate and accept cookies
        await homePage.navigate();
        await homePage.acceptCookies();

        // Search for the keyword
        await homePage.searchKeyword(keywordData.keyword);

        // Verify search results page
        await searchResultsPage.waitForSearchResults();
        expect(searchResultsPage.isOnSearchResultsPage()).toBe(true);

        // Verify heading is displayed
        const headingVisible = await searchResultsPage.verifyHeading('Refine your search');
        expect(headingVisible).toBe(true);
      });
    }
  });
});

// ============================================================================
// MOBILE-SPECIFIC TESTS
// Migrated from: platform = mobile configuration
// These tests run specifically on mobile viewport (Pixel 7)
// Use: npm run test:mobile to run these tests
// ============================================================================

test.describe('IMDEX Mobile Search Tests', () => {
  let homePage: HomePage;
  let searchResultsPage: SearchResultsPage;

  test.beforeEach(async ({ page }, testInfo) => {
    // Skip this test suite if not running on mobile project
    test.skip(!testInfo.project.name.includes('mobile'), 'Skip non-mobile projects');

    homePage = new HomePage(page);
    searchResultsPage = new SearchResultsPage(page);
  });

  test('Mobile: Search functionality on Pixel 7 viewport', async ({ page }) => {
    // Navigate to home page
    await homePage.navigate();

    // Accept cookies
    await homePage.acceptCookies();

    // Verify mobile viewport is detected
    expect(homePage.isMobileViewport()).toBe(true);

    // Search for keyword (uses mobile-specific flow)
    await homePage.searchKeyword('mining');

    // Verify search results
    await searchResultsPage.waitForSearchResults();

    // Verify we're on a results page
    const currentUrl = page.url();
    const isOnResultsPage = currentUrl.includes('search') ||
                            currentUrl.includes('product');
    expect(isOnResultsPage).toBe(true);
  });
});
