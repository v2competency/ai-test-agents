# IMDEX Playwright Automation Framework

> Migrated from QAF (QMetry Automation Framework) / Selenium WebDriver

## Overview

This Playwright automation framework was migrated from the original Java-based QAF/Selenium framework. The migration follows the guidelines in the [Migration Guardrail](../guardrails/migration-guardrail.md).

### Migration Summary

| Aspect | Original | Migrated |
|--------|----------|----------|
| Framework | QAF (QMetry Automation Framework) | Playwright |
| Language | Java 1.8 | TypeScript |
| Test Runner | TestNG (via BDDTestFactory2) | Playwright Test |
| BDD Support | Gherkin Feature Files | Playwright describe/test blocks |
| Page Objects | Object Repository (Properties) | TypeScript Classes |
| Self-Healing | Healenium (EPAM) | AI-powered (Anthropic Claude) |
| Browser Management | WebDriverManager | Playwright (built-in) |

## Project Structure

```
imdex-playwright/
├── pages/                    # Page Object Model classes
│   ├── BasePage.ts          # Base page with common utilities
│   ├── HomePage.ts          # Home page (search, cookies)
│   └── SearchResultsPage.ts # Search results (filters, results)
├── tests/                    # Test specifications
│   ├── imdex.spec.ts        # Main test suite
│   └── self-healing.spec.ts # Self-healing demonstration
├── data/                     # Test data (JSON)
│   └── imdexData.json       # Migrated from keywords.json + feature
├── utils/                    # Utility classes
│   ├── SelfHealingLocator.ts # Self-healing locator utility
│   └── AIObserver.ts        # AI-powered element finder
├── config/                   # Configuration
│   └── elements.ts          # Element definitions with fallbacks
├── reports/                  # Test reports (generated)
├── playwright.config.ts     # Playwright configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── .env.example             # Environment variables template
└── migration-report.txt     # Detailed migration report
```

## Quick Start

### 1. Install Dependencies

```bash
cd imdex-playwright
npm install
```

### 2. Install Browsers

```bash
npx playwright install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run with browser visible
npm run test:headed

# Run desktop tests only
npm run test:desktop

# Run mobile tests only
npm run test:mobile

# Run smoke tests
npm run test:smoke

# Debug mode
npm run test:debug

# UI mode (interactive)
npm run test:ui
```

### 5. View Report

```bash
npm run report
```

## Test Scenarios

### Migrated from `imdex.feature`

| Original Scenario | Migrated Test ID | Description |
|-------------------|------------------|-------------|
| Validate Search and Filter Functionality | TC_SEARCH_001 | Basic search with Product filter |
| Data Driven (keyword-1) | TC_SEARCH_002 | Search "mining" with Solution filter |
| Data Driven (keyword-2) | TC_SEARCH_003 | Search "fluids optimisation" with Solution filter |
| Data Provider (keyword-1) | TC_SEARCH_004 | Search "mining" with Content filter |
| Data Provider (keyword-2) | TC_SEARCH_005 | Search "fluids optimisation" with Content filter |

## Platform Support

### Desktop (default)
- Chrome (Desktop)
- Full viewport (1920x1080)

### Mobile
- Pixel 7 emulation
- Mobile-specific search flow

Run specific platform:
```bash
npm run test:desktop
npm run test:mobile
npm run test:all-platforms
```

## Self-Healing Feature

The framework includes AI-powered self-healing capabilities that replace the original Healenium integration.

### How It Works

1. **Primary Selector**: Tries the main CSS selector
2. **Cache Check**: Uses previously healed selector if available
3. **Fallback Selectors**: Tries alternative selectors defined in `config/elements.ts`
4. **AI Healing**: Uses Anthropic Claude to analyze the page and suggest a selector

### Enable AI Healing

```bash
# In .env file
ENABLE_SELF_HEALING=true
ENABLE_AI_OBSERVER=true
ANTHROPIC_API_KEY=your-api-key-here
```

### View Healing Report

Healing statistics are printed after each test. Example:

```
======================================================================
SELF-HEALING LOCATOR REPORT
======================================================================

STATISTICS:
----------------------------------------------------------------------
Total Locate Attempts: 5
Primary Success: 3
Healed (Cache): 1
Healed (Fallback): 1
Healed (AI): 0
Failed: 0

Healing Success Rate: 40.0%
```

## Locator Migration

### Original QAF Repository (imdex.properties)

```properties
imdex.home.lnk.acceptAllCookies = xpath=//div[@class="action-accept"]//a
imdex.home.txt.searchInput = id=searchBox
imdex.search.lst.filter = xpath=//button[@data-bs-toggle="dropdown"]/...
```

### Migrated Playwright (elements.ts)

```typescript
acceptCookiesButton: {
  primary: 'div.action-accept a',
  fallbacks: [
    '[data-test="accept-cookies"]',
    'button:has-text("Accept All")',
    '.cookie-consent button'
  ],
  description: 'Accept All Cookies button'
}
```

## Configuration

### Playwright Config (`playwright.config.ts`)

Key settings migrated from `application.properties`:

| Original | Playwright |
|----------|------------|
| `env.baseurl` | `use.baseURL` |
| `selenium.wait.timeout` | `use.actionTimeout` |
| `platform = mobile` | `projects[].use.devices` |
| `selenium.success.screenshots` | `use.screenshot` |

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | Application URL | https://www.imdex.com |
| `HEADLESS` | Run without browser UI | false |
| `ENABLE_SELF_HEALING` | Enable self-healing | true |
| `ENABLE_AI_OBSERVER` | Enable AI healing | false |
| `ANTHROPIC_API_KEY` | API key for AI healing | - |

## Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:headed` | Run with browser visible |
| `npm run test:debug` | Run in debug mode |
| `npm run test:ui` | Interactive UI mode |
| `npm run test:desktop` | Desktop browser tests |
| `npm run test:mobile` | Mobile emulation tests |
| `npm run test:smoke` | Run @smoke tagged tests |
| `npm run report` | View HTML report |
| `npm run codegen` | Record new tests |
| `npm run clean` | Clean reports/artifacts |

## Comparison: Before vs After

### Test Execution

| Aspect | QAF/Selenium | Playwright |
|--------|--------------|------------|
| Startup | WebDriverManager setup | Instant (built-in) |
| Parallel | TestNG XML config | Built-in, automatic |
| Speed | ~10s per test | ~3s per test |
| Flakiness | Common (timing) | Rare (auto-wait) |

### Code Example

**Original (Java/QAF)**
```java
@QAFTestStep(description = "the user searches for {keyword}")
public static void searchKeyword(String keyword) {
    click("imdex.home.btn.searchInput");
    sendKeys(keyword, "imdex.home.txt.searchInput");
    click("imdex.home.btn.searchSubmit");
}
```

**Migrated (TypeScript/Playwright)**
```typescript
async searchKeyword(keyword: string): Promise<void> {
  await this.searchInputButton.click();
  await this.searchInputField.fill(keyword);
  await this.searchSubmitButton.click();
}
```

## Migration Notes

See [migration-report.txt](./migration-report.txt) for detailed migration documentation including:
- Full locator mapping table
- Wait strategy changes
- Configuration migration details
- Self-healing setup

## Troubleshooting

### Common Issues

1. **Tests timeout on cookie banner**
   - Cookie may already be accepted
   - Check if banner appears in headed mode

2. **Mobile tests fail**
   - Ensure running with `--project=mobile-pixel7`
   - Mobile navigation may differ

3. **Self-healing not working**
   - Check `ENABLE_SELF_HEALING=true` in .env
   - For AI healing, ensure `ANTHROPIC_API_KEY` is set

### Debug Tips

```bash
# Run single test with tracing
npx playwright test --trace on -g "TC_SEARCH_001"

# Open trace viewer
npx playwright show-trace reports/test-artifacts/trace.zip

# Generate selectors interactively
npx playwright codegen https://www.imdex.com
```

## License

ISC

---

*Migrated on 2025-12-17 from QAF/Selenium to Playwright*
