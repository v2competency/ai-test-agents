# Test Case Generator Agent - Prompt Templates

> Ready-to-use prompts for invoking the Test Case Generator Agent

---

## Quick Start Prompt

```
I have screenshot(s) of my application that I need analyzed for test case generation.

Application Name: {YOUR_APP_NAME}
Base URL: {YOUR_APP_URL}

Please analyze the attached screenshot(s) and:
1. Identify all pages and their purposes
2. Catalog all interactive elements
3. Identify testable scenarios across:
   - Functional/Positive tests
   - Negative tests
   - Boundary tests
   - Security tests
4. Present a summary for my review before generating test cases
5. After my confirmation, generate comprehensive manual test cases in CSV format to manual-tests/

[Attach your screenshot(s)]
```

---

## Detailed Analysis Request

```
CONTEXT:
I am building test documentation for {APPLICATION_NAME}, a {APPLICATION_TYPE} application.
Base URL: {BASE_URL}

SCREENSHOTS PROVIDED:
- {screenshot1.png}: {Brief description}
- {screenshot2.png}: {Brief description}
- {screenshot3.png}: {Brief description}

REQUIREMENTS:
1. Analyze all screenshots systematically
2. Identify every interactive element on each page
3. Generate test scenarios covering:
   - POSITIVE: Valid inputs and happy path scenarios
   - NEGATIVE: Invalid inputs and error handling
   - BOUNDARY: Edge cases, min/max values, special characters
   - SECURITY: SQL injection, XSS, authentication bypass
4. Provide a comprehensive summary before generating test cases
5. Wait for my approval before creating the test case document

KNOWN TEST DATA (if any):
- Valid credentials: {username/password if known}
- Sample data: {any known valid values}

OUTPUT:
- Analysis summary for review
- After approval: manual-tests/{APP_NAME}_Manual_Test_Cases.csv (CSV format for easy integration)
```

---

## Single Page Analysis

```
Please analyze this screenshot of my {PAGE_TYPE} page.

Application: {APP_NAME}
Page: {PAGE_NAME} (e.g., Login, Registration, Dashboard)
URL: {PAGE_URL}

Focus areas:
- All input fields and their validation requirements
- All buttons and their expected behaviors
- Error message patterns
- Success/confirmation indicators

Generate a summary of potential test cases, then wait for my confirmation.
```

---

## Multi-Page Flow Analysis

```
I have screenshots covering a complete user flow in my application.

Application: {APP_NAME}
Flow: {FLOW_NAME} (e.g., User Registration, Checkout Process, Profile Update)

Screenshots:
1. {screenshot1}: {Start page}
2. {screenshot2}: {Step 2}
3. {screenshot3}: {Step 3}
4. {screenshot4}: {Confirmation page}

Please:
1. Analyze each page in the flow
2. Identify the complete user journey
3. Generate E2E test scenarios alongside individual page tests
4. Present summary for approval before generating test cases
```

---

## Focus-Specific Analysis

### Security-Focused

```
I need a security-focused analysis of my application.

Application: {APP_NAME}
Focus: Security Test Cases

Please analyze the attached screenshots with emphasis on:
- Authentication vulnerabilities
- Input validation weaknesses
- Potential SQL injection points
- XSS vulnerability surfaces
- Authorization bypass opportunities
- Session management issues

Generate primarily security test cases (minimum 10) along with standard functional tests.
```

### Form Validation-Focused

```
Please analyze this form for comprehensive validation testing.

Application: {APP_NAME}
Form: {FORM_NAME}

I need thorough coverage of:
- Required field validation
- Format validation (email, phone, date, etc.)
- Length validation (min/max)
- Cross-field validation
- Error message verification
- Success state verification

Generate detailed validation test cases covering all input combinations.
```

### E-Commerce Application

```
I have screenshots of my e-commerce application.

Application: {STORE_NAME}
Type: E-Commerce

Screenshots include:
- Product listing page
- Product detail page
- Shopping cart
- Checkout flow
- Order confirmation

Please analyze with focus on:
- Product browsing and search
- Cart operations (add, update, remove)
- Checkout validation
- Payment processing states
- Order completion

Generate comprehensive e-commerce test cases.
```

---

## Modification Requests

### After Initial Analysis - Request Changes

```
Thank you for the analysis. Before generating test cases, please:

1. Add more focus on: {AREA}
2. Reduce coverage on: {AREA}
3. Include additional scenarios for: {SPECIFIC_FEATURE}
4. Skip: {FEATURE_TO_SKIP}

Then proceed with test case generation.
```

### Request Additional Categories

```
Please also include test cases for:
- Accessibility (keyboard navigation, screen reader support)
- Performance (load time, response time)
- Mobile/Responsive behavior
- Localization/i18n
```

---

## Output Control

### Standard Output (Default)
```
Generate test cases in CSV format and save to: manual-tests/{APP_NAME}_Manual_Test_Cases.csv
```

### Custom Output Location
```
Generate test cases in CSV format and save to: manual-tests/{CUSTOM_FOLDER}/{CUSTOM_FILENAME}.csv
```

### Preview Only
```
Show me a preview of the test cases (first 5 per category) in CSV format before generating the full document.
```

### With Summary File
```
Generate test cases and also create a summary file: manual-tests/{APP_NAME}_Test_Summary.csv
```

---

## Example Complete Interaction

### User's Initial Request
```
I have attached a screenshot of my SaaS application's login page.

Application: TaskMaster Pro
Base URL: https://app.taskmasterpro.com
Page: Login

Please analyze it and help me create comprehensive test cases.
```

### After Agent Summary - User Confirmation
```
Yes, please generate all test cases as analyzed. The coverage looks good.
```

### Or - With Modifications
```
Before generating:
1. Add 2 more test cases for password complexity
2. Include cases for SSO login button (I'll provide that screenshot next)
3. Focus more on security tests since this is a B2B application

Then generate the test cases.
```

---

## Tips for Best Results

1. **Provide clear screenshots** - Higher resolution images yield better element identification
2. **Include all states** - Show forms in empty, filled, error, and success states
3. **Capture error messages** - Take screenshots showing validation errors
4. **Show full page** - Include navigation and headers for context
5. **Specify known data** - Share valid test credentials if available
6. **Indicate priorities** - Tell the agent which modules are most critical
7. **Be specific about app type** - E-commerce, SaaS, CMS, etc. helps context
