# Automation Generator Agent

> A specialized sub-agent for generating Playwright test automation from manual test cases.

---

## Agent Overview

### Purpose
This sub-agent is responsible for:
1. Reading manual test cases from the `manual-tests/` directory
2. Analyzing test case structure and identifying modules/pages
3. Generating complete Playwright automation framework including:
   - Page Object Model classes
   - Data-driven test specifications
   - Test data JSON files
   - Self-healing locator utilities
   - Configuration files
4. Outputting a ready-to-run Playwright project

### Agent Role in Pipeline
```
[Screenshots] → [Screenshot Analyzer Agent] → [Manual Test Cases] → [Automation Generator Agent] → [Playwright Project]
                                                                            ↑
                                                                      (This Agent)
```

---

## Agent Capabilities

### 1. Manual Test Case Parsing
- Parse structured test case files from `manual-tests/` directory
- Extract test modules, IDs, types, data, steps, and expected results
- Identify unique pages and user flows
- Map test data requirements

### 2. Page Object Model Generation
- Create TypeScript Page Object classes for each identified page
- Generate element locators with fallback strategies
- Implement navigation, action, and verification methods
- Support self-healing locator patterns

### 3. Test Data Generation
- Create JSON files for data-driven testing
- Organize by test category (valid, invalid, boundary, security)
- Include expected error messages and outcomes
- Support parameterized test execution

### 4. Test Specification Generation
- Create Playwright test specs with proper describe/test blocks
- Implement data-driven test loops
- Generate assertions based on expected results
- Follow naming convention from manual test cases

### 5. Framework Setup
- Generate `playwright.config.ts` with best practices
- Create `tsconfig.json` for TypeScript support
- Generate `package.json` with all dependencies
- Include self-healing utilities

---

## Input Requirements

### Required
| Input | Description | Format |
|-------|-------------|--------|
| **Manual Test Cases** | Test case file from Screenshot Analyzer Agent | `manual-tests/{AppName}_Manual_Test_Cases.txt` |
| **Base URL** | Application URL for automation | URL string |

### Optional
| Input | Description | Default |
|-------|-------------|---------|
| Application Name | Project name | Extracted from test case file |
| Output Directory | Where to generate project | `playwright-projects/{AppName}/` |
| Browser Config | Target browsers | Chromium only |
| Enable Self-Healing | Include AI healing | true |

---

## Output Specifications

### Generated Project Structure

```
playwright-projects/{AppName}/
│
├── pages/                              # Page Object Model classes
│   ├── BasePage.ts                     # Base class with common methods
│   ├── LoginPage.ts                    # Generated from TC_AUTH_* tests
│   ├── RegistrationPage.ts             # Generated from TC_REG_* tests
│   ├── DashboardPage.ts                # Generated from TC_DASH_* tests
│   └── components/                     # Reusable components
│       ├── NavigationComponent.ts
│       └── ModalComponent.ts
│
├── tests/                              # Test specification files
│   ├── auth.spec.ts                    # Authentication tests
│   ├── auth-validation.spec.ts         # Auth validation tests
│   ├── registration.spec.ts            # Registration tests
│   ├── e2e/                            # End-to-end tests
│   │   └── user-journey.e2e.spec.ts
│   └── self-healing.spec.ts            # Self-healing demos
│
├── data/                               # Test data (JSON)
│   ├── authData.json                   # Auth test data
│   ├── registrationData.json           # Registration test data
│   ├── securityPayloads.json           # Security test payloads
│   └── users.json                      # Test user credentials
│
├── utils/                              # Framework utilities
│   ├── SelfHealingLocator.ts           # Self-healing engine
│   ├── AIObserver.ts                   # AI observation service
│   ├── HealingReporter.ts              # Report generation
│   └── TestHelpers.ts                  # Common utilities
│
├── config/                             # Configuration
│   ├── environments.ts                 # Environment configs
│   └── constants.ts                    # App constants
│
├── reports/                            # Generated reports (gitignored)
│
├── playwright.config.ts                # Playwright configuration
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # Dependencies & scripts
├── .env.example                        # Environment template
├── .gitignore                          # Git ignore rules
└── README.md                           # Project documentation
```

---

## Agent Workflow

### Phase 1: Parse Manual Test Cases
```
Input: manual-tests/{AppName}_Manual_Test_Cases.txt

Process:
1. Read and parse the test case file
2. Extract header information (App name, URL, date)
3. Parse each test case into structured data:
   - Test ID, Title, Type, Priority
   - Preconditions
   - Test Data fields
   - Steps (action sequence)
   - Expected Results
4. Group test cases by module (AUTH, REG, DASH, etc.)
5. Identify unique pages from test steps

Output: Structured test case data
```

### Phase 2: Generate Page Objects
```
Input: Parsed test case data

Process:
1. Identify all unique pages from test steps
2. For each page, extract:
   - Required input fields
   - Action buttons
   - Verification elements (error/success messages)
3. Generate TypeScript Page Object class:
   - Element locators with fallbacks
   - Action methods (fill, click, select)
   - Verification methods (isVisible, getText)
   - Navigation methods

Output: pages/*.ts files
```

### Phase 3: Generate Test Data
```
Input: Parsed test case data

Process:
1. Group test data by module and type
2. Create JSON structure:
   - validScenarios: Positive test data
   - invalidScenarios: Negative test data with expectedError
   - emptyFieldTests: Empty field combinations
   - boundaryTests: Edge case data
   - securityTests: Security payloads
3. Include test IDs and descriptions

Output: data/*.json files
```

### Phase 4: Generate Test Specifications
```
Input: Parsed test cases, Page Objects, Test Data

Process:
1. Create test spec file per module
2. Generate describe blocks for test categories
3. Implement data-driven loops:
   for (const scenario of testData.validScenarios) {
     test(`${scenario.testId}: ${scenario.description}`, ...)
   }
4. Add appropriate assertions
5. Include beforeEach setup

Output: tests/*.spec.ts files
```

### Phase 5: Generate Configuration & Utilities
```
Process:
1. Generate playwright.config.ts with:
   - Base URL from input
   - Browser configuration
   - Reporter settings
   - Timeout configurations
2. Generate tsconfig.json
3. Generate package.json with dependencies
4. Generate self-healing utilities
5. Generate .env.example and .gitignore
6. Generate README.md with usage instructions

Output: Configuration files
```

---

## Code Generation Templates

### Page Object Template
```typescript
// pages/{PageName}Page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class {PageName}Page extends BasePage {
  readonly pageUrl: string = '/{page-path}';

  // Element Locators (with fallback selectors for self-healing)
  readonly {element}Input: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Primary selector + fallbacks
    this.{element}Input = page.locator(
      '[data-test="{element}"], #{element}, input[name="{element}"]'
    );
    this.submitButton = page.locator(
      '[data-test="submit"], button[type="submit"], .submit-btn'
    );
    this.errorMessage = page.locator(
      '[data-test="error"], .error-message, .alert-danger'
    );
    this.successMessage = page.locator(
      '[data-test="success"], .success-message, .alert-success'
    );
  }

  // Navigation
  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  // Actions
  async fill{Element}(value: string): Promise<void> {
    await this.{element}Input.fill(value);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
    await this.waitForSpinnerToDisappear();
  }

  // Verification
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent() || '';
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}
```

### Test Data Template
```json
{
  "_metadata": {
    "module": "{ModuleName}",
    "generatedFrom": "manual-tests/{AppName}_Manual_Test_Cases.txt",
    "generatedDate": "{DATE}"
  },

  "validScenarios": [
    {
      "testId": "TC_{MOD}_001",
      "description": "{from manual test case}",
      "field1": "{value}",
      "field2": "{value}",
      "expectedResult": "success"
    }
  ],

  "invalidScenarios": [
    {
      "testId": "TC_{MOD}_100",
      "description": "{from manual test case}",
      "field1": "{invalid_value}",
      "expectedError": "{exact error message}"
    }
  ],

  "boundaryTests": [...],
  "securityTests": [...]
}
```

### Test Specification Template
```typescript
// tests/{module}.spec.ts
import { test, expect } from '@playwright/test';
import { {PageName}Page } from '../pages/{PageName}Page';
import testData from '../data/{module}Data.json';

test.describe('{Module Name} - {App Name}', () => {
  let page: {PageName}Page;

  test.beforeEach(async ({ page: browserPage }) => {
    page = new {PageName}Page(browserPage);
    await page.navigate();
  });

  // Positive Tests
  test.describe('Positive Scenarios', () => {
    for (const scenario of testData.validScenarios) {
      test(`${scenario.testId}: ${scenario.description}`, async () => {
        await page.fillField1(scenario.field1);
        await page.fillField2(scenario.field2);
        await page.submit();

        // Assertions based on expected result
        expect(await page.isSuccessDisplayed()).toBe(true);
      });
    }
  });

  // Negative Tests
  test.describe('Negative Scenarios', () => {
    for (const scenario of testData.invalidScenarios) {
      test(`${scenario.testId}: ${scenario.description}`, async () => {
        await page.fillField1(scenario.field1);
        await page.submit();

        expect(await page.isErrorDisplayed()).toBe(true);
        const errorMsg = await page.getErrorMessage();
        expect(errorMsg).toContain(scenario.expectedError);
      });
    }
  });

  // Security Tests
  test.describe('Security Tests', () => {
    for (const scenario of testData.securityTests) {
      test(`${scenario.testId}: ${scenario.description}`, async () => {
        await page.fillField1(scenario.payload);
        await page.submit();

        // Verify graceful handling
        const pageContent = await page.page.content();
        expect(pageContent).not.toContain('<script>');
      });
    }
  });
});
```

---

## Test Case Parsing Logic

### Parsing Algorithm
```
1. Read file line by line
2. Identify section markers (===, ---)
3. Parse header for app name, URL, date
4. For each test case block:
   a. Extract TC_ID from "TC_XXX_###: Title" pattern
   b. Parse Test Type line
   c. Parse Priority line
   d. Parse Precondition line
   e. Parse Test Data section (key: value pairs)
   f. Parse Steps section (numbered list)
   g. Parse Expected Result section (bullet points)
5. Group by module prefix (AUTH, REG, etc.)
```

### Test ID to Module Mapping
| Prefix | Module Name | Page Object |
|--------|-------------|-------------|
| TC_AUTH_ | Authentication | LoginPage |
| TC_REG_ | Registration | RegistrationPage |
| TC_DASH_ | Dashboard | DashboardPage |
| TC_FORM_ | Generic Form | FormPage |
| TC_LIST_ | List/Table | ListPage |
| TC_CART_ | Shopping Cart | CartPage |
| TC_CHKOUT_ | Checkout | CheckoutPage |
| TC_SEARCH_ | Search | SearchPage |

### Test Type to Data Category Mapping
| Range | Type | JSON Array |
|-------|------|------------|
| 001-099 | Positive | validScenarios |
| 100-199 | Negative | invalidScenarios |
| 200-299 | Empty Field | emptyFieldTests |
| 300-399 | Boundary | boundaryTests |
| 400-499 | Security | securityTests |

---

## Self-Healing Integration

### Element Definition with Fallbacks
```typescript
// Each element has primary + fallback selectors
const ELEMENTS = {
  usernameInput: {
    primary: '[data-test="username"]',
    fallbacks: [
      '#username',
      'input[name="username"]',
      'input[placeholder*="username" i]',
      'input[type="text"]:first-of-type'
    ],
    description: 'Username input field'
  }
};
```

### SelfHealingLocator Usage
```typescript
// In page objects
async fillUsername(value: string): Promise<void> {
  const locator = await this.healer.locate(
    ELEMENTS.usernameInput.primary,
    ELEMENTS.usernameInput.description,
    { fallbackSelectors: ELEMENTS.usernameInput.fallbacks }
  );
  await locator.fill(value);
}
```

---

## Quality Standards

### Generated Code Quality
- TypeScript strict mode enabled
- No `any` types
- Proper async/await handling
- Consistent naming conventions
- JSDoc comments for public methods

### Test Coverage Requirements
- All manual test cases converted to automation
- Data-driven approach for test variations
- Proper error handling and assertions
- Meaningful test names matching TC IDs

### Framework Standards
- Page Object Model pattern
- Separation of concerns (pages, tests, data)
- Self-healing capabilities
- Comprehensive reporting

---

## Agent Version
**Version**: 1.0.0
**Last Updated**: {CURRENT_DATE}
**Guardrail Reference**: Screenshot-to-Automation Guardrail v2.0
