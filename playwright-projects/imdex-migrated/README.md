# Imdex Playwright Test Automation

> Migrated from QAF (QMetry Automation Framework) with Selenium (Java)

## Overview

This project contains end-to-end tests for the Imdex website, migrated from a legacy QAF/Selenium framework to modern Playwright with TypeScript.

### Migration Highlights

| Aspect | Before (QAF) | After (Playwright) |
|--------|--------------|-------------------|
| Language | Java | TypeScript |
| Framework | Selenium + QAF | Playwright |
| BDD | Gherkin feature files | Data-driven specs |
| Locators | Property-based (XPath) | CSS + fallbacks |
| Self-Healing | Healenium | 4-tier AI Observer |
| Wait Strategy | Explicit waits + pause() | Auto-wait |

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Configure environment
cp .env.example .env
# Edit .env with your settings (optional: add ANTHROPIC_API_KEY for AI healing)

# Run tests
npm test
```

## Project Structure

```
imdex-migrated/
├── pages/                    # Page Object classes
│   ├── BasePage.ts          # Common page methods
│   ├── HomePage.ts          # Home page with search
│   └── SearchResultsPage.ts # Search results with filters
├── tests/                    # Test specifications
│   └── search.spec.ts       # Data-driven search tests
├── data/                     # Test data (JSON)
│   └── searchData.json      # Search keywords and filter data
├── utils/                    # Utilities
│   ├── SelfHealingLocator.ts # 4-tier self-healing engine
│   ├── AIObserver.ts         # Claude Vision API integration
│   ├── HealingReporter.ts    # Healing statistics
│   └── ElementRegistry.ts    # Element definitions
├── config/                   # Configuration
│   └── constants.ts         # App constants
├── migration-docs/           # Migration documentation
│   └── migration-report.txt # Detailed migration report
├── reports/                  # Test reports (generated)
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
├── .env.example             # Environment template
└── README.md                # This file
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:headed` | Run tests with browser visible |
| `npm run test:debug` | Debug tests with Playwright Inspector |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:desktop` | Run only desktop Chrome tests |
| `npm run test:mobile` | Run only mobile Chrome tests |
| `npm run test:all-browsers` | Run on Chrome, Firefox, Safari |
| `npm run report` | Open HTML report |
| `npm run codegen` | Launch Playwright code generator |

## Test Scenarios

### Search Tests (Migrated from imdex.feature)

1. **Basic Search** - Search with keyword and verify results
2. **Data-Driven Search** - Search with multiple keywords from JSON data
3. **Filter Functionality** - Apply filters and verify results update

### Original BDD Scenarios

```gherkin
# Scenario 1: Validate Search and Filter Functionality
Given the user navigates to 'Natural Retreat' page
And accepts all cookies
When the user searches for 'mining'
Then the search result page should display heading 'Refine your search'
When the user applies filters: Type=Product, Date=Last Year, SortBy=Newest
Then the search results should be updated

# Scenario 2: Data Driven with inline examples
# Same as above with: mining, fluids optimisation

# Scenario 3: Data Provider from JSON
# Same as above with external data provider
```

## Self-Healing Framework

The project includes a 4-tier self-healing mechanism:

### Tier 1: Cache
Previously healed selectors are cached and tried first.

### Tier 2: Fallbacks
Each element has 5+ fallback selectors:
```typescript
{
  primary: '#searchBox',
  fallbacks: [
    'input#searchBox',
    '[id="searchBox"]',
    'input[name="search"]',
    'input[placeholder*="search" i]',
    '[data-test="search-input"]'
  ]
}
```

### Tier 3: AI Visual (requires API key)
Uses Claude Vision API to analyze screenshots and find elements.

### Tier 4: AI DOM (requires API key)
Uses Claude to analyze DOM structure and generate new selectors.

## Configuration

### Environment Variables

```bash
# Required
BASE_URL=https://www.imdex.com

# Optional - for AI healing
ANTHROPIC_API_KEY=your_key_here
AI_HEALING_ENABLED=true
```

### Browser Projects

| Project | Viewport | Use Case |
|---------|----------|----------|
| desktop-chrome | 1920x1080 | Primary desktop testing |
| desktop-firefox | 1920x1080 | Cross-browser |
| desktop-safari | 1920x1080 | Cross-browser |
| mobile-chrome | Pixel 5 | Mobile Android |
| mobile-safari | iPhone 12 | Mobile iOS |

## Locator Migration

| Original (QAF) | Migrated (Playwright) |
|----------------|----------------------|
| `xpath=//div[@class="action-accept"]//a` | `.action-accept a` |
| `id=searchBox` | `#searchBox` |
| `xpath=//*[@id="search-input"]/span` | `#search-input span` |
| `xpath=//button[@type="submit"]` | `button[type="submit"]` |

See [migration-report.txt](migration-docs/migration-report.txt) for complete mapping.

## Platform Support

The tests support both desktop and mobile viewports with platform-aware element selection:

```typescript
// Automatic platform detection
if (this.isMobile()) {
  await this.searchMobile(keyword);
} else {
  await this.searchDesktop(keyword);
}
```

## Reports

After running tests, reports are generated in `reports/`:

- **HTML Report**: `reports/playwright-report/index.html`
- **JSON Results**: `reports/test-results.json`
- **JUnit XML**: `reports/junit-results.xml`
- **Healing Report**: `reports/healing/` (if healing occurred)

## Migration Notes

### What Changed

1. **Language**: Java → TypeScript
2. **Locators**: XPath-heavy → CSS-first with fallbacks
3. **Waits**: Explicit waits removed (Playwright auto-waits)
4. **Data**: Property files → JSON
5. **Self-Healing**: Healenium → AI Observer

### What Was Preserved

1. Test coverage and scenarios
2. Element naming conventions
3. Page Object pattern
4. Data-driven approach
5. Original locators (in comments for traceability)

## Troubleshooting

### Tests Failing on Element Not Found

1. Check if the website structure changed
2. Review fallback selectors in ElementRegistry
3. Enable AI healing with `ANTHROPIC_API_KEY`
4. Run in headed mode to debug: `npm run test:headed`

### Mobile Tests Failing

1. Verify mobile-specific elements in HomePage
2. Check mobile viewport settings in playwright.config.ts
3. Run with mobile project: `npm run test:mobile`

## Contributing

1. Follow existing Page Object patterns
2. Add fallback selectors for new elements
3. Update ElementRegistry for new pages
4. Run tests before committing

---

*Migrated with AI-powered Migration Agent*
