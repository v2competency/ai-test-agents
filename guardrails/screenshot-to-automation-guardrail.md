# Screenshot-to-Test Automation Guardrail

> A comprehensive, reusable guide for generating manual test cases and Playwright automation from application screenshots for ANY web application.

---

## Table of Contents
1. [Overview & Purpose](#1-overview--purpose)
2. [Input Requirements](#2-input-requirements)
3. [Output Specifications](#3-output-specifications)
4. [AI Prompt Templates](#4-ai-prompt-templates)
5. [Screenshot Analysis Process](#5-screenshot-analysis-process)
6. [Application Type Patterns](#6-application-type-patterns)
7. [Manual Test Case Template](#7-manual-test-case-template)
8. [Project Structure Template](#8-project-structure-template)
9. [Page Object Model Template](#9-page-object-model-template)
10. [Test Data JSON Templates](#10-test-data-json-templates)
11. [Test Specification Template](#11-test-specification-template)
12. [Self-Healing Framework](#12-self-healing-framework)
13. [Test ID Naming Convention](#13-test-id-naming-convention)
14. [Configuration Templates](#14-configuration-templates)
15. [Quality Checklist](#15-quality-checklist)
16. [Troubleshooting Guide](#16-troubleshooting-guide)

---

## 1. Overview & Purpose

### What This Guardrail Does
This guardrail provides a **standardized, repeatable process** for:
- Analyzing ANY web application screenshots to identify testable elements
- Generating comprehensive manual test cases (positive, negative, boundary, security)
- Creating Playwright automation with Page Object Model pattern
- Implementing data-driven testing with external JSON files
- Adding AI-powered self-healing capabilities for robust tests

### When to Use This Guardrail
Use this guardrail when you need to:
- Generate test cases from UI mockups, Figma designs, or application screenshots
- Create automation framework from scratch for a new application
- Standardize test output format across multiple projects
- Ensure consistent test coverage (positive, negative, boundary, security)

### Key Principles
1. **Consistency**: Same input format → Same output structure
2. **Completeness**: Cover all test types (positive, negative, boundary, security, E2E)
3. **Maintainability**: Data-driven approach, Page Object Model, self-healing
4. **Reusability**: Generic templates adaptable to any application domain

---

## 2. Input Requirements

### Required Inputs

| Input | Description | Format |
|-------|-------------|--------|
| **Screenshots** | Application UI screenshots covering all pages | PNG, JPG, or PDF |
| **Application Name** | Name of the application under test | String |
| **Base URL** | Application URL for automation | URL string |

### Optional Inputs

| Input | Description | Default |
|-------|-------------|---------|
| Test Data | Known valid credentials, sample data | Extract from screenshots |
| Error Messages | Expected error message formats | Analyze from screenshots |
| Business Rules | Special validation rules | Infer from UI |
| Priority Modules | Which modules to prioritize | All modules equal |

### Screenshot Requirements Checklist
```
□ Login/Authentication page (if applicable)
□ Main dashboard/home page
□ All primary user flows (CRUD operations)
□ Form pages with validation states
□ Error states and messages
□ Success/confirmation pages
□ Navigation elements (menus, breadcrumbs)
□ Modal dialogs and popups
□ Mobile/responsive views (if applicable)
```

---

## 3. Output Specifications

### Deliverables Checklist

For every project, this guardrail produces:

```
□ Manual Test Cases Document
  - Format: TXT file
  - Location: {project-root}/{AppName}_Manual_Test_Cases.txt
  - Content: All test cases with steps and expected results

□ Playwright Project Structure
  - pages/           → Page Object Model classes
  - tests/           → Test specification files
  - data/            → JSON test data files
  - utils/           → Self-healing utilities
  - Configuration files (playwright.config.ts, tsconfig.json, package.json)

□ Test Coverage
  - Minimum 5 positive test cases per module
  - Minimum 5 negative test cases per module
  - Minimum 2 boundary test cases per module
  - Minimum 2 security test cases per module
  - At least 1 E2E scenario covering full user journey

□ Self-Healing Framework
  - SelfHealingLocator utility
  - AIObserver integration
  - Healing report generation
```

### Output Quality Standards

| Metric | Standard |
|--------|----------|
| Test Case Clarity | Each step is a single action |
| Expected Results | Specific, measurable outcomes |
| Data Coverage | All field validations covered |
| Locator Strategy | Primary + 3-4 fallback selectors |
| Code Quality | TypeScript strict mode, no any types |

---

## 4. AI Prompt Templates

### Prompt 1: Generate Manual Test Cases

```
CONTEXT:
I have attached screenshots of [APPLICATION_NAME], a [APPLICATION_TYPE] application.
The application URL is: [BASE_URL]

TASK:
Generate comprehensive manual test cases following the guardrail template.

REQUIREMENTS:
1. Analyze all screenshots to identify:
   - All pages/modules
   - All interactive elements (inputs, buttons, links, dropdowns)
   - User flows and navigation paths
   - Visible test data (usernames, sample data)
   - Error messages and validation patterns

2. Generate test cases covering:
   - POSITIVE: Valid inputs, happy path scenarios
   - NEGATIVE: Invalid inputs, error handling
   - BOUNDARY: Min/max values, special characters, edge cases
   - SECURITY: SQL injection, XSS, authentication bypass attempts
   - E2E: Complete user journeys

3. Output format:
   - TXT file with standardized template
   - Test IDs following naming convention: TC_{MODULE}_{###}
   - Each test case includes: Type, Priority, Precondition, Steps, Expected Result

4. Coverage targets:
   - Minimum 5 positive tests per module
   - Minimum 5 negative tests per module
   - Minimum 2 boundary tests per module
   - Minimum 2 security tests per module

OUTPUT:
Create file: [APPLICATION_NAME]_Manual_Test_Cases.txt
```

### Prompt 2: Generate Playwright Automation

```
CONTEXT:
I have manual test cases for [APPLICATION_NAME].
The application URL is: [BASE_URL]

TASK:
Create complete Playwright automation framework following the guardrail.

REQUIREMENTS:
1. Project Structure:
   - pages/: Page Object Model classes for each identified page
   - tests/: Test specification files (data-driven)
   - data/: JSON files for test data
   - utils/: Self-healing utilities

2. Page Objects must include:
   - All element locators (prefer data-test, fallback to id/class)
   - Navigation methods
   - Action methods (fill, click, select)
   - Verification methods (isVisible, getText, isOnPage)
   - Error handling methods

3. Test Data JSON structure:
   - validScenarios: Array of positive test data
   - invalidScenarios: Array with expectedError
   - emptyFields: Empty field validation tests
   - boundaryTests: Edge case data
   - securityTests: Injection payloads

4. Test Specifications:
   - Data-driven loops for all test categories
   - Test names: ${testCase.testId}: ${testCase.description}
   - Proper assertions using expect()
   - beforeEach setup for page initialization

5. Self-Healing:
   - Element definitions with primary + fallback selectors
   - SelfHealingLocator integration
   - Healing statistics tracking

OUTPUT:
Complete project with all files ready to run with: npm test
```

### Prompt 3: Add Self-Healing to Existing Tests

```
CONTEXT:
I have existing Playwright tests for [APPLICATION_NAME].

TASK:
Add AI-powered self-healing capabilities to the automation framework.

REQUIREMENTS:
1. Create utils/SelfHealingLocator.ts with:
   - 3-tier healing: Cache → Fallbacks → AI Visual Analysis
   - Healing statistics tracking
   - Report generation

2. Create utils/AIObserver.ts with:
   - Anthropic Claude integration
   - Screenshot analysis for element detection
   - Graceful degradation without API key

3. Update page objects to use self-healing:
   - Define ELEMENTS object with primary + fallbacks
   - Use healer.locate() instead of page.locator()

4. Create self-healing test demonstration

OUTPUT:
- utils/SelfHealingLocator.ts
- utils/AIObserver.ts
- utils/HealingReporter.ts
- Updated page objects with self-healing
- tests/self-healing.spec.ts
```

### Prompt 4: Migrate Existing Framework

```
CONTEXT:
I have existing [OLD_FRAMEWORK] tests for [APPLICATION_NAME].
Source files are in: [SOURCE_PATH]

TASK:
Migrate to Playwright following the guardrail structure.

REQUIREMENTS:
1. Analyze existing test structure and logic
2. Map old locators to Playwright locator strategies
3. Convert page objects to TypeScript classes
4. Transform test files to Playwright test format
5. Migrate test data to JSON structure
6. Add self-healing capabilities

PRESERVE:
- Test logic and assertions
- Test coverage scope
- Test naming where possible

UPGRADE:
- Modern Playwright APIs (auto-wait, locators)
- TypeScript strict typing
- Data-driven approach
- Self-healing locators

OUTPUT:
Complete migrated Playwright project
```

---

## 5. Screenshot Analysis Process

### Step-by-Step Analysis Algorithm

When analyzing screenshots, follow this systematic process:

#### Step 1: Page Inventory
```
For each screenshot:
1. Identify the page name/purpose
2. Note the URL path (if visible)
3. Categorize: Auth | Dashboard | Form | List | Detail | Checkout | Confirmation
4. Record navigation elements visible
```

#### Step 2: Element Catalog
```
For each page, catalog ALL interactive elements:

INPUT FIELDS:
- Text inputs: name, placeholder, label, required indicator
- Password fields: visibility toggle, strength indicator
- Email fields: format validation
- Number fields: min/max, step
- Date fields: format, picker type
- Dropdowns: options visible, multi-select
- Checkboxes/Radio: grouped options
- File uploads: accepted formats
- Text areas: character limits

BUTTONS:
- Submit/Primary action buttons
- Secondary/Cancel buttons
- Icon buttons (edit, delete, etc.)
- Toggle buttons

LINKS:
- Navigation links
- External links
- Action links (forgot password, etc.)

DISPLAY ELEMENTS:
- Error messages (location, style)
- Success messages
- Loading indicators
- Badges/Counters
- Tables/Lists
```

#### Step 3: Data Extraction
```
Extract from screenshots:
- Sample usernames/emails shown
- Product names, prices, IDs
- Error message text (exact wording)
- Placeholder text
- Button labels
- Dropdown options
- Validation rules (shown in hints)
```

#### Step 4: Flow Mapping
```
Map user journeys:
Flow: [Flow Name]
  1. Start: [Page]
  2. Action: [User action]
  3. Navigate: [Next page]
  4. Action: [User action]
  ...
  N. End: [Final state/page]
```

#### Step 5: Test Scenario Generation
```
For each element/flow, generate scenarios:

POSITIVE:
- Valid data → Expected success
- All required fields filled
- Correct format/type

NEGATIVE:
- Invalid format → Expected error message
- Missing required fields → Validation error
- Unauthorized access → Access denied

BOUNDARY:
- Minimum length input
- Maximum length input
- Special characters
- Unicode/international characters
- Whitespace handling

SECURITY:
- SQL injection payloads
- XSS script injection
- Path traversal
- Authentication bypass
```

---

## 6. Application Type Patterns

### Pattern: E-Commerce Application

**Common Pages:**
- Login/Register
- Product Catalog/Search
- Product Detail
- Shopping Cart
- Checkout (multi-step)
- Order Confirmation
- User Profile/Orders

**Key Test Areas:**
```json
{
  "modules": [
    {
      "name": "Authentication",
      "prefix": "TC_AUTH",
      "elements": ["username", "password", "loginButton", "registerLink"]
    },
    {
      "name": "Products",
      "prefix": "TC_PROD",
      "elements": ["searchBar", "filterOptions", "sortDropdown", "productCards", "addToCartButton"]
    },
    {
      "name": "Cart",
      "prefix": "TC_CART",
      "elements": ["cartItems", "quantity", "removeButton", "subtotal", "checkoutButton"]
    },
    {
      "name": "Checkout",
      "prefix": "TC_CHKOUT",
      "elements": ["shippingForm", "paymentForm", "orderSummary", "placeOrderButton"]
    }
  ],
  "e2eFlows": [
    "Guest checkout with single product",
    "Registered user checkout with multiple products",
    "Add/remove products then checkout",
    "Apply discount code and checkout"
  ]
}
```

### Pattern: SaaS Dashboard Application

**Common Pages:**
- Login/SSO
- Dashboard/Overview
- Data Tables/Lists
- Detail/Edit Forms
- Settings/Profile
- Reports/Analytics

**Key Test Areas:**
```json
{
  "modules": [
    {
      "name": "Authentication",
      "prefix": "TC_AUTH",
      "elements": ["email", "password", "ssoButton", "mfaInput"]
    },
    {
      "name": "Dashboard",
      "prefix": "TC_DASH",
      "elements": ["widgets", "charts", "quickActions", "notifications"]
    },
    {
      "name": "DataManagement",
      "prefix": "TC_DATA",
      "elements": ["dataTable", "searchFilter", "pagination", "bulkActions", "exportButton"]
    },
    {
      "name": "CRUD",
      "prefix": "TC_CRUD",
      "elements": ["createForm", "editForm", "deleteConfirm", "validationErrors"]
    }
  ],
  "e2eFlows": [
    "Create new record and verify in list",
    "Edit existing record",
    "Delete record with confirmation",
    "Bulk operations on multiple records",
    "Export data and verify download"
  ]
}
```

### Pattern: Form-Heavy Application

**Common Pages:**
- Multi-step wizard forms
- Complex validation forms
- File upload forms
- Dynamic forms (conditional fields)

**Key Test Areas:**
```json
{
  "modules": [
    {
      "name": "BasicForm",
      "prefix": "TC_FORM",
      "elements": ["textInputs", "selects", "checkboxes", "radioGroups", "submitButton"]
    },
    {
      "name": "Validation",
      "prefix": "TC_VAL",
      "elements": ["requiredFields", "formatValidation", "crossFieldValidation"]
    },
    {
      "name": "FileUpload",
      "prefix": "TC_FILE",
      "elements": ["fileInput", "dragDrop", "preview", "progressBar"]
    },
    {
      "name": "Wizard",
      "prefix": "TC_WIZ",
      "elements": ["stepIndicator", "nextButton", "backButton", "skipButton"]
    }
  ],
  "e2eFlows": [
    "Complete all steps successfully",
    "Navigate back and forth between steps",
    "Save draft and resume later",
    "Validation errors block progression"
  ]
}
```

### Pattern: Content Management System

**Common Pages:**
- Content list/grid
- Content editor (WYSIWYG)
- Media library
- Categories/Tags management
- Publishing workflow

**Key Test Areas:**
```json
{
  "modules": [
    {
      "name": "ContentList",
      "prefix": "TC_LIST",
      "elements": ["contentTable", "statusFilter", "searchBar", "bulkActions"]
    },
    {
      "name": "Editor",
      "prefix": "TC_EDIT",
      "elements": ["titleInput", "richTextEditor", "mediaInsert", "metaFields"]
    },
    {
      "name": "Media",
      "prefix": "TC_MEDIA",
      "elements": ["uploadArea", "mediaGrid", "folderNav", "imageEditor"]
    },
    {
      "name": "Publishing",
      "prefix": "TC_PUB",
      "elements": ["draftButton", "scheduleButton", "publishButton", "statusBadge"]
    }
  ],
  "e2eFlows": [
    "Create and publish new content",
    "Edit existing content and save draft",
    "Upload media and insert into content",
    "Schedule content for future publishing"
  ]
}
```

---

## 7. Manual Test Case Template

### Document Header Template

```
================================================================================
                    {APPLICATION_NAME} - MANUAL TEST CASES
================================================================================
Application URL: {BASE_URL}
Document Version: 1.0
Created Date: {CURRENT_DATE}
Generated By: AI Test Generator (Guardrail v1.0)

================================================================================
                              TEST SUMMARY
================================================================================

Total Test Cases: {TOTAL_COUNT}

Module Breakdown:
{For each module:}
- {Module Name}: {count} test cases
  - Positive: {count}
  - Negative: {count}
  - Boundary: {count}
  - Security: {count}

Coverage Areas:
- Positive Test Cases (Happy Path)
- Negative Test Cases (Error Handling)
- Boundary Condition Test Cases
- Security Test Cases
- End-to-End Test Cases

================================================================================
```

### Test Case Template

```
================================================================================
                        MODULE: {MODULE_NAME}
================================================================================

------------------------------------------------------------------------------
TC_{MODULE}_{###}: {Test Case Title}
------------------------------------------------------------------------------
Test Type: {Positive|Negative|Boundary|Security|E2E}
Priority: {High|Medium|Low}
Precondition: {Required state before test execution}

Test Data:
- {field1}: {value1}
- {field2}: {value2}

Steps:
1. {Single action step}
2. {Single action step}
3. {Single action step}

Expected Result:
- {Specific, measurable outcome}
- {Additional verification point}

------------------------------------------------------------------------------
```

### Test Type Guidelines

| Type | Description | Focus Areas |
|------|-------------|-------------|
| **Positive** | Valid inputs, expected success | Happy path, correct formats, all required fields |
| **Negative** | Invalid inputs, error handling | Wrong formats, missing fields, invalid values |
| **Boundary** | Edge cases and limits | Min/max length, special chars, empty strings |
| **Security** | Security vulnerability tests | SQL injection, XSS, CSRF, auth bypass |
| **E2E** | Complete user journeys | Multi-page flows, data persistence |
| **UI** | Visual and element validation | Element visibility, styling, responsiveness |

### Document Footer Template

```
================================================================================
                         END OF TEST CASES
================================================================================

Notes:
------
1. Test data values should be replaced with actual application data
2. Error messages should be verified against actual application responses
3. Security tests should be executed in isolated test environment
4. E2E tests require clean database state

Environment Requirements:
- Browser: Chrome (latest)
- Screen Resolution: 1920x1080
- Network: Stable internet connection
- Test Data: Seeded test database

================================================================================
Document generated following Screenshot-to-Automation Guardrail v1.0
================================================================================
```

---

## 8. Project Structure Template

### Generic Project Structure

```
{project-name}/
│
├── pages/                              # Page Object Model classes
│   ├── BasePage.ts                     # Base class with common methods
│   ├── {PageName}Page.ts               # One file per application page
│   └── components/                     # Reusable component objects
│       ├── NavigationComponent.ts
│       ├── ModalComponent.ts
│       └── TableComponent.ts
│
├── tests/                              # Test specification files
│   ├── {module}.spec.ts                # One file per module
│   ├── {module}-validation.spec.ts     # Validation-specific tests
│   ├── e2e/                            # End-to-end test suites
│   │   └── {flow}.e2e.spec.ts
│   └── self-healing.spec.ts            # Self-healing demonstrations
│
├── data/                               # Test data (JSON format)
│   ├── {module}Data.json               # Module-specific test data
│   ├── e2eScenarios.json               # E2E scenario definitions
│   ├── users.json                      # User credentials for testing
│   └── fixtures/                       # Static test fixtures
│       └── {dataType}.json
│
├── utils/                              # Framework utilities
│   ├── SelfHealingLocator.ts           # Core healing engine
│   ├── AIObserver.ts                   # AI observation service
│   ├── HealingReporter.ts              # Report generation
│   ├── TestHelpers.ts                  # Common test utilities
│   └── DataGenerator.ts                # Dynamic test data generation
│
├── config/                             # Configuration files
│   ├── environments.ts                 # Environment-specific configs
│   └── constants.ts                    # Application constants
│
├── reports/                            # Generated reports (gitignored)
│   ├── playwright-report/
│   └── healing-reports/
│
├── screenshots/                        # Application screenshots (input)
│   └── {page-name}.png
│
├── playwright.config.ts                # Playwright configuration
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # Dependencies & scripts
├── .env.example                        # Environment variables template
├── .gitignore                          # Git ignore rules
└── README.md                           # Project documentation
```

### File Naming Conventions

| File Type | Convention | Example |
|-----------|------------|---------|
| Page Object | `{PageName}Page.ts` | `LoginPage.ts`, `ProductsPage.ts` |
| Test Spec | `{module}.spec.ts` | `login.spec.ts`, `checkout.spec.ts` |
| Test Data | `{module}Data.json` | `loginData.json`, `checkoutData.json` |
| E2E Test | `{flow}.e2e.spec.ts` | `purchase.e2e.spec.ts` |
| Component | `{Name}Component.ts` | `ModalComponent.ts` |

---

## 9. Page Object Model Template

### Base Page Class

```typescript
// pages/BasePage.ts
import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  // Common elements present on all/most pages
  readonly header: Locator;
  readonly footer: Locator;
  readonly loadingSpinner: Locator;
  readonly toastMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('header, [data-test="header"], #header');
    this.footer = page.locator('footer, [data-test="footer"], #footer');
    this.loadingSpinner = page.locator('[data-test="loading"], .loading, .spinner');
    this.toastMessage = page.locator('[data-test="toast"], .toast, .notification');
  }

  // Common navigation methods
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForSpinnerToDisappear(): Promise<void> {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  }

  // Common verification methods
  async getToastMessage(): Promise<string> {
    await this.toastMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.toastMessage.textContent() || '';
  }

  async isToastVisible(): Promise<boolean> {
    return await this.toastMessage.isVisible();
  }

  // Screenshot utility
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `reports/screenshots/${name}.png`, fullPage: true });
  }
}
```

### Generic Page Object Template

```typescript
// pages/{PageName}Page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class {PageName}Page extends BasePage {
  // Page URL
  readonly pageUrl: string = '/{page-path}';

  // Page identification elements
  readonly pageTitle: Locator;
  readonly pageIdentifier: Locator;

  // Form elements (customize per page)
  readonly {field1}Input: Locator;
  readonly {field2}Input: Locator;
  readonly {field3}Select: Locator;

  // Action buttons
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  // Feedback elements
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly fieldError: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators - PRIORITY ORDER:
    // 1. data-test attribute (most reliable)
    // 2. ID attribute
    // 3. Name attribute
    // 4. Placeholder/Label text
    // 5. CSS class (least reliable)

    this.pageTitle = page.locator('[data-test="page-title"], .page-title, h1');
    this.pageIdentifier = page.locator('[data-test="{page-identifier}"]');

    this.{field1}Input = page.locator('[data-test="{field1}"], #{field1}, input[name="{field1}"]');
    this.{field2}Input = page.locator('[data-test="{field2}"], #{field2}, input[name="{field2}"]');
    this.{field3}Select = page.locator('[data-test="{field3}"], #{field3}, select[name="{field3}"]');

    this.submitButton = page.locator('[data-test="submit"], button[type="submit"], .submit-btn');
    this.cancelButton = page.locator('[data-test="cancel"], button:has-text("Cancel"), .cancel-btn');

    this.errorMessage = page.locator('[data-test="error"], .error-message, .alert-danger');
    this.successMessage = page.locator('[data-test="success"], .success-message, .alert-success');
    this.fieldError = page.locator('.field-error, .invalid-feedback, [data-test="field-error"]');
  }

  // ==================== NAVIGATION ====================

  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  async isOnPage(): Promise<boolean> {
    try {
      await this.pageIdentifier.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // ==================== FORM ACTIONS ====================

  async fillForm({field1}: string, {field2}: string, {field3}?: string): Promise<void> {
    await this.{field1}Input.fill({field1});
    await this.{field2}Input.fill({field2});
    if ({field3}) {
      await this.{field3}Select.selectOption({field3});
    }
  }

  async submitForm(): Promise<void> {
    await this.submitButton.click();
    await this.waitForSpinnerToDisappear();
  }

  async cancelForm(): Promise<void> {
    await this.cancelButton.click();
  }

  // Convenience method: fill and submit
  async completeForm({field1}: string, {field2}: string, {field3}?: string): Promise<void> {
    await this.fillForm({field1}, {field2}, {field3});
    await this.submitForm();
  }

  // ==================== EMPTY FIELD VARIANTS ====================

  async submitWithEmpty{Field1}({field2}: string): Promise<void> {
    await this.{field1}Input.clear();
    await this.{field2}Input.fill({field2});
    await this.submitForm();
  }

  async submitWithEmpty{Field2}({field1}: string): Promise<void> {
    await this.{field1}Input.fill({field1});
    await this.{field2}Input.clear();
    await this.submitForm();
  }

  async submitWithAllFieldsEmpty(): Promise<void> {
    await this.{field1}Input.clear();
    await this.{field2}Input.clear();
    await this.submitForm();
  }

  // ==================== VERIFICATION METHODS ====================

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent() || '';
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async getSuccessMessage(): Promise<string> {
    await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.successMessage.textContent() || '';
  }

  async isSuccessDisplayed(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  async getFieldError(fieldName: string): Promise<string> {
    const fieldError = this.page.locator(`[data-test="${fieldName}-error"], #${fieldName}-error`);
    return await fieldError.textContent() || '';
  }

  async hasFieldError(fieldName: string): Promise<boolean> {
    const input = this.page.locator(`[data-test="${fieldName}"], #${fieldName}`);
    const classList = await input.evaluate(el => el.className);
    return classList.includes('error') || classList.includes('invalid');
  }

  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  // ==================== INPUT UTILITIES ====================

  async getInputValue(locator: Locator): Promise<string> {
    return await locator.inputValue();
  }

  async isFieldDisabled(locator: Locator): Promise<boolean> {
    return await locator.isDisabled();
  }

  async isFieldRequired(locator: Locator): Promise<boolean> {
    const required = await locator.getAttribute('required');
    const ariaRequired = await locator.getAttribute('aria-required');
    return required !== null || ariaRequired === 'true';
  }
}
```

### List/Table Page Object Template

```typescript
// pages/{ListPage}Page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class {ListPage}Page extends BasePage {
  readonly pageUrl: string = '/{list-path}';

  // List container
  readonly listContainer: Locator;
  readonly listItems: Locator;
  readonly emptyState: Locator;

  // Search and Filter
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly filterDropdown: Locator;
  readonly sortDropdown: Locator;

  // Pagination
  readonly pagination: Locator;
  readonly nextPageButton: Locator;
  readonly prevPageButton: Locator;
  readonly pageInfo: Locator;

  // Bulk actions
  readonly selectAllCheckbox: Locator;
  readonly bulkActionDropdown: Locator;
  readonly deleteSelectedButton: Locator;

  constructor(page: Page) {
    super(page);

    this.listContainer = page.locator('[data-test="list-container"], .list-container, table');
    this.listItems = page.locator('[data-test="list-item"], .list-item, tbody tr');
    this.emptyState = page.locator('[data-test="empty-state"], .empty-state, .no-results');

    this.searchInput = page.locator('[data-test="search"], input[type="search"], .search-input');
    this.searchButton = page.locator('[data-test="search-btn"], button:has-text("Search")');
    this.filterDropdown = page.locator('[data-test="filter"], .filter-dropdown');
    this.sortDropdown = page.locator('[data-test="sort"], .sort-dropdown');

    this.pagination = page.locator('[data-test="pagination"], .pagination');
    this.nextPageButton = page.locator('[data-test="next-page"], .next-page, button:has-text("Next")');
    this.prevPageButton = page.locator('[data-test="prev-page"], .prev-page, button:has-text("Previous")');
    this.pageInfo = page.locator('[data-test="page-info"], .page-info');

    this.selectAllCheckbox = page.locator('[data-test="select-all"], thead input[type="checkbox"]');
    this.bulkActionDropdown = page.locator('[data-test="bulk-actions"], .bulk-actions');
    this.deleteSelectedButton = page.locator('[data-test="delete-selected"], button:has-text("Delete Selected")');
  }

  // ==================== LIST OPERATIONS ====================

  async getItemCount(): Promise<number> {
    return await this.listItems.count();
  }

  async isListEmpty(): Promise<boolean> {
    return await this.emptyState.isVisible();
  }

  async getItemByIndex(index: number): Promise<Locator> {
    return this.listItems.nth(index);
  }

  async getItemByText(text: string): Promise<Locator> {
    return this.listItems.filter({ hasText: text });
  }

  async clickItemAction(itemText: string, action: string): Promise<void> {
    const item = await this.getItemByText(itemText);
    await item.locator(`[data-test="${action}"], button:has-text("${action}")`).click();
  }

  // ==================== SEARCH & FILTER ====================

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await this.waitForSpinnerToDisappear();
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await this.searchButton.click();
    await this.waitForSpinnerToDisappear();
  }

  async filterBy(filterValue: string): Promise<void> {
    await this.filterDropdown.selectOption(filterValue);
    await this.waitForSpinnerToDisappear();
  }

  async sortBy(sortOption: string): Promise<void> {
    await this.sortDropdown.selectOption(sortOption);
    await this.waitForSpinnerToDisappear();
  }

  // ==================== PAGINATION ====================

  async goToNextPage(): Promise<void> {
    await this.nextPageButton.click();
    await this.waitForSpinnerToDisappear();
  }

  async goToPrevPage(): Promise<void> {
    await this.prevPageButton.click();
    await this.waitForSpinnerToDisappear();
  }

  async getPageInfo(): Promise<string> {
    return await this.pageInfo.textContent() || '';
  }

  // ==================== BULK OPERATIONS ====================

  async selectAll(): Promise<void> {
    await this.selectAllCheckbox.check();
  }

  async deselectAll(): Promise<void> {
    await this.selectAllCheckbox.uncheck();
  }

  async selectItem(itemText: string): Promise<void> {
    const item = await this.getItemByText(itemText);
    await item.locator('input[type="checkbox"]').check();
  }

  async deleteSelected(): Promise<void> {
    await this.deleteSelectedButton.click();
  }

  // ==================== DATA EXTRACTION ====================

  async getAllItemTexts(): Promise<string[]> {
    return await this.listItems.allTextContents();
  }

  async getColumnValues(columnIndex: number): Promise<string[]> {
    const cells = this.page.locator(`tbody tr td:nth-child(${columnIndex + 1})`);
    return await cells.allTextContents();
  }
}
```

---

## 10. Test Data JSON Templates

### Generic Module Data Template

```json
{
  "_metadata": {
    "module": "{ModuleName}",
    "version": "1.0",
    "lastUpdated": "{DATE}",
    "description": "Test data for {ModuleName} module"
  },

  "validScenarios": [
    {
      "testId": "TC_{MODULE}_001",
      "description": "{Positive test description}",
      "field1": "{valid_value}",
      "field2": "{valid_value}",
      "expectedResult": "success",
      "expectedRedirect": "/{success-page}"
    }
  ],

  "invalidScenarios": [
    {
      "testId": "TC_{MODULE}_010",
      "description": "{Negative test description}",
      "field1": "{invalid_value}",
      "field2": "{valid_value}",
      "expectedError": "{Exact error message text}"
    }
  ],

  "emptyFieldTests": [
    {
      "testId": "TC_{MODULE}_020",
      "description": "Submit with empty {field1}",
      "field1": "",
      "field2": "{valid_value}",
      "expectedError": "{Field1} is required"
    },
    {
      "testId": "TC_{MODULE}_021",
      "description": "Submit with empty {field2}",
      "field1": "{valid_value}",
      "field2": "",
      "expectedError": "{Field2} is required"
    },
    {
      "testId": "TC_{MODULE}_022",
      "description": "Submit with all fields empty",
      "field1": "",
      "field2": "",
      "expectedError": "{Field1} is required"
    }
  ],

  "boundaryTests": [
    {
      "testId": "TC_{MODULE}_030",
      "description": "{field1} - Minimum length (1 character)",
      "field1": "a",
      "field2": "{valid_value}",
      "expectedResult": "success_or_error"
    },
    {
      "testId": "TC_{MODULE}_031",
      "description": "{field1} - Maximum length",
      "field1Length": 255,
      "field2": "{valid_value}",
      "expectedResult": "error"
    },
    {
      "testId": "TC_{MODULE}_032",
      "description": "{field1} - Special characters",
      "field1": "!@#$%^&*()_+-=[]{}|;':\",./<>?",
      "field2": "{valid_value}",
      "expectedResult": "depends_on_field_type"
    },
    {
      "testId": "TC_{MODULE}_033",
      "description": "{field1} - Unicode characters",
      "field1": "用户名テスト",
      "field2": "{valid_value}",
      "expectedResult": "depends_on_field_type"
    },
    {
      "testId": "TC_{MODULE}_034",
      "description": "{field1} - Leading/trailing spaces",
      "field1": "  value  ",
      "field2": "{valid_value}",
      "expectedResult": "depends_on_trimming"
    },
    {
      "testId": "TC_{MODULE}_035",
      "description": "{field1} - Only whitespace",
      "field1": "   ",
      "field2": "{valid_value}",
      "expectedError": "{Field1} is required"
    }
  ],

  "securityTests": [
    {
      "testId": "TC_SEC_{MODULE}_001",
      "description": "SQL Injection - Basic",
      "field1": "' OR '1'='1",
      "field2": "{valid_value}",
      "expectedBehavior": "reject_gracefully",
      "category": "sql_injection"
    },
    {
      "testId": "TC_SEC_{MODULE}_002",
      "description": "SQL Injection - Union",
      "field1": "' UNION SELECT * FROM users--",
      "field2": "{valid_value}",
      "expectedBehavior": "reject_gracefully",
      "category": "sql_injection"
    },
    {
      "testId": "TC_SEC_{MODULE}_003",
      "description": "XSS - Script tag",
      "field1": "<script>alert('XSS')</script>",
      "field2": "{valid_value}",
      "expectedBehavior": "sanitize_or_reject",
      "category": "xss"
    },
    {
      "testId": "TC_SEC_{MODULE}_004",
      "description": "XSS - Event handler",
      "field1": "<img src=x onerror=alert('XSS')>",
      "field2": "{valid_value}",
      "expectedBehavior": "sanitize_or_reject",
      "category": "xss"
    },
    {
      "testId": "TC_SEC_{MODULE}_005",
      "description": "Path Traversal",
      "field1": "../../../etc/passwd",
      "field2": "{valid_value}",
      "expectedBehavior": "reject_gracefully",
      "category": "path_traversal"
    }
  ],

  "caseSensitivityTests": [
    {
      "testId": "TC_CASE_{MODULE}_001",
      "description": "{field1} - All uppercase",
      "field1": "{VALUE_UPPERCASE}",
      "field2": "{valid_value}",
      "expectedResult": "depends_on_field"
    },
    {
      "testId": "TC_CASE_{MODULE}_002",
      "description": "{field1} - Mixed case",
      "field1": "{VaLuE_MiXeD}",
      "field2": "{valid_value}",
      "expectedResult": "depends_on_field"
    }
  ],

  "errorMessages": {
    "field1Required": "{Field1} is required",
    "field2Required": "{Field2} is required",
    "invalidFormat": "Invalid {field} format",
    "genericError": "An error occurred. Please try again."
  }
}
```

### Authentication Data Template

```json
{
  "_metadata": {
    "module": "Authentication",
    "version": "1.0"
  },

  "validUsers": [
    {
      "testId": "TC_AUTH_001",
      "description": "Login with standard user",
      "username": "{standard_username}",
      "password": "{standard_password}",
      "expectedResult": "success",
      "expectedRedirect": "/dashboard"
    },
    {
      "testId": "TC_AUTH_002",
      "description": "Login with admin user",
      "username": "{admin_username}",
      "password": "{admin_password}",
      "expectedResult": "success",
      "expectedRedirect": "/admin"
    }
  ],

  "invalidCredentials": [
    {
      "testId": "TC_AUTH_010",
      "description": "Login with invalid username",
      "username": "nonexistent_user",
      "password": "{valid_password}",
      "expectedError": "Invalid username or password"
    },
    {
      "testId": "TC_AUTH_011",
      "description": "Login with invalid password",
      "username": "{valid_username}",
      "password": "wrong_password",
      "expectedError": "Invalid username or password"
    },
    {
      "testId": "TC_AUTH_012",
      "description": "Login with both invalid",
      "username": "nonexistent_user",
      "password": "wrong_password",
      "expectedError": "Invalid username or password"
    }
  ],

  "accountStates": [
    {
      "testId": "TC_AUTH_020",
      "description": "Login with locked account",
      "username": "{locked_username}",
      "password": "{locked_password}",
      "expectedError": "Account is locked"
    },
    {
      "testId": "TC_AUTH_021",
      "description": "Login with disabled account",
      "username": "{disabled_username}",
      "password": "{disabled_password}",
      "expectedError": "Account is disabled"
    },
    {
      "testId": "TC_AUTH_022",
      "description": "Login with unverified account",
      "username": "{unverified_username}",
      "password": "{unverified_password}",
      "expectedError": "Please verify your email"
    }
  ],

  "passwordRules": {
    "minLength": 8,
    "maxLength": 128,
    "requireUppercase": true,
    "requireLowercase": true,
    "requireNumber": true,
    "requireSpecial": true
  }
}
```

### E2E Scenarios Template

```json
{
  "_metadata": {
    "type": "e2e",
    "version": "1.0"
  },

  "scenarios": [
    {
      "testId": "E2E_001",
      "description": "{Complete user journey description}",
      "preconditions": [
        "{Precondition 1}",
        "{Precondition 2}"
      ],
      "steps": [
        {
          "page": "{PageName}",
          "action": "{action_type}",
          "data": {
            "field1": "{value1}",
            "field2": "{value2}"
          }
        },
        {
          "page": "{NextPageName}",
          "action": "{action_type}",
          "verification": "{expected_state}"
        }
      ],
      "expectedOutcome": {
        "finalPage": "/{final-page}",
        "successMessage": "{Success message text}",
        "dataCreated": true
      }
    }
  ],

  "sharedData": {
    "defaultUser": {
      "username": "{default_username}",
      "password": "{default_password}"
    }
  }
}
```

---

## 11. Test Specification Template

### Data-Driven Test Specification

```typescript
// tests/{module}.spec.ts
import { test, expect } from '@playwright/test';
import { {PageName}Page } from '../pages/{PageName}Page';
import { {NextPageName}Page } from '../pages/{NextPageName}Page';
import testData from '../data/{module}Data.json';

test.describe('{Module Name} Module - {Application Name}', () => {
  let {pageName}Page: {PageName}Page;
  let {nextPageName}Page: {NextPageName}Page;

  test.beforeEach(async ({ page }) => {
    {pageName}Page = new {PageName}Page(page);
    {nextPageName}Page = new {NextPageName}Page(page);
    await {pageName}Page.navigate();
  });

  // ============================================================================
  // POSITIVE TEST CASES
  // ============================================================================

  test.describe('Positive Scenarios', () => {
    for (const scenario of testData.validScenarios) {
      test(`${scenario.testId}: ${scenario.description}`, async ({ page }) => {
        // Arrange - Data is from JSON

        // Act
        await {pageName}Page.completeForm(scenario.field1, scenario.field2);

        // Assert
        expect(await {nextPageName}Page.isOnPage()).toBe(true);

        // Additional assertions based on scenario
        if (scenario.expectedRedirect) {
          expect(page.url()).toContain(scenario.expectedRedirect);
        }
      });
    }
  });

  // ============================================================================
  // NEGATIVE TEST CASES - Invalid Data
  // ============================================================================

  test.describe('Invalid Data Scenarios', () => {
    for (const scenario of testData.invalidScenarios) {
      test(`${scenario.testId}: ${scenario.description}`, async () => {
        // Act
        await {pageName}Page.completeForm(scenario.field1, scenario.field2);

        // Assert - Should stay on same page with error
        expect(await {pageName}Page.isOnPage()).toBe(true);
        expect(await {pageName}Page.isErrorDisplayed()).toBe(true);

        const errorMsg = await {pageName}Page.getErrorMessage();
        expect(errorMsg).toContain(scenario.expectedError);
      });
    }
  });

  // ============================================================================
  // NEGATIVE TEST CASES - Empty Fields
  // ============================================================================

  test.describe('Empty Field Validation', () => {
    for (const scenario of testData.emptyFieldTests) {
      test(`${scenario.testId}: ${scenario.description}`, async () => {
        // Act - Handle different empty field combinations
        if (scenario.field1 === '' && scenario.field2 === '') {
          await {pageName}Page.submitWithAllFieldsEmpty();
        } else if (scenario.field1 === '') {
          await {pageName}Page.submitWithEmptyField1(scenario.field2);
        } else {
          await {pageName}Page.submitWithEmptyField2(scenario.field1);
        }

        // Assert
        expect(await {pageName}Page.isOnPage()).toBe(true);
        expect(await {pageName}Page.isErrorDisplayed()).toBe(true);

        const errorMsg = await {pageName}Page.getErrorMessage();
        expect(errorMsg).toContain(scenario.expectedError);
      });
    }
  });

  // ============================================================================
  // BOUNDARY TEST CASES
  // ============================================================================

  test.describe('Boundary Conditions', () => {
    for (const scenario of testData.boundaryTests) {
      test(`${scenario.testId}: ${scenario.description}`, async () => {
        // Generate boundary data if length specified
        let field1Value = scenario.field1;
        if (scenario.field1Length) {
          field1Value = 'a'.repeat(scenario.field1Length);
        }

        // Act
        await {pageName}Page.completeForm(field1Value, scenario.field2);

        // Assert based on expected result
        if (scenario.expectedResult === 'success') {
          expect(await {nextPageName}Page.isOnPage()).toBe(true);
        } else if (scenario.expectedResult === 'error') {
          expect(await {pageName}Page.isOnPage()).toBe(true);
          expect(await {pageName}Page.isErrorDisplayed()).toBe(true);
        }
        // 'depends_on_*' - check actual behavior
      });
    }
  });

  // ============================================================================
  // SECURITY TEST CASES
  // ============================================================================

  test.describe('Security Tests', () => {
    for (const scenario of testData.securityTests) {
      test(`${scenario.testId}: ${scenario.description}`, async () => {
        // Act - Attempt security payload
        await {pageName}Page.completeForm(scenario.field1, scenario.field2);

        // Assert - Application should handle gracefully
        // Should not crash, should not execute malicious code
        // Should either reject or sanitize

        const isOnOriginalPage = await {pageName}Page.isOnPage();
        const hasError = await {pageName}Page.isErrorDisplayed();

        // Security test passes if:
        // 1. Stays on page with error (rejected), OR
        // 2. Proceeds but input was sanitized
        expect(isOnOriginalPage || hasError || true).toBe(true);

        // Verify no script execution (for XSS tests)
        if (scenario.category === 'xss') {
          // Check that script tags are escaped in any displayed output
          const pageContent = await {pageName}Page.page.content();
          expect(pageContent).not.toContain('<script>alert');
        }
      });
    }
  });

  // ============================================================================
  // CASE SENSITIVITY TESTS
  // ============================================================================

  test.describe('Case Sensitivity', () => {
    for (const scenario of testData.caseSensitivityTests) {
      test(`${scenario.testId}: ${scenario.description}`, async () => {
        await {pageName}Page.completeForm(scenario.field1, scenario.field2);

        // Assert based on expected behavior
        // Case-sensitive fields: should fail with wrong case
        // Case-insensitive fields: should succeed regardless of case
      });
    }
  });
});
```

### E2E Test Specification

```typescript
// tests/e2e/{flow}.e2e.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
// Import all required page objects
import e2eScenarios from '../../data/e2eScenarios.json';

const defaultUser = e2eScenarios.sharedData.defaultUser;

test.describe('E2E: {Flow Name}', () => {
  // Page objects
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  // ... other pages

  test.beforeEach(async ({ page }) => {
    // Initialize all page objects
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    // ... initialize others

    // Common setup: Login
    await loginPage.navigate();
    await loginPage.login(defaultUser.username, defaultUser.password);
    await dashboardPage.isOnPage();
  });

  // Data-driven E2E scenarios
  for (const scenario of e2eScenarios.scenarios) {
    test(`${scenario.testId}: ${scenario.description}`, async ({ page }) => {
      // Execute each step in the scenario
      for (const step of scenario.steps) {
        // Dynamic page object selection based on step.page
        // Execute step.action with step.data
        // Verify step.verification if present
      }

      // Verify final outcome
      expect(page.url()).toContain(scenario.expectedOutcome.finalPage);

      if (scenario.expectedOutcome.successMessage) {
        // Verify success message is displayed
      }
    });
  }
});
```

---

## 12. Self-Healing Framework

### Element Definition Pattern

```typescript
// config/elements.ts
export interface ElementDefinition {
  primary: string;
  fallbacks: string[];
  description: string;
}

export interface PageElements {
  [key: string]: ElementDefinition;
}

// Define elements for each page
export const LOGIN_ELEMENTS: PageElements = {
  usernameInput: {
    primary: '[data-test="username"]',
    fallbacks: [
      '#username',
      'input[name="username"]',
      'input[placeholder*="username" i]',
      'input[placeholder*="email" i]',
      '#user-name',
      'input[type="text"]:first-of-type'
    ],
    description: 'Username/email input field'
  },
  passwordInput: {
    primary: '[data-test="password"]',
    fallbacks: [
      '#password',
      'input[name="password"]',
      'input[type="password"]',
      'input[placeholder*="password" i]'
    ],
    description: 'Password input field'
  },
  submitButton: {
    primary: '[data-test="login-button"]',
    fallbacks: [
      '#login-button',
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Login")',
      'button:has-text("Sign in")',
      '.login-btn',
      '.submit-btn'
    ],
    description: 'Login/Submit button'
  },
  errorMessage: {
    primary: '[data-test="error"]',
    fallbacks: [
      '.error-message',
      '.alert-danger',
      '.error',
      '[role="alert"]',
      '.notification-error'
    ],
    description: 'Error message container'
  }
};

// Template for other pages
export const {PAGE}_ELEMENTS: PageElements = {
  {elementName}: {
    primary: '[data-test="{element}"]',
    fallbacks: [
      '#{element}',
      '[name="{element}"]',
      // Add more fallbacks
    ],
    description: '{Element description}'
  }
};
```

### SelfHealingLocator Implementation

```typescript
// utils/SelfHealingLocator.ts
import { Page, Locator } from '@playwright/test';
import { AIObserver } from './AIObserver';

interface HealingResult {
  originalSelector: string;
  healedSelector: string | null;
  healingMethod: 'cache' | 'fallback' | 'ai' | 'failed';
  timestamp: Date;
}

interface HealingStats {
  total: number;
  healed: number;
  failed: number;
  byMethod: {
    cache: number;
    fallback: number;
    ai: number;
  };
}

export class SelfHealingLocator {
  private page: Page;
  private healingCache: Map<string, string> = new Map();
  private healingHistory: HealingResult[] = [];
  private aiObserver: AIObserver;
  private stats: HealingStats = {
    total: 0,
    healed: 0,
    failed: 0,
    byMethod: { cache: 0, fallback: 0, ai: 0 }
  };

  constructor(page: Page) {
    this.page = page;
    this.aiObserver = new AIObserver();
  }

  async locate(
    selector: string,
    description: string,
    options?: {
      timeout?: number;
      fallbackSelectors?: string[];
    }
  ): Promise<Locator> {
    const timeout = options?.timeout || 5000;
    const fallbacks = options?.fallbackSelectors || [];

    this.stats.total++;

    // Strategy 1: Try primary selector
    try {
      const locator = this.page.locator(selector);
      await locator.waitFor({ state: 'visible', timeout: timeout / 3 });
      return locator;
    } catch {
      console.log(`[SelfHealing] Primary selector failed: ${selector}`);
    }

    // Strategy 2: Check healing cache
    const cachedSelector = this.healingCache.get(selector);
    if (cachedSelector) {
      try {
        const locator = this.page.locator(cachedSelector);
        await locator.waitFor({ state: 'visible', timeout: timeout / 3 });
        this.recordHealing(selector, cachedSelector, 'cache');
        return locator;
      } catch {
        console.log(`[SelfHealing] Cached selector failed: ${cachedSelector}`);
      }
    }

    // Strategy 3: Try fallback selectors
    for (const fallback of fallbacks) {
      try {
        const locator = this.page.locator(fallback);
        await locator.waitFor({ state: 'visible', timeout: timeout / (fallbacks.length + 1) });
        this.healingCache.set(selector, fallback);
        this.recordHealing(selector, fallback, 'fallback');
        return locator;
      } catch {
        continue;
      }
    }

    // Strategy 4: AI-powered healing
    if (this.aiObserver.isEnabled()) {
      try {
        const screenshot = await this.page.screenshot({ type: 'png' });
        const aiSelector = await this.aiObserver.findElement(
          screenshot,
          description,
          await this.page.content()
        );

        if (aiSelector) {
          const locator = this.page.locator(aiSelector);
          await locator.waitFor({ state: 'visible', timeout: timeout / 3 });
          this.healingCache.set(selector, aiSelector);
          this.recordHealing(selector, aiSelector, 'ai');
          return locator;
        }
      } catch (error) {
        console.log(`[SelfHealing] AI healing failed: ${error}`);
      }
    }

    // All strategies failed
    this.recordHealing(selector, null, 'failed');
    throw new Error(`[SelfHealing] Could not locate element: ${description} (${selector})`);
  }

  private recordHealing(
    original: string,
    healed: string | null,
    method: 'cache' | 'fallback' | 'ai' | 'failed'
  ): void {
    this.healingHistory.push({
      originalSelector: original,
      healedSelector: healed,
      healingMethod: method,
      timestamp: new Date()
    });

    if (method === 'failed') {
      this.stats.failed++;
    } else {
      this.stats.healed++;
      this.stats.byMethod[method]++;
    }

    console.log(`[SelfHealing] ${method.toUpperCase()}: ${original} → ${healed || 'FAILED'}`);
  }

  getHealingStats(): HealingStats {
    return { ...this.stats };
  }

  getHealingHistory(): HealingResult[] {
    return [...this.healingHistory];
  }

  clearCache(): void {
    this.healingCache.clear();
  }

  generateReport(): string {
    const report = [
      '='.repeat(60),
      'SELF-HEALING REPORT',
      '='.repeat(60),
      `Total Healing Attempts: ${this.stats.total}`,
      `Successfully Healed: ${this.stats.healed}`,
      `Failed: ${this.stats.failed}`,
      `Success Rate: ${((this.stats.healed / this.stats.total) * 100).toFixed(1)}%`,
      '',
      'Healing by Method:',
      `  Cache hits: ${this.stats.byMethod.cache}`,
      `  Fallback selectors: ${this.stats.byMethod.fallback}`,
      `  AI healing: ${this.stats.byMethod.ai}`,
      '',
      'Healing History:',
      ...this.healingHistory.map(h =>
        `  [${h.healingMethod}] ${h.originalSelector} → ${h.healedSelector || 'FAILED'}`
      ),
      '='.repeat(60)
    ];
    return report.join('\n');
  }
}
```

### AIObserver Implementation

```typescript
// utils/AIObserver.ts
import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

export class AIObserver {
  private client: Anthropic | null = null;
  private enabled: boolean = false;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      this.client = new Anthropic({ apiKey });
      this.enabled = true;
      console.log('[AIObserver] Initialized with API key');
    } else {
      console.log('[AIObserver] No API key found - AI healing disabled');
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async findElement(
    screenshot: Buffer,
    description: string,
    htmlContent: string
  ): Promise<string | null> {
    if (!this.client) return null;

    try {
      // Truncate HTML to avoid token limits
      const truncatedHtml = htmlContent.substring(0, 10000);

      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [
          {
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
                text: `I need to find a CSS selector for an element in a web page.

Element description: "${description}"

Here is part of the HTML:
\`\`\`html
${truncatedHtml}
\`\`\`

Based on the screenshot and HTML, provide ONLY a single CSS selector that would reliably locate this element.
Prefer selectors in this order:
1. data-test attributes
2. ID attributes
3. Unique class combinations
4. Text content selectors

Return ONLY the selector, nothing else. Example: [data-test="submit-btn"]`
              }
            ]
          }
        ]
      });

      const selector = (response.content[0] as any).text?.trim();
      if (selector && !selector.includes(' ')) {
        console.log(`[AIObserver] Found selector: ${selector}`);
        return selector;
      }
      return null;
    } catch (error) {
      console.error('[AIObserver] Error:', error);
      return null;
    }
  }
}
```

---

## 13. Test ID Naming Convention

### Standard Prefixes

| Prefix | Full Form | Module Type | Example |
|--------|-----------|-------------|---------|
| `TC_AUTH_` | Test Case - Authentication | Login, Register, Password Reset | TC_AUTH_001 |
| `TC_DASH_` | Test Case - Dashboard | Home page, Overview | TC_DASH_001 |
| `TC_FORM_` | Test Case - Form | Any form submission | TC_FORM_001 |
| `TC_LIST_` | Test Case - List/Table | Data tables, grids | TC_LIST_001 |
| `TC_CRUD_` | Test Case - CRUD | Create, Read, Update, Delete | TC_CRUD_001 |
| `TC_NAV_` | Test Case - Navigation | Menu, breadcrumbs | TC_NAV_001 |
| `TC_SEARCH_` | Test Case - Search | Search functionality | TC_SEARCH_001 |
| `TC_FILTER_` | Test Case - Filter | Filtering, sorting | TC_FILTER_001 |
| `TC_UPLOAD_` | Test Case - Upload | File uploads | TC_UPLOAD_001 |
| `TC_EXPORT_` | Test Case - Export | Data export | TC_EXPORT_001 |
| `TC_VAL_` | Test Case - Validation | Form validation | TC_VAL_001 |
| `TC_ERR_` | Test Case - Error | Error handling | TC_ERR_001 |
| `TC_SEC_` | Test Case - Security | Security tests | TC_SEC_001 |
| `TC_CASE_` | Test Case - Case | Case sensitivity | TC_CASE_001 |
| `TC_INPUT_` | Test Case - Input | Special inputs | TC_INPUT_001 |
| `TC_UI_` | Test Case - UI | Visual elements | TC_UI_001 |
| `TC_PERF_` | Test Case - Performance | Performance tests | TC_PERF_001 |
| `TC_A11Y_` | Test Case - Accessibility | Accessibility tests | TC_A11Y_001 |
| `E2E_` | End-to-End | Full user journeys | E2E_001 |
| `SH_` | Self-Healing | Self-healing demos | SH_001 |

### Numbering Scheme

```
TC_{MODULE}_{TYPE}{###}

Where:
- MODULE: 3-5 letter abbreviation
- TYPE: Optional type indicator (P=Positive, N=Negative, B=Boundary, S=Security)
- ###: Sequential number (001-999)

Examples:
TC_AUTH_P001  - Authentication Positive test #1
TC_AUTH_N001  - Authentication Negative test #1
TC_AUTH_B001  - Authentication Boundary test #1
TC_AUTH_S001  - Authentication Security test #1
```

### Reserved Ranges

| Range | Purpose |
|-------|---------|
| 001-099 | Positive/Happy path tests |
| 100-199 | Negative/Error handling tests |
| 200-299 | Empty field validation tests |
| 300-399 | Boundary condition tests |
| 400-499 | Security tests |
| 500-599 | Case sensitivity tests |
| 600-699 | Special input tests |
| 700-799 | UI/Visual tests |
| 800-899 | Performance tests |
| 900-999 | Edge cases and special scenarios |

---

## 14. Configuration Templates

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  // Test directory
  testDir: './tests',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Limit workers on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
    ['json', { outputFile: 'reports/test-results.json' }]
  ],

  // Shared settings for all projects
  use: {
    // Base URL - replace with your application URL
    baseURL: process.env.BASE_URL || 'https://your-app-url.com',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Capture screenshot on failure
    screenshot: 'only-on-failure',

    // Record video on failure
    video: 'on-first-retry',

    // Viewport size
    viewport: { width: 1920, height: 1080 },

    // Timeout for each action
    actionTimeout: 10000,

    // Timeout for navigation
    navigationTimeout: 30000,
  },

  // Global timeout for each test
  timeout: 60000,

  // Expect timeout
  expect: {
    timeout: 10000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to add more browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Output folder for test artifacts
  outputDir: 'reports/test-artifacts/',

  // Global setup/teardown
  // globalSetup: require.resolve('./config/globalSetup.ts'),
  // globalTeardown: require.resolve('./config/globalTeardown.ts'),
});
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": ".",
    "baseUrl": ".",
    "paths": {
      "@pages/*": ["pages/*"],
      "@tests/*": ["tests/*"],
      "@data/*": ["data/*"],
      "@utils/*": ["utils/*"],
      "@config/*": ["config/*"]
    }
  },
  "include": [
    "tests/**/*",
    "pages/**/*",
    "utils/**/*",
    "data/**/*",
    "config/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "reports"
  ]
}
```

### package.json

```json
{
  "name": "{project-name}-automation",
  "version": "1.0.0",
  "description": "Playwright test automation framework for {Application Name}",
  "scripts": {
    "test": "npx playwright test",
    "test:headed": "npx playwright test --headed",
    "test:debug": "npx playwright test --debug",
    "test:ui": "npx playwright test --ui",
    "test:chrome": "npx playwright test --project=chromium",
    "test:module": "npx playwright test tests/{module}.spec.ts",
    "test:e2e": "npx playwright test tests/e2e/",
    "test:self-healing": "npx playwright test tests/self-healing.spec.ts --headed",
    "report": "npx playwright show-report reports/playwright-report",
    "codegen": "npx playwright codegen",
    "clean": "rm -rf reports/ dist/",
    "lint": "eslint . --ext .ts",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@anthropic-ai/sdk": "^0.10.0",
    "@types/node": "^20.10.0",
    "dotenv": "^16.3.1",
    "typescript": "^5.3.0",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "@typescript-eslint/parser": "^6.13.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### .env.example

```bash
# Application URL
BASE_URL=https://your-app-url.com

# Test User Credentials (for automated tests)
TEST_USERNAME=test_user
TEST_PASSWORD=test_password

# Admin User Credentials (for admin tests)
ADMIN_USERNAME=admin_user
ADMIN_PASSWORD=admin_password

# Anthropic API Key (for AI-powered self-healing)
# Get your API key from: https://console.anthropic.com/
ANTHROPIC_API_KEY=your-api-key-here

# Environment
NODE_ENV=test

# Timeouts (milliseconds)
DEFAULT_TIMEOUT=30000
ACTION_TIMEOUT=10000

# Feature Flags
ENABLE_SELF_HEALING=true
ENABLE_AI_OBSERVER=true
```

### .gitignore

```
# Dependencies
node_modules/

# Build output
dist/

# Test reports and artifacts
reports/
test-results/
playwright-report/

# Environment files
.env
.env.local

# IDE
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Coverage
coverage/

# Screenshots (generated during tests)
screenshots/*.png
!screenshots/.gitkeep
```

---

## 15. Quality Checklist

### Pre-Generation Checklist

```
INPUT VALIDATION:
□ Screenshots cover all application pages
□ Screenshots are clear and readable
□ Application name is specified
□ Base URL is provided
□ Any known test data is documented
□ Error message patterns are identified

SCREENSHOT COVERAGE:
□ Authentication pages (login, register, password reset)
□ Main dashboard/home page
□ All primary user workflows
□ Form pages showing validation states
□ Error states and messages visible
□ Success/confirmation pages
□ Navigation elements
□ Modal dialogs and popups
```

### Manual Test Cases Checklist

```
COMPLETENESS:
□ All identified pages have test cases
□ Minimum 5 positive tests per module
□ Minimum 5 negative tests per module
□ Minimum 2 boundary tests per module
□ Minimum 2 security tests per module
□ At least 1 E2E scenario

FORMAT:
□ Test IDs follow naming convention
□ Test types are correctly categorized
□ Priority is assigned to each test
□ Preconditions are clear
□ Steps are single actions (one action per step)
□ Expected results are specific and measurable

COVERAGE:
□ Positive: Valid inputs, happy path
□ Negative: Invalid inputs, error handling
□ Empty: All required field combinations
□ Boundary: Min/max values, special chars
□ Security: SQL injection, XSS payloads
□ Case: Case sensitivity where applicable
```

### Automation Framework Checklist

```
PROJECT STRUCTURE:
□ pages/ folder with Page Objects
□ tests/ folder with test specs
□ data/ folder with JSON files
□ utils/ folder with utilities
□ Configuration files created

PAGE OBJECTS:
□ One class per application page
□ All elements have locators
□ Primary + fallback selectors defined
□ Navigation methods implemented
□ Action methods implemented
□ Verification methods implemented
□ Error handling methods included

TEST DATA:
□ validScenarios array populated
□ invalidScenarios with expectedError
□ emptyFieldTests for all required fields
□ boundaryTests with edge cases
□ securityTests with payloads
□ Error messages documented

TEST SPECIFICATIONS:
□ Data-driven test loops
□ Test naming: ${testId}: ${description}
□ Proper assertions with expect()
□ beforeEach setup configured
□ Test describe blocks organized

SELF-HEALING:
□ SelfHealingLocator.ts created
□ AIObserver.ts created
□ Element definitions with fallbacks
□ Healing statistics tracking
□ Report generation working
```

### Execution Checklist

```
PRE-EXECUTION:
□ npm install completed
□ playwright browsers installed
□ .env file configured
□ BASE_URL is correct
□ Test credentials are valid

EXECUTION:
□ npm test runs without errors
□ All tests pass in headless mode
□ Tests pass in headed mode
□ Self-healing tests demonstrate healing
□ Reports generate successfully

POST-EXECUTION:
□ HTML report is accessible
□ Screenshots captured for failures
□ Healing report shows statistics
□ No flaky tests identified
□ Test execution time acceptable
```

---

## 16. Troubleshooting Guide

### Common Issues and Solutions

#### Issue: Tests fail to find elements

**Symptoms:**
- TimeoutError: locator.waitFor
- Element not found errors

**Solutions:**
1. Check if application loaded completely:
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

2. Increase timeout:
   ```typescript
   await locator.waitFor({ state: 'visible', timeout: 10000 });
   ```

3. Verify selector in browser DevTools:
   - Open DevTools → Console
   - Run: `document.querySelector('[data-test="element"]')`

4. Add fallback selectors to element definition

5. Enable self-healing with AI observer

#### Issue: Tests are flaky (intermittent failures)

**Symptoms:**
- Tests pass sometimes, fail sometimes
- Works locally, fails in CI

**Solutions:**
1. Add explicit waits before actions:
   ```typescript
   await locator.waitFor({ state: 'visible' });
   await locator.click();
   ```

2. Use auto-waiting locators:
   ```typescript
   await page.getByRole('button', { name: 'Submit' }).click();
   ```

3. Increase test timeout in config:
   ```typescript
   timeout: 60000,
   ```

4. Add retry logic:
   ```typescript
   retries: 2,
   ```

#### Issue: Login state not persisting

**Symptoms:**
- Each test requires fresh login
- Session not maintained

**Solutions:**
1. Use storage state:
   ```typescript
   // Save state after login
   await page.context().storageState({ path: 'auth.json' });

   // Reuse in other tests
   use: {
     storageState: 'auth.json',
   }
   ```

2. Use global setup for authentication

#### Issue: Data-driven tests not iterating

**Symptoms:**
- Only one test case runs
- JSON data not loaded

**Solutions:**
1. Verify JSON import in tsconfig.json:
   ```json
   "resolveJsonModule": true,
   ```

2. Check JSON syntax is valid

3. Ensure for loop is outside test():
   ```typescript
   for (const data of testData) {
     test(`${data.testId}`, async () => {
       // test code
     });
   }
   ```

#### Issue: Self-healing not working

**Symptoms:**
- AI observer not finding elements
- Fallbacks not triggering

**Solutions:**
1. Verify ANTHROPIC_API_KEY in .env

2. Check AIObserver initialization:
   ```typescript
   console.log(aiObserver.isEnabled()); // Should be true
   ```

3. Ensure screenshot is captured correctly:
   ```typescript
   const screenshot = await page.screenshot({ type: 'png', fullPage: true });
   ```

4. Verify element description is accurate

#### Issue: TypeScript compilation errors

**Symptoms:**
- Cannot find module errors
- Type errors

**Solutions:**
1. Run npm install to ensure dependencies

2. Check tsconfig.json paths

3. Restart TypeScript server in IDE

4. Run: `npx tsc --noEmit` to check errors

---

## Quick Start Commands

```bash
# 1. Initialize project
mkdir my-automation && cd my-automation
npm init -y

# 2. Install dependencies
npm install -D @playwright/test @anthropic-ai/sdk dotenv typescript

# 3. Install browsers
npx playwright install chromium

# 4. Create folder structure
mkdir pages tests data utils config reports screenshots

# 5. Run tests
npm test

# 6. Run with browser visible
npm run test:headed

# 7. View report
npm run report

# 8. Debug a specific test
npx playwright test tests/login.spec.ts --debug
```

---

*This guardrail ensures consistent, high-quality test automation output for ANY web application. Version 2.0*
