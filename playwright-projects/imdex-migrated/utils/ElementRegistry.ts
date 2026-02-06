/**
 * Element Definition Interface
 */
export interface ElementDefinition {
  name: string;
  description: string;
  primary: string;
  fallbacks: string[];
  type: 'input' | 'button' | 'link' | 'text' | 'container';
  originalLocator?: string;  // Original Selenium/QAF locator for traceability
}

/**
 * Element Registry
 * Centralized element definitions with fallback selectors
 *
 * Migrated from: resources/repository/imdex.properties
 * Original format: QAF property-based locators
 *
 * Each element includes:
 * - Primary selector (migrated from QAF)
 * - 5+ fallback selectors for self-healing
 * - Description for AI healing
 * - Original Selenium locator for traceability
 */
export const ELEMENT_REGISTRY: Record<string, Record<string, ElementDefinition>> = {

  // ============================================================================
  // HOME PAGE ELEMENTS
  // Migrated from: imdex.properties (imdex.home.*)
  // ============================================================================

  home: {
    acceptCookiesButton: {
      name: 'acceptCookiesButton',
      description: 'Accept cookies button/link in cookie consent banner',
      primary: '.action-accept a',
      fallbacks: [
        'div.action-accept a',
        '[class*="action-accept"] a',
        'a:has-text("Accept")',
        'button:has-text("Accept All")',
        '[data-test="accept-cookies"]',
        '.cookie-consent a'
      ],
      type: 'link',
      originalLocator: 'xpath=//div[@class="action-accept"]//a'
    },

    searchInputButton: {
      name: 'searchInputButton',
      description: 'Search input trigger button/icon to focus search box',
      primary: '#search-input span',
      fallbacks: [
        '[id="search-input"] span',
        '#search-input > span',
        '.search-input span',
        '[data-test="search-trigger"]',
        'button[aria-label*="search" i]',
        '.search-icon'
      ],
      type: 'button',
      originalLocator: 'xpath=//*[@id="search-input"]/span'
    },

    searchInput: {
      name: 'searchInput',
      description: 'Main search text input field',
      primary: '#searchBox',
      fallbacks: [
        'input#searchBox',
        '[id="searchBox"]',
        'input[name="search"]',
        'input[placeholder*="search" i]',
        '[data-test="search-input"]',
        'input[type="search"]'
      ],
      type: 'input',
      originalLocator: 'id=searchBox'
    },

    searchSubmitButton: {
      name: 'searchSubmitButton',
      description: 'Search submit button',
      primary: 'form button[type="submit"]',
      fallbacks: [
        'button[type="submit"]',
        '.search-form button',
        'button:has-text("Search")',
        '[data-test="search-submit"]',
        'input[type="submit"]',
        '.search-btn'
      ],
      type: 'button',
      originalLocator: 'xpath=//button[@type="submit"]'
    },

    // Mobile-specific elements
    mobileNavigation: {
      name: 'mobileNavigation',
      description: 'Mobile navigation menu toggle button',
      primary: '#mobile-navigation',
      fallbacks: [
        '[id="mobile-navigation"]',
        '.mobile-navigation',
        '[data-test="mobile-nav"]',
        'button[aria-label*="menu" i]',
        '.hamburger-menu',
        '.nav-toggle'
      ],
      type: 'button',
      originalLocator: 'id=mobile-navigation'
    },

    mobileSearchInput: {
      name: 'mobileSearchInput',
      description: 'Search input field in mobile menu',
      primary: '#mobile-menu #searchBox',
      fallbacks: [
        'div#mobile-menu input#searchBox',
        '#mobile-menu input[name="search"]',
        '.mobile-menu #searchBox',
        '[data-test="mobile-search-input"]',
        '#mobile-menu input[type="search"]'
      ],
      type: 'input',
      originalLocator: 'xpath=//div[@id="mobile-menu"]//input[@id="searchBox"]'
    },

    mobileSearchSubmit: {
      name: 'mobileSearchSubmit',
      description: 'Search submit button in mobile menu',
      primary: '#mobile-menu button[type="submit"]',
      fallbacks: [
        'div#mobile-menu button[type="submit"]',
        '#mobile-menu .search-submit',
        '#mobile-menu button:has-text("Search")',
        '[data-test="mobile-search-submit"]'
      ],
      type: 'button',
      originalLocator: 'xpath=//div[@id="mobile-menu"]//button[@type="submit"]'
    }
  },

  // ============================================================================
  // SEARCH RESULTS PAGE ELEMENTS
  // Migrated from: imdex.properties (imdex.search.*)
  // ============================================================================

  searchResults: {
    resultsHeading: {
      name: 'resultsHeading',
      description: 'Search results header showing result count',
      primary: '.search-results__header span',
      fallbacks: [
        'div.search-results__header span',
        '[class*="search-results"] .header span',
        '.search-results span',
        '[data-test="results-heading"]',
        '.results-count'
      ],
      type: 'text',
      originalLocator: 'xpath=//div[@class="search-results__header"]/span'
    },

    refineHeading: {
      name: 'refineHeading',
      description: 'Refine your search heading',
      primary: 'h3:has-text("Refine your search")',
      fallbacks: [
        'h3:text("Refine your search")',
        '.refine-heading',
        '[data-test="refine-heading"]',
        'h3.search-heading'
      ],
      type: 'text',
      originalLocator: 'xpath=//h3[text()="Refine your search"]'
    },

    filterDropdown: {
      name: 'filterDropdown',
      description: 'Filter dropdown toggle button',
      primary: 'button[data-bs-toggle="dropdown"]',
      fallbacks: [
        '.dropdown-toggle',
        'button.dropdown',
        '[data-test="filter-dropdown"]',
        '.filter-btn'
      ],
      type: 'button',
      originalLocator: 'xpath=//button[@data-bs-toggle="dropdown"]'
    }
  }
};

/**
 * Get element definition by page and element name
 */
export function getElement(page: string, elementName: string): ElementDefinition | undefined {
  return ELEMENT_REGISTRY[page]?.[elementName];
}

/**
 * Get all elements for a page
 */
export function getPageElements(page: string): Record<string, ElementDefinition> | undefined {
  return ELEMENT_REGISTRY[page];
}

/**
 * List all registered elements
 */
export function listAllElements(): { page: string; element: string; description: string }[] {
  const elements: { page: string; element: string; description: string }[] = [];

  for (const [pageName, pageElements] of Object.entries(ELEMENT_REGISTRY)) {
    for (const [elementName, elementDef] of Object.entries(pageElements)) {
      elements.push({
        page: pageName,
        element: elementName,
        description: elementDef.description
      });
    }
  }

  return elements;
}
