# Legacy Framework to Playwright Migration Guardrail

> A comprehensive, reusable guide for migrating existing Selenium/legacy automation frameworks to modern Playwright agentic automation framework.

---

## Table of Contents
1. [Overview & Purpose](#1-overview--purpose)
2. [Input Requirements](#2-input-requirements)
3. [Output Specifications](#3-output-specifications)
4. [AI Prompt Templates](#4-ai-prompt-templates)
5. [Source Code Analysis Process](#5-source-code-analysis-process)
6. [Framework Type Patterns](#6-framework-type-patterns)
7. [Selenium to Playwright Mapping](#7-selenium-to-playwright-mapping)
8. [Page Object Migration Template](#8-page-object-migration-template)
9. [Test Data Migration](#9-test-data-migration)
10. [Test Specification Migration](#10-test-specification-migration)
11. [Self-Healing Integration](#11-self-healing-integration)
12. [Locator Strategy Migration](#12-locator-strategy-migration)
13. [Wait Strategy Migration](#13-wait-strategy-migration)
14. [Configuration Migration](#14-configuration-migration)
15. [Quality Checklist](#15-quality-checklist)
16. [Troubleshooting Guide](#16-troubleshooting-guide)

---

## 1. Overview & Purpose

### What This Guardrail Does
This guardrail provides a **standardized, repeatable process** for:
- Analyzing existing Selenium/legacy automation frameworks
- Mapping legacy APIs to modern Playwright equivalents
- Converting Page Objects from Java/Python/JavaScript to TypeScript
- Migrating test data structures to JSON format
- Transforming test specifications to Playwright test format
- Adding AI-powered self-healing capabilities to migrated tests

### When to Use This Guardrail
Use this guardrail when you need to:
- Migrate Selenium WebDriver tests to Playwright
- Modernize Protractor (Angular) tests to Playwright
- Convert Cypress tests to Playwright
- Upgrade TestCafe or other legacy frameworks
- Standardize multiple framework implementations to a single Playwright stack

### Key Principles
1. **Preserve Test Logic**: Migration should maintain test intent and coverage
2. **Modernize Architecture**: Upgrade to modern patterns (TypeScript, async/await)
3. **Enhance Reliability**: Add auto-wait, self-healing, better locator strategies
4. **Maintain Coverage**: All existing tests should be migrated with equivalent coverage
5. **Improve Maintainability**: Data-driven approach, centralized configuration

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

## 2. Input Requirements

### Required Inputs

| Input | Description | Format |
|-------|-------------|--------|
| **Source Project Path** | Path to existing automation project | Directory path |
| **Source Framework** | Current framework (Selenium, Protractor, Cypress, etc.) | String |
| **Source Language** | Current language (Java, Python, JavaScript, C#) | String |
| **Application Name** | Name of the application under test | String |
| **Base URL** | Application URL for automation | URL string |

### Optional Inputs

| Input | Description | Default |
|-------|-------------|---------|
| Test Data Files | Existing test data (Excel, CSV, Properties) | Extract from source |
| Configuration Files | Existing config (properties, yaml, json) | Analyze from source |
| CI/CD Pipelines | Existing pipeline definitions | Generate new |
| Priority Modules | Which modules to migrate first | All modules |

### Source Project Analysis Checklist
```
PROJECT STRUCTURE:
□ Identify test framework (TestNG, JUnit, pytest, Mocha, etc.)
□ Locate Page Object classes/files
□ Find test specification files
□ Identify test data files (Excel, CSV, JSON, properties)
□ Locate configuration files
□ Check for utility/helper classes
□ Identify custom framework extensions

CODE PATTERNS:
□ Page Object Model implementation style
□ Locator strategy used (By.id, By.xpath, By.cssSelector)
□ Wait strategy (implicit, explicit, fluent)
□ Assertion library (TestNG Assert, JUnit Assert, Hamcrest)
□ Data provider/parameterization approach
□ Reporting mechanism
□ Logging implementation

DEPENDENCIES:
□ WebDriver version
□ Browser driver versions
□ Third-party libraries
□ Build tool (Maven, Gradle, pip, npm)
```

---

## 3. Output Specifications

### Deliverables Checklist

For every migration project, this guardrail produces:

```
□ Migration Analysis Report
  - Format: TXT file
  - Location: {project-root}/migration-report.txt
  - Content: Source analysis, mapping decisions, migration notes

□ Playwright Project Structure
  - pages/           → Migrated Page Object Model classes (TypeScript)
  - tests/           → Converted test specification files
  - data/            → Migrated test data (JSON format)
  - utils/           → Self-healing utilities + migrated helpers
  - config/          → Migrated configuration

□ Mapping Documentation
  - Locator mappings (old → new)
  - API mappings (Selenium → Playwright)
  - Data structure mappings

□ Self-Healing Framework
  - SelfHealingLocator utility
  - AIObserver integration
  - Healing report generation
```

### Output Quality Standards

| Metric | Standard |
|--------|----------|
| Test Coverage | 100% of source tests migrated |
| Locator Quality | Modern selectors (data-test, role, text) |
| Type Safety | TypeScript strict mode, no any types |
| Code Quality | ESLint compliant, consistent formatting |
| Documentation | Inline comments for complex mappings |

---

## 4. AI Prompt Templates

### Prompt 1: Analyze Source Project

```
CONTEXT:
I have an existing {SOURCE_FRAMEWORK} automation project in {SOURCE_LANGUAGE}.
Project path: {SOURCE_PATH}

TASK:
Analyze the source project structure and generate a migration report.

REQUIREMENTS:
1. Identify all components:
   - Page Object classes (count, patterns used)
   - Test specifications (count, framework used)
   - Test data files (format, structure)
   - Configuration files
   - Utility classes
   - Custom extensions

2. Analyze code patterns:
   - Locator strategies used
   - Wait strategies implemented
   - Assertion patterns
   - Data parameterization approach

3. Generate migration complexity assessment:
   - Simple (direct mapping available)
   - Medium (requires refactoring)
   - Complex (requires redesign)

4. Identify potential issues:
   - Deprecated APIs
   - Framework-specific features
   - Custom implementations

OUTPUT:
Create file: migration-report.txt
```

### Prompt 2: Migrate Page Objects

```
CONTEXT:
I have analyzed the source project. Now migrating Page Objects.
Source Framework: {SOURCE_FRAMEWORK}
Source Language: {SOURCE_LANGUAGE}

TASK:
Convert all Page Object classes to Playwright TypeScript format.

REQUIREMENTS:
1. For each source Page Object:
   - Map class structure to TypeScript
   - Convert locators to Playwright Locator API
   - Transform methods to async/await pattern
   - Add proper TypeScript types

2. Locator Migration Rules:
   - By.id("x") → page.locator('#x')
   - By.name("x") → page.locator('[name="x"]')
   - By.className("x") → page.locator('.x')
   - By.xpath("//x") → page.locator('//x') or better CSS
   - By.cssSelector("x") → page.locator('x')

3. Add enhancements:
   - Primary + fallback selectors for self-healing
   - Helper methods for common operations
   - Type-safe return types

4. Maintain structure:
   - Preserve method names where possible
   - Keep logical grouping
   - Document significant changes

OUTPUT:
pages/{PageName}Page.ts for each source Page Object
```

### Prompt 3: Migrate Test Specifications

```
CONTEXT:
Page Objects have been migrated. Now migrating test specifications.
Source Test Framework: {TEST_FRAMEWORK} (TestNG/JUnit/pytest/Mocha)

TASK:
Convert all test specifications to Playwright test format.

REQUIREMENTS:
1. Test Structure Mapping:
   - @Test → test()
   - @BeforeClass → test.beforeAll()
   - @BeforeMethod → test.beforeEach()
   - @AfterMethod → test.afterEach()
   - @AfterClass → test.afterAll()
   - @DataProvider → External JSON + for loop

2. Assertion Mapping:
   - assertEquals(a, b) → expect(a).toBe(b)
   - assertTrue(x) → expect(x).toBe(true)
   - assertNotNull(x) → expect(x).toBeDefined()
   - assertContains(a, b) → expect(a).toContain(b)

3. Data-Driven Conversion:
   - Extract inline data to JSON files
   - Convert @DataProvider to JSON arrays
   - Use for loops with test() calls

4. Preserve:
   - Test logic and intent
   - Test names and descriptions
   - Test categorization (groups/tags)

OUTPUT:
tests/{module}.spec.ts for each test class
data/{module}Data.json for extracted test data
```

### Prompt 4: Migrate Test Data

```
CONTEXT:
Migrating test data from {SOURCE_FORMAT} to JSON.
Source formats: Excel, CSV, Properties, XML, inline code

TASK:
Convert all test data to standardized JSON format.

REQUIREMENTS:
1. Data Extraction:
   - Extract from Excel sheets → JSON arrays
   - Convert CSV files → JSON arrays
   - Transform properties → JSON objects
   - Move inline test data → JSON files

2. JSON Structure:
   {
     "_metadata": {
       "source": "{original_file}",
       "migratedDate": "{date}",
       "module": "{module_name}"
     },
     "validScenarios": [...],
     "invalidScenarios": [...],
     "boundaryTests": [...],
     "securityTests": [...]
   }

3. Data Categorization:
   - Group by test type
   - Maintain original test IDs
   - Add expected results/errors

OUTPUT:
data/{module}Data.json for each data source
```

### Prompt 5: Add Self-Healing Capabilities

```
CONTEXT:
Core migration complete. Now adding self-healing capabilities.

TASK:
Integrate AI-powered self-healing framework to migrated tests.

REQUIREMENTS:
1. Create Element Definitions:
   - Extract locators from migrated Page Objects
   - Add 3-5 fallback selectors per element
   - Add human-readable descriptions

2. Create Self-Healing Utilities:
   - utils/SelfHealingLocator.ts
   - utils/AIObserver.ts
   - utils/HealingReporter.ts

3. Update Page Objects:
   - Define ELEMENTS constant with fallbacks
   - Use healer.locate() for critical elements
   - Add healing statistics tracking

4. Create Demonstration:
   - tests/self-healing.spec.ts
   - Show healing in action
   - Generate healing report

OUTPUT:
- utils/SelfHealingLocator.ts
- utils/AIObserver.ts
- config/elements.ts
- tests/self-healing.spec.ts
```

---

## 5. Source Code Analysis Process

### Step-by-Step Analysis Algorithm

When analyzing source projects, follow this systematic process:

#### Step 1: Project Inventory
```
For each source file:
1. Categorize: PageObject | TestSpec | TestData | Config | Utility
2. Record file path and language
3. Note dependencies and imports
4. Identify framework-specific annotations/decorators
```

#### Step 2: Page Object Analysis
```
For each Page Object class:
1. Extract class name and file location
2. List all locators with strategy type:
   - @FindBy annotations (Java)
   - locators dict/property (Python)
   - getter methods (JavaScript)
3. List all public methods with signatures
4. Identify constructor patterns
5. Note any inheritance hierarchy
6. Document custom extensions
```

#### Step 3: Test Specification Analysis
```
For each test class/file:
1. Extract test framework used
2. List all test methods with annotations
3. Identify setup/teardown methods
4. Document data providers/parameterization
5. Extract assertion patterns
6. Note test grouping/categorization
7. Identify dependencies between tests
```

#### Step 4: Test Data Analysis
```
For each data source:
1. Identify format (Excel, CSV, Properties, JSON, inline)
2. Document structure and schema
3. Count test cases per category
4. Note any data generation logic
5. Identify environment-specific data
```

#### Step 5: Migration Complexity Assessment
```
For each component, classify:

SIMPLE (Direct mapping):
- Standard locator strategies
- Common assertions
- Basic data structures
- No custom extensions

MEDIUM (Requires refactoring):
- Complex XPath locators
- Custom wait conditions
- Multi-step test setups
- Framework-specific features

COMPLEX (Requires redesign):
- Parallel execution dependencies
- Custom reporting integration
- Browser-specific workarounds
- Complex data providers
```

---

## 6. Framework Type Patterns

### Pattern: Java Selenium with TestNG

**Common Structure:**
```
src/
├── main/java/
│   └── pages/
│       ├── BasePage.java
│       ├── LoginPage.java
│       └── HomePage.java
├── test/java/
│   └── tests/
│       ├── BaseTest.java
│       ├── LoginTests.java
│       └── HomeTests.java
└── resources/
    ├── testdata/
    │   ├── login.xlsx
    │   └── testng.xml
    └── config.properties
```

**Migration Focus:**
```json
{
  "patterns": {
    "pageObject": "@FindBy annotations, PageFactory.initElements",
    "locators": "By.id, By.xpath, By.cssSelector, By.name",
    "waits": "WebDriverWait, ExpectedConditions",
    "assertions": "Assert.assertEquals, Assert.assertTrue",
    "dataProvider": "@DataProvider annotation",
    "testHooks": "@BeforeClass, @BeforeMethod, @AfterMethod, @AfterClass"
  },
  "complexityFactors": [
    "PageFactory initialization",
    "Explicit WebDriverWait patterns",
    "TestNG annotations and groups",
    "Excel data providers"
  ]
}
```

### Pattern: Python Selenium with pytest

**Common Structure:**
```
project/
├── pages/
│   ├── base_page.py
│   ├── login_page.py
│   └── home_page.py
├── tests/
│   ├── conftest.py
│   ├── test_login.py
│   └── test_home.py
├── data/
│   ├── test_data.json
│   └── credentials.yaml
├── utils/
│   └── helpers.py
└── pytest.ini
```

**Migration Focus:**
```json
{
  "patterns": {
    "pageObject": "Class with locator tuples, By.* strategy",
    "locators": "(By.ID, 'x'), (By.XPATH, '//x')",
    "waits": "WebDriverWait(driver, 10).until()",
    "assertions": "assert, pytest.raises",
    "fixtures": "@pytest.fixture, conftest.py",
    "parameterization": "@pytest.mark.parametrize"
  },
  "complexityFactors": [
    "Tuple-based locator definitions",
    "pytest fixture scopes",
    "Parametrize decorators",
    "YAML/JSON config files"
  ]
}
```

### Pattern: JavaScript Selenium (WebDriverJS/WDIO)

**Common Structure:**
```
project/
├── pageobjects/
│   ├── BasePage.js
│   ├── LoginPage.js
│   └── HomePage.js
├── test/
│   └── specs/
│       ├── login.spec.js
│       └── home.spec.js
├── testdata/
│   └── users.json
├── wdio.conf.js
└── package.json
```

**Migration Focus:**
```json
{
  "patterns": {
    "pageObject": "ES6 classes with getters for elements",
    "locators": "$(), $$(), browser.findElement()",
    "waits": "browser.waitUntil(), element.waitForDisplayed()",
    "assertions": "expect (from chai/jest)",
    "hooks": "before, beforeEach, after, afterEach",
    "async": "async/await pattern"
  },
  "complexityFactors": [
    "Already async - easier migration",
    "Similar element getter pattern",
    "WDIO-specific commands",
    "Mocha/Jasmine test structure"
  ]
}
```

### Pattern: Protractor (Angular)

**Common Structure:**
```
e2e/
├── page-objects/
│   ├── app.po.ts
│   ├── login.po.ts
│   └── home.po.ts
├── specs/
│   ├── login.e2e-spec.ts
│   └── home.e2e-spec.ts
├── protractor.conf.js
└── tsconfig.json
```

**Migration Focus:**
```json
{
  "patterns": {
    "pageObject": "TypeScript classes with element() and element.all()",
    "locators": "by.css, by.id, by.buttonText, by.model, by.binding",
    "waits": "browser.wait(), ExpectedConditions",
    "assertions": "expect() from Jasmine",
    "angular": "by.model, by.binding, by.repeater (Angular-specific)"
  },
  "complexityFactors": [
    "Angular-specific locators need CSS alternatives",
    "Already TypeScript - similar syntax",
    "Jasmine assertions similar to Playwright",
    "browser.wait patterns need conversion"
  ]
}
```

### Pattern: Cypress

**Common Structure:**
```
cypress/
├── e2e/
│   ├── login.cy.js
│   └── home.cy.js
├── support/
│   ├── commands.js
│   └── e2e.js
├── fixtures/
│   └── users.json
└── cypress.config.js
```

**Migration Focus:**
```json
{
  "patterns": {
    "pageObject": "Custom commands or Page Object pattern",
    "locators": "cy.get(), cy.contains(), cy.find()",
    "waits": "Built-in auto-wait (similar to Playwright)",
    "assertions": "should(), expect()",
    "commands": "Custom Cypress commands → Playwright fixtures"
  },
  "complexityFactors": [
    "Chaining syntax → async/await conversion",
    "cy.intercept → page.route",
    "Custom commands → utility functions",
    "Fixtures already JSON"
  ]
}
```

---

## 7. Selenium to Playwright Mapping

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

### Modern Locator Preferences (Playwright Best Practices)

```typescript
// Priority order for Playwright locators:

// 1. Role-based (most accessible)
page.getByRole('button', { name: 'Submit' })
page.getByRole('textbox', { name: 'Email' })
page.getByRole('link', { name: 'Home' })

// 2. Test ID (most reliable)
page.getByTestId('submit-button')
page.locator('[data-test="submit"]')

// 3. Text content
page.getByText('Welcome')
page.getByLabel('Username')
page.getByPlaceholder('Enter email')

// 4. CSS selectors
page.locator('#username')
page.locator('.submit-btn')

// 5. XPath (avoid when possible)
page.locator('//button[@type="submit"]')
```

### Driver/Browser Operations Mapping

| Selenium | Playwright | Notes |
|----------|------------|-------|
| `new WebDriver()` | `browser.newPage()` | Browser managed by Playwright |
| `driver.get(url)` | `await page.goto(url)` | Async navigation |
| `driver.getCurrentUrl()` | `page.url()` | Sync property |
| `driver.getTitle()` | `await page.title()` | Async method |
| `driver.getPageSource()` | `await page.content()` | Async method |
| `driver.close()` | `await page.close()` | Close page |
| `driver.quit()` | `await browser.close()` | Close browser |
| `driver.navigate().back()` | `await page.goBack()` | Navigation |
| `driver.navigate().forward()` | `await page.goForward()` | Navigation |
| `driver.navigate().refresh()` | `await page.reload()` | Refresh |

### Element Interaction Mapping

| Selenium | Playwright | Notes |
|----------|------------|-------|
| `element.click()` | `await locator.click()` | Auto-waits |
| `element.sendKeys("text")` | `await locator.fill("text")` | Clears first |
| `element.sendKeys("text")` | `await locator.type("text")` | Types character by character |
| `element.clear()` | `await locator.clear()` | Clear input |
| `element.submit()` | `await locator.press('Enter')` | Form submit |
| `element.getText()` | `await locator.textContent()` | Get text |
| `element.getAttribute("x")` | `await locator.getAttribute("x")` | Get attribute |
| `element.isDisplayed()` | `await locator.isVisible()` | Visibility check |
| `element.isEnabled()` | `await locator.isEnabled()` | Enabled check |
| `element.isSelected()` | `await locator.isChecked()` | For checkboxes |
| `Select(element).selectByVisibleText("x")` | `await locator.selectOption("x")` | Dropdown |
| `Select(element).selectByValue("x")` | `await locator.selectOption({ value: "x" })` | By value |
| `Select(element).selectByIndex(0)` | `await locator.selectOption({ index: 0 })` | By index |

### Wait Mapping

| Selenium | Playwright | Notes |
|----------|------------|-------|
| `WebDriverWait(driver, 10).until(EC.visibilityOf(element))` | `await locator.waitFor({ state: 'visible' })` | Auto-wait built-in |
| `WebDriverWait(driver, 10).until(EC.elementToBeClickable(element))` | `await locator.click()` | Auto-waits for clickable |
| `WebDriverWait(driver, 10).until(EC.presenceOfElementLocated())` | `await locator.waitFor({ state: 'attached' })` | DOM presence |
| `WebDriverWait(driver, 10).until(EC.invisibilityOf(element))` | `await locator.waitFor({ state: 'hidden' })` | Wait for hidden |
| `Thread.sleep(1000)` | `await page.waitForTimeout(1000)` | Avoid when possible |
| `driver.manage().timeouts().implicitlyWait(10)` | N/A - use auto-wait | Implicit wait not needed |
| `FluentWait` | Custom with `waitFor` + polling | Rarely needed |

### Assertion Mapping

| TestNG/JUnit | Playwright expect() | Notes |
|--------------|---------------------|-------|
| `Assert.assertEquals(a, b)` | `expect(a).toBe(b)` | Exact equality |
| `Assert.assertEquals(a, b, msg)` | `expect(a, msg).toBe(b)` | With message |
| `Assert.assertTrue(x)` | `expect(x).toBe(true)` | Boolean true |
| `Assert.assertFalse(x)` | `expect(x).toBe(false)` | Boolean false |
| `Assert.assertNotNull(x)` | `expect(x).toBeDefined()` | Not null/undefined |
| `Assert.assertNull(x)` | `expect(x).toBeNull()` | Is null |
| `Assert.assertContains(a, b)` | `expect(a).toContain(b)` | Contains |
| `Assert.assertNotEquals(a, b)` | `expect(a).not.toBe(b)` | Not equal |
| `Assert.assertTrue(list.size() > 0)` | `expect(list).toHaveLength(expect.any(Number))` | Collection size |

### Special Operations Mapping

| Selenium | Playwright | Notes |
|----------|------------|-------|
| `Actions(driver).moveToElement(e).click().perform()` | `await locator.hover()` then `await locator.click()` | Actions chain |
| `Actions(driver).doubleClick(e).perform()` | `await locator.dblclick()` | Double click |
| `Actions(driver).contextClick(e).perform()` | `await locator.click({ button: 'right' })` | Right click |
| `Actions(driver).dragAndDrop(src, tgt).perform()` | `await src.dragTo(tgt)` | Drag and drop |
| `JavascriptExecutor.executeScript("...")` | `await page.evaluate(() => {...})` | JS execution |
| `driver.switchTo().frame(f)` | `await page.frameLocator('#f')` | Frame handling |
| `driver.switchTo().alert().accept()` | `page.on('dialog', d => d.accept())` | Alert handling |
| `driver.switchTo().window(handle)` | `await context.pages()[index]` | Window switching |
| `TakesScreenshot.getScreenshotAs()` | `await page.screenshot({ path: 'x.png' })` | Screenshot |

---

## 8. Page Object Migration Template

### Source: Java Selenium Page Object

```java
// LoginPage.java (Source)
package pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class LoginPage {
    private WebDriver driver;
    private WebDriverWait wait;

    @FindBy(id = "username")
    private WebElement usernameInput;

    @FindBy(id = "password")
    private WebElement passwordInput;

    @FindBy(css = "button[type='submit']")
    private WebElement loginButton;

    @FindBy(css = ".error-message")
    private WebElement errorMessage;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, 10);
        PageFactory.initElements(driver, this);
    }

    public void navigateTo(String url) {
        driver.get(url);
    }

    public void enterUsername(String username) {
        wait.until(ExpectedConditions.visibilityOf(usernameInput));
        usernameInput.clear();
        usernameInput.sendKeys(username);
    }

    public void enterPassword(String password) {
        passwordInput.clear();
        passwordInput.sendKeys(password);
    }

    public void clickLogin() {
        loginButton.click();
    }

    public void login(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLogin();
    }

    public String getErrorMessage() {
        wait.until(ExpectedConditions.visibilityOf(errorMessage));
        return errorMessage.getText();
    }

    public boolean isErrorDisplayed() {
        try {
            return errorMessage.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
}
```

### Target: TypeScript Playwright Page Object

```typescript
// pages/LoginPage.ts (Target)
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Page URL
  readonly pageUrl: string = '/login';

  // Element Locators - with fallback selectors for self-healing
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
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
      description: 'Username input field'
    },
    passwordInput: {
      primary: '#password',
      fallbacks: [
        '[data-test="password"]',
        'input[name="password"]',
        'input[type="password"]',
        'input[placeholder*="password" i]'
      ],
      description: 'Password input field'
    },
    loginButton: {
      primary: 'button[type="submit"]',
      fallbacks: [
        '[data-test="login-button"]',
        '#login-button',
        'button:has-text("Login")',
        'button:has-text("Sign in")',
        '.login-btn'
      ],
      description: 'Login submit button'
    },
    errorMessage: {
      primary: '.error-message',
      fallbacks: [
        '[data-test="error"]',
        '.alert-danger',
        '[role="alert"]',
        '.error'
      ],
      description: 'Error message container'
    }
  };

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
  }

  // ==================== NAVIGATION ====================

  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  // ==================== ACTIONS ====================

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  // ==================== EMPTY FIELD VARIANTS ====================

  async loginWithEmptyUsername(password: string): Promise<void> {
    await this.usernameInput.clear();
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async loginWithEmptyPassword(username: string): Promise<void> {
    await this.enterUsername(username);
    await this.passwordInput.clear();
    await this.clickLogin();
  }

  async loginWithAllFieldsEmpty(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
    await this.clickLogin();
  }

  // ==================== VERIFICATION ====================

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent() || '';
  }

  async isErrorDisplayed(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isOnLoginPage(): Promise<boolean> {
    try {
      await this.usernameInput.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}
```

### Migration Template - Generic Page Object

```typescript
// pages/{PageName}Page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * {PageName} Page Object
 * Migrated from: {source_file_path}
 * Original framework: {source_framework}
 */
export class {PageName}Page extends BasePage {
  readonly pageUrl: string = '/{page-path}';

  // ==================== LOCATORS ====================
  // Migrated from @FindBy / locators dict / element getters

  readonly {element1}: Locator;
  readonly {element2}: Locator;
  // ... add all elements

  // ==================== SELF-HEALING DEFINITIONS ====================

  static readonly ELEMENTS = {
    {element1}: {
      primary: '{primary_selector}',      // Original: {original_locator}
      fallbacks: [
        '{fallback1}',
        '{fallback2}',
        '{fallback3}'
      ],
      description: '{element description}'
    }
    // ... add all elements
  };

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.{element1} = page.locator('{primary_selector}');
    this.{element2} = page.locator('{primary_selector}');
  }

  // ==================== NAVIGATION ====================
  // Migrated from: {original_navigation_methods}

  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  // ==================== ACTIONS ====================
  // Migrated from: {original_action_methods}

  async {actionMethod}({params}): Promise<void> {
    // Original implementation:
    // {original_code_comment}

    await this.{element}.{action}({params});
  }

  // ==================== VERIFICATION ====================
  // Migrated from: {original_verification_methods}

  async {verifyMethod}(): Promise<boolean> {
    return await this.{element}.isVisible();
  }

  async get{Property}(): Promise<string> {
    return await this.{element}.textContent() || '';
  }
}
```

---

## 9. Test Data Migration

### Source: Java TestNG DataProvider

```java
// LoginTests.java (Source)
@DataProvider(name = "validLogins")
public Object[][] getValidLogins() {
    return new Object[][] {
        {"standard_user", "secret_sauce", "Products"},
        {"problem_user", "secret_sauce", "Products"},
    };
}

@DataProvider(name = "invalidLogins")
public Object[][] getInvalidLogins() {
    return new Object[][] {
        {"invalid_user", "secret_sauce", "Username and password do not match"},
        {"standard_user", "wrong_password", "Username and password do not match"},
    };
}
```

### Source: Python pytest parametrize

```python
# test_login.py (Source)
@pytest.mark.parametrize("username,password,expected", [
    ("standard_user", "secret_sauce", "Products"),
    ("problem_user", "secret_sauce", "Products"),
])
def test_valid_login(username, password, expected):
    # test implementation
    pass

@pytest.mark.parametrize("username,password,error_msg", [
    ("invalid_user", "secret_sauce", "Username and password do not match"),
    ("standard_user", "wrong_password", "Username and password do not match"),
])
def test_invalid_login(username, password, error_msg):
    # test implementation
    pass
```

### Target: JSON Test Data

```json
// data/loginData.json (Target)
{
  "_metadata": {
    "module": "Login",
    "version": "1.0",
    "migratedFrom": "LoginTests.java / test_login.py",
    "migratedDate": "{CURRENT_DATE}",
    "description": "Login module test data migrated from legacy framework"
  },

  "validScenarios": [
    {
      "testId": "TC_LOGIN_001",
      "description": "Login with standard user",
      "username": "standard_user",
      "password": "secret_sauce",
      "expectedResult": "success",
      "expectedPage": "Products",
      "originalTestId": "validLogins[0] / test_valid_login[standard_user]"
    },
    {
      "testId": "TC_LOGIN_002",
      "description": "Login with problem user",
      "username": "problem_user",
      "password": "secret_sauce",
      "expectedResult": "success",
      "expectedPage": "Products",
      "originalTestId": "validLogins[1] / test_valid_login[problem_user]"
    }
  ],

  "invalidScenarios": [
    {
      "testId": "TC_LOGIN_010",
      "description": "Login with invalid username",
      "username": "invalid_user",
      "password": "secret_sauce",
      "expectedError": "Username and password do not match",
      "originalTestId": "invalidLogins[0] / test_invalid_login[invalid_user]"
    },
    {
      "testId": "TC_LOGIN_011",
      "description": "Login with invalid password",
      "username": "standard_user",
      "password": "wrong_password",
      "expectedError": "Username and password do not match",
      "originalTestId": "invalidLogins[1] / test_invalid_login[wrong_password]"
    }
  ],

  "emptyFieldTests": [
    {
      "testId": "TC_LOGIN_020",
      "description": "Login with empty username",
      "username": "",
      "password": "secret_sauce",
      "expectedError": "Username is required"
    },
    {
      "testId": "TC_LOGIN_021",
      "description": "Login with empty password",
      "username": "standard_user",
      "password": "",
      "expectedError": "Password is required"
    },
    {
      "testId": "TC_LOGIN_022",
      "description": "Login with all fields empty",
      "username": "",
      "password": "",
      "expectedError": "Username is required"
    }
  ],

  "lockedUserTests": [
    {
      "testId": "TC_LOGIN_030",
      "description": "Login with locked out user",
      "username": "locked_out_user",
      "password": "secret_sauce",
      "expectedError": "Sorry, this user has been locked out"
    }
  ],

  "securityTests": [
    {
      "testId": "TC_SEC_LOGIN_001",
      "description": "SQL Injection in username",
      "username": "' OR '1'='1",
      "password": "secret_sauce",
      "expectedBehavior": "reject_gracefully",
      "category": "sql_injection"
    },
    {
      "testId": "TC_SEC_LOGIN_002",
      "description": "XSS in username",
      "username": "<script>alert('XSS')</script>",
      "password": "secret_sauce",
      "expectedBehavior": "sanitize_or_reject",
      "category": "xss"
    }
  ],

  "errorMessages": {
    "invalidCredentials": "Username and password do not match",
    "lockedAccount": "Sorry, this user has been locked out",
    "usernameRequired": "Username is required",
    "passwordRequired": "Password is required"
  }
}
```

### Excel/CSV Migration Template

```typescript
// utils/DataMigrator.ts - Helper for bulk data migration
import * as fs from 'fs';
import * as path from 'path';

interface MigratedData {
  _metadata: {
    module: string;
    version: string;
    migratedFrom: string;
    migratedDate: string;
  };
  validScenarios: any[];
  invalidScenarios: any[];
  [key: string]: any;
}

/**
 * Converts Excel/CSV test data to JSON format
 *
 * Source columns expected:
 * | TestID | Description | Input1 | Input2 | ExpectedResult | TestType |
 */
export function migrateTestData(
  sourceFile: string,
  moduleName: string
): MigratedData {
  const data: MigratedData = {
    _metadata: {
      module: moduleName,
      version: '1.0',
      migratedFrom: sourceFile,
      migratedDate: new Date().toISOString().split('T')[0]
    },
    validScenarios: [],
    invalidScenarios: [],
    emptyFieldTests: [],
    boundaryTests: [],
    securityTests: []
  };

  // Parse source file (Excel/CSV)
  // Categorize based on TestType column
  // Map to appropriate arrays

  return data;
}
```

---

## 10. Test Specification Migration

### Source: Java TestNG Test

```java
// LoginTests.java (Source)
package tests;

import org.testng.Assert;
import org.testng.annotations.*;
import pages.LoginPage;
import pages.ProductsPage;

public class LoginTests extends BaseTest {
    private LoginPage loginPage;
    private ProductsPage productsPage;

    @BeforeMethod
    public void setUp() {
        loginPage = new LoginPage(driver);
        productsPage = new ProductsPage(driver);
        loginPage.navigateTo(baseUrl);
    }

    @Test(dataProvider = "validLogins")
    public void testValidLogin(String username, String password, String expectedPage) {
        loginPage.login(username, password);
        Assert.assertTrue(productsPage.isOnProductsPage(),
            "Should be on products page after login");
        Assert.assertEquals(productsPage.getPageTitle(), expectedPage,
            "Page title should match");
    }

    @Test(dataProvider = "invalidLogins")
    public void testInvalidLogin(String username, String password, String expectedError) {
        loginPage.login(username, password);
        Assert.assertTrue(loginPage.isErrorDisplayed(),
            "Error message should be displayed");
        Assert.assertTrue(loginPage.getErrorMessage().contains(expectedError),
            "Error message should contain: " + expectedError);
    }

    @Test
    public void testEmptyUsername() {
        loginPage.enterPassword("secret_sauce");
        loginPage.clickLogin();
        Assert.assertTrue(loginPage.isErrorDisplayed());
        Assert.assertTrue(loginPage.getErrorMessage().contains("Username is required"));
    }

    @Test
    public void testLockedUser() {
        loginPage.login("locked_out_user", "secret_sauce");
        Assert.assertTrue(loginPage.isErrorDisplayed());
        Assert.assertTrue(loginPage.getErrorMessage().contains("locked out"));
    }
}
```

### Target: Playwright Test Specification

```typescript
// tests/login.spec.ts (Target)
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import loginData from '../data/loginData.json';

/**
 * Login Module Tests
 * Migrated from: LoginTests.java
 * Original framework: TestNG
 */
test.describe('Login Module - Swag Labs', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  // Migrated from: @BeforeMethod
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.navigate();
  });

  // ============================================================================
  // POSITIVE TEST CASES
  // Migrated from: testValidLogin with @DataProvider("validLogins")
  // ============================================================================

  test.describe('Valid Login Scenarios', () => {
    for (const scenario of loginData.validScenarios) {
      test(`${scenario.testId}: ${scenario.description}`, async ({ page }) => {
        // Act
        await loginPage.login(scenario.username, scenario.password);

        // Assert - Migrated from: Assert.assertTrue(productsPage.isOnProductsPage())
        expect(await productsPage.isOnProductsPage()).toBe(true);

        // Assert - Migrated from: Assert.assertEquals(productsPage.getPageTitle(), expectedPage)
        const pageTitle = await productsPage.getPageTitle();
        expect(pageTitle).toContain(scenario.expectedPage);
      });
    }
  });

  // ============================================================================
  // NEGATIVE TEST CASES - Invalid Credentials
  // Migrated from: testInvalidLogin with @DataProvider("invalidLogins")
  // ============================================================================

  test.describe('Invalid Login Scenarios', () => {
    for (const scenario of loginData.invalidScenarios) {
      test(`${scenario.testId}: ${scenario.description}`, async () => {
        // Act
        await loginPage.login(scenario.username, scenario.password);

        // Assert - Migrated from: Assert.assertTrue(loginPage.isErrorDisplayed())
        expect(await loginPage.isErrorDisplayed()).toBe(true);

        // Assert - Migrated from: Assert.assertTrue(...contains(expectedError))
        const errorMsg = await loginPage.getErrorMessage();
        expect(errorMsg).toContain(scenario.expectedError);
      });
    }
  });

  // ============================================================================
  // NEGATIVE TEST CASES - Empty Fields
  // Migrated from: testEmptyUsername (and similar tests)
  // ============================================================================

  test.describe('Empty Field Validation', () => {
    for (const scenario of loginData.emptyFieldTests) {
      test(`${scenario.testId}: ${scenario.description}`, async () => {
        // Act - Handle different empty field combinations
        if (scenario.username === '' && scenario.password === '') {
          await loginPage.loginWithAllFieldsEmpty();
        } else if (scenario.username === '') {
          await loginPage.loginWithEmptyUsername(scenario.password);
        } else {
          await loginPage.loginWithEmptyPassword(scenario.username);
        }

        // Assert
        expect(await loginPage.isOnLoginPage()).toBe(true);
        expect(await loginPage.isErrorDisplayed()).toBe(true);

        const errorMsg = await loginPage.getErrorMessage();
        expect(errorMsg).toContain(scenario.expectedError);
      });
    }
  });

  // ============================================================================
  // LOCKED USER TEST CASES
  // Migrated from: testLockedUser
  // ============================================================================

  test.describe('Locked User Scenarios', () => {
    for (const scenario of loginData.lockedUserTests) {
      test(`${scenario.testId}: ${scenario.description}`, async () => {
        // Act
        await loginPage.login(scenario.username, scenario.password);

        // Assert
        expect(await loginPage.isErrorDisplayed()).toBe(true);

        const errorMsg = await loginPage.getErrorMessage();
        expect(errorMsg).toContain(scenario.expectedError);
      });
    }
  });

  // ============================================================================
  // SECURITY TEST CASES
  // Added during migration for comprehensive coverage
  // ============================================================================

  test.describe('Security Tests', () => {
    for (const scenario of loginData.securityTests) {
      test(`${scenario.testId}: ${scenario.description}`, async () => {
        // Act
        await loginPage.login(scenario.username, scenario.password);

        // Assert - Application should handle gracefully
        // Should not crash, should reject or sanitize malicious input
        const isOnLoginPage = await loginPage.isOnLoginPage();
        const hasError = await loginPage.isErrorDisplayed();

        // Security test passes if application handles input gracefully
        expect(isOnLoginPage || hasError).toBe(true);

        // For XSS tests, verify no script execution
        if (scenario.category === 'xss') {
          const pageContent = await loginPage.page.content();
          expect(pageContent).not.toContain('<script>alert');
        }
      });
    }
  });
});
```

### Test Migration Template

```typescript
// tests/{module}.spec.ts
import { test, expect } from '@playwright/test';
import { {PageName}Page } from '../pages/{PageName}Page';
// Import other required page objects
import testData from '../data/{module}Data.json';

/**
 * {Module Name} Module Tests
 * Migrated from: {source_file_path}
 * Original framework: {source_framework}
 * Migration date: {date}
 */
test.describe('{Module Name} Module - {Application Name}', () => {
  let {pageName}Page: {PageName}Page;
  // Declare other page objects

  // Migrated from: {original_setup_annotation}
  test.beforeEach(async ({ page }) => {
    {pageName}Page = new {PageName}Page(page);
    // Initialize other page objects
    await {pageName}Page.navigate();
  });

  // ============================================================================
  // POSITIVE TEST CASES
  // Migrated from: {original_test_method} with {data_provider}
  // ============================================================================

  test.describe('Positive Scenarios', () => {
    for (const scenario of testData.validScenarios) {
      test(`${scenario.testId}: ${scenario.description}`, async ({ page }) => {
        // Original test ID: ${scenario.originalTestId}

        // Arrange - from JSON data

        // Act - Migrated from: {original_actions}
        await {pageName}Page.{action}(scenario.{param});

        // Assert - Migrated from: {original_assertions}
        expect(await {pageName}Page.{verification}()).toBe(true);
      });
    }
  });

  // ============================================================================
  // NEGATIVE TEST CASES
  // Migrated from: {original_negative_tests}
  // ============================================================================

  test.describe('Negative Scenarios', () => {
    for (const scenario of testData.invalidScenarios) {
      test(`${scenario.testId}: ${scenario.description}`, async () => {
        // Act
        await {pageName}Page.{action}(scenario.{param});

        // Assert
        expect(await {pageName}Page.isErrorDisplayed()).toBe(true);
        const errorMsg = await {pageName}Page.getErrorMessage();
        expect(errorMsg).toContain(scenario.expectedError);
      });
    }
  });

  // Add more test.describe blocks for:
  // - Empty field tests
  // - Boundary tests
  // - Security tests
  // - E2E scenarios
});
```

---

## 11. Self-Healing Integration

### Element Definition Pattern for Migrated Projects

```typescript
// config/elements.ts
export interface ElementDefinition {
  primary: string;
  fallbacks: string[];
  description: string;
  originalLocator?: string; // Track original Selenium locator
}

export interface PageElements {
  [key: string]: ElementDefinition;
}

/**
 * Element definitions for Login Page
 * Migrated from: LoginPage.java @FindBy annotations
 */
export const LOGIN_ELEMENTS: PageElements = {
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
      '.login-btn'
    ],
    description: 'Login submit button',
    originalLocator: '@FindBy(css = "button[type=\'submit\']")'
  },
  errorMessage: {
    primary: '.error-message',
    fallbacks: [
      '[data-test="error"]',
      '.alert-danger',
      '[role="alert"]'
    ],
    description: 'Error message container',
    originalLocator: '@FindBy(css = ".error-message")'
  }
};

// Template for generating element definitions from source
export function generateElementDefinition(
  elementName: string,
  originalLocator: string,
  locatorType: string
): ElementDefinition {
  // Map original locator to primary + fallbacks
  const primary = mapToPrimarySelector(originalLocator, locatorType);
  const fallbacks = generateFallbacks(elementName, primary);

  return {
    primary,
    fallbacks,
    description: `${elementName} element`,
    originalLocator: `${locatorType}: ${originalLocator}`
  };
}

function mapToPrimarySelector(original: string, type: string): string {
  switch (type) {
    case 'id':
      return `#${original}`;
    case 'name':
      return `[name="${original}"]`;
    case 'className':
      return `.${original}`;
    case 'css':
    case 'cssSelector':
      return original;
    case 'xpath':
      // Try to convert simple XPath to CSS, otherwise keep XPath
      return original.startsWith('//') ? original : `xpath=${original}`;
    default:
      return original;
  }
}

function generateFallbacks(elementName: string, primary: string): string[] {
  const fallbacks: string[] = [];

  // Add data-test attribute
  fallbacks.push(`[data-test="${elementName}"]`);
  fallbacks.push(`[data-testid="${elementName}"]`);

  // Add name attribute if applicable
  if (elementName.includes('Input') || elementName.includes('Field')) {
    const fieldName = elementName.replace(/Input|Field/i, '').toLowerCase();
    fallbacks.push(`[name="${fieldName}"]`);
    fallbacks.push(`input[placeholder*="${fieldName}" i]`);
  }

  // Add button-specific fallbacks
  if (elementName.includes('Button') || elementName.includes('Btn')) {
    const buttonText = elementName.replace(/Button|Btn/i, '');
    fallbacks.push(`button:has-text("${buttonText}")`);
  }

  return fallbacks;
}
```

### SelfHealingLocator for Migrated Tests

```typescript
// utils/SelfHealingLocator.ts
import { Page, Locator } from '@playwright/test';
import { AIObserver } from './AIObserver';
import { ElementDefinition } from '../config/elements';

interface MigrationHealingResult {
  originalSeleniumLocator: string;
  originalPlaywrightSelector: string;
  healedSelector: string | null;
  healingMethod: 'cache' | 'fallback' | 'ai' | 'failed';
  timestamp: Date;
}

export class SelfHealingLocator {
  private page: Page;
  private healingCache: Map<string, string> = new Map();
  private healingHistory: MigrationHealingResult[] = [];
  private aiObserver: AIObserver;

  constructor(page: Page) {
    this.page = page;
    this.aiObserver = new AIObserver();
  }

  /**
   * Locate element with self-healing capabilities
   * Enhanced for migrated projects with original locator tracking
   */
  async locate(
    elementDef: ElementDefinition,
    options?: { timeout?: number }
  ): Promise<Locator> {
    const timeout = options?.timeout || 5000;
    const { primary, fallbacks, description, originalLocator } = elementDef;

    // Strategy 1: Try primary selector
    try {
      const locator = this.page.locator(primary);
      await locator.waitFor({ state: 'visible', timeout: timeout / 3 });
      return locator;
    } catch {
      console.log(`[SelfHealing] Primary selector failed: ${primary}`);
      console.log(`[SelfHealing] Original Selenium: ${originalLocator || 'N/A'}`);
    }

    // Strategy 2: Check healing cache
    const cachedSelector = this.healingCache.get(primary);
    if (cachedSelector) {
      try {
        const locator = this.page.locator(cachedSelector);
        await locator.waitFor({ state: 'visible', timeout: timeout / 3 });
        this.recordHealing(originalLocator, primary, cachedSelector, 'cache');
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
        this.healingCache.set(primary, fallback);
        this.recordHealing(originalLocator, primary, fallback, 'fallback');
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
          this.healingCache.set(primary, aiSelector);
          this.recordHealing(originalLocator, primary, aiSelector, 'ai');
          return locator;
        }
      } catch (error) {
        console.log(`[SelfHealing] AI healing failed: ${error}`);
      }
    }

    // All strategies failed
    this.recordHealing(originalLocator, primary, null, 'failed');
    throw new Error(`[SelfHealing] Could not locate element: ${description}`);
  }

  private recordHealing(
    originalSelenium: string | undefined,
    originalPlaywright: string,
    healed: string | null,
    method: 'cache' | 'fallback' | 'ai' | 'failed'
  ): void {
    this.healingHistory.push({
      originalSeleniumLocator: originalSelenium || 'N/A',
      originalPlaywrightSelector: originalPlaywright,
      healedSelector: healed,
      healingMethod: method,
      timestamp: new Date()
    });

    console.log(`[SelfHealing] ${method.toUpperCase()}: ${originalPlaywright} → ${healed || 'FAILED'}`);
  }

  generateMigrationReport(): string {
    const report = [
      '='.repeat(70),
      'MIGRATION SELF-HEALING REPORT',
      '='.repeat(70),
      '',
      'This report shows how migrated locators performed and healed.',
      '',
      'HEALING HISTORY:',
      '-'.repeat(70)
    ];

    for (const h of this.healingHistory) {
      report.push(`Original Selenium: ${h.originalSeleniumLocator}`);
      report.push(`Migrated Selector: ${h.originalPlaywrightSelector}`);
      report.push(`Healed To: ${h.healedSelector || 'FAILED'}`);
      report.push(`Method: ${h.healingMethod.toUpperCase()}`);
      report.push('-'.repeat(70));
    }

    report.push('');
    report.push('='.repeat(70));

    return report.join('\n');
  }
}
```

---

## 12. Locator Strategy Migration

### Locator Upgrade Guidelines

When migrating locators, follow this priority order:

```typescript
/**
 * Locator Migration Priority
 *
 * 1. BEST: Role-based locators (most accessible, resilient)
 *    - page.getByRole('button', { name: 'Submit' })
 *    - page.getByRole('textbox', { name: 'Email' })
 *
 * 2. PREFERRED: Test ID locators (reliable, explicit)
 *    - page.getByTestId('submit-button')
 *    - page.locator('[data-test="submit"]')
 *
 * 3. GOOD: Text/Label based (readable, semantic)
 *    - page.getByText('Welcome')
 *    - page.getByLabel('Username')
 *    - page.getByPlaceholder('Enter email')
 *
 * 4. ACCEPTABLE: CSS selectors (fast, flexible)
 *    - page.locator('#username')
 *    - page.locator('.submit-btn')
 *
 * 5. AVOID: XPath (slow, brittle)
 *    - page.locator('//button[@type="submit"]')
 *    - Only use when no CSS alternative exists
 */
```

### Common XPath to CSS Conversions

```typescript
// utils/LocatorMigrator.ts

/**
 * Convert common XPath patterns to CSS selectors
 */
export function xpathToCss(xpath: string): string | null {
  const conversions: { [pattern: string]: (match: RegExpMatchArray) => string } = {
    // //tag[@id='value'] → #value
    "^\\/\\/\\w+\\[@id='([^']+)'\\]$": (m) => `#${m[1]}`,

    // //tag[@class='value'] → .value
    "^\\/\\/\\w+\\[@class='([^']+)'\\]$": (m) => `.${m[1]}`,

    // //tag[@name='value'] → [name="value"]
    "^\\/\\/\\w+\\[@name='([^']+)'\\]$": (m) => `[name="${m[1]}"]`,

    // //tag[@type='value'] → [type="value"]
    "^\\/\\/\\w+\\[@type='([^']+)'\\]$": (m) => `[type="${m[1]}"]`,

    // //tag[contains(@class,'value')] → [class*="value"]
    "^\\/\\/\\w+\\[contains\\(@class,'([^']+)'\\)\\]$": (m) => `[class*="${m[1]}"]`,

    // //tag[contains(text(),'value')] → :has-text("value")
    "^\\/\\/\\w+\\[contains\\(text\\(\\),'([^']+)'\\)\\]$": (m) => `:has-text("${m[1]}")`,

    // //tag[@attr='value'] → tag[attr="value"]
    "^\\/\\/(\\w+)\\[@(\\w+)='([^']+)'\\]$": (m) => `${m[1]}[${m[2]}="${m[3]}"]`,
  };

  for (const [pattern, converter] of Object.entries(conversions)) {
    const regex = new RegExp(pattern);
    const match = xpath.match(regex);
    if (match) {
      return converter(match);
    }
  }

  // Complex XPath - return null to indicate manual conversion needed
  return null;
}

/**
 * Migrate Selenium By locator to Playwright
 */
export function migrateSeleniumLocator(
  locatorType: string,
  locatorValue: string
): { selector: string; strategy: string } {
  switch (locatorType.toLowerCase()) {
    case 'id':
      return { selector: `#${locatorValue}`, strategy: 'id' };

    case 'name':
      return { selector: `[name="${locatorValue}"]`, strategy: 'attribute' };

    case 'classname':
    case 'class':
      return { selector: `.${locatorValue}`, strategy: 'class' };

    case 'tagname':
    case 'tag':
      return { selector: locatorValue, strategy: 'tag' };

    case 'linktext':
      return { selector: `a:has-text("${locatorValue}")`, strategy: 'text' };

    case 'partiallinktext':
      return { selector: `a:has-text("${locatorValue}")`, strategy: 'text' };

    case 'cssselector':
    case 'css':
      return { selector: locatorValue, strategy: 'css' };

    case 'xpath':
      const cssEquivalent = xpathToCss(locatorValue);
      if (cssEquivalent) {
        return { selector: cssEquivalent, strategy: 'css-from-xpath' };
      }
      return { selector: `xpath=${locatorValue}`, strategy: 'xpath' };

    default:
      return { selector: locatorValue, strategy: 'unknown' };
  }
}
```

### Locator Migration Report Template

```
================================================================================
                     LOCATOR MIGRATION REPORT
================================================================================
Project: {PROJECT_NAME}
Migration Date: {DATE}
Source Framework: {SOURCE_FRAMEWORK}

================================================================================
                          MIGRATION SUMMARY
================================================================================

Total Locators Migrated: {TOTAL}

By Strategy:
- ID → CSS ID:           {COUNT} ({PERCENT}%)
- Class → CSS Class:     {COUNT} ({PERCENT}%)
- Name → Attribute:      {COUNT} ({PERCENT}%)
- CSS → CSS (unchanged): {COUNT} ({PERCENT}%)
- XPath → CSS:           {COUNT} ({PERCENT}%)
- XPath → XPath (kept):  {COUNT} ({PERCENT}%)
- Text-based:            {COUNT} ({PERCENT}%)

================================================================================
                        UPGRADE OPPORTUNITIES
================================================================================

The following locators could be upgraded to more resilient strategies:

| Original | Current | Recommended | Reason |
|----------|---------|-------------|--------|
| By.id("submit") | #submit | getByRole('button', {name: 'Submit'}) | Role-based is more resilient |
| By.className("error") | .error | getByRole('alert') | Semantic role is clearer |

================================================================================
                     COMPLEX LOCATORS (Review Required)
================================================================================

The following XPath locators could not be auto-converted:

1. Original: //div[@class='container']//button[contains(text(),'Save')]
   Current: xpath=//div[@class='container']//button[contains(text(),'Save')]
   Suggestion: Consider adding data-test attribute to button

2. Original: //table//tr[position()>1]/td[2]
   Current: xpath=//table//tr[position()>1]/td[2]
   Suggestion: Use table locator pattern: page.locator('table tbody tr').nth(n)

================================================================================
                       SELF-HEALING FALLBACKS
================================================================================

Fallback selectors have been generated for all elements.
See config/elements.ts for full definitions.

================================================================================
```

---

## 13. Wait Strategy Migration

### Wait Pattern Mapping

| Selenium Wait | Playwright Equivalent | Notes |
|---------------|----------------------|-------|
| Implicit Wait | Not needed | Playwright auto-waits |
| `WebDriverWait.until(visibilityOf)` | `await locator.waitFor({ state: 'visible' })` | Explicit visibility |
| `WebDriverWait.until(elementToBeClickable)` | `await locator.click()` | Auto-waits for clickable |
| `WebDriverWait.until(presenceOf)` | `await locator.waitFor({ state: 'attached' })` | DOM presence |
| `WebDriverWait.until(invisibilityOf)` | `await locator.waitFor({ state: 'hidden' })` | Wait for hidden |
| `Thread.sleep()` | `await page.waitForTimeout()` | Avoid when possible |
| `FluentWait` | Custom polling with `waitFor` | Rarely needed |

### Wait Migration Examples

```typescript
// utils/WaitMigrator.ts

/**
 * Source: Java Selenium
 *
 * WebDriverWait wait = new WebDriverWait(driver, 10);
 * wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")));
 *
 * Target: Playwright
 */
async function migratedVisibilityWait(page: Page): Promise<void> {
  // Playwright equivalent - explicit wait
  await page.locator('#username').waitFor({ state: 'visible', timeout: 10000 });

  // Or simply - Playwright auto-waits for most actions
  await page.locator('#username').fill('value'); // Auto-waits for visible
}

/**
 * Source: Java Selenium
 *
 * WebDriverWait wait = new WebDriverWait(driver, 10);
 * wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".submit-btn")));
 * element.click();
 *
 * Target: Playwright
 */
async function migratedClickableWait(page: Page): Promise<void> {
  // Playwright auto-waits for element to be clickable
  await page.locator('.submit-btn').click(); // Auto-waits for actionable
}

/**
 * Source: Java Selenium
 *
 * WebDriverWait wait = new WebDriverWait(driver, 10);
 * wait.until(ExpectedConditions.textToBePresentInElement(element, "Success"));
 *
 * Target: Playwright
 */
async function migratedTextWait(page: Page): Promise<void> {
  // Playwright - use assertion with auto-retry
  await expect(page.locator('.message')).toContainText('Success');

  // Or explicit wait
  await page.locator('.message:has-text("Success")').waitFor({ state: 'visible' });
}

/**
 * Source: Java Selenium
 *
 * WebDriverWait wait = new WebDriverWait(driver, 30);
 * wait.until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector(".loading")));
 *
 * Target: Playwright
 */
async function migratedInvisibilityWait(page: Page): Promise<void> {
  // Wait for loading spinner to disappear
  await page.locator('.loading').waitFor({ state: 'hidden', timeout: 30000 });

  // Or with fallback for non-existent element
  await page.locator('.loading').waitFor({ state: 'hidden' }).catch(() => {});
}

/**
 * Source: Java Selenium
 *
 * FluentWait<WebDriver> wait = new FluentWait<>(driver)
 *     .withTimeout(Duration.ofSeconds(30))
 *     .pollingEvery(Duration.ofMillis(500))
 *     .ignoring(NoSuchElementException.class);
 *
 * Target: Playwright
 */
async function migratedFluentWait(page: Page): Promise<void> {
  // Playwright - use expect with custom timeout
  await expect(page.locator('.element')).toBeVisible({ timeout: 30000 });

  // Or custom polling (rarely needed)
  await page.waitForFunction(
    () => document.querySelector('.element')?.textContent?.includes('Ready'),
    { timeout: 30000, polling: 500 }
  );
}

/**
 * Source: Java Selenium (Network wait)
 *
 * wait.until(ExpectedConditions.urlContains("/dashboard"));
 *
 * Target: Playwright
 */
async function migratedUrlWait(page: Page): Promise<void> {
  // Wait for URL
  await page.waitForURL('**/dashboard');

  // Or with assertion
  await expect(page).toHaveURL(/\/dashboard/);
}

/**
 * Source: Java Selenium (Page load)
 *
 * driver.manage().timeouts().pageLoadTimeout(30, TimeUnit.SECONDS);
 *
 * Target: Playwright
 */
async function migratedPageLoadWait(page: Page): Promise<void> {
  // Wait for page load state
  await page.waitForLoadState('load');           // DOM loaded
  await page.waitForLoadState('domcontentloaded'); // DOM ready
  await page.waitForLoadState('networkidle');    // No network activity
}
```

### Wait Strategy Recommendation

```typescript
/**
 * PLAYWRIGHT WAIT STRATEGY GUIDE
 *
 * 1. DON'T WAIT - Playwright auto-waits for most actions
 *    await page.locator('#btn').click(); // Auto-waits for clickable
 *    await page.locator('#input').fill('text'); // Auto-waits for visible
 *
 * 2. USE ASSERTIONS - For verification with built-in retry
 *    await expect(locator).toBeVisible();
 *    await expect(locator).toHaveText('Expected');
 *    await expect(page).toHaveURL('/path');
 *
 * 3. EXPLICIT WAIT - When you need specific state
 *    await locator.waitFor({ state: 'visible' });
 *    await locator.waitFor({ state: 'hidden' });
 *    await locator.waitFor({ state: 'attached' });
 *
 * 4. NETWORK WAIT - For API responses
 *    await page.waitForResponse('/api/data');
 *    await page.waitForRequest('/api/submit');
 *
 * 5. NAVIGATION WAIT - For page changes
 *    await page.waitForURL('**/dashboard');
 *    await page.waitForLoadState('networkidle');
 *
 * 6. AVOID - Hard-coded sleeps
 *    await page.waitForTimeout(1000); // Use sparingly
 */
```

---

## 14. Configuration Migration

### Source: Java/Maven Configuration

```properties
# config.properties (Source)
base.url=https://www.saucedemo.com
browser=chrome
implicit.wait=10
explicit.wait=30
headless=false
screenshot.on.failure=true
```

```xml
<!-- pom.xml (Source) -->
<project>
    <dependencies>
        <dependency>
            <groupId>org.seleniumhq.selenium</groupId>
            <artifactId>selenium-java</artifactId>
            <version>4.10.0</version>
        </dependency>
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>7.8.0</version>
        </dependency>
    </dependencies>
</project>
```

### Target: Playwright Configuration

```typescript
// playwright.config.ts (Target)
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Playwright Configuration
 * Migrated from: config.properties + pom.xml
 * Original framework: Java Selenium + TestNG
 */
export default defineConfig({
  // Test directory
  testDir: './tests',

  // Parallel execution (Selenium required complex setup, Playwright built-in)
  fullyParallel: true,

  // Fail fast on CI
  forbidOnly: !!process.env.CI,

  // Retry failed tests
  retries: process.env.CI ? 2 : 0,

  // Worker threads
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  // Migrated from: TestNG XML reporter / ExtentReports
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }] // For CI compatibility
  ],

  // Shared settings for all projects
  use: {
    // Migrated from: base.url property
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

    // Migrated from: screenshot.on.failure
    screenshot: 'only-on-failure',

    // Enhanced: Trace on retry (not available in Selenium)
    trace: 'on-first-retry',

    // Enhanced: Video recording
    video: 'on-first-retry',

    // Viewport size
    viewport: { width: 1920, height: 1080 },

    // Migrated from: explicit.wait (used as action timeout)
    actionTimeout: 30000,

    // Navigation timeout
    navigationTimeout: 30000,

    // Migrated from: headless property
    headless: process.env.HEADLESS !== 'false',
  },

  // Global timeout
  // Migrated from: testng timeout attribute
  timeout: 60000,

  // Expect timeout
  expect: {
    timeout: 10000,
  },

  // Browser projects
  // Migrated from: browser property (now supports multiple easily)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to add more browsers (easier than Selenium Grid)
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Output folder
  outputDir: 'reports/test-artifacts/',

  // Web server (optional - run app before tests)
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
```

### Target: Package.json

```json
{
  "name": "migrated-automation-framework",
  "version": "1.0.0",
  "description": "Playwright automation framework - Migrated from Selenium",
  "scripts": {
    "test": "npx playwright test",
    "test:headed": "npx playwright test --headed",
    "test:debug": "npx playwright test --debug",
    "test:ui": "npx playwright test --ui",
    "test:chrome": "npx playwright test --project=chromium",
    "test:firefox": "npx playwright test --project=firefox",
    "test:webkit": "npx playwright test --project=webkit",
    "test:all-browsers": "npx playwright test --project=chromium --project=firefox --project=webkit",
    "test:login": "npx playwright test tests/login.spec.ts",
    "test:e2e": "npx playwright test tests/e2e/",
    "test:self-healing": "npx playwright test tests/self-healing.spec.ts --headed",
    "report": "npx playwright show-report reports/playwright-report",
    "codegen": "npx playwright codegen",
    "clean": "rm -rf reports/ dist/ test-results/",
    "lint": "eslint . --ext .ts",
    "typecheck": "tsc --noEmit",
    "install:browsers": "npx playwright install"
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

### Target: .env.example

```bash
# Application URL
# Migrated from: base.url property
BASE_URL=https://www.saucedemo.com

# Test User Credentials
# Migrated from: test-data/*.properties or environment variables
TEST_USERNAME=standard_user
TEST_PASSWORD=secret_sauce

# Admin User Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin_password

# Browser Settings
# Migrated from: headless property
HEADLESS=false

# Anthropic API Key (for AI-powered self-healing)
# NEW: Not available in Selenium
ANTHROPIC_API_KEY=your-api-key-here

# Environment
NODE_ENV=test

# Timeouts (milliseconds)
# Migrated from: explicit.wait and implicit.wait
DEFAULT_TIMEOUT=30000
ACTION_TIMEOUT=10000

# Feature Flags
# NEW: Self-healing capabilities
ENABLE_SELF_HEALING=true
ENABLE_AI_OBSERVER=true
```

### Target: tsconfig.json

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

---

## 15. Quality Checklist

### Pre-Migration Checklist

```
SOURCE ANALYSIS:
□ Source project path identified
□ Source framework determined (Selenium, Protractor, Cypress, etc.)
□ Source language confirmed (Java, Python, JavaScript, C#)
□ All Page Object classes cataloged
□ All test specification files identified
□ Test data sources documented (Excel, CSV, JSON, inline)
□ Configuration files located
□ Utility/helper classes identified
□ Custom framework extensions noted
□ Dependencies and versions documented

MIGRATION SCOPE:
□ Modules to migrate prioritized
□ Complexity assessment completed
□ Timeline estimates documented
□ Risk areas identified
```

### Page Object Migration Checklist

```
FOR EACH PAGE OBJECT:
□ Class converted to TypeScript
□ All locators migrated to Playwright format
□ Locators upgraded where possible (ID → Role/TestID)
□ Fallback selectors added for self-healing
□ Original locators documented in comments
□ All methods converted to async/await
□ TypeScript types added (no 'any')
□ Inheritance preserved (BasePage)
□ Constructor properly initializes locators
□ Navigation methods work correctly
□ Action methods use Playwright APIs
□ Verification methods return proper types
```

### Test Specification Migration Checklist

```
FOR EACH TEST FILE:
□ Test framework hooks migrated (Before/After)
□ All test methods converted
□ Data providers converted to JSON + loops
□ Assertions mapped to expect()
□ Test names preserved or improved
□ Test groups/tags converted
□ Comments reference original test IDs
□ Data-driven loops implemented
□ Error handling updated

COVERAGE PRESERVED:
□ All positive tests migrated
□ All negative tests migrated
□ Boundary tests migrated
□ Security tests migrated (or added)
□ E2E scenarios migrated
```

### Test Data Migration Checklist

```
FOR EACH DATA SOURCE:
□ Data extracted from source format
□ JSON structure standardized
□ _metadata section added
□ Original test IDs referenced
□ Test categories organized (valid/invalid/boundary)
□ Expected results documented
□ Error messages captured
□ Security test data included
```

### Self-Healing Integration Checklist

```
SELF-HEALING SETUP:
□ Element definitions created for all pages
□ Primary selectors assigned
□ Fallback selectors generated (3-5 per element)
□ Human-readable descriptions added
□ Original locators documented
□ SelfHealingLocator.ts created
□ AIObserver.ts configured
□ HealingReporter.ts implemented
□ Environment variables configured
□ Self-healing demo test created
```

### Post-Migration Verification Checklist

```
EXECUTION VERIFICATION:
□ npm install completes without errors
□ Playwright browsers installed
□ .env file configured with correct values
□ All tests run without syntax errors
□ Tests pass in headless mode
□ Tests pass in headed mode
□ Self-healing demonstration works
□ Reports generate correctly

COVERAGE VERIFICATION:
□ Total test count matches or exceeds source
□ All original test IDs can be traced
□ No loss of test coverage
□ Additional security tests added

QUALITY VERIFICATION:
□ TypeScript compiles without errors
□ ESLint passes
□ No 'any' types in code
□ Consistent code formatting
□ Comments reference original code
□ README updated with migration notes
```

### Migration Report Template

```
================================================================================
                     FRAMEWORK MIGRATION REPORT
================================================================================
Project: {PROJECT_NAME}
Migration Date: {DATE}
Source Framework: {SOURCE_FRAMEWORK} ({SOURCE_LANGUAGE})
Target Framework: Playwright (TypeScript)

================================================================================
                          MIGRATION SUMMARY
================================================================================

SOURCE ANALYSIS:
- Page Objects: {COUNT}
- Test Specifications: {COUNT}
- Total Test Cases: {COUNT}
- Data Sources: {COUNT}
- Utility Classes: {COUNT}

MIGRATION RESULTS:
- Page Objects Migrated: {COUNT}/{TOTAL} ({PERCENT}%)
- Tests Migrated: {COUNT}/{TOTAL} ({PERCENT}%)
- Data Files Created: {COUNT}
- Locators Upgraded: {COUNT} (improved from XPath/other to modern selectors)

================================================================================
                          LOCATOR STATISTICS
================================================================================

| Strategy | Source Count | Target Count | Upgraded |
|----------|--------------|--------------|----------|
| ID       | {COUNT}      | {COUNT}      | {COUNT}  |
| CSS      | {COUNT}      | {COUNT}      | {COUNT}  |
| XPath    | {COUNT}      | {COUNT}      | {COUNT}  |
| Name     | {COUNT}      | {COUNT}      | {COUNT}  |
| Role     | 0            | {COUNT}      | N/A      |
| TestID   | 0            | {COUNT}      | N/A      |

================================================================================
                        IMPROVEMENT HIGHLIGHTS
================================================================================

1. EXECUTION SPEED: Expected 3x faster due to Playwright optimizations
2. RELIABILITY: Auto-wait eliminates flakiness from timing issues
3. DEBUGGING: Trace viewer, inspector, and codegen tools added
4. SELF-HEALING: AI-powered locator healing implemented
5. PARALLEL EXECUTION: Built-in parallelization (was complex in Selenium)
6. CROSS-BROWSER: Easy multi-browser testing with device emulation

================================================================================
                           KNOWN ISSUES
================================================================================

{List any issues or limitations discovered during migration}

================================================================================
                          NEXT STEPS
================================================================================

1. Run full test suite in CI/CD environment
2. Monitor self-healing statistics
3. Update locators based on healing reports
4. Add additional test coverage where gaps identified
5. Train team on Playwright best practices

================================================================================
```

---

## 16. Troubleshooting Guide

### Common Migration Issues

#### Issue: Locators not finding elements

**Symptoms:**
- TimeoutError in migrated tests
- Elements not found that worked in Selenium

**Solutions:**
1. Check if application uses dynamic IDs:
   ```typescript
   // Instead of #dynamic-123
   // Use: [data-test="element"] or role-based locator
   page.getByTestId('element');
   page.getByRole('button', { name: 'Submit' });
   ```

2. Verify XPath conversion is correct:
   ```typescript
   // Complex XPath may need manual adjustment
   // Original: //div[@class='container']//span[text()='Value']
   // Better: page.locator('.container').getByText('Value')
   ```

3. Check for iframe content:
   ```typescript
   // Selenium: driver.switchTo().frame(...)
   // Playwright: Use frameLocator
   const frame = page.frameLocator('#iframe-id');
   await frame.locator('#element').click();
   ```

#### Issue: Timing/synchronization problems

**Symptoms:**
- Tests that passed in Selenium now fail intermittently
- "Element not visible" errors

**Solutions:**
1. Remove explicit waits and trust auto-wait:
   ```typescript
   // Remove: await page.waitForSelector('#element');
   // Just use: await page.locator('#element').click();
   ```

2. For dynamic content, use assertions:
   ```typescript
   // Instead of sleep/wait
   await expect(page.locator('.result')).toBeVisible();
   ```

3. For AJAX updates, wait for network:
   ```typescript
   await Promise.all([
     page.waitForResponse('/api/data'),
     page.locator('#refresh').click()
   ]);
   ```

#### Issue: Data provider tests not iterating

**Symptoms:**
- Only one test case runs
- All data scenarios executed as single test

**Solutions:**
1. Ensure for loop is outside test():
   ```typescript
   // CORRECT:
   for (const data of testData.scenarios) {
     test(`${data.testId}`, async () => { ... });
   }

   // INCORRECT:
   test('test', async () => {
     for (const data of testData.scenarios) { ... }
   });
   ```

2. Verify JSON import in tsconfig.json:
   ```json
   "resolveJsonModule": true,
   "esModuleInterop": true
   ```

#### Issue: Authentication state not persisting

**Symptoms:**
- Every test requires fresh login
- Session not shared between tests

**Solutions:**
1. Use storage state:
   ```typescript
   // Save after login
   await page.context().storageState({ path: 'auth.json' });

   // Reuse in config
   use: {
     storageState: 'auth.json',
   }
   ```

2. Use global setup:
   ```typescript
   // config/globalSetup.ts
   async function globalSetup() {
     const browser = await chromium.launch();
     const page = await browser.newPage();
     await page.goto('/login');
     await page.locator('#username').fill('user');
     await page.locator('#password').fill('pass');
     await page.locator('#submit').click();
     await page.context().storageState({ path: 'auth.json' });
     await browser.close();
   }
   ```

#### Issue: Actions class equivalent not working

**Symptoms:**
- Drag and drop fails
- Hover actions don't trigger menus

**Solutions:**
1. Hover actions:
   ```typescript
   // Selenium: Actions(driver).moveToElement(e).perform()
   // Playwright:
   await page.locator('.menu').hover();
   await page.locator('.submenu-item').click();
   ```

2. Drag and drop:
   ```typescript
   // Selenium: Actions(driver).dragAndDrop(src, tgt).perform()
   // Playwright:
   await page.locator('#source').dragTo(page.locator('#target'));
   ```

3. Complex actions:
   ```typescript
   // For complex sequences
   await page.locator('#element').click({ force: true });
   await page.locator('#element').click({ position: { x: 10, y: 20 } });
   ```

#### Issue: Alert/Dialog handling differences

**Symptoms:**
- Alert tests failing
- Dialog not being handled

**Solutions:**
```typescript
// Selenium: driver.switchTo().alert().accept()
// Playwright: Set up handler BEFORE triggering action
page.on('dialog', dialog => dialog.accept());
await page.locator('#trigger-alert').click();

// For confirm dialogs with text verification
page.on('dialog', async dialog => {
  expect(dialog.message()).toBe('Are you sure?');
  await dialog.accept();
});
```

#### Issue: Window/tab handling different

**Symptoms:**
- New window tests failing
- Can't switch between tabs

**Solutions:**
```typescript
// Selenium: driver.switchTo().window(handle)
// Playwright: Listen for new page

// Before clicking link that opens new tab
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('a[target="_blank"]').click()
]);
await newPage.waitForLoadState();
// Now work with newPage

// Or get all pages
const pages = context.pages();
const newPage = pages[1];
```

---

## Quick Start Commands

```bash
# 1. Initialize new Playwright project for migration
mkdir migrated-framework && cd migrated-framework
npm init -y

# 2. Install dependencies
npm install -D @playwright/test @anthropic-ai/sdk dotenv typescript
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint

# 3. Install browsers
npx playwright install chromium

# 4. Create folder structure
mkdir pages tests data utils config reports

# 5. Initialize TypeScript
npx tsc --init

# 6. Run initial test
npm test

# 7. Run with browser visible
npm run test:headed

# 8. View report
npm run report

# 9. Debug a specific test
npx playwright test tests/login.spec.ts --debug

# 10. Generate tests with codegen
npx playwright codegen https://your-app-url.com
```

---

## Migration Command Reference

| Task | Command |
|------|---------|
| Run all tests | `npm test` |
| Run specific file | `npx playwright test tests/login.spec.ts` |
| Run in headed mode | `npm run test:headed` |
| Debug mode | `npx playwright test --debug` |
| UI mode | `npx playwright test --ui` |
| Generate code | `npx playwright codegen [url]` |
| View report | `npm run report` |
| Run single browser | `npx playwright test --project=chromium` |
| Run with retries | `npx playwright test --retries=2` |
| Update snapshots | `npx playwright test --update-snapshots` |

---

*This guardrail ensures consistent, high-quality migration from legacy frameworks to modern Playwright automation. Version 1.0*
