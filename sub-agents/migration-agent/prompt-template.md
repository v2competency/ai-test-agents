# Migration Agent - Prompt Templates

> Ready-to-use prompts for invoking the Migration Agent to convert legacy automation frameworks to Playwright

---

## Quick Start Prompt

```
I have an existing automation project that I need to migrate to Playwright.

Source Project: {PATH_TO_PROJECT}
Framework: {Selenium/Protractor/Cypress/TestCafe/WebDriverIO}
Language: {Java/Python/JavaScript/TypeScript/C#}
Base URL: {APPLICATION_URL}

Please:
1. Analyze the source project structure
2. Show me what will be migrated (pages, tests, data, config)
3. After my confirmation, migrate to a complete Playwright project with self-healing
4. Save to playwright-projects/{AppName}-migrated/
```

---

## Detailed Migration Request

```
CONTEXT:
I have an existing {FRAMEWORK} automation project in {LANGUAGE} that needs to be migrated to Playwright.

SOURCE PROJECT:
- Path: {PROJECT_PATH}
- Framework: {Selenium/Protractor/Cypress/TestCafe/WebDriverIO}
- Language: {Java/Python/JavaScript/TypeScript/C#}
- Test Framework: {TestNG/JUnit/pytest/Mocha/Jasmine}
- Base URL: {APPLICATION_URL}

REQUIREMENTS:
1. Analyze existing project structure and identify all components
2. Migrate all Page Object classes to TypeScript
3. Convert locators to Playwright format with modern selector strategies
4. Extract test data to JSON format
5. Transform test specifications to Playwright tests
6. Include 4-tier self-healing framework (Cache → Fallbacks → AI Visual → AI DOM)
7. Generate comprehensive migration documentation

OUTPUT:
- Complete Playwright project in: playwright-projects/{AppName}-migrated/
- Migration report with locator mappings
- Project should be ready to run with: npm install && npm test

PREFERENCES:
- TypeScript strict mode: Yes
- Include original locators in comments: Yes
- Self-healing enabled: Yes
- Generate migration report: Yes
```

---

## Framework-Specific Prompts

### Java Selenium with TestNG Migration

```
I need to migrate a Java Selenium TestNG project to Playwright.

Source Project: {PATH}
Structure:
- Page Objects: src/main/java/pages/*.java (with @FindBy annotations)
- Tests: src/test/java/tests/*.java (TestNG @Test, @DataProvider)
- Config: src/test/resources/config.properties
- Test Data: src/test/resources/testdata/*.xlsx

Base URL: {URL}

Please migrate:
1. All Page Objects with @FindBy → Playwright locators with fallbacks
2. All TestNG tests → Playwright test format
3. @DataProvider → JSON test data
4. WebDriverWait patterns → Playwright auto-wait
5. config.properties → .env.example + playwright.config.ts

Include self-healing framework and migration traceability.
```

### Python Selenium with pytest Migration

```
I need to migrate a Python Selenium pytest project to Playwright TypeScript.

Source Project: {PATH}
Structure:
- Page Objects: pages/*.py (with locator tuples and By.* selectors)
- Tests: tests/test_*.py (pytest fixtures, @pytest.mark.parametrize)
- Config: pytest.ini, conftest.py
- Test Data: data/test_data.json

Base URL: {URL}

Please migrate:
1. Python Page Objects → TypeScript classes
2. Locator tuples (By.ID, "x") → page.locator('#x')
3. pytest tests → Playwright tests
4. @pytest.fixture → test.beforeEach/test.afterEach
5. @pytest.mark.parametrize → JSON data + for loops

Include fallback selectors and self-healing.
```

### Protractor (Angular) Migration

```
I need to migrate a Protractor project to Playwright.

Source Project: {PATH}
Structure:
- Page Objects: e2e/page-objects/*.po.ts
- Tests: e2e/specs/*.e2e-spec.ts
- Config: protractor.conf.js

Base URL: {URL}

Please migrate:
1. element(by.css/by.id) → page.locator()
2. element(by.model) → [ng-model] or modern selector
3. element(by.binding) → data binding alternative
4. browser.wait(EC.*) → Playwright auto-wait
5. Jasmine expect() → Playwright expect()

Handle Angular-specific locators with appropriate alternatives.
```

### Cypress Migration

```
I need to migrate a Cypress project to Playwright.

Source Project: {PATH}
Structure:
- Tests: cypress/e2e/*.cy.js
- Custom Commands: cypress/support/commands.js
- Fixtures: cypress/fixtures/*.json
- Config: cypress.config.js

Base URL: {URL}

Please migrate:
1. cy.get() → page.locator()
2. cy.contains() → page.getByText() or :has-text()
3. .should('be.visible') → expect().toBeVisible()
4. Custom commands → utility functions or fixtures
5. cy.intercept() → page.route()
6. fixtures → data/*.json

Preserve the JSON fixtures structure where possible.
```

### WebDriverIO Migration

```
I need to migrate a WebDriverIO project to Playwright.

Source Project: {PATH}
Structure:
- Page Objects: pageobjects/*.js (ES6 classes with getters)
- Tests: test/specs/*.spec.js
- Config: wdio.conf.js

Base URL: {URL}

Please migrate:
1. $() / $$() → page.locator()
2. browser.* commands → page.* equivalents
3. element getters → Playwright locator properties
4. waitUntil() → waitFor() or auto-wait
5. Mocha hooks → Playwright hooks

The project uses async/await, which should map well to Playwright.
```

---

## Analyze Before Migration

```
Before migrating any code, please analyze and show me:

Source Project: {PATH}
Framework: {FRAMEWORK}
Language: {LANGUAGE}

Analysis Required:
1. Project structure overview
2. List all Page Object files found
3. List all test specification files found
4. Test data sources identified (Excel, CSV, JSON, inline)
5. Configuration files found
6. Utility/helper classes identified
7. Framework-specific patterns detected:
   - Locator strategies used (count by type)
   - Wait strategies identified
   - Assertion patterns
   - Data parameterization approach
8. Complexity assessment per component (simple/medium/complex)
9. Potential migration issues or manual review areas
10. Files that will be generated

Wait for my approval before proceeding with migration.
```

---

## Migrate Specific Components

### Page Objects Only

```
Migrate only Page Objects from: {PROJECT_PATH}

Source: {LANGUAGE} {FRAMEWORK}
Output: playwright-projects/{AppName}-migrated/pages/

For each Page Object:
1. Convert class to TypeScript
2. Map all locators to Playwright format
3. Generate 5+ fallback selectors per element
4. Transform methods to async/await
5. Add TypeScript types
6. Document original locators in comments
7. Create element registry entries

Skip test specifications for now - I'll handle those separately.
```

### Test Specifications Only

```
I already have migrated Page Objects at: playwright-projects/{AppName}-migrated/pages/

Now migrate only test specifications from: {SOURCE_PROJECT}/tests/

Source Framework: {TestNG/JUnit/pytest/Mocha}

For each test file:
1. Convert to Playwright test format
2. Map hooks (Before/After)
3. Transform assertions to expect()
4. Convert data providers to JSON + loops
5. Preserve test names and groups
6. Import from existing Page Objects

Output: playwright-projects/{AppName}-migrated/tests/
```

### Test Data Only

```
Extract and convert test data from: {PROJECT_PATH}

Source formats:
- Excel files: {paths}
- CSV files: {paths}
- Properties files: {paths}
- DataProviders: {class names}
- Inline test data in tests

Convert to JSON format with:
- Metadata (source, migration date)
- validScenarios array
- invalidScenarios array
- boundaryTests array
- securityTests array
- Original test IDs preserved

Output: playwright-projects/{AppName}-migrated/data/
```

### Configuration Only

```
Migrate configuration from: {PROJECT_PATH}

Source files:
- {config.properties / yaml / json}
- {testng.xml / pytest.ini / wdio.conf.js}

Generate:
1. playwright.config.ts with:
   - Base URL
   - Browser configuration
   - Timeout settings
   - Reporter configuration
2. tsconfig.json for strict TypeScript
3. package.json with all dependencies
4. .env.example with environment variables
5. .gitignore for reports and artifacts

Map original configuration values to Playwright equivalents.
```

---

## Module-by-Module Migration

```
Migrate one module at a time from: {PROJECT_PATH}

Current module to migrate: {MODULE_NAME}
(e.g., Authentication, Registration, Dashboard, Cart, Checkout)

Related source files:
- Page Objects: {list files}
- Tests: {list files}
- Test Data: {list data sources}

Generate:
1. pages/{ModuleName}Page.ts
2. tests/{moduleName}.spec.ts
3. data/{moduleName}Data.json
4. Element definitions in ElementRegistry.ts (append)

After this module is complete and verified, I'll request the next module.
```

---

## With Custom Options

### Full Self-Healing (Recommended)

```
Migrate with full AI-powered self-healing capabilities.

Source: {PROJECT_PATH}
Framework: {FRAMEWORK}

Options:
- Self-healing: Full 4-tier (Cache → Fallbacks → AI Visual → AI DOM)
- AI Observer: Enabled (requires ANTHROPIC_API_KEY)
- Healing reports: Yes
- Fallback selectors: 5+ per element
- Original locator tracking: Yes

Generate robust Page Objects with complete self-healing capabilities.
```

### Without AI Healing (Fallbacks Only)

```
Migrate with fallback-only self-healing (no AI required).

Source: {PROJECT_PATH}
Framework: {FRAMEWORK}

Options:
- Self-healing: 2-tier only (Cache → Fallbacks)
- AI Observer: Disabled (no API key required)
- Standard Playwright locators with fallbacks
- Still track original locators

Good for teams that don't have Anthropic API access.
```

### Multi-Browser Support

```
Migrate with multi-browser support.

Source: {PROJECT_PATH}
Framework: {FRAMEWORK}

Configure for browsers:
- Chromium (Chrome, Edge)
- Firefox
- WebKit (Safari)

Update playwright.config.ts projects array accordingly.
Include cross-browser considerations in migration.
```

### CI/CD Ready

```
Migrate with CI/CD ready configuration.

Source: {PROJECT_PATH}
Framework: {FRAMEWORK}

Include:
- GitHub Actions workflow file
- Environment-specific configs (dev, staging, prod)
- Parallel test execution setup
- Report artifacts configuration
- Docker configuration (optional)

Output should be ready for immediate CI integration.
```

---

## Update Existing Migration

### Add Missing Tests

```
The migration at playwright-projects/{AppName}-migrated/ was completed.

New tests have been added to the source project:
- {list new test files or classes}

Please:
1. Analyze the new tests
2. Update existing Page Objects if new elements needed
3. Add new test data to existing JSON files
4. Create new test specs
5. Preserve existing migrated code

Do not regenerate already-migrated components.
```

### Fix Migrated Locators

```
Some migrated locators aren't working.

Page: {PageName}Page.ts
Issue: {element} locator not finding element

Original Selenium locator: {original}
Migrated Playwright locator: {migrated}

Actual element HTML:
```html
{paste_actual_html}
```

Please:
1. Analyze why the migration didn't work
2. Update the primary selector
3. Generate new fallback selectors based on actual HTML
4. Update element registry
```

### Refactor Page Object

```
Please refactor {PageName}Page.ts at: playwright-projects/{AppName}-migrated/pages/

Changes needed:
- Add method for {new_action}
- Add locator for {new_element}
- Update element definitions
- Improve error handling in {method_name}
- Add more fallback selectors for {element}
```

---

## Migration Report Request

```
Generate a comprehensive migration report for: playwright-projects/{AppName}-migrated/

Include:
1. Migration summary (source vs target comparison)
2. Component inventory (pages, tests, data files)
3. Locator statistics:
   - Count by strategy (ID, CSS, XPath)
   - Upgraded locators count
   - Complex locators requiring review
4. Test coverage comparison
5. API mapping reference used
6. Known issues or limitations
7. Recommendations for manual review
8. Next steps for the team

Save report to: migration-docs/migration-report.txt
```

---

## Example Complete Interaction

### User Request

```
I have a Java Selenium TestNG project that needs migrating to Playwright.

Source: D:/projects/my-selenium-tests
Base URL: https://myapp.example.com

The project has:
- 5 Page Object classes
- 3 test classes with about 50 tests total
- Excel test data files
- config.properties for settings

Please analyze and migrate everything.
```

### Agent Response (Analysis)

```
## Migration Analysis Summary

### Source Project Overview
- **Path**: D:/projects/my-selenium-tests
- **Framework**: Java Selenium with TestNG
- **Language**: Java

### Components Identified

#### Page Objects (5 files)
| File | Elements | Methods | Complexity |
|------|----------|---------|------------|
| LoginPage.java | 4 | 5 | Simple |
| RegistrationPage.java | 8 | 7 | Simple |
| DashboardPage.java | 12 | 10 | Medium |
| ProfilePage.java | 6 | 8 | Simple |
| SettingsPage.java | 15 | 12 | Medium |

#### Test Specifications (3 files)
| File | Test Count | DataProviders | Groups |
|------|------------|---------------|--------|
| LoginTests.java | 15 | 2 | smoke, regression |
| RegistrationTests.java | 20 | 3 | regression |
| ProfileTests.java | 15 | 2 | regression |

#### Test Data Sources
- testdata/login_data.xlsx (2 sheets)
- testdata/registration_data.xlsx (3 sheets)
- Inline DataProviders in test classes

#### Configuration
- config.properties (base URL, timeouts, credentials)

### Locator Analysis
| Strategy | Count | Upgrade Plan |
|----------|-------|--------------|
| By.id | 23 | → CSS ID selectors |
| By.xpath | 12 | → CSS where possible, flag complex ones |
| By.cssSelector | 8 | → Pass-through |
| By.name | 5 | → Attribute selectors |

### Migration Plan

**Files to Generate:**
```
playwright-projects/MyApp-migrated/
├── pages/
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── RegistrationPage.ts
│   ├── DashboardPage.ts
│   ├── ProfilePage.ts
│   └── SettingsPage.ts
├── tests/
│   ├── login.spec.ts
│   ├── registration.spec.ts
│   └── profile.spec.ts
├── data/
│   ├── loginData.json
│   ├── registrationData.json
│   └── profileData.json
├── utils/
│   ├── SelfHealingLocator.ts
│   ├── AIObserver.ts
│   ├── HealingReporter.ts
│   └── ElementRegistry.ts
├── migration-docs/
│   ├── migration-report.txt
│   └── locator-mappings.json
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── .env.example
└── README.md
```

### Potential Issues
1. **Complex XPath**: 3 locators need manual review
2. **Excel Data**: Will be converted to JSON (verify data accuracy)
3. **Custom Waits**: 2 custom wait conditions need adaptation

**Proceed with migration?**
```

### After Confirmation

```
✅ Migration completed successfully!

Location: playwright-projects/MyApp-migrated/

## Quick Start

```bash
cd playwright-projects/MyApp-migrated
npm install
npx playwright install
cp .env.example .env  # Configure your settings
npm test
```

## Migration Results

| Component | Source | Migrated | Coverage |
|-----------|--------|----------|----------|
| Page Objects | 5 | 5 | 100% |
| Test Specs | 3 | 3 | 100% |
| Test Cases | 50 | 50 | 100% |
| Data Files | 2 Excel | 3 JSON | 100% |

## Locator Statistics
- Total migrated: 48
- ID → CSS: 23
- XPath → CSS: 9
- XPath (kept): 3 (flagged for review)
- CSS pass-through: 8
- Name → Attribute: 5

## Self-Healing
- Elements with fallbacks: 48
- Average fallbacks per element: 5
- AI Observer: Configured (needs API key)

## Documentation Generated
- migration-docs/migration-report.txt - Full migration details
- migration-docs/locator-mappings.json - Old → New mapping

## Next Steps
1. Configure .env with your settings
2. Review flagged XPath locators in migration report
3. Run `npm test` to verify migration (normal mode)
4. Run `npm run test:healing` to run tests with AI Observer self-healing
5. Run `npm run test:healing:demo` to see AI healing with broken selectors
```

---

## Running Tests in Different Modes

### Normal Mode (Standard Page Object Tests)
```
Run the migrated tests in normal mode - standard Playwright execution without AI healing.
This is the default for CI/CD pipelines.

cd playwright-projects/{AppName}-migrated
npm test                    # All normal tests
npm run test:headed         # With browser visible
npm run test:chrome         # Chrome only
```

### Self-Healing Mode (AI Observer Tests)
```
Run the migrated tests with AI Observer self-healing enabled.
Each test uses SelfHealingLocator + ElementRegistry for every element interaction.
Generates healing reports showing which selectors needed healing.

cd playwright-projects/{AppName}-migrated
npm run test:healing        # All healing-mode tests
npm run test:healing:headed # With browser visible
```

### Self-Healing Demo (Broken Selector Demo)
```
Run the self-healing demonstration with deliberately broken selectors.
Shows the 4-tier healing pipeline in action:
  Tier 1: Cache → Tier 2: Fallbacks → Tier 3: AI Visual → Tier 4: AI DOM

cd playwright-projects/{AppName}-migrated
npm run test:healing:demo   # Headed mode, shows AI healing live
```

### Run All Tests (Both Modes)
```
Run both normal and self-healing test suites together.

cd playwright-projects/{AppName}-migrated
npm run test:all            # Everything
```

---

## Tips for Best Results

1. **Provide accurate source info** - Framework and language detection helps choose right patterns
2. **Include project structure** - Helps identify all components to migrate
3. **Specify base URL** - Used in configuration and navigation
4. **Review analysis first** - Verify all components identified before migration
5. **Migrate incrementally** - For large projects, migrate module by module
6. **Configure API key** - Set `ANTHROPIC_API_KEY` in .env for AI-powered self-healing (Tier 3 & 4)
7. **Run normal tests first** - Verify with `npm test` that basic migration is correct
8. **Then run healing tests** - Use `npm run test:healing` to validate self-healing pipeline
9. **Review migration report** - Check flagged items and recommendations
10. **Update real credentials** - Replace placeholder values in .env
11. **Verify data accuracy** - Especially for Excel → JSON conversions
12. **Use rich element descriptions** - In ElementRegistry, describe elements with location context for better AI healing
