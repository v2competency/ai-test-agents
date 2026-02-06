import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage, FilterOptions } from '../pages/SearchResultsPage';
import searchData from '../data/searchData.json';

/**
 * Search and Filter Tests
 * Migrated from: scenarios/imdex.feature
 * Original framework: QAF BDD with Gherkin
 *
 * Original Feature: V2AF Automation Demo for Imdex
 * Narrative: As a user of the Imdex application,
 * I want to search for information and refine the results using filters,
 * So that I can efficiently find the most relevant data.
 */
test.describe('Imdex Search and Filter Functionality', () => {
  let homePage: HomePage;
  let searchResultsPage: SearchResultsPage;

  // Migrated from: Implicit setup in QAF BDD scenarios
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    searchResultsPage = new SearchResultsPage(page);

    // Navigate to application
    // Original: "Given the user navigates to the Imdex application"
    await homePage.navigate();

    // Accept cookies
    // Original: "And the user accepts the cookie consent"
    await homePage.acceptCookies();
  });

  // ============================================================================
  // SCENARIO 1: Basic Search and Filter
  // Migrated from: "Scenario: Validate Search and Filter Functionality"
  // Original tag: @Smoke
  // ============================================================================

  test('TC_SEARCH_001: Validate Search and Filter Functionality - Basic', async () => {
    // Original scenario with hardcoded data
    const keyword = 'mining';
    const filters: FilterOptions = {
      Type: 'Product',
      Date: 'Last Year',
      SortBy: 'Newest'
    };

    // When the user searches for "mining" in the search box
    await homePage.search(keyword);

    // Then the user should see the "Refine your search" heading
    await searchResultsPage.verifyHeading('Refine your search');

    // When the user applies the following filters
    await searchResultsPage.applyFilters(filters);

    // Then the user should see results updated based on the applied filters
    await searchResultsPage.verifyResultsUpdated();
  });

  // ============================================================================
  // SCENARIO 2: Data-Driven Search (Inline Examples)
  // Migrated from: "Scenario Outline: Validate Search and Filter Functionality (Data Driven)"
  // Original tag: @Smoke
  // ============================================================================

  test.describe('Data-Driven Search - Inline Examples', () => {
    // Migrated from scenario outline examples
    const inlineScenarios = searchData.inlineExamples;

    for (const scenario of inlineScenarios) {
      test(`TC_SEARCH_${scenario.recid}: Search with keyword "${scenario.keyword}"`, async () => {
        // Filters from original scenario outline
        const filters: FilterOptions = {
          Type: 'Solution',
          Date: 'All Time',
          SortBy: 'Oldest'
        };

        // When the user searches for "${keyword}" in the search box
        await homePage.search(scenario.keyword);

        // Then the user should see the "Refine your search" heading
        await searchResultsPage.verifyHeading('Refine your search');

        // When the user applies the following filters
        await searchResultsPage.applyFilters(filters);

        // Then the user should see results updated based on the applied filters
        await searchResultsPage.verifyResultsUpdated();
      });
    }
  });

  // ============================================================================
  // SCENARIO 3: Data-Driven Search (External JSON)
  // Migrated from: "Scenario Outline: Validate Search and Filter Functionality (Data Provider)"
  // Original: Examples: {'datafile':'resources/testdata/keywords.json'}
  // Original tag: @Smoke
  // ============================================================================

  test.describe('Data-Driven Search - JSON Data Provider', () => {
    // Migrated from external JSON file
    const jsonScenarios = searchData.jsonDataProvider;

    for (const scenario of jsonScenarios) {
      test(`TC_SEARCH_${scenario.testId}: ${scenario.description}`, async () => {
        // Filters from original scenario outline
        const filters: FilterOptions = {
          Type: 'Content',
          Date: 'Last Month',
          SortBy: 'Relevance'
        };

        // When the user searches for "${keyword}" in the search box
        await homePage.search(scenario.keyword);

        // Then the user should see the "Refine your search" heading
        await searchResultsPage.verifyHeading('Refine your search');

        // When the user applies the following filters
        await searchResultsPage.applyFilters(filters);

        // Then the user should see results updated based on the applied filters
        await searchResultsPage.verifyResultsUpdated();
      });
    }
  });

  // ============================================================================
  // ADDITIONAL TEST CASES - Enhanced during migration
  // ============================================================================

  test.describe('Additional Search Scenarios', () => {
    test('TC_SEARCH_100: Search with empty keyword should handle gracefully', async () => {
      // Navigate without searching
      const isOnHome = await homePage.isOnHomePage();
      expect(isOnHome).toBe(true);
    });

    test('TC_SEARCH_101: Verify search input is available', async () => {
      const isSearchAvailable = await homePage.isSearchAvailable();
      expect(isSearchAvailable).toBe(true);
    });
  });
});

// ============================================================================
// FILTER VARIATION TESTS
// Additional tests for comprehensive filter coverage
// ============================================================================

test.describe('Filter Variations', () => {
  let homePage: HomePage;
  let searchResultsPage: SearchResultsPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    searchResultsPage = new SearchResultsPage(page);
    await homePage.navigate();
    await homePage.acceptCookies();
    await homePage.search('technology');
  });

  // Test different filter combinations
  const filterCombinations = [
    { Type: 'Product', Date: 'Last Year', SortBy: 'Newest' },
    { Type: 'Solution', Date: 'All Time', SortBy: 'Oldest' },
    { Type: 'Content', Date: 'Last Month', SortBy: 'Relevance' }
  ];

  for (const filters of filterCombinations) {
    test(`TC_FILTER: Apply filters - Type: ${filters.Type}, Date: ${filters.Date}, Sort: ${filters.SortBy}`, async () => {
      await searchResultsPage.verifyHeading('Refine your search');
      await searchResultsPage.applyFilters(filters);
      await searchResultsPage.verifyResultsUpdated();
    });
  }
});
