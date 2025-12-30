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
- **4-Tier Self-Healing**: Cache → Fallbacks → AI Visual → AI DOM analysis
- **AI Observer Integration**: Claude Vision API for intelligent element detection
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

## Agent Capabilities

### 1. CSV Test Case Parsing
- Parse CSV test case files from `manual-tests/` directory
- Support standard CSV columns: Test_ID, Module, Test_Title, Test_Type, Priority, Precondition, Test_Data, Steps, Expected_Result, Tags
- Parse JSON-encoded Test_Data field for complex test inputs
- Extract unique pages and user flows from Steps column
- Map test data requirements automatically

### 2. Page Object Model Generation
- Create TypeScript Page Object classes for each identified page
- Generate element locators with **5+ fallback strategies**
- Implement navigation, action, and verification methods
- **Integrate self-healing locator patterns with AI Observer**
- Support any application type (generic templates)

### 3. Test Data Generation
- Create JSON files from parsed CSV Test_Data
- Organize by test category (valid, invalid, boundary, security)
- Include expected error messages and outcomes from Expected_Result
- Support parameterized test execution
- Generate security payload files

### 4. Test Specification Generation
- Create Playwright test specs with proper describe/test blocks
- Implement data-driven test loops from JSON data
- Generate assertions based on Expected_Result column
- Follow naming convention from Test_ID column
- Support tag-based test filtering

### 5. Self-Healing Framework Generation
- Generate `SelfHealingLocator.ts` with 4-tier healing strategy
- Create `AIObserver.ts` for Claude Vision API integration
- Implement `HealingReporter.ts` for healing analytics
- Generate `ElementRegistry.ts` for centralized element definitions
- Include healing statistics and report generation

### 6. Framework Infrastructure
- Generate `playwright.config.ts` with best practices
- Create `tsconfig.json` for TypeScript strict mode
- Generate `package.json` with all dependencies including `@anthropic-ai/sdk`
- Include environment configuration templates
- Generate comprehensive README with setup instructions

---

## Input Requirements

### Required
| Input | Description | Format |
|-------|-------------|--------|
| **Manual Test Cases** | CSV test case file from Test Case Generator Agent | `manual-tests/{AppName}_Manual_Test_Cases.csv` |
| **Base URL** | Application URL for automation | URL string |

### CSV Input Format
The agent expects CSV files with these columns:
```csv
Test_ID,Module,Test_Title,Test_Type,Priority,Precondition,Test_Data,Steps,Expected_Result,Tags
```

| Column | Description | Example |
|--------|-------------|---------|
| `Test_ID` | Unique identifier | `TC_AUTH_001` |
| `Module` | Functional area | `Authentication` |
| `Test_Title` | Test description | `Login with valid credentials` |
| `Test_Type` | Category | `Positive\|Negative\|Boundary\|Security` |
| `Priority` | Importance | `High\|Medium\|Low` |
| `Precondition` | Pre-test state | `User account exists` |
| `Test_Data` | JSON-encoded data | `{"email":"test@test.com"}` |
| `Steps` | Semicolon-separated | `1. Navigate; 2. Enter data; 3. Click` |
| `Expected_Result` | Outcomes | `Login succeeds; Dashboard shown` |
| `Tags` | Comma-separated | `smoke,regression,auth` |

### Optional
| Input | Description | Default |
|-------|-------------|---------|
| Application Name | Project name | Extracted from CSV filename |
| Output Directory | Where to generate project | `playwright-projects/{AppName}/` |
| Browser Config | Target browsers | Chromium only |
| Enable Self-Healing | Include AI Observer healing | `true` |
| AI Provider | API for self-healing | Anthropic Claude |
| Healing Report | Generate healing analytics | `true` |

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
│   ├── SelfHealingLocator.ts           # Core 4-tier self-healing engine
│   ├── AIObserver.ts                   # Claude Vision API integration
│   ├── HealingReporter.ts              # Healing statistics & reports
│   ├── ElementRegistry.ts              # Centralized element definitions
│   ├── RetryHandler.ts                 # Smart retry with backoff
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

## Self-Healing Framework (AI Observer)

### Overview
The self-healing framework provides robust element location through a 4-tier healing strategy powered by AI Observer. When the primary selector fails, the system progressively tries more sophisticated healing methods.

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

### Element Registry Pattern
```typescript
// utils/ElementRegistry.ts
export interface ElementDefinition {
  name: string;
  description: string;
  primary: string;
  fallbacks: string[];
  type: 'input' | 'button' | 'link' | 'text' | 'container';
  attributes?: Record<string, string>;
}

export const ELEMENT_REGISTRY: Record<string, Record<string, ElementDefinition>> = {
  login: {
    emailInput: {
      name: 'emailInput',
      description: 'Email/username input field on login page',
      primary: '[data-testid="email"]',
      fallbacks: [
        '[data-test="email"]',
        '#email',
        'input[name="email"]',
        'input[type="email"]',
        'input[placeholder*="email" i]',
        'input[aria-label*="email" i]'
      ],
      type: 'input'
    },
    passwordInput: {
      name: 'passwordInput',
      description: 'Password input field on login page',
      primary: '[data-testid="password"]',
      fallbacks: [
        '[data-test="password"]',
        '#password',
        'input[name="password"]',
        'input[type="password"]',
        'input[placeholder*="password" i]'
      ],
      type: 'input'
    },
    submitButton: {
      name: 'submitButton',
      description: 'Login/Submit button',
      primary: '[data-testid="login-button"]',
      fallbacks: [
        '[data-test="submit"]',
        'button[type="submit"]',
        'button:has-text("Login")',
        'button:has-text("Sign in")',
        'input[type="submit"]',
        '.login-btn, .submit-btn'
      ],
      type: 'button'
    }
  }
};
```

### SelfHealingLocator Core Implementation
```typescript
// utils/SelfHealingLocator.ts
import { Page, Locator } from '@playwright/test';
import { AIObserver } from './AIObserver';
import { HealingReporter, HealingResult } from './HealingReporter';
import { ElementDefinition } from './ElementRegistry';

export class SelfHealingLocator {
  private page: Page;
  private healingCache: Map<string, string> = new Map();
  private aiObserver: AIObserver;
  private reporter: HealingReporter;

  constructor(page: Page, options?: { enableAI?: boolean }) {
    this.page = page;
    this.aiObserver = new AIObserver(options?.enableAI ?? true);
    this.reporter = new HealingReporter();
  }

  async locate(element: ElementDefinition, timeout = 5000): Promise<Locator> {
    const startTime = Date.now();

    // Try primary selector first
    try {
      const locator = this.page.locator(element.primary);
      await locator.waitFor({ state: 'visible', timeout: timeout / 4 });
      return locator;
    } catch {
      console.log(`[Healer] Primary failed: ${element.primary}`);
    }

    // TIER 1: Check healing cache
    const cached = this.healingCache.get(element.name);
    if (cached) {
      try {
        const locator = this.page.locator(cached);
        await locator.waitFor({ state: 'visible', timeout: timeout / 4 });
        this.reporter.record({
          element: element.name,
          original: element.primary,
          healed: cached,
          tier: 'cache',
          duration: Date.now() - startTime
        });
        return locator;
      } catch {
        this.healingCache.delete(element.name);
      }
    }

    // TIER 2: Try fallback selectors
    for (const fallback of element.fallbacks) {
      try {
        const locator = this.page.locator(fallback);
        await locator.waitFor({ state: 'visible', timeout: timeout / (element.fallbacks.length + 2) });
        this.healingCache.set(element.name, fallback);
        this.reporter.record({
          element: element.name,
          original: element.primary,
          healed: fallback,
          tier: 'fallback',
          duration: Date.now() - startTime
        });
        return locator;
      } catch {
        continue;
      }
    }

    // TIER 3: AI Visual Analysis
    if (this.aiObserver.isEnabled()) {
      try {
        const screenshot = await this.page.screenshot({ type: 'png' });
        const aiSelector = await this.aiObserver.findElementByVision(
          screenshot,
          element.description,
          element.type
        );
        if (aiSelector) {
          const locator = this.page.locator(aiSelector);
          await locator.waitFor({ state: 'visible', timeout: timeout / 4 });
          this.healingCache.set(element.name, aiSelector);
          this.reporter.record({
            element: element.name,
            original: element.primary,
            healed: aiSelector,
            tier: 'ai_visual',
            duration: Date.now() - startTime
          });
          return locator;
        }
      } catch (error) {
        console.log(`[Healer] AI Visual failed: ${error}`);
      }

      // TIER 4: AI DOM Analysis
      try {
        const html = await this.page.content();
        const aiSelector = await this.aiObserver.findElementByDOM(
          html,
          element.description,
          element.type,
          element.attributes
        );
        if (aiSelector) {
          const locator = this.page.locator(aiSelector);
          await locator.waitFor({ state: 'visible', timeout: timeout / 4 });
          this.healingCache.set(element.name, aiSelector);
          this.reporter.record({
            element: element.name,
            original: element.primary,
            healed: aiSelector,
            tier: 'ai_dom',
            duration: Date.now() - startTime
          });
          return locator;
        }
      } catch (error) {
        console.log(`[Healer] AI DOM failed: ${error}`);
      }
    }

    // All healing attempts failed
    this.reporter.record({
      element: element.name,
      original: element.primary,
      healed: null,
      tier: 'failed',
      duration: Date.now() - startTime
    });

    throw new Error(`[SelfHealing] Could not locate: ${element.description} (${element.name})`);
  }

  getReport(): string {
    return this.reporter.generateReport();
  }

  async saveReport(path: string): Promise<void> {
    await this.reporter.saveReport(path);
  }
}
```

### AIObserver Implementation
```typescript
// utils/AIObserver.ts
import Anthropic from '@anthropic-ai/sdk';

export class AIObserver {
  private client: Anthropic | null = null;
  private enabled: boolean = false;
  private model = 'claude-sonnet-4-20250514';

  constructor(enableAI = true) {
    if (enableAI && process.env.ANTHROPIC_API_KEY) {
      this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      this.enabled = true;
      console.log('[AIObserver] Initialized with Claude Vision');
    } else {
      console.log('[AIObserver] Running without AI (API key not configured)');
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async findElementByVision(
    screenshot: Buffer,
    description: string,
    elementType: string
  ): Promise<string | null> {
    if (!this.client) return null;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/png',
                data: screenshot.toString('base64')
              }
            },
            {
              type: 'text',
              text: `Find the ${elementType} element: "${description}"

Analyze the screenshot and provide a single CSS selector to locate this element.
Prioritize selectors in this order:
1. data-testid or data-test attributes
2. id attribute
3. aria-label or role
4. unique class combinations
5. text content selectors

Return ONLY the CSS selector, nothing else.
Example: [data-testid="login-btn"]`
            }
          ]
        }]
      });

      const selector = (response.content[0] as any).text?.trim();
      return selector && this.isValidSelector(selector) ? selector : null;
    } catch (error) {
      console.error('[AIObserver] Vision API error:', error);
      return null;
    }
  }

  async findElementByDOM(
    html: string,
    description: string,
    elementType: string,
    attributes?: Record<string, string>
  ): Promise<string | null> {
    if (!this.client) return null;

    try {
      // Truncate HTML to avoid token limits
      const truncatedHtml = html.substring(0, 15000);

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `Analyze this HTML and find a CSS selector for:
Element type: ${elementType}
Description: "${description}"
${attributes ? `Known attributes: ${JSON.stringify(attributes)}` : ''}

HTML:
\`\`\`html
${truncatedHtml}
\`\`\`

Return ONLY a single CSS selector. Prefer data-testid > id > unique classes.`
        }]
      });

      const selector = (response.content[0] as any).text?.trim();
      return selector && this.isValidSelector(selector) ? selector : null;
    } catch (error) {
      console.error('[AIObserver] DOM API error:', error);
      return null;
    }
  }

  private isValidSelector(selector: string): boolean {
    // Basic validation - selector should not contain explanatory text
    return selector.length < 200 &&
           !selector.includes('\n') &&
           !selector.toLowerCase().includes('the element');
  }
}
```

### HealingReporter Implementation
```typescript
// utils/HealingReporter.ts
import * as fs from 'fs';
import * as path from 'path';

export interface HealingResult {
  element: string;
  original: string;
  healed: string | null;
  tier: 'cache' | 'fallback' | 'ai_visual' | 'ai_dom' | 'failed';
  duration: number;
  timestamp?: Date;
}

export interface HealingStats {
  total: number;
  successful: number;
  failed: number;
  byTier: Record<string, number>;
  avgDuration: number;
}

export class HealingReporter {
  private results: HealingResult[] = [];

  record(result: HealingResult): void {
    this.results.push({
      ...result,
      timestamp: new Date()
    });
  }

  getStats(): HealingStats {
    const successful = this.results.filter(r => r.tier !== 'failed');
    const byTier = this.results.reduce((acc, r) => {
      acc[r.tier] = (acc[r.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.results.length,
      successful: successful.length,
      failed: this.results.length - successful.length,
      byTier,
      avgDuration: this.results.reduce((sum, r) => sum + r.duration, 0) / this.results.length || 0
    };
  }

  generateReport(): string {
    const stats = this.getStats();
    const lines = [
      '═'.repeat(70),
      '                    SELF-HEALING REPORT',
      '═'.repeat(70),
      `Total Healing Attempts: ${stats.total}`,
      `Successful: ${stats.successful} (${((stats.successful / stats.total) * 100).toFixed(1)}%)`,
      `Failed: ${stats.failed}`,
      `Average Duration: ${stats.avgDuration.toFixed(0)}ms`,
      '',
      'By Tier:',
      ...Object.entries(stats.byTier).map(([tier, count]) =>
        `  ${tier}: ${count} (${((count / stats.total) * 100).toFixed(1)}%)`
      ),
      '',
      'Healing Details:',
      ...this.results.map(r =>
        `  [${r.tier.toUpperCase()}] ${r.element}: ${r.original} → ${r.healed || 'FAILED'} (${r.duration}ms)`
      ),
      '═'.repeat(70)
    ];
    return lines.join('\n');
  }

  async saveReport(filePath: string): Promise<void> {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const report = {
      generatedAt: new Date().toISOString(),
      stats: this.getStats(),
      results: this.results
    };

    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
  }
}
```

### Page Object Integration Example
```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SelfHealingLocator } from '../utils/SelfHealingLocator';
import { ELEMENT_REGISTRY } from '../utils/ElementRegistry';

export class LoginPage extends BasePage {
  private healer: SelfHealingLocator;
  private elements = ELEMENT_REGISTRY.login;

  constructor(page: Page) {
    super(page);
    this.healer = new SelfHealingLocator(page);
  }

  async fillEmail(value: string): Promise<void> {
    const locator = await this.healer.locate(this.elements.emailInput);
    await locator.fill(value);
  }

  async fillPassword(value: string): Promise<void> {
    const locator = await this.healer.locate(this.elements.passwordInput);
    await locator.fill(value);
  }

  async clickLogin(): Promise<void> {
    const locator = await this.healer.locate(this.elements.submitButton);
    await locator.click();
    await this.waitForNavigation();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async getHealingReport(): Promise<string> {
    return this.healer.getReport();
  }
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

---

## Universal Application Support

The agent generates automation that works with any application type:

| Application Type | Supported Modules | Special Handling |
|-----------------|-------------------|------------------|
| **E-Commerce** | Cart, Checkout, Products, Payments | Multi-step flows, price validation |
| **SaaS/Dashboard** | Auth, Dashboard, CRUD, Reports | Data tables, widgets, charts |
| **CMS** | Content, Media, Publishing | Rich text editors, file uploads |
| **Forms-Heavy** | Multi-step forms, Wizards | Validation, conditional fields |
| **API-Driven** | Any REST/GraphQL frontend | Network interception |

---

## Agent Version
**Version**: 2.0.0
**Last Updated**: {CURRENT_DATE}
**Guardrail Reference**: Screenshot-to-Automation Guardrail v2.0
**Self-Healing Framework**: AI Observer v1.0
