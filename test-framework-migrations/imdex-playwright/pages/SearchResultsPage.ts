import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Filter options interface
 * Migrated from: Gherkin DataTable structure
 */
export interface FilterOptions {
  Type?: string;
  Date?: string;
  SortBy?: string;
}

/**
 * Search Results Page Object
 * Migrated from: StepsLibrary.java + imdex.properties (locator repository)
 * Original framework: QAF/Selenium WebDriver
 */
export class SearchResultsPage extends BasePage {
  // Page URL pattern
  readonly pageUrlPattern: string = '/search';

  // ==================== LOCATORS ====================
  // Migrated from: imdex.properties repository

  // Results heading
  // Original: imdex.search.results.heading = xpath=//div[@class="search-results__header"]/span
  readonly resultsHeading: Locator;

  // ==================== SELF-HEALING DEFINITIONS ====================

  static readonly ELEMENTS = {
    searchHeading: {
      primary: 'h3',
      fallbacks: [
        '[data-test="search-heading"]',
        '.search-heading h3',
        '.search-results h3',
        'h2'
      ],
      description: 'Search results heading',
      originalLocator: 'xpath=//h3[text()="%s"]'
    },
    filterDropdown: {
      primary: 'button[data-bs-toggle="dropdown"]',
      fallbacks: [
        '[data-test="filter-dropdown"]',
        '.filter-dropdown button',
        '.dropdown-toggle',
        'button.dropdown'
      ],
      description: 'Filter dropdown button',
      originalLocator: 'xpath=//button[@data-bs-toggle="dropdown"]/preceding-sibling::p[text()="%s"]/following-sibling::button'
    },
    filterOption: {
      primary: '.dropdown-menu li',
      fallbacks: [
        '[data-test="filter-option"]',
        '.dropdown-item',
        'ul.dropdown-menu span',
        '.filter-option'
      ],
      description: 'Filter option item',
      originalLocator: 'xpath=//button[@data-bs-toggle="dropdown"]//preceding-sibling::p[text()="%s"]/following-sibling::ul//span[text()="%s"]//parent::li'
    },
    resultsHeading: {
      primary: 'div.search-results__header span',
      fallbacks: [
        '[data-test="results-count"]',
        '.results-summary',
        '.search-results-header span',
        '.results-header'
      ],
      description: 'Search results header showing count',
      originalLocator: 'xpath=//div[@class="search-results__header"]/span'
    }
  };

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.resultsHeading = page.locator('div.search-results__header span');
  }

  // ==================== NAVIGATION ====================

  /**
   * Wait for search results page to load
   */
  async waitForSearchResults(): Promise<void> {
    await this.page.waitForURL(/.*search.*/);
    await this.waitForPageLoad();
    // Handle any cookie modal that may appear on search results page
    await this.dismissCookieModal();
  }

  /**
   * Dismiss cookie modal if present
   */
  private async dismissCookieModal(): Promise<void> {
    try {
      const cookieModal = this.page.locator('.cookie-consent.modal.show, [id^="CookieConsent"].show');
      if (await cookieModal.isVisible({ timeout: 2000 }).catch(() => false)) {
        const acceptBtn = this.page.locator('.cookie-consent .action-accept a, .cookie-consent .action-accept button, a:has-text("Accept")').first();
        if (await acceptBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await acceptBtn.click();
          await cookieModal.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
        }
      }
    } catch {
      // Cookie modal not present or already dismissed
    }
  }

  // ==================== VERIFICATION ====================

  /**
   * Verify search result page heading
   * Migrated from: verifySearchResultPage(String title)
   * Original: verifyPresent(String.format(getValue("imdex.search.tl.heading"), title))
   */
  async verifyHeading(title: string): Promise<boolean> {
    const heading = this.page.locator(`h3:has-text("${title}")`);
    try {
      await heading.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the search heading text
   */
  async getHeadingText(): Promise<string> {
    const heading = this.page.locator('h3').first();
    return await heading.textContent() || '';
  }

  /**
   * Verify results are displayed
   * Migrated from: verifySearchResults()
   * Original: verifyPresent("imdex.search.results.heading")
   */
  async verifyResultsDisplayed(): Promise<boolean> {
    try {
      await this.resultsHeading.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get results count text
   */
  async getResultsCountText(): Promise<string> {
    return await this.resultsHeading.textContent() || '';
  }

  /**
   * Check if on search results page
   */
  isOnSearchResultsPage(): boolean {
    return this.page.url().includes('/search');
  }

  // ==================== FILTER FUNCTIONALITY ====================

  /**
   * Apply filters to search results
   * Migrated from: theUserAppliesTheFollowingFilters(Object[] filters)
   *
   * Original implementation used complex XPath with dynamic parameters:
   * - imdex.search.lst.filter = xpath=//button[@data-bs-toggle="dropdown"]/preceding-sibling::p[text()="%s"]/following-sibling::button
   * - imdex.search.lst.filter.option = xpath=//button[@data-bs-toggle="dropdown"]//preceding-sibling::p[text()="%s"]/following-sibling::ul//span[text()="%s"]//parent::li
   */
  async applyFilters(filters: FilterOptions): Promise<void> {
    console.log('Applying filters:', filters);

    // Apply "Filter by type" if provided
    if (filters.Type) {
      await this.selectFilter('Filter by type', filters.Type);
    }

    // Apply "Filter by date" if provided
    if (filters.Date) {
      await this.selectFilter('Filter by date', filters.Date);
    }

    // Apply "Sort by" if provided
    if (filters.SortBy) {
      await this.selectFilter('Sort by', filters.SortBy);
    }
  }

  /**
   * Select a specific filter option
   * Migrated from: click() calls with formatted locators
   *
   * Original XPath: //button[@data-bs-toggle="dropdown"]/preceding-sibling::p[text()="%s"]/following-sibling::button
   * Converted to Playwright locator chain for better readability and reliability
   */
  private async selectFilter(filterName: string, optionValue: string): Promise<void> {
    // Find the filter label
    const filterLabel = this.page.locator(`p:has-text("${filterName}")`);

    // Find the dropdown button that is a sibling of the label
    const dropdownButton = filterLabel.locator('~ button[data-bs-toggle="dropdown"]').first();

    // Click to open the dropdown
    // Original: click(String.format(getValue("imdex.search.lst.filter"), filterName))
    await dropdownButton.click();

    // Wait for dropdown menu to appear
    await this.page.waitForTimeout(500);

    // Find and click the option
    // Original: click(String.format(getValue("imdex.search.lst.filter.option"), filterName, optionValue))
    const optionLocator = this.page.locator(`ul.dropdown-menu span:has-text("${optionValue}")`).first();

    try {
      await optionLocator.waitFor({ state: 'visible', timeout: 5000 });
      await optionLocator.click();
    } catch {
      // Alternative approach: try clicking the parent li element
      const altOptionLocator = this.page.locator(`li:has-text("${optionValue}")`).first();
      await altOptionLocator.click();
    }

    // Wait for filter to apply
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get currently selected filter value
   */
  async getSelectedFilterValue(filterName: string): Promise<string> {
    const filterLabel = this.page.locator(`p:has-text("${filterName}")`);
    const dropdownButton = filterLabel.locator('~ button[data-bs-toggle="dropdown"]').first();
    return await dropdownButton.textContent() || '';
  }

  /**
   * Check if filter dropdown is visible
   */
  async isFilterVisible(filterName: string): Promise<boolean> {
    const filterLabel = this.page.locator(`p:has-text("${filterName}")`);
    return await filterLabel.isVisible();
  }

  // ==================== SEARCH RESULTS ====================

  /**
   * Get number of search results displayed
   */
  async getResultsCount(): Promise<number> {
    const resultsText = await this.getResultsCountText();
    const match = resultsText.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Check if search returned any results
   */
  async hasResults(): Promise<boolean> {
    return await this.resultsHeading.isVisible();
  }

  /**
   * Wait for results to update after applying filters
   * Migrated from: QAFTestBase.pause(3000) at end of verifySearchResults()
   */
  async waitForResultsUpdate(): Promise<void> {
    // Using networkidle instead of hard-coded pause
    await this.page.waitForLoadState('networkidle');
  }
}
