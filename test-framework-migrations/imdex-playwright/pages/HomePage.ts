import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home Page Object
 * Migrated from: StepsLibrary.java + imdex.properties (locator repository)
 * Original framework: QAF/Selenium WebDriver
 */
export class HomePage extends BasePage {
  // Page URL
  readonly pageUrl: string = '/';

  // ==================== LOCATORS ====================
  // Migrated from: imdex.properties repository

  // Cookie consent
  // Original: imdex.home.lnk.acceptAllCookies = xpath=//div[@class="action-accept"]//a
  readonly acceptCookiesButton: Locator;

  // Mobile navigation
  // Original: imdex.home.mobile.navigation = id=mobile-navigation
  readonly mobileNavigation: Locator;

  // Desktop search elements
  // Original: imdex.home.btn.searchInput = xpath=//*[@id="search-input"]/span
  readonly searchInputButton: Locator;

  // Original: imdex.home.txt.searchInput = id=searchBox
  readonly searchInputField: Locator;

  // Original: imdex.home.btn.searchSubmit = xpath=//button[@type="submit"]
  readonly searchSubmitButton: Locator;

  // Mobile search elements
  // Original: imdex.mobile.txt.searchInput = xpath=//div[@id="mobile-menu"]//input[@id="searchBox"]
  readonly mobileSearchInput: Locator;

  // Original: imdex.mobile.btn.searchSubmit = xpath=//div[@id="mobile-menu"]//button[@type="submit"]
  readonly mobileSearchSubmit: Locator;

  // ==================== SELF-HEALING DEFINITIONS ====================

  static readonly ELEMENTS = {
    acceptCookiesButton: {
      primary: 'div.action-accept a',
      fallbacks: [
        '[data-test="accept-cookies"]',
        '.cookie-consent button',
        'button:has-text("Accept All")',
        'a:has-text("Accept All")',
        '.action-accept'
      ],
      description: 'Accept All Cookies button',
      originalLocator: 'xpath=//div[@class="action-accept"]//a'
    },
    mobileNavigation: {
      primary: '#mobile-navigation',
      fallbacks: [
        '[data-test="mobile-nav"]',
        '.mobile-nav-toggle',
        'button[aria-label*="menu"]',
        '.hamburger-menu',
        '[aria-expanded][aria-controls*="mobile"]'
      ],
      description: 'Mobile navigation menu toggle',
      originalLocator: 'id=mobile-navigation'
    },
    searchInputButton: {
      primary: '#search-input span',
      fallbacks: [
        '[data-test="search-trigger"]',
        '.search-icon',
        'button[aria-label*="search"]',
        '#search-input',
        '.header-search-trigger'
      ],
      description: 'Search input button/icon',
      originalLocator: 'xpath=//*[@id="search-input"]/span'
    },
    searchInputField: {
      primary: '#searchBox',
      fallbacks: [
        '[data-test="search-input"]',
        'input[type="search"]',
        'input[placeholder*="Search"]',
        'input[name="search"]',
        '.search-input'
      ],
      description: 'Search text input field',
      originalLocator: 'id=searchBox'
    },
    searchSubmitButton: {
      primary: 'button[type="submit"]',
      fallbacks: [
        '[data-test="search-submit"]',
        '.search-submit',
        'button:has-text("Search")',
        'input[type="submit"]',
        '.search-button'
      ],
      description: 'Search submit button',
      originalLocator: 'xpath=//button[@type="submit"]'
    },
    mobileSearchInput: {
      primary: '#mobile-menu #searchBox',
      fallbacks: [
        '#mobile-menu input[type="search"]',
        '.mobile-search-input',
        '#mobile-menu input[placeholder*="Search"]',
        '[data-test="mobile-search-input"]'
      ],
      description: 'Mobile search input field',
      originalLocator: 'xpath=//div[@id="mobile-menu"]//input[@id="searchBox"]'
    },
    mobileSearchSubmit: {
      primary: '#mobile-menu button[type="submit"]',
      fallbacks: [
        '#mobile-menu .search-submit',
        '[data-test="mobile-search-submit"]',
        '#mobile-menu button:has-text("Search")'
      ],
      description: 'Mobile search submit button',
      originalLocator: 'xpath=//div[@id="mobile-menu"]//button[@type="submit"]'
    }
  };

  constructor(page: Page) {
    super(page);

    // Initialize locators - updated based on actual page structure
    this.acceptCookiesButton = page.locator('.cookie-consent .action-accept a, .cookie-consent button.accept, div.action-accept a').first();
    this.mobileNavigation = page.locator('#mobile-navigation');
    this.searchInputButton = page.locator('#search-input'); // Button element, not span
    this.searchInputField = page.locator('#Search-Menu input[type="search"], #searchBox, input[name="q"]').first();
    this.searchSubmitButton = page.locator('#Search-Menu button[type="submit"], button[type="submit"]').first();
    this.mobileSearchInput = page.locator('#mobile-menu #searchBox, #mobile-menu input[type="search"]').first();
    this.mobileSearchSubmit = page.locator('#mobile-menu button[type="submit"]');
  }

  // ==================== NAVIGATION ====================

  /**
   * Navigate to home page
   * Migrated from: navigateToNaturalRetreatPage() - get("/")
   */
  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  // ==================== COOKIE CONSENT ====================

  /**
   * Accept cookie consent
   * Migrated from: acceptAllCookies() - click("imdex.home.lnk.acceptAllCookies")
   */
  async acceptCookies(): Promise<void> {
    try {
      // Wait for cookie modal to appear
      const cookieModal = this.page.locator('.cookie-consent.modal, [id^="CookieConsent"]');
      await cookieModal.waitFor({ state: 'visible', timeout: 10000 });

      // Try multiple selectors for the accept button
      const acceptSelectors = [
        '.cookie-consent .action-accept a',
        '.cookie-consent .action-accept button',
        'div.action-accept a',
        'button:has-text("Accept")',
        'a:has-text("Accept")',
        '.cookie-consent button.btn-primary'
      ];

      for (const selector of acceptSelectors) {
        const btn = this.page.locator(selector).first();
        if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await btn.click();
          console.log(`Cookie accepted using: ${selector}`);
          break;
        }
      }

      // Wait for modal to disappear
      await cookieModal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    } catch {
      // Cookie banner may not appear if already accepted
      console.log('Cookie banner not displayed or already accepted');
    }
  }

  // ==================== SEARCH FUNCTIONALITY ====================

  /**
   * Search for a keyword
   * Migrated from: searchKeyword(String keyword)
   * Handles both desktop and mobile search flows
   */
  async searchKeyword(keyword: string): Promise<void> {
    if (this.isMobileViewport()) {
      await this.searchKeywordMobile(keyword);
    } else {
      await this.searchKeywordDesktop(keyword);
    }
  }

  /**
   * Desktop search flow
   * Migrated from: searchKeyword() desktop branch
   */
  private async searchKeywordDesktop(keyword: string): Promise<void> {
    // Focus on the search input box
    // Original: click("imdex.home.btn.searchInput")
    await this.searchInputButton.click();

    // Wait for search menu to open
    await this.page.locator('#Search-Menu, .search-menu').first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

    // Enter the keyword into the search input field
    // Original: sendKeys(keyword, "imdex.home.txt.searchInput")
    await this.searchInputField.waitFor({ state: 'visible', timeout: 5000 });
    await this.searchInputField.fill(keyword);

    // Submit the search
    // Original: click("imdex.home.btn.searchSubmit")
    await this.searchSubmitButton.click();
  }

  /**
   * Mobile search flow
   * Migrated from: searchKeyword() mobile branch
   */
  private async searchKeywordMobile(keyword: string): Promise<void> {
    // Open the navigation menu
    // Original: click("imdex.home.mobile.navigation")
    await this.mobileNavigation.click();

    // Wait for mobile menu to be visible
    await this.page.locator('#mobile-menu').waitFor({ state: 'visible' });

    // Enter the keyword into the search input field
    // Original: sendKeys(keyword, "imdex.mobile.txt.searchInput")
    await this.mobileSearchInput.fill(keyword);

    // Submit the search using the mobile-specific submit button
    // Original: click("imdex.mobile.btn.searchSubmit")
    await this.mobileSearchSubmit.click();
  }

  // ==================== VERIFICATION ====================

  /**
   * Check if on home page
   */
  async isOnHomePage(): Promise<boolean> {
    return this.page.url().includes('imdex.com') && !this.page.url().includes('/search');
  }

  /**
   * Check if cookie banner is visible
   */
  async isCookieBannerVisible(): Promise<boolean> {
    return await this.acceptCookiesButton.isVisible();
  }
}
