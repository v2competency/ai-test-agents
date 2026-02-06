import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home Page Object
 * Migrated from: QAF StepsLibrary.java (navigateToNaturalRetreatPage, acceptAllCookies, searchKeyword)
 * Original framework: QAF with Selenium
 */
export class HomePage extends BasePage {
  readonly pageUrl: string = '/';

  // ==================== LOCATORS ====================
  // Migrated from: resources/repository/imdex.properties

  // Cookie consent - Original: xpath=//div[@class="action-accept"]//a
  readonly acceptCookiesButton: Locator;

  // Desktop search elements
  readonly searchInputButton: Locator;    // Original: xpath=//*[@id="search-input"]/span
  readonly searchInput: Locator;          // Original: id=searchBox
  readonly searchSubmitButton: Locator;   // Original: xpath=//button[@type="submit"]

  // Mobile navigation and search elements
  readonly mobileNavigation: Locator;     // Original: id=mobile-navigation
  readonly mobileSearchInput: Locator;    // Original: xpath=//div[@id="mobile-menu"]//input[@id="searchBox"]
  readonly mobileSearchSubmit: Locator;   // Original: xpath=//div[@id="mobile-menu"]//button[@type="submit"]

  // ==================== SELF-HEALING DEFINITIONS ====================

  static readonly ELEMENTS = {
    acceptCookiesButton: {
      primary: '.action-accept a',
      fallbacks: [
        'div.action-accept a',
        '[class*="action-accept"] a',
        'a:has-text("Accept")',
        'button:has-text("Accept")',
        '[data-test="accept-cookies"]'
      ],
      description: 'Accept cookies button/link',
      originalLocator: 'xpath=//div[@class="action-accept"]//a'
    },
    searchInputButton: {
      primary: '#search-input span',
      fallbacks: [
        '[id="search-input"] span',
        '#search-input > span',
        '.search-input span',
        '[data-test="search-trigger"]'
      ],
      description: 'Search input trigger button',
      originalLocator: 'xpath=//*[@id="search-input"]/span'
    },
    searchInput: {
      primary: '#searchBox',
      fallbacks: [
        'input#searchBox',
        '[id="searchBox"]',
        'input[name="search"]',
        'input[placeholder*="search" i]',
        '[data-test="search-input"]'
      ],
      description: 'Search text input field',
      originalLocator: 'id=searchBox'
    },
    searchSubmitButton: {
      primary: 'button[type="submit"]',
      fallbacks: [
        'form button[type="submit"]',
        '.search-form button',
        'button:has-text("Search")',
        '[data-test="search-submit"]'
      ],
      description: 'Search submit button',
      originalLocator: 'xpath=//button[@type="submit"]'
    },
    mobileNavigation: {
      primary: '#mobile-navigation',
      fallbacks: [
        '[id="mobile-navigation"]',
        '.mobile-navigation',
        '[data-test="mobile-nav"]',
        'button[aria-label*="menu" i]'
      ],
      description: 'Mobile navigation menu toggle',
      originalLocator: 'id=mobile-navigation'
    },
    mobileSearchInput: {
      primary: '#mobile-menu #searchBox',
      fallbacks: [
        'div#mobile-menu input#searchBox',
        '#mobile-menu input[name="search"]',
        '.mobile-menu #searchBox',
        '[data-test="mobile-search-input"]'
      ],
      description: 'Mobile search input field',
      originalLocator: 'xpath=//div[@id="mobile-menu"]//input[@id="searchBox"]'
    },
    mobileSearchSubmit: {
      primary: '#mobile-menu button[type="submit"]',
      fallbacks: [
        'div#mobile-menu button[type="submit"]',
        '#mobile-menu .search-submit',
        '#mobile-menu button:has-text("Search")',
        '[data-test="mobile-search-submit"]'
      ],
      description: 'Mobile search submit button',
      originalLocator: 'xpath=//div[@id="mobile-menu"]//button[@type="submit"]'
    }
  };

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.acceptCookiesButton = page.locator('.action-accept a');
    this.searchInputButton = page.locator('#search-input span');
    this.searchInput = page.locator('#searchBox');
    this.searchSubmitButton = page.locator('form button[type="submit"]').first();
    this.mobileNavigation = page.locator('#mobile-navigation');
    this.mobileSearchInput = page.locator('#mobile-menu #searchBox');
    this.mobileSearchSubmit = page.locator('#mobile-menu button[type="submit"]');
  }

  // ==================== NAVIGATION ====================
  // Migrated from: navigateToNaturalRetreatPage()

  /**
   * Navigate to the Imdex application home page
   * Original: get("/")
   */
  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  // ==================== ACTIONS ====================

  /**
   * Accept the cookie consent
   * Migrated from: acceptAllCookies()
   * Original: click("imdex.home.lnk.acceptAllCookies")
   */
  async acceptCookies(): Promise<void> {
    try {
      // Wait for cookie banner with shorter timeout
      await this.acceptCookiesButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.acceptCookiesButton.click();
      // Wait for cookie banner to disappear
      await this.acceptCookiesButton.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    } catch {
      // Cookie banner may not appear if already accepted
      console.log('[HomePage] Cookie banner not displayed or already accepted');
    }
  }

  /**
   * Search for a keyword - platform aware
   * Migrated from: searchKeyword(String keyword)
   * Original: Conditional logic based on getValue("platform")
   */
  async search(keyword: string): Promise<void> {
    if (this.isMobile()) {
      await this.searchMobile(keyword);
    } else {
      await this.searchDesktop(keyword);
    }
  }

  /**
   * Desktop search flow
   * Migrated from: desktop branch of searchKeyword()
   */
  async searchDesktop(keyword: string): Promise<void> {
    // Focus on the search input box
    // Original: click("imdex.home.btn.searchInput")
    await this.searchInputButton.click();

    // Enter the keyword
    // Original: sendKeys(keyword, "imdex.home.txt.searchInput")
    await this.searchInput.waitFor({ state: 'visible' });
    await this.searchInput.fill(keyword);

    // Submit the search
    // Original: click("imdex.home.btn.searchSubmit")
    await this.searchSubmitButton.click();

    await this.waitForPageLoad();
  }

  /**
   * Mobile search flow
   * Migrated from: mobile branch of searchKeyword()
   */
  async searchMobile(keyword: string): Promise<void> {
    // Open mobile navigation
    // Original: click("imdex.home.mobile.navigation")
    await this.mobileNavigation.click();

    // Wait for mobile menu to open
    await this.page.locator('#mobile-menu').waitFor({ state: 'visible' });

    // Enter the keyword
    // Original: sendKeys(keyword, "imdex.mobile.txt.searchInput")
    await this.mobileSearchInput.fill(keyword);

    // Submit the search
    // Original: click("imdex.mobile.btn.searchSubmit")
    await this.mobileSearchSubmit.click();

    await this.waitForPageLoad();
  }

  // ==================== VERIFICATION ====================

  /**
   * Check if on home page
   */
  async isOnHomePage(): Promise<boolean> {
    const url = this.page.url();
    return url.endsWith('/') || url.includes('imdex.com');
  }

  /**
   * Check if search input is visible
   */
  async isSearchAvailable(): Promise<boolean> {
    if (this.isMobile()) {
      return await this.mobileNavigation.isVisible();
    }
    return await this.searchInputButton.isVisible();
  }
}
