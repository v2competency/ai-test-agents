/**
 * Element Definitions for Self-Healing
 * Migrated from: imdex.properties (QAF Object Repository)
 * Original framework: QAF / Healenium integration
 *
 * Each element has:
 * - primary: The main selector to use
 * - fallbacks: Alternative selectors for self-healing
 * - description: Human-readable description for AI healing
 * - originalLocator: The original Selenium/QAF locator for reference
 */

export interface ElementDefinition {
  primary: string;
  fallbacks: string[];
  description: string;
  originalLocator?: string;
}

export interface PageElements {
  [key: string]: ElementDefinition;
}

// ============================================================================
// HOME PAGE ELEMENTS
// Migrated from: imdex.properties locators starting with "imdex.home.*"
// ============================================================================

export const HOME_ELEMENTS: PageElements = {
  acceptCookiesButton: {
    primary: '.cookie-consent .action-accept a',
    fallbacks: [
      '.cookie-consent .action-accept button',
      'div.action-accept a',
      '[data-test="accept-cookies"]',
      '.cookie-consent button',
      'button:has-text("Accept")',
      'a:has-text("Accept")',
      '.action-accept',
      '#onetrust-accept-btn-handler',
      '.cookie-banner button.accept'
    ],
    description: 'Accept All Cookies button on the cookie consent banner',
    originalLocator: 'xpath=//div[@class="action-accept"]//a'
  },

  mobileNavigation: {
    primary: '#mobile-navigation',
    fallbacks: [
      '[data-test="mobile-nav"]',
      '.mobile-nav-toggle',
      'button[aria-label*="menu"]',
      '.hamburger-menu',
      '[aria-expanded][aria-controls*="mobile"]',
      '.mobile-menu-toggle',
      '#nav-toggle'
    ],
    description: 'Mobile navigation hamburger menu toggle button',
    originalLocator: 'id=mobile-navigation'
  },

  searchInputButton: {
    primary: '#search-input',
    fallbacks: [
      '#search-input span',
      '[data-test="search-trigger"]',
      '.search-icon',
      'button[aria-label*="search"]',
      '.header-search-trigger',
      '.search-toggle',
      'button.header__search'
    ],
    description: 'Search icon/button that opens the search input field',
    originalLocator: 'xpath=//*[@id="search-input"]/span'
  },

  searchInputField: {
    primary: '#Search-Menu input[type="search"]',
    fallbacks: [
      '#searchBox',
      '[data-test="search-input"]',
      'input[type="search"]',
      'input[placeholder*="Search"]',
      'input[name="search"]',
      'input[name="q"]',
      '.search-input'
    ],
    description: 'Search text input field where users type their search query',
    originalLocator: 'id=searchBox'
  },

  searchSubmitButton: {
    primary: 'button[type="submit"]',
    fallbacks: [
      '[data-test="search-submit"]',
      '.search-submit',
      'button:has-text("Search")',
      'input[type="submit"]',
      '.search-button',
      'button[aria-label*="search"]',
      '.btn-search'
    ],
    description: 'Search submit button to execute the search',
    originalLocator: 'xpath=//button[@type="submit"]'
  },

  mobileSearchInput: {
    primary: '#mobile-menu #searchBox',
    fallbacks: [
      '#mobile-menu input[type="search"]',
      '.mobile-search-input',
      '#mobile-menu input[placeholder*="Search"]',
      '[data-test="mobile-search-input"]',
      '.mobile-menu input.search'
    ],
    description: 'Search input field in the mobile navigation menu',
    originalLocator: 'xpath=//div[@id="mobile-menu"]//input[@id="searchBox"]'
  },

  mobileSearchSubmit: {
    primary: '#mobile-menu button[type="submit"]',
    fallbacks: [
      '#mobile-menu .search-submit',
      '[data-test="mobile-search-submit"]',
      '#mobile-menu button:has-text("Search")',
      '.mobile-menu .search-button'
    ],
    description: 'Search submit button in the mobile navigation menu',
    originalLocator: 'xpath=//div[@id="mobile-menu"]//button[@type="submit"]'
  }
};

// ============================================================================
// SEARCH RESULTS PAGE ELEMENTS
// Migrated from: imdex.properties locators starting with "imdex.search.*"
// ============================================================================

export const SEARCH_RESULTS_ELEMENTS: PageElements = {
  searchHeading: {
    primary: 'h3',
    fallbacks: [
      '[data-test="search-heading"]',
      '.search-heading h3',
      '.search-results h3',
      'h2.search-title',
      '.page-heading'
    ],
    description: 'Search results page heading (e.g., "Refine your search")',
    originalLocator: 'xpath=//h3[text()="%s"]'
  },

  filterDropdownByType: {
    primary: 'p:has-text("Filter by type") ~ button[data-bs-toggle="dropdown"]',
    fallbacks: [
      '[data-test="filter-type-dropdown"]',
      '.filter-type button.dropdown-toggle',
      'select[name="type"]',
      '#type-filter'
    ],
    description: 'Filter by type dropdown selector',
    originalLocator: 'xpath=//button[@data-bs-toggle="dropdown"]/preceding-sibling::p[text()="Filter by type"]/following-sibling::button'
  },

  filterDropdownByDate: {
    primary: 'p:has-text("Filter by date") ~ button[data-bs-toggle="dropdown"]',
    fallbacks: [
      '[data-test="filter-date-dropdown"]',
      '.filter-date button.dropdown-toggle',
      'select[name="date"]',
      '#date-filter'
    ],
    description: 'Filter by date dropdown selector',
    originalLocator: 'xpath=//button[@data-bs-toggle="dropdown"]/preceding-sibling::p[text()="Filter by date"]/following-sibling::button'
  },

  filterDropdownSortBy: {
    primary: 'p:has-text("Sort by") ~ button[data-bs-toggle="dropdown"]',
    fallbacks: [
      '[data-test="sort-dropdown"]',
      '.sort-by button.dropdown-toggle',
      'select[name="sort"]',
      '#sort-filter'
    ],
    description: 'Sort by dropdown selector',
    originalLocator: 'xpath=//button[@data-bs-toggle="dropdown"]/preceding-sibling::p[text()="Sort by"]/following-sibling::button'
  },

  filterOption: {
    primary: 'ul.dropdown-menu span',
    fallbacks: [
      '[data-test="filter-option"]',
      '.dropdown-item',
      'ul.dropdown-menu li',
      '.filter-option'
    ],
    description: 'Filter option item in dropdown menu',
    originalLocator: 'xpath=//ul//span[text()="%s"]//parent::li'
  },

  resultsHeading: {
    primary: 'div.search-results__header span',
    fallbacks: [
      '[data-test="results-count"]',
      '.results-summary',
      '.search-results-header span',
      '.results-header',
      '.search-count',
      '.total-results'
    ],
    description: 'Search results header showing the count of results',
    originalLocator: 'xpath=//div[@class="search-results__header"]/span'
  },

  searchResultItem: {
    primary: '.search-result-item',
    fallbacks: [
      '[data-test="search-result"]',
      '.result-item',
      '.search-results li',
      'article.result'
    ],
    description: 'Individual search result item in the results list'
  },

  noResultsMessage: {
    primary: '.no-results',
    fallbacks: [
      '[data-test="no-results"]',
      '.empty-results',
      ':has-text("No results")',
      '.search-empty'
    ],
    description: 'Message displayed when no search results are found'
  }
};

// ============================================================================
// ALL ELEMENTS COMBINED
// ============================================================================

export const ALL_ELEMENTS: PageElements = {
  ...HOME_ELEMENTS,
  ...SEARCH_RESULTS_ELEMENTS
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get element definition by key
 */
export function getElementDefinition(key: string): ElementDefinition | undefined {
  return ALL_ELEMENTS[key];
}

/**
 * Get all selectors for an element (primary + fallbacks)
 */
export function getAllSelectors(key: string): string[] {
  const element = ALL_ELEMENTS[key];
  if (!element) return [];
  return [element.primary, ...element.fallbacks];
}

/**
 * Generate fallback selectors for a custom element
 * Migrated from: HealeniumListener healing logic
 */
export function generateFallbacks(
  elementName: string,
  primarySelector: string,
  elementType: 'button' | 'input' | 'link' | 'generic' = 'generic'
): string[] {
  const fallbacks: string[] = [];

  // Add data-test attribute
  fallbacks.push(`[data-test="${elementName}"]`);
  fallbacks.push(`[data-testid="${elementName}"]`);

  // Type-specific fallbacks
  switch (elementType) {
    case 'button':
      fallbacks.push(`button:has-text("${elementName.replace(/([A-Z])/g, ' $1').trim()}")`);
      fallbacks.push(`.btn-${elementName.toLowerCase()}`);
      break;
    case 'input':
      const fieldName = elementName.replace(/Input|Field/i, '').toLowerCase();
      fallbacks.push(`[name="${fieldName}"]`);
      fallbacks.push(`input[placeholder*="${fieldName}" i]`);
      break;
    case 'link':
      fallbacks.push(`a:has-text("${elementName.replace(/([A-Z])/g, ' $1').trim()}")`);
      break;
    default:
      fallbacks.push(`.${elementName.toLowerCase()}`);
      fallbacks.push(`#${elementName}`);
  }

  return fallbacks;
}
