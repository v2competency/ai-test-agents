# Automation Generator Agent

> A specialized sub-agent for generating Playwright test automation with AI-powered self-healing capabilities from manual test cases.

---

## Agent Overview

### Purpose
This sub-agent is responsible for:
1. Reading manual test cases (CSV format) from the `manual-tests/` directory
2. Analyzing test case structure and identifying modules/pages
3. Generating complete Playwright automation framework including:
   - Page Object Model classes with self-healing locators
   - Data-driven test specifications
   - Test data JSON files (parsed from CSV)
   - **AI-powered self-healing framework using AI Observer**
   - Configuration files for any project type
4. Outputting a production-ready, self-healing Playwright project

### Key Features
- **Universal Generic Approach**: Works with any web application (e-commerce, SaaS, CMS, etc.)
- **CSV Input Support**: Parses structured CSV test cases from testcase-generator-agent
- **4-Tier Self-Healing**: Primary → Cache+Fallbacks (parallel race) → AI Visual → AI DOM analysis
- **AI Observer Integration**: Claude Vision API for intelligent element detection
- **Dual Mode**: Standard mode (primary only) and AI healing mode (full 4-tier) via env toggle
- **Auto-Patching**: Global teardown patches healed selectors back into source files
- **Cross-Platform**: Works on Windows, macOS, and Linux

### Agent Role in Pipeline
```
[Screenshots] → [Test Case Generator Agent] → [Manual Test Cases (CSV)] → [Automation Generator Agent] → [Playwright Project]
                                                                                     ↑
                                                                               (This Agent)
                                                                                     ↓
                                                                    [Self-Healing Framework + AI Observer]
```

---

## Generated Project Structure

The agent MUST produce the following structure, matching the reference OrangeHRM project exactly:

```
playwright-projects/{AppName}/
│
├── config/                             # Global setup/teardown
│   ├── global-setup.ts                # Loads dotenv, logs AI mode
│   └── global-teardown.ts             # Applies healed selectors + broken fallbacks back to source
│
├── pages/                              # Page Object Model classes
│   ├── BasePage.ts                    # Abstract base with healer, spinner, toast handling
│   ├── LoginPage.ts                   # Login page with ElementDefinitions
│   ├── DashboardPage.ts              # Dashboard with sidebar integration
│   ├── {Module}Page.ts               # One per identified module
│   └── components/                    # Reusable components
│       └── SidebarNav.ts             # Sidebar navigation component
│
├── tests/                              # Test specification files
│   ├── auth.spec.ts                   # Authentication tests
│   ├── dashboard.spec.ts             # Dashboard tests
│   ├── {module}.spec.ts              # One per module
│   └── e2e/                           # End-to-end tests
│       └── e2e-flows.spec.ts
│
├── data/                               # Test data (JSON)
│   ├── authData.json                  # Auth test data
│   ├── dashboardData.json            # Dashboard test data
│   ├── {module}Data.json             # One per module
│   ├── e2eData.json                  # E2E flow data
│   └── users.json                    # Test user credentials
│
├── utils/                              # Framework utilities (COPY AS-IS)
│   ├── SelfHealingLocator.ts          # Core 4-tier self-healing engine with parallel race
│   ├── AIObserver.ts                  # Claude Vision API integration
│   ├── HealingReporter.ts            # Healing statistics & reports, multi-worker safe
│   ├── HealingPatcher.ts             # Auto-patches healed selectors back to source files
│   ├── LocatorStrategy.ts            # ILocatorStrategy interface + factory function
│   ├── StandardLocator.ts            # Standard mode (primary selector only, no AI)
│   └── TestHelpers.ts                # Common utilities (wait, retry, random, date, SoftAssert)
│
├── reports/                            # Generated reports (gitignored)
│
├── playwright.config.ts               # Playwright configuration
├── tsconfig.json                      # TypeScript configuration
├── package.json                       # Dependencies & scripts
├── .env.example                       # Environment template
├── .gitignore                         # Git ignore rules
└── README.md                          # Project documentation
```

---

## Critical Implementation Patterns

### 1. ElementDefinition at Page Level (NOT centralized registry)

Elements are declared as `private readonly` fields with `Def` suffix directly on each Page class:

```typescript
// pages/{PageName}Page.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ElementDefinition } from '../utils/SelfHealingLocator';

export class {PageName}Page extends BasePage {
  readonly pageUrl = '/web/index.php/{path}';

  // Element definitions with primary + fallback selectors
  private readonly usernameInputDef: ElementDefinition = {
    name: 'usernameInput',
    description: 'Username input field on login page',
    primary: 'input[name="username"]',
    fallbacks: [
      '[placeholder="Username"]',
      '.oxd-input[name="username"]',
      'input.oxd-input:first-of-type'
    ],
    type: 'input'
  };

  private readonly submitButtonDef: ElementDefinition = {
    name: 'submitButton',
    description: 'Login submit button',
    primary: 'button[type="submit"]',
    fallbacks: [
      'button:has-text("Login")',
      '.oxd-button--main'
    ],
    type: 'button'
  };

  constructor(page: Page) {
    super(page);
  }

  // Methods use this.healer.click/fill/getText/isVisible/locate
  async enterUsername(username: string): Promise<void> {
    await this.healer.fill(this.usernameInputDef, username);
  }

  async clickSubmit(): Promise<void> {
    await this.healer.click(this.submitButtonDef);
    await this.waitForSpinnerToDisappear();
  }
}
```

**Key rules:**
- Field naming: `{descriptiveName}Def` (e.g., `usernameInputDef`, `saveButtonDef`)
- Always `private readonly`
- `name` matches the field name without `Def` suffix
- `description` is rich and contextual for AI healing
- `primary` is the most specific selector
- `fallbacks` array with 1-5 alternative selectors
- `type` is one of: `'input' | 'button' | 'link' | 'text' | 'container' | 'dropdown' | 'checkbox' | 'radio' | 'textarea'`

### 2. BasePage Pattern

```typescript
// pages/BasePage.ts
import { Page } from '@playwright/test';
import { ElementDefinition } from '../utils/SelfHealingLocator';
import { ILocatorStrategy, createLocatorStrategy } from '../utils/LocatorStrategy';

export abstract class BasePage {
  readonly page: Page;
  readonly healer: ILocatorStrategy;

  // Common element definitions
  protected readonly loadingSpinnerDef: ElementDefinition = { ... };
  protected readonly toastMessageDef: ElementDefinition = { ... };
  protected readonly toastSuccessDef: ElementDefinition = { ... };
  protected readonly toastErrorDef: ElementDefinition = { ... };

  constructor(page: Page) {
    this.page = page;
    this.healer = createLocatorStrategy(page);
  }

  async waitForPageLoad(): Promise<void> { ... }
  async waitForSpinnerToDisappear(timeout = 30000): Promise<void> { ... }
  async getToastMessage(): Promise<string> { ... }
  async isSuccessToastDisplayed(): Promise<boolean> { ... }
  async isErrorToastDisplayed(): Promise<boolean> { ... }
  async waitForToastToDisappear(timeout = 5000): Promise<void> { ... }
  async takeScreenshot(name: string): Promise<void> { ... }
  getCurrentUrl(): string { ... }
  getHealingReport(): string { ... }
  async saveHealingReport(path: string): Promise<void> { ... }
  async getPageTitle(): Promise<string> { ... }
  async pressKey(key: string): Promise<void> { ... }
  async wait(ms: number): Promise<void> { ... }
}
```

### 3. Test Specification Pattern

```typescript
// tests/{module}.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { {PageName}Page } from '../pages/{PageName}Page';
import testData from '../data/{module}Data.json';
import users from '../data/users.json';

test.describe('{Module Name} - {AppName}', () => {
  let loginPage: LoginPage;
  let {pageName}Page: {PageName}Page;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    {pageName}Page = new {PageName}Page(page);

    // Login
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);
  });

  // ============================================================================
  // SECTION NAME TESTS
  // ============================================================================
  test.describe('Section Name @smoke @regression', () => {
    test.beforeEach(async () => {
      await {pageName}Page.navigateTo{Section}();
    });

    test('TC_XXX_001: Test description', async () => {
      // Act
      ...
      // Assert
      expect(...).toBe(true);
    });
  });
});
```

### 4. npm Scripts Pattern

```json
{
  "scripts": {
    "test": "npx playwright test",
    "test:ai": "cross-env AI_HEALING_ENABLED=true npx playwright test",
    "test:standard": "cross-env AI_HEALING_ENABLED=false npx playwright test",
    "test:headed": "npx playwright test --headed",
    "test:debug": "npx playwright test --debug",
    "test:ui": "npx playwright test --ui",
    "test:chromium": "npx playwright test --project=chromium",
    "test:firefox": "npx playwright test --project=firefox",
    "test:webkit": "npx playwright test --project=webkit",
    "test:smoke": "npx playwright test --grep @smoke",
    "test:regression": "npx playwright test --grep @regression",
    "test:e2e": "npx playwright test --grep @e2e",
    "test:security": "npx playwright test --grep @security",
    "test:negative": "npx playwright test --grep @negative",
    "test:auth": "npx playwright test tests/auth.spec.ts",
    "test:{module}": "npx playwright test tests/{module}.spec.ts",
    "report": "npx playwright show-report reports/playwright-report",
    "report:open": "start reports/playwright-report/index.html",
    "allure:generate": "npx allure generate allure-results --clean -o allure-report",
    "allure:open": "npx allure open allure-report",
    "allure:serve": "npx allure serve allure-results",
    "clean": "rimraf reports/ test-results/ dist/ allure-results/ allure-report/",
    "lint": "tsc --noEmit",
    "postinstall": "npx playwright install"
  }
}
```

### 5. Dependencies (EXACT versions)

```json
{
  "devDependencies": {
    "@anthropic-ai/sdk": "^0.78.0",
    "@playwright/test": "^1.40.0",
    "@types/node": "^20.10.0",
    "allure-commandline": "^2.36.0",
    "allure-playwright": "^3.4.4",
    "cross-env": "^7.0.3",
    "dotenv": "^16.3.1",
    "rimraf": "^5.0.5",
    "typescript": "^5.3.0"
  }
}
```

**CRITICAL**: Never use `@anthropic-ai/sdk@^0.10.0` - it breaks. Must use `^0.78.0`+.

---

## Files to Copy As-Is (No AI Generation Needed)

The following files MUST be copied verbatim from the reference implementation. The agent should NOT regenerate these - just copy the exact content:

### Copy-Paste Files:
1. `config/global-setup.ts` - Loads dotenv, logs AI mode
2. `config/global-teardown.ts` - Applies healed selectors + broken fallback fixes
3. `utils/SelfHealingLocator.ts` - 4-tier healing engine with parallel race
4. `utils/AIObserver.ts` - Claude Vision API integration
5. `utils/HealingReporter.ts` - Healing statistics & multi-worker persistence
6. `utils/HealingPatcher.ts` - Auto-patches healed selectors back to source
7. `utils/LocatorStrategy.ts` - ILocatorStrategy interface + factory
8. `utils/StandardLocator.ts` - Standard mode locator (no AI)
9. `utils/TestHelpers.ts` - Common utilities (adjust app-specific helpers per project)
10. `pages/BasePage.ts` - Abstract base page (copy as-is)
11. `playwright.config.ts` - Update only baseURL, keep structure
12. `tsconfig.json` - Copy as-is
13. `.gitignore` - Copy as-is
14. `.env.example` - Update credentials section per project

---

## Agent Workflow

### Phase 1: Parse Manual Test Cases
- Read CSV test case file
- Extract modules, test IDs, data, steps, expected results
- Group by module

### Phase 2: Generate Page Objects
- Create page classes extending BasePage
- Declare `ElementDefinition` fields as `private readonly {name}Def`
- Implement action methods using `this.healer.fill/click/getText/isVisible/locate`
- Include navigation methods
- Add `isOn{Page}Page()` URL check methods

### Phase 3: Generate Test Data
- Create JSON files per module
- Structure: `_metadata`, `validScenarios`, `invalidScenarios`, `boundaryTests`, `securityTests`
- Create `users.json` with test credentials

### Phase 4: Generate Test Specs
- Create spec files with `test.describe` blocks
- Login in `beforeEach` using `users.json`
- Section separators with `// ===...` comments
- Tag-based filtering (`@smoke`, `@regression`, `@security`, `@boundary`)
- Test naming: `TC_XXX_NNN: Description`

### Phase 5: Copy Framework Files
- Copy all utils/ files as-is
- Copy config/ files as-is
- Copy BasePage.ts as-is
- Generate playwright.config.ts (update baseURL only)
- Generate package.json with correct dependencies
- Generate .env.example, .gitignore, tsconfig.json, README.md

---

## Agent Version
**Version**: 3.0.0
**Last Updated**: 2026-03-05
**Reference Project**: playwright-projects/OrangeHRM
**Self-Healing Framework**: AI Observer v2.0 (with auto-patching)
