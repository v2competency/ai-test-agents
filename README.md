# How to Use the Sub-Agents - Complete Prompt Guide

> This file contains the exact prompts to use for invoking each sub-agent

---

## 🎯 Quick Reference

| Agent | Purpose | Prompt File |
|-------|---------|-------------|
| **Test Case Generator Agent** | Screenshot → Manual Test Cases | [See Section 1](#1-test-case-generator-agent-prompts) |
| **Automation Generator Agent** | Manual Test Cases → Playwright | [See Section 2](#2-automation-generator-agent-prompts) |

---

## 1. Test Case Generator Agent Prompts

### ✅ Basic Usage (Recommended)

```
Please act as the Test Case Generator Agent using the system prompt at:
sub-agents/testcase-generator-agent/system-prompt.md

I have a screenshot of my application's login page.

Application Name: SauceDemo
Base URL: https://www.saucedemo.com/

Please analyze this screenshot and generate comprehensive test cases.

[Attach your screenshot file]
```

---

### ✅ Simple Version (Just Say This)

```
I have a screenshot of my login page for MyApp (https://myapp.example.com).

Please analyze it and create test cases covering:
- Functional/Positive tests
- Negative tests
- Boundary tests
- Security tests

[Attach screenshot]
```

---

### ✅ Multiple Screenshots

```
I have screenshots of my e-commerce application.

Application: ShopEasy
Base URL: https://shopeasy.com

Screenshots:
1. Login page
2. Product listing page
3. Shopping cart page

Please analyze all screenshots and generate comprehensive test cases.

[Attach multiple screenshots]
```

---

### ✅ With Specific Requirements

```
Please analyze this screenshot using the Test Case Generator Agent.

Application: TaskMaster Pro
URL: https://app.taskmasterpro.com
Type: SaaS Dashboard

Focus on:
- Security tests (this is a B2B app with sensitive data)
- Form validation (complex multi-field form)
- Authentication flows

[Attach screenshot]
```

---

### ✅ Single Module Focus

```
Please analyze this registration page screenshot.

Application: MyApp
Page: Registration Form
URL: https://myapp.com/register

I need test cases specifically for:
- Field validation (email, password, phone)
- Password strength requirements
- Terms & conditions checkbox
- Email verification flow

[Attach screenshot]
```

---

## 2. Automation Generator Agent Prompts

### ✅ Basic Usage (After Test Cases Generated)

```
Please act as the Automation Generator Agent using the system prompt at:
sub-agents/automation-generator-agent/system-prompt.md

Generate Playwright automation framework from:
manual-tests/MyApp_Manual_Test_Cases.txt

Base URL: https://myapp.example.com
```

---

### ✅ Simple Version

```
Now generate Playwright automation from the manual test cases.

Input: manual-tests/MyApp_Manual_Test_Cases.txt
Base URL: https://myapp.example.com

Please create the complete framework with:
- Page Objects
- Test Specifications
- Test Data JSON files
- Self-healing utilities
```

---

### ✅ With Options

```
Generate Playwright automation from manual-tests/ShopEasy_Manual_Test_Cases.txt

Base URL: https://shopeasy.com

Options:
- Enable self-healing: Yes
- Multi-browser: Chromium only
- Include AI Observer: Yes

Output to: playwright-projects/ShopEasy/
```

---

### ✅ Specific Module Only

```
Generate Playwright automation for just the Authentication module.

Input: manual-tests/MyApp_Manual_Test_Cases.txt
Focus: TC_AUTH_* test cases only

Generate:
- LoginPage.ts
- auth.spec.ts
- authData.json

Skip other modules for now.
```

---

### ✅ Update Existing Project

```
I have an existing Playwright project at: playwright-projects/MyApp/

New test cases added to: manual-tests/MyApp_Manual_Test_Cases.txt (updated)

Please:
1. Identify new test cases not yet automated
2. Update existing page objects if needed
3. Add new test specs for new tests
4. Preserve existing code
```

---

## 3. Complete Pipeline Example

### Step 1: Screenshot Analysis

```
I'm starting a new test automation project.

Application: TaskMaster Pro
Type: SaaS Task Management
Base URL: https://app.taskmasterpro.com

I have screenshots of the login page. Please analyze and create test cases.

[Attach login_screenshot.png]
```

### Step 2: Review & Confirm

```
(Agent shows summary)

Yes, please generate all test cases as analyzed. The coverage looks good.
```

### Step 3: Generate Automation

```
Perfect! Now generate the Playwright automation framework.

Input: manual-tests/TaskMasterPro_Manual_Test_Cases.txt
Base URL: https://app.taskmasterpro.com
```

### Step 4: Review & Confirm

```
(Agent shows generation plan)

Yes, proceed with generation.
```

---

## 4. Advanced Usage

### For E-Commerce Applications

```
Please analyze my e-commerce site screenshots.

Application: ShopNow
Type: E-Commerce
URL: https://shopnow.com

Screenshots provided:
- Homepage with search
- Product listing with filters
- Product detail page
- Shopping cart
- Multi-step checkout (3 pages)
- Order confirmation

Generate comprehensive test cases including:
- Product search and filtering
- Add to cart workflows
- Checkout validation
- Payment processing states
- E2E purchase flows

[Attach all screenshots]
```

---

### For SaaS Dashboard

```
Analyze my SaaS dashboard application.

Application: Analytics Pro
Type: SaaS Dashboard
URL: https://analytics.pro

Screenshots:
- Login with SSO option
- Main dashboard with widgets
- Data table with CRUD operations
- Settings page
- Reports/Export page

Focus on:
- Authentication (including SSO)
- Data table interactions
- Form CRUD operations
- Data export functionality

[Attach screenshots]
```

---

### For Form-Heavy Applications

```
Please analyze my multi-step form application.

Application: Loan Application Portal
Type: Form-based Wizard
URL: https://loans.example.com

Screenshots show a 5-step wizard form with:
- Personal information
- Employment details
- Financial information
- Document upload
- Review & submit

I need extensive validation testing for:
- Field-level validation
- Cross-field validation
- Step progression/navigation
- Draft saving
- File upload validation

[Attach wizard screenshots]
```

---

## 5. Modification Requests

### After Initial Analysis

```
Thank you for the analysis. Before generating test cases, please:

1. Add more security test cases (minimum 10)
2. Include accessibility tests (keyboard navigation, ARIA labels)
3. Add more boundary tests for the email field
4. Skip the "Remember Me" functionality tests for now

Then proceed with test case generation.
```

---

### After Automation Generation

```
The automation looks good. Please also add:

1. A helper utility for login in utils/AuthHelper.ts
2. A fixture for common test data
3. Update the README with environment setup for Windows

Other files look perfect.
```

---

## 6. Troubleshooting Prompts

### If Agent Doesn't Understand

```
Please read and act according to the instructions in:
d:\Work\Claude-QE\Agents\sub-agents\testcase-generator-agent\system-prompt.md

I need you to analyze a screenshot and generate test cases following that system prompt exactly.

[Attach screenshot]
```

---

### Request Format Clarification

```
Please generate test cases in the exact format specified in:
sub-agents/testcase-generator-agent\system-prompt.md

Use the template shown in the "Output Format - Manual Test Cases" section.
```

---

## 7. Tips for Best Results

### ✅ DO:
- Provide clear, high-resolution screenshots
- Mention application name and URL
- Specify application type (e-commerce, SaaS, etc.)
- Include error states in screenshots
- Be specific about priorities

### ❌ DON'T:
- Use blurry or partial screenshots
- Skip the Base URL (needed for automation)
- Mix multiple unrelated apps in one request
- Forget to confirm before generation

---

## 8. Quick Copy-Paste Templates

### Template 1: New Project Start

```
New test automation project:
- App: [APP_NAME]
- URL: [BASE_URL]
- Type: [Web App/E-commerce/SaaS]

Screenshot attached: [PAGE_NAME]

Please analyze and create test cases.
```

---

### Template 2: Continue to Automation

```
Generate Playwright automation:
- Input: manual-tests/[APP_NAME]_Manual_Test_Cases.txt
- URL: [BASE_URL]

Proceed with generation.
```

---

### Template 3: Full Pipeline

```
Complete test automation pipeline:

1. App: [APP_NAME]
2. URL: [BASE_URL]
3. Screenshots: [LIST]

Please:
- Analyze screenshots → generate test cases
- After my confirmation → generate Playwright automation
- Output ready-to-run project

[Attach screenshots]
```

---

## 9. Reference

| File | Purpose |
|------|---------|
| `sub-agents/testcase-generator-agent/system-prompt.md` | Test Case Generator behavior |
| `sub-agents/testcase-generator-agent/prompt-template.md` | More example prompts |
| `sub-agents/automation-generator-agent/system-prompt.md` | Automation Generator behavior |
| `sub-agents/automation-generator-agent/prompt-template.md` | More example prompts |
| `manual-tests/EXAMPLE_SampleApp_Manual_Test_Cases.txt` | Example output format |
| `playwright-projects/EXAMPLE_SampleApp/` | Example generated project |

---

## 10. Getting Help

If something doesn't work, say:

```
Please read the system prompt at sub-agents/[agent-name]/system-prompt.md
and follow those instructions exactly.
```

Or reference the example:

```
Please generate output similar to:
manual-tests/EXAMPLE_SampleApp_Manual_Test_Cases.txt
```

---

**That's it! Just copy any prompt above and replace the placeholders with your app details.**
