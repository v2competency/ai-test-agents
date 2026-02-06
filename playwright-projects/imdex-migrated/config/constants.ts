/**
 * Application Constants
 * Migrated from: QAF application.properties + config files
 */

/**
 * Application URLs
 */
export const URLS = {
  BASE: process.env.BASE_URL || 'https://www.imdex.com',
  SEARCH: '/search',
} as const;

/**
 * Timeout values in milliseconds
 * Migrated from: selenium.wait.timeout=60000
 */
export const TIMEOUTS = {
  /** Navigation timeout */
  NAVIGATION: 60000,
  /** Action timeout (click, fill, etc.) */
  ACTION: 30000,
  /** Expect/assertion timeout */
  EXPECT: 10000,
  /** Spinner/loader wait timeout */
  SPINNER: 30000,
  /** Short wait for quick operations */
  SHORT: 5000,
} as const;

/**
 * Test data categories
 */
export const TEST_CATEGORIES = {
  SMOKE: 'smoke',
  REGRESSION: 'regression',
  SANITY: 'sanity',
} as const;

/**
 * Platform identifiers
 * Used for platform-aware element selection
 */
export const PLATFORMS = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
} as const;

/**
 * Browser identifiers
 */
export const BROWSERS = {
  CHROMIUM: 'chromium',
  FIREFOX: 'firefox',
  WEBKIT: 'webkit',
} as const;

/**
 * Self-healing configuration
 */
export const HEALING_CONFIG = {
  /** Enable healing cache */
  CACHE_ENABLED: true,
  /** Maximum fallback attempts before AI healing */
  MAX_FALLBACK_ATTEMPTS: 5,
  /** Enable AI Visual healing (requires API key) */
  AI_VISUAL_ENABLED: true,
  /** Enable AI DOM healing (requires API key) */
  AI_DOM_ENABLED: true,
  /** Save healing reports */
  SAVE_REPORTS: true,
  /** Healing report directory */
  REPORT_DIR: 'reports/healing',
} as const;

/**
 * AI Observer configuration
 */
export const AI_CONFIG = {
  /** Anthropic API model */
  MODEL: 'claude-sonnet-4-20250514',
  /** Maximum tokens for API response */
  MAX_TOKENS: 1024,
  /** Temperature for API response */
  TEMPERATURE: 0,
} as const;

/**
 * Filter options for search results
 * Extracted from original test scenarios
 */
export const FILTER_OPTIONS = {
  TYPE: ['Product', 'Solution', 'Content'] as const,
  DATE: ['Last Year', 'All Time', 'Last Month'] as const,
  SORT_BY: ['Newest', 'Oldest', 'Relevance'] as const,
} as const;

/**
 * Expected text values for assertions
 */
export const EXPECTED_TEXT = {
  REFINE_HEADING: 'Refine your search',
} as const;
