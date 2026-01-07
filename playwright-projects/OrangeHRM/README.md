# OrangeHRM Playwright Automation Framework

A comprehensive Playwright test automation framework for OrangeHRM with AI-powered self-healing capabilities.

## Features

- **Page Object Model (POM)** - Clean separation of test logic and page interactions
- **AI Self-Healing Locators** - 4-tier healing strategy with Claude Vision API integration
- **Data-Driven Testing** - JSON-based test data for easy maintenance
- **Cross-Browser Support** - Chromium, Firefox, WebKit, and mobile viewports
- **Comprehensive Test Coverage** - 128+ test cases across 8 modules
- **Multiple Reporters** - HTML, JSON, and JUnit reports

## Project Structure

```
OrangeHRM/
├── config/                    # Global setup/teardown
├── data/                      # Test data JSON files
│   ├── authData.json         # Authentication test data
│   ├── dashboardData.json    # Dashboard test data
│   ├── leaveListData.json    # Leave list test data
│   ├── applyLeaveData.json   # Apply leave test data
│   ├── leaveConfigData.json  # Leave configuration data
│   ├── entitlementsData.json # Entitlements test data
│   ├── reportsData.json      # Reports test data
│   ├── assignLeaveData.json  # Assign leave test data
│   ├── e2eData.json          # End-to-end flow data
│   └── users.json            # User credentials
├── pages/                     # Page Object classes
│   ├── components/           # Reusable UI components
│   │   └── SidebarNav.ts    # Sidebar navigation
│   ├── BasePage.ts          # Base page with common methods
│   ├── LoginPage.ts         # Login page
│   ├── DashboardPage.ts     # Dashboard page
│   ├── LeaveListPage.ts     # Leave list page
│   ├── ApplyLeavePage.ts    # Apply leave page
│   ├── LeaveConfigPage.ts   # Leave configuration pages
│   ├── EntitlementsPage.ts  # Entitlements page
│   ├── ReportsPage.ts       # Reports page
│   └── AssignLeavePage.ts   # Assign leave page
├── tests/                     # Test specification files
│   ├── e2e/                  # End-to-end flow tests
│   │   └── e2e-flows.spec.ts
│   ├── auth.spec.ts         # Authentication tests
│   ├── dashboard.spec.ts    # Dashboard tests
│   ├── apply-leave.spec.ts  # Apply leave tests
│   ├── leave-list.spec.ts   # Leave list tests
│   ├── assign-leave.spec.ts # Assign leave tests
│   ├── entitlements.spec.ts # Entitlements tests
│   ├── reports.spec.ts      # Reports tests
│   └── leave-config.spec.ts # Leave config tests
├── utils/                     # Utility classes
│   ├── SelfHealingLocator.ts # 4-tier self-healing engine
│   ├── AIObserver.ts        # Claude Vision API integration
│   ├── HealingReporter.ts   # Healing statistics reporter
│   └── TestHelpers.ts       # Common test helpers
├── reports/                   # Generated reports (gitignored)
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── package.json              # NPM dependencies and scripts
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Prerequisites

- Node.js 18+
- npm 8+
- OrangeHRM instance accessible at configured BASE_URL

## Installation

1. Clone the repository and navigate to the project:
   ```bash
   cd playwright-projects/OrangeHRM
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. Install Playwright browsers (done automatically via postinstall):
   ```bash
   npx playwright install
   ```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | OrangeHRM application URL | `http://localhost/orangehrm` |
| `ADMIN_USERNAME` | Admin user login | `admin` |
| `ADMIN_PASSWORD` | Admin user password | `Admin@123` |
| `ANTHROPIC_API_KEY` | Claude API key for AI healing | - |
| `AI_HEALING_ENABLED` | Enable/disable AI healing | `true` |
| `AI_MODEL` | Claude model for healing | `claude-sonnet-4-20250514` |
| `DEFAULT_TIMEOUT` | Default action timeout (ms) | `30000` |
| `WORKERS` | Parallel test workers | `4` |

## Running Tests

### All Tests
```bash
npm test                    # Run all tests
npm run test:headed         # Run with browser visible
npm run test:debug          # Run in debug mode
npm run test:ui             # Open Playwright UI mode
```

### By Browser
```bash
npm run test:chromium       # Chrome only
npm run test:firefox        # Firefox only
npm run test:webkit         # Safari only
```

### By Tag
```bash
npm run test:smoke          # Smoke tests (@smoke)
npm run test:regression     # Regression tests (@regression)
npm run test:e2e            # End-to-end flows (@e2e)
npm run test:security       # Security tests (@security)
npm run test:negative       # Negative tests (@negative)
```

### By Module
```bash
npm run test:auth           # Authentication tests
npm run test:dashboard      # Dashboard tests
npm run test:leave          # All leave-related tests
npm run test:config         # Leave configuration tests
npm run test:entitlements   # Entitlements tests
npm run test:report         # Reports tests
```

## Test Reports

After test execution, reports are generated in the `reports/` directory:

```bash
npm run report              # Open HTML report
npm run report:open         # Open report in default browser (Windows)
```

Report formats:
- **HTML Report**: `reports/playwright-report/index.html`
- **JSON Report**: `reports/test-results.json`
- **JUnit Report**: `reports/junit-results.xml`

## Self-Healing Locator Strategy

The framework implements a 4-tier healing strategy:

1. **Primary Selector** - Uses the main configured selector
2. **Cached Selector** - Uses previously successful healed selector
3. **Fallback Selectors** - Tries alternative selectors in order
4. **AI Healing** - Uses Claude Vision API to locate element visually

### Element Definition Example

```typescript
const usernameField: ElementDefinition = {
  name: 'username',
  description: 'Username input field on login page',
  primary: 'input[name="username"]',
  fallbacks: [
    '[placeholder="Username"]',
    '#username',
    '//input[@name="username"]'
  ],
  type: 'input'
};
```

### Healing Reports

When AI healing occurs, statistics are logged to `reports/healing-stats.json`:

```json
{
  "totalHealed": 5,
  "healingEvents": [
    {
      "elementName": "loginButton",
      "originalSelector": "button[type='submit']",
      "healedSelector": ".oxd-button--main",
      "method": "fallback",
      "duration": 150,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## Test Categories

| Tag | Description | Count |
|-----|-------------|-------|
| `@smoke` | Critical path tests | 15 |
| `@regression` | Full regression suite | 50+ |
| `@e2e` | End-to-end workflows | 10 |
| `@security` | Security validations | 12 |
| `@negative` | Negative test cases | 25 |
| `@boundary` | Boundary value tests | 16 |

## Module Coverage

| Module | Test File | Test Cases |
|--------|-----------|------------|
| Authentication | `auth.spec.ts` | 28 |
| Dashboard | `dashboard.spec.ts` | 12 |
| Apply Leave | `apply-leave.spec.ts` | 18 |
| Leave List | `leave-list.spec.ts` | 15 |
| Assign Leave | `assign-leave.spec.ts` | 12 |
| Entitlements | `entitlements.spec.ts` | 15 |
| Reports | `reports.spec.ts` | 12 |
| Leave Config | `leave-config.spec.ts` | 16 |
| E2E Flows | `e2e-flows.spec.ts` | 10 |

## Writing New Tests

### 1. Create Page Object (if needed)

```typescript
// pages/NewPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ElementDefinition } from '../utils/SelfHealingLocator';

export class NewPage extends BasePage {
  readonly elements = {
    myElement: {
      name: 'myElement',
      description: 'Description of element',
      primary: '[data-testid="my-element"]',
      fallbacks: ['.my-element', '#my-element'],
      type: 'button' as const
    }
  };

  async clickMyElement(): Promise<void> {
    await this.healer.click(this.elements.myElement);
  }
}
```

### 2. Create Test Data

```json
// data/newData.json
{
  "validScenarios": [
    {
      "name": "Valid scenario 1",
      "input": "test",
      "expected": "success"
    }
  ]
}
```

### 3. Write Test

```typescript
// tests/new.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { NewPage } from '../pages/NewPage';
import newData from '../data/newData.json';

test.describe('New Feature Tests', () => {
  let loginPage: LoginPage;
  let newPage: NewPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    newPage = new NewPage(page);

    await loginPage.goto();
    await loginPage.login('admin', 'Admin@123');
  });

  test('should do something @smoke', async () => {
    await newPage.clickMyElement();
    // assertions
  });
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci
        working-directory: playwright-projects/OrangeHRM

      - name: Run Playwright tests
        run: npm test
        working-directory: playwright-projects/OrangeHRM
        env:
          CI: true
          BASE_URL: ${{ secrets.BASE_URL }}
          ADMIN_USERNAME: ${{ secrets.ADMIN_USERNAME }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-projects/OrangeHRM/reports/
```

## Troubleshooting

### Common Issues

1. **Tests failing on CI but passing locally**
   - Check `BASE_URL` environment variable
   - Ensure OrangeHRM is accessible from CI environment
   - Verify credentials are correctly configured

2. **Timeout errors**
   - Increase `DEFAULT_TIMEOUT` in `.env`
   - Check network connectivity to OrangeHRM
   - Verify page load times

3. **AI Healing not working**
   - Ensure `ANTHROPIC_API_KEY` is set
   - Check `AI_HEALING_ENABLED=true`
   - Verify API key has sufficient credits

4. **Element not found errors**
   - Check if OrangeHRM UI has changed
   - Update element selectors in Page Objects
   - Review healing reports for patterns

### Debug Mode

```bash
# Run with debug flag
npm run test:debug

# Run specific test in debug
npx playwright test tests/auth.spec.ts --debug

# Run with trace viewer
npx playwright test --trace on
```

## Contributing

1. Follow the existing code style
2. Add appropriate test tags (@smoke, @regression, etc.)
3. Update test data files as needed
4. Run lint check: `npm run lint`
5. Ensure all tests pass before submitting

## License

MIT License - See LICENSE file for details.
