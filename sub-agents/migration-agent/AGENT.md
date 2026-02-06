# Migration Agent

> A specialized sub-agent for migrating legacy automation frameworks (Selenium, Protractor, Cypress, etc.) to modern Playwright with AI-powered self-healing capabilities.

---

## Agent Overview

### Purpose
This sub-agent is responsible for:
1. Analyzing existing legacy automation frameworks (Selenium, Protractor, Cypress, TestCafe, etc.)
2. Generating comprehensive migration analysis reports
3. Converting Page Objects from Java/Python/JavaScript/C# to TypeScript
4. Migrating test data structures to JSON format
5. Transforming test specifications to Playwright test format
6. Adding AI-powered self-healing capabilities to migrated tests
7. Outputting a production-ready, self-healing Playwright project

### Key Features
- **Multi-Framework Support**: Migrates from Selenium (Java/Python/JS/C#), Protractor, Cypress, TestCafe, WebDriverIO
- **Intelligent Code Analysis**: Parses and understands legacy patterns, locators, and test structures
- **API Mapping**: Automatically maps legacy APIs to Playwright equivalents
- **Locator Upgrade**: Converts XPath/CSS to modern role-based and test-id selectors
- **4-Tier Self-Healing**: Cache → Fallbacks → AI Visual → AI DOM analysis
- **AI Observer Integration**: Claude Vision API for intelligent element detection
- **Migration Traceability**: Documents original → migrated mappings

### Agent Role in Pipeline
```
[Legacy Framework] → [Migration Agent] → [Playwright Project]
                           ↑
                     (This Agent)
                           ↓
          [Analysis Report + Self-Healing Framework + Migration Docs]
```

### Migration Benefits
| Aspect | Before (Selenium) | After (Playwright) |
|--------|-------------------|-------------------|
| Execution Speed | Slower | 3x faster |
| Browser Support | Manual WebDriver management | Auto-managed browsers |
| Waiting | Explicit/Implicit waits | Auto-wait built-in |
| Flakiness | High | Low |
| Parallel Execution | Complex setup | Built-in |
| Debugging | Limited | Trace viewer, inspector |
| API Testing | Separate tool needed | Built-in |
| Mobile Viewports | Manual configuration | Device profiles |

---

## Agent Capabilities

### 1. Source Framework Analysis
- Analyze existing project structure and identify framework type
- Catalog all Page Object classes/files
- Identify test specification files and framework (TestNG, JUnit, pytest, Mocha, etc.)
- Document locator strategies used (By.id, By.xpath, By.cssSelector)
- Analyze wait strategies (implicit, explicit, fluent)
- Identify assertion patterns and data providers
- Map dependencies and third-party libraries

### 2. Page Object Migration
- Convert Page Object classes to TypeScript
- Map all locators to Playwright Locator API
- Transform methods to async/await pattern
- Add proper TypeScript types (no `any`)
- Generate fallback selectors for self-healing
- Preserve method names and logical structure
- Document original locators in comments

### 3. Test Data Migration
- Extract test data from DataProviders, parametrize decorators, fixtures
- Convert Excel/CSV/Properties files to JSON
- Organize by test category (valid, invalid, boundary, security)
- Include expected results and error messages
- Maintain original test IDs for traceability

### 4. Test Specification Migration
- Convert test classes/files to Playwright test format
- Map test framework hooks (Before/After → beforeEach/afterEach)
- Transform assertions to expect() API
- Implement data-driven test loops
- Preserve test names, groups, and tags
- Add healing report generation

### 5. Self-Healing Framework Generation
- Generate `SelfHealingLocator.ts` with 4-tier healing strategy
- Create `AIObserver.ts` for Claude Vision API integration
- Implement `HealingReporter.ts` for healing analytics
- Generate `ElementRegistry.ts` with original locator mappings
- Track healing statistics and generate reports

### 6. Migration Documentation
- Generate comprehensive migration report (TXT)
- Document locator mappings (old → new)
- Create API mapping reference
- List complex locators requiring manual review
- Provide troubleshooting guidance

---

## Input Requirements

### Required Inputs

| Input | Description | Format |
|-------|-------------|--------|
| **Source Project Path** | Path to existing automation project | Directory path |
| **Source Framework** | Current framework (Selenium, Protractor, Cypress, etc.) | String |
| **Source Language** | Current language (Java, Python, JavaScript, C#) | String |
| **Base URL** | Application URL for automation | URL string |

### Optional Inputs

| Input | Description | Default |
|-------|-------------|---------|
| Application Name | Name of the application under test | Extracted from project |
| Output Directory | Where to generate project | `playwright-projects/{AppName}-migrated/` |
| Priority Modules | Which modules to migrate first | All modules |
| Enable Self-Healing | Include AI Observer healing | `true` |
| Preserve Comments | Keep original code in comments | `true` |

### Supported Source Frameworks

| Framework | Languages | Patterns Recognized |
|-----------|-----------|-------------------|
| **Selenium WebDriver** | Java, Python, JavaScript, C# | @FindBy, PageFactory, WebDriverWait |
| **Protractor** | TypeScript, JavaScript | element(), by.css, by.model, by.binding |
| **Cypress** | JavaScript, TypeScript | cy.get(), cy.contains(), custom commands |
| **TestCafe** | JavaScript, TypeScript | Selector(), t.click(), t.typeText() |
| **WebDriverIO** | JavaScript, TypeScript | $(), $$(), browser.* commands |

---

## Output Specifications

### Generated Project Structure

```
playwright-projects/{AppName}-migrated/
│
├── pages/                              # Migrated Page Object Model classes
│   ├── BasePage.ts                     # Base class with common methods
│   ├── {PageName}Page.ts               # Migrated page classes
│   └── components/                     # Reusable components
│       └── {ComponentName}Component.ts
│
├── tests/                              # Migrated test specification files
│   ├── {module}.spec.ts                # Normal mode: standard Page Object tests
│   ├── {module}-healing.spec.ts        # Healing mode: same tests using SelfHealingLocator
│   ├── {module}-validation.spec.ts     # Validation tests
│   ├── e2e/                            # End-to-end tests
│   │   └── {flow}.e2e.spec.ts
│   └── self-healing-demo.spec.ts       # Self-healing demonstration with broken selectors
│
├── data/                               # Migrated test data (JSON)
│   ├── {module}Data.json               # Module test data
│   ├── users.json                      # Test user credentials
│   └── securityPayloads.json           # Security test payloads
│
├── utils/                              # Framework utilities
│   ├── SelfHealingLocator.ts           # Core 4-tier self-healing engine
│   ├── AIObserver.ts                   # Claude Vision API integration
│   ├── HealingReporter.ts              # Healing statistics & reports
│   ├── ElementRegistry.ts              # Element definitions with fallbacks
│   ├── RetryHandler.ts                 # Smart retry with backoff
│   └── TestHelpers.ts                  # Common utilities
│
├── config/                             # Configuration
│   ├── environments.ts                 # Environment configs
│   └── constants.ts                    # App constants
│
├── migration-docs/                     # Migration documentation
│   ├── migration-report.txt            # Comprehensive migration report
│   ├── locator-mappings.json           # Old → New locator mappings
│   └── api-mappings.md                 # Selenium → Playwright API reference
│
├── reports/                            # Generated reports (gitignored)
│   ├── playwright-report/
│   ├── healing/
│   └── test-artifacts/
│
├── playwright.config.ts                # Playwright configuration
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # Dependencies & scripts
├── .env.example                        # Environment template
├── .gitignore                          # Git ignore rules
└── README.md                           # Project documentation
```

### Migration Report Output
```
================================================================================
                     FRAMEWORK MIGRATION REPORT
================================================================================
Project: {PROJECT_NAME}
Migration Date: {DATE}
Source Framework: {SOURCE_FRAMEWORK} ({SOURCE_LANGUAGE})
Target Framework: Playwright (TypeScript)

================================================================================
                          SOURCE ANALYSIS
================================================================================

PROJECT STRUCTURE:
- Page Objects Found: {COUNT}
- Test Specifications Found: {COUNT}
- Test Data Files Found: {COUNT}
- Utility Classes Found: {COUNT}
- Configuration Files Found: {COUNT}

FRAMEWORK PATTERNS DETECTED:
- Test Framework: {TestNG/JUnit/pytest/Mocha/etc.}
- Page Object Pattern: {@FindBy/locators dict/getters}
- Locator Strategy: {ID/CSS/XPath percentages}
- Wait Strategy: {Implicit/Explicit/Fluent}
- Assertion Library: {Assert/Hamcrest/Chai/etc.}

================================================================================
                          MIGRATION SUMMARY
================================================================================

MIGRATION RESULTS:
- Page Objects Migrated: {COUNT}/{TOTAL} ({PERCENT}%)
- Tests Migrated: {COUNT}/{TOTAL} ({PERCENT}%)
- Data Files Created: {COUNT}
- Locators Upgraded: {COUNT}

LOCATOR STATISTICS:
| Strategy | Source Count | Migrated | Upgraded |
|----------|--------------|----------|----------|
| ID       | {COUNT}      | {COUNT}  | {COUNT}  |
| CSS      | {COUNT}      | {COUNT}  | {COUNT}  |
| XPath    | {COUNT}      | {COUNT}  | {COUNT}  |
| Name     | {COUNT}      | {COUNT}  | {COUNT}  |
| Role     | 0            | {COUNT}  | N/A      |
| TestID   | 0            | {COUNT}  | N/A      |

================================================================================
                     COMPLEX LOCATORS (Review Required)
================================================================================
{List of XPath locators that couldn't be auto-converted}

================================================================================
                          IMPROVEMENT HIGHLIGHTS
================================================================================

1. EXECUTION SPEED: Expected 3x faster due to Playwright optimizations
2. RELIABILITY: Auto-wait eliminates flakiness from timing issues
3. DEBUGGING: Trace viewer, inspector, and codegen tools added
4. SELF-HEALING: AI-powered locator healing implemented
5. PARALLEL EXECUTION: Built-in parallelization
6. CROSS-BROWSER: Easy multi-browser testing with device emulation

================================================================================
```

---

## Agent Workflow

### Phase 1: Source Project Analysis
```
Input: Source project path, framework type, language

Process:
1. Scan project structure
2. Identify all source files by category:
   - Page Objects (classes with @FindBy, locators, element getters)
   - Test Specifications (classes with @Test, test(), describe())
   - Test Data (Excel, CSV, JSON, Properties, inline data)
   - Configuration (properties, yaml, json config files)
   - Utilities (helper classes, custom extensions)
3. Analyze patterns:
   - Locator strategies used
   - Wait strategies implemented
   - Assertion patterns
   - Data parameterization approach
4. Generate complexity assessment

Output: Source analysis summary
```

### Phase 2: Present Migration Plan
```
Input: Source analysis

Process:
1. List files to be migrated
2. Identify potential issues
3. Estimate migration complexity
4. Propose file structure

Output: Migration plan for user approval
```

### Phase 3: Migrate Page Objects
```
Input: Source Page Object files

Process:
1. Parse class structure
2. Extract all locators and map to Playwright format
3. Convert methods to async/await
4. Add TypeScript types
5. Generate fallback selectors
6. Create element registry entries

Output: pages/*.ts files
```

### Phase 4: Migrate Test Data
```
Input: Source test data (Excel, CSV, Properties, inline)

Process:
1. Extract data from source format
2. Categorize by test type
3. Create JSON structure with metadata
4. Include original test IDs

Output: data/*.json files
```

### Phase 5: Migrate Test Specifications
```
Input: Source test files, migrated Page Objects, migrated data

Process:
1. Convert test class structure
2. Map hooks (Before/After)
3. Transform assertions
4. Implement data-driven loops
5. Preserve test names and tags

Output: tests/*.spec.ts files
```

### Phase 6: Generate Framework Infrastructure
```
Process:
1. Generate playwright.config.ts
2. Generate tsconfig.json
3. Generate package.json with dependencies
4. Generate self-healing utilities
5. Generate .env.example
6. Generate migration documentation
7. Generate README.md

Output: Configuration and utility files
```

---

## Selenium to Playwright Mapping

### Locator Strategy Mapping

| Selenium | Playwright | Notes |
|----------|------------|-------|
| `By.id("x")` | `page.locator('#x')` | Direct CSS ID |
| `By.name("x")` | `page.locator('[name="x"]')` | Attribute selector |
| `By.className("x")` | `page.locator('.x')` | CSS class |
| `By.tagName("x")` | `page.locator('x')` | Tag name |
| `By.linkText("x")` | `page.getByRole('link', { name: 'x' })` | Prefer role-based |
| `By.partialLinkText("x")` | `page.getByRole('link', { name: /x/i })` | Regex match |
| `By.cssSelector("x")` | `page.locator('x')` | Direct pass-through |
| `By.xpath("//x")` | `page.locator('//x')` | Works but prefer CSS |

### Element Interaction Mapping

| Selenium | Playwright | Notes |
|----------|------------|-------|
| `element.click()` | `await locator.click()` | Auto-waits |
| `element.sendKeys("text")` | `await locator.fill("text")` | Clears first |
| `element.clear()` | `await locator.clear()` | Clear input |
| `element.getText()` | `await locator.textContent()` | Get text |
| `element.getAttribute("x")` | `await locator.getAttribute("x")` | Get attribute |
| `element.isDisplayed()` | `await locator.isVisible()` | Visibility check |
| `element.isEnabled()` | `await locator.isEnabled()` | Enabled check |
| `Select().selectByVisibleText("x")` | `await locator.selectOption("x")` | Dropdown |

### Wait Mapping

| Selenium | Playwright | Notes |
|----------|------------|-------|
| `WebDriverWait.until(visibilityOf)` | `await locator.waitFor({ state: 'visible' })` | Explicit visibility |
| `WebDriverWait.until(clickable)` | `await locator.click()` | Auto-waits for clickable |
| `WebDriverWait.until(presenceOf)` | `await locator.waitFor({ state: 'attached' })` | DOM presence |
| `Thread.sleep(1000)` | `await page.waitForTimeout(1000)` | Avoid when possible |
| Implicit Wait | N/A - use auto-wait | Not needed |

### Assertion Mapping

| TestNG/JUnit | Playwright expect() | Notes |
|--------------|---------------------|-------|
| `Assert.assertEquals(a, b)` | `expect(a).toBe(b)` | Exact equality |
| `Assert.assertTrue(x)` | `expect(x).toBe(true)` | Boolean true |
| `Assert.assertFalse(x)` | `expect(x).toBe(false)` | Boolean false |
| `Assert.assertNotNull(x)` | `expect(x).toBeDefined()` | Not null/undefined |
| `Assert.assertContains(a, b)` | `expect(a).toContain(b)` | Contains |

### Test Hook Mapping

| TestNG/JUnit | Playwright | Notes |
|--------------|------------|-------|
| `@BeforeClass` | `test.beforeAll()` | Run once before all |
| `@BeforeMethod` | `test.beforeEach()` | Run before each test |
| `@AfterMethod` | `test.afterEach()` | Run after each test |
| `@AfterClass` | `test.afterAll()` | Run once after all |
| `@DataProvider` | JSON + for loop | External data file |
| `@Test(groups="smoke")` | `test().tag("@smoke")` | Test tagging |

---

## Code Templates

### Page Object Migration Template

**Source (Java Selenium):**
```java
public class LoginPage {
    private WebDriver driver;

    @FindBy(id = "username")
    private WebElement usernameInput;

    @FindBy(id = "password")
    private WebElement passwordInput;

    @FindBy(css = "button[type='submit']")
    private WebElement loginButton;

    public void login(String username, String password) {
        usernameInput.sendKeys(username);
        passwordInput.sendKeys(password);
        loginButton.click();
    }
}
```

**Target (Playwright TypeScript):**
```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly pageUrl: string = '/login';

  // Locators - Migrated from @FindBy annotations
  readonly usernameInput: Locator;  // Original: @FindBy(id = "username")
  readonly passwordInput: Locator;  // Original: @FindBy(id = "password")
  readonly loginButton: Locator;    // Original: @FindBy(css = "button[type='submit']")
  readonly errorMessage: Locator;

  // Element definitions for self-healing
  static readonly ELEMENTS = {
    usernameInput: {
      primary: '#username',
      fallbacks: [
        '[data-test="username"]',
        'input[name="username"]',
        'input[placeholder*="username" i]',
        'input[type="text"]:first-of-type'
      ],
      description: 'Username input field',
      originalLocator: '@FindBy(id = "username")'
    },
    passwordInput: {
      primary: '#password',
      fallbacks: [
        '[data-test="password"]',
        'input[name="password"]',
        'input[type="password"]'
      ],
      description: 'Password input field',
      originalLocator: '@FindBy(id = "password")'
    },
    loginButton: {
      primary: 'button[type="submit"]',
      fallbacks: [
        '[data-test="login-button"]',
        '#login-button',
        'button:has-text("Login")',
        'button:has-text("Sign in")'
      ],
      description: 'Login submit button',
      originalLocator: '@FindBy(css = "button[type=\'submit\']")'
    }
  };

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message, [data-test="error"], [role="alert"]');
  }

  // Navigation
  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  // Actions - Migrated from original methods
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  // Original method preserved: login(String, String)
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  // Verification methods
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent() || '';
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}
```

### Test Data Migration Template

**Source (Java DataProvider):**
```java
@DataProvider(name = "validLogins")
public Object[][] getValidLogins() {
    return new Object[][] {
        {"standard_user", "secret_sauce", "Products"},
        {"problem_user", "secret_sauce", "Products"},
    };
}
```

**Target (JSON):**
```json
{
  "_metadata": {
    "module": "Authentication",
    "migratedFrom": "LoginTests.java - @DataProvider(validLogins)",
    "migratedDate": "{DATE}",
    "originalTestCount": 2
  },

  "validScenarios": [
    {
      "testId": "TC_AUTH_001",
      "description": "Login with standard user",
      "username": "standard_user",
      "password": "secret_sauce",
      "expectedResult": "success",
      "expectedPage": "Products",
      "originalTestId": "validLogins[0]"
    },
    {
      "testId": "TC_AUTH_002",
      "description": "Login with problem user",
      "username": "problem_user",
      "password": "secret_sauce",
      "expectedResult": "success",
      "expectedPage": "Products",
      "originalTestId": "validLogins[1]"
    }
  ]
}
```

### Test Specification Migration Template

**Source (Java TestNG):**
```java
@Test(dataProvider = "validLogins")
public void testValidLogin(String username, String password, String expectedPage) {
    loginPage.login(username, password);
    Assert.assertTrue(productsPage.isOnProductsPage());
    Assert.assertEquals(productsPage.getPageTitle(), expectedPage);
}
```

**Target (Playwright):**
```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import loginData from '../data/authData.json';

/**
 * Authentication Tests
 * Migrated from: LoginTests.java
 * Original framework: TestNG
 */
test.describe('Authentication - Login', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  // Migrated from: @BeforeMethod
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.navigate();
  });

  // Migrated from: testValidLogin with @DataProvider("validLogins")
  test.describe('Valid Login Scenarios', () => {
    for (const scenario of loginData.validScenarios) {
      test(`${scenario.testId}: ${scenario.description}`, async () => {
        // Original test ID: ${scenario.originalTestId}

        // Act - Migrated from: loginPage.login(username, password)
        await loginPage.login(scenario.username, scenario.password);

        // Assert - Migrated from: Assert.assertTrue(productsPage.isOnProductsPage())
        expect(await productsPage.isOnProductsPage()).toBe(true);

        // Assert - Migrated from: Assert.assertEquals(productsPage.getPageTitle(), expectedPage)
        const pageTitle = await productsPage.getPageTitle();
        expect(pageTitle).toContain(scenario.expectedPage);
      });
    }
  });
});
```

---

## Self-Healing Framework

### 4-Tier Healing Strategy
```
┌─────────────────────────────────────────────────────────────────────┐
│                    SELF-HEALING FLOW                                │
├─────────────────────────────────────────────────────────────────────┤
│  Primary Selector Failed                                            │
│           ↓                                                         │
│  ┌─────────────────┐                                                │
│  │ TIER 1: CACHE   │ ← Check previously healed selectors           │
│  └────────┬────────┘                                                │
│           ↓ (miss)                                                  │
│  ┌─────────────────┐                                                │
│  │ TIER 2: FALLBACKS│ ← Try predefined fallback selectors          │
│  └────────┬────────┘                                                │
│           ↓ (all failed)                                            │
│  ┌─────────────────┐                                                │
│  │ TIER 3: AI VISUAL│ ← Screenshot + Claude Vision API             │
│  └────────┬────────┘                                                │
│           ↓ (failed)                                                │
│  ┌─────────────────┐                                                │
│  │ TIER 4: AI DOM  │ ← Full DOM analysis with AI                   │
│  └────────┬────────┘                                                │
│           ↓                                                         │
│  [Element Found or Healing Failed with Report]                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Migration-Specific Healing Features
- **Original Locator Tracking**: Each element definition includes the original Selenium locator for reference
- **Migration Report Integration**: Healing reports show which migrated locators needed healing
- **Fallback Generation**: Automatically generates fallbacks based on original locator patterns

---

## Dual Test Mode

The migration agent generates tests in **two modes** allowing users to run the same test scenarios either with standard Playwright locators or with the AI-powered self-healing pipeline.

### Mode 1: Normal Run (`{module}.spec.ts`)
- Uses standard Page Object locators directly
- Fast execution, no AI overhead
- Ideal for CI/CD pipelines and daily regression
- Locators use comma-separated fallback chains: `page.locator('#a, .b, [c]').first()`

### Mode 2: Self-Healing Run (`{module}-healing.spec.ts`)
- Uses `SelfHealingLocator` with `ElementRegistry` for every element interaction
- Triggers the 4-tier healing pipeline (Cache → Fallbacks → AI Visual → AI DOM)
- Generates healing reports showing which selectors needed healing
- Ideal for post-migration validation, debugging broken selectors, and monitoring site changes

### Mode 3: Self-Healing Demo (`self-healing-demo.spec.ts`)
- Uses deliberately broken selectors to demonstrate AI Observer capabilities
- Shows the full healing pipeline in action
- Generates comprehensive healing reports

### npm Scripts for Both Modes
```json
{
  "test": "npx playwright test --grep-invert @healing",
  "test:healing": "npx playwright test --grep @healing",
  "test:all": "npx playwright test",
  "test:healing:demo": "npx playwright test tests/self-healing-demo.spec.ts --headed"
}
```

---

## Learnings from Production Migrations

### Critical Patterns Discovered

1. **Strict Mode Violations**: When AI suggests a selector matching multiple elements (e.g., `button[type="submit"]` matching desktop + mobile), Playwright throws strict mode errors. **Fix**: Always use `.first()` in `SelfHealingLocator` via a `safeLocator()` helper.

2. **Cookie Consent Modals**: Modern sites use `[role="dialog"]` modal dialogs, not just simple banners. Cookie handling must account for:
   - Simple banners: `.action-accept a`
   - Modal dialogs: `[role="dialog"] a:has-text("Accept")`
   - Already-accepted state (no banner visible)

3. **AI Element Descriptions Matter**: Vague descriptions like "search button" produce poor AI healing results. **Use rich descriptions** that include location context: "Search button in the secondary navigation bar at top of page, with text 'Search' and a magnifying glass icon."

4. **Fallback Chains in Page Object Constructors**: In addition to self-healing fallbacks in `ElementRegistry`, Page Object constructors should use comma-separated locators for resilience:
   ```typescript
   this.searchInput = page.locator('#searchBox, input[name="search"], input[type="search"]').first();
   ```

5. **Site Structure Changes Post-Migration**: The original Selenium locators may all be broken if the site has been redesigned. Tier 2 (Fallbacks) and Tier 3 (AI Visual) are the most effective tiers for handling this.

6. **Anthropic SDK Version**: Use `@anthropic-ai/sdk@latest` (currently `^0.73.0`+). Version `^0.10.0` has breaking API changes with `client.messages.create()`.

7. **Wait After Panel Transitions**: After clicking triggers that open panels/modals (e.g., search trigger opening search overlay), add a short `waitForTimeout(1000)` before interacting with elements inside the panel.

---

## Quality Standards

### Generated Code Quality
- TypeScript strict mode enabled
- No `any` types
- Proper async/await handling
- Consistent naming conventions
- JSDoc comments for public methods
- Original locators documented in comments

### Migration Coverage Requirements
- 100% of source tests migrated
- All Page Objects converted
- Test data extracted and structured
- Configuration migrated
- Documentation generated

### Framework Standards
- Page Object Model pattern preserved
- Separation of concerns (pages, tests, data)
- Self-healing capabilities included
- Comprehensive reporting

---

## Agent Version
**Version**: 1.1.0
**Last Updated**: {CURRENT_DATE}
**Guardrail Reference**: Migration Guardrail v1.0
**Self-Healing Framework**: AI Observer v1.1 (with Dual Test Mode + safeLocator)
