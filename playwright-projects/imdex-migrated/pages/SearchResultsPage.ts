import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Filter options interface
 * Migrated from: Feature file data table structure
 */
export interface FilterOptions {
  Type?: string;
  Date?: string;
  SortBy?: string;
}

/**
 * Search Results Page Object
 * Migrated from: QAF StepsLibrary.java (verifySearchResultPage, theUserAppliesTheFollowingFilters, verifySearchResults)
 * Original framework: QAF with Selenium
 */
export class SearchResultsPage extends BasePage {
  // ==================== LOCATORS ====================
  // Migrated from: resources/repository/imdex.properties

  // Results heading - Original: xpath=//div[@class="search-results__header"]/span
  readonly resultsHeading: Locator;

  // ==================== SELF-HEALING DEFINITIONS ====================

  static readonly ELEMENTS = {
    resultsHeading: {
      primary: '.search-results__header span',
      fallbacks: [
        'div.search-results__header span',
        '[class*="search-results"] .header span',
        '.search-results span',
        '[data-test="results-heading"]'
      ],
      description: 'Search results header/count',
      originalLocator: 'xpath=//div[@class="search-results__header"]/span'
    },
    filterDropdown: {
      primary: 'button[data-bs-toggle="dropdown"]',
      fallbacks: [
        '.dropdown-toggle',
        'button.dropdown',
        '[data-test="filter-dropdown"]'
      ],
      description: 'Filter dropdown button',
      originalLocator: 'xpath=//button[@data-bs-toggle="dropdown"]'
    },
    refineHeading: {
      primary: 'h3:has-text("Refine your search")',
      fallbacks: [
        'h3:text("Refine your search")',
        '.refine-heading',
        '[data-test="refine-heading"]'
      ],
      description: 'Refine your search heading',
      originalLocator: 'xpath=//h3[text()="Refine your search"]'
    }
  };

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.resultsHeading = page.locator('.search-results__header span');
  }

  // ==================== VERIFICATION ====================

  /**
   * Verify the search results heading contains expected text
   * Migrated from: verifySearchResultPage(String title)
   * Original: verifyPresent(String.format(getValue("imdex.search.tl.heading"), title))
   */
  async verifyHeading(expectedText: string): Promise<void> {
    // Original locator: xpath=//h3[text()="%s"]
    const heading = this.page.locator(`h3:has-text("${expectedText}")`);
    await expect(heading).toBeVisible({ timeout: 10000 });
  }

  /**
   * Verify search results are displayed and updated
   * Migrated from: verifySearchResults()
   * Original: verifyPresent("imdex.search.results.heading"); QAFTestBase.pause(3000);
   */
  async verifyResultsUpdated(): Promise<void> {
    // Verify results heading is visible
    await expect(this.resultsHeading).toBeVisible({ timeout: 10000 });

    // Wait for results to stabilize (replacing QAFTestBase.pause(3000))
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the results count text
   */
  async getResultsText(): Promise<string> {
    await this.resultsHeading.waitFor({ state: 'visible' });
    return await this.resultsHeading.textContent() || '';
  }

  // ==================== FILTER ACTIONS ====================

  /**
   * Apply filters to search results
   * Migrated from: theUserAppliesTheFollowingFilters(Object[] filters)
   * Original: Complex click operations with dynamic XPath locators
   */
  async applyFilters(filters: FilterOptions): Promise<void> {
    // Apply Type filter if specified
    if (filters.Type) {
      await this.selectFilter('Filter by type', filters.Type);
    }

    // Apply Date filter if specified
    if (filters.Date) {
      await this.selectFilter('Filter by date', filters.Date);
    }

    // Apply Sort filter if specified
    if (filters.SortBy) {
      await this.selectFilter('Sort by', filters.SortBy);
    }

    // Wait for filters to be applied
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Select a filter option from dropdown
   * Migrated from: click(String.format(getValue("imdex.search.lst.filter"), filterName))
   *                click(String.format(getValue("imdex.search.lst.filter.option"), filterName, optionValue))
   *
   * Original locators:
   * - Filter: xpath=//button[@data-bs-toggle="dropdown"]/preceding-sibling::p[text()="%s"]/following-sibling::button
   * - Option: xpath=//button[@data-bs-toggle="dropdown"]//preceding-sibling::p[text()="%s"]/following-sibling::ul//span[text()="%s"]//parent::li
   */
  private async selectFilter(filterName: string, optionValue: string): Promise<void> {
    // Find the filter section by label text
    const filterSection = this.page.locator(`p:has-text("${filterName}")`).first();

    // Click the dropdown button next to the filter label
    // Original: //button[@data-bs-toggle="dropdown"]/preceding-sibling::p[text()="%s"]/following-sibling::button
    const dropdownButton = filterSection.locator('~ button[data-bs-toggle="dropdown"]').first();

    // Alternative approach if sibling selector doesn't work
    const filterContainer = this.page.locator(`p:text("${filterName}")`).locator('..').first();

    try {
      // Try clicking the dropdown button
      await dropdownButton.click({ timeout: 5000 });
    } catch {
      // Fallback: Find button in parent container
      await filterContainer.locator('button[data-bs-toggle="dropdown"]').first().click();
    }

    // Wait for dropdown to open
    await this.page.waitForTimeout(300);

    // Select the option
    // Original: //span[text()="%s"]//parent::li
    const option = this.page.locator(`li:has(span:text("${optionValue}"))`).first();

    try {
      await option.click({ timeout: 5000 });
    } catch {
      // Fallback: Try direct text match
      await this.page.locator(`ul >> text="${optionValue}"`).first().click();
    }

    // Wait for filter to be applied
    await this.page.waitForTimeout(500);
  }

  /**
   * Get currently applied filter value
   */
  async getActiveFilterValue(filterName: string): Promise<string | null> {
    const filterSection = this.page.locator(`p:has-text("${filterName}")`).first();
    const activeValue = filterSection.locator('~ button .selected-value, ~ button').first();

    try {
      return await activeValue.textContent();
    } catch {
      return null;
    }
  }

  // ==================== PAGE STATE ====================

  /**
   * Check if on search results page
   */
  async isOnSearchResultsPage(): Promise<boolean> {
    try {
      await this.resultsHeading.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get total results count (if displayed)
   */
  async getResultsCount(): Promise<number | null> {
    const text = await this.getResultsText();
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }
}
