# IMDEX HUB-IQ - Playwright Automation Framework

Automated test suite for **IMDEX HUB-IQ** (https://iq.dev.imdexhub.com) with AI-powered self-healing locators.

## Features

- **142 Test Cases** across 8 modules
- **Page Object Model** with TypeScript
- **4-Tier Self-Healing Locators**: Primary → Cache → Fallback → AI (Vision + DOM)
- **AI Observer** integration using Claude Vision API
- **Data-Driven Testing** with JSON test data files
- **Allure Reporting** integration
- **Cross-browser** support (Chromium default)

## Project Structure

```
├── config/                  # Global setup/teardown
├── data/                    # Test data JSON files
│   ├── users.json          # Test credentials
│   ├── authData.json       # Authentication test data
│   ├── dashboardData.json  # Dashboard test data
│   ├── viewDataData.json   # View Data test data
│   ├── addProjectData.json # Add Project test data
│   ├── addDrillholeData.json # Add Drillhole test data
│   ├── coreOrientationsData.json # Core Orientations test data
│   ├── approveSurveysData.json   # Approve Surveys test data
│   └── e2eData.json        # E2E flow test data
├── pages/                   # Page Object classes
│   ├── BasePage.ts         # Abstract base class
│   ├── LoginPage.ts        # Login page
│   ├── DashboardPage.ts    # Dashboard page
│   ├── ViewDataPage.ts     # View Data page
│   ├── AddProjectPage.ts   # Add Project page
│   ├── AddDrillholePage.ts # Add Drillhole page
│   ├── CoreOrientationsPage.ts # Core Orientations page
│   ├── ApproveSurveysPage.ts   # Approve Surveys page
│   └── components/
│       └── SidebarNav.ts   # Sidebar navigation component
├── tests/                   # Test specifications
│   ├── auth.spec.ts        # Authentication tests (16)
│   ├── dashboard.spec.ts   # Dashboard tests (11)
│   ├── view-data.spec.ts   # View Data tests (21)
│   ├── add-project.spec.ts # Add Project tests (27)
│   ├── add-drillhole.spec.ts # Add Drillhole tests (28)
│   ├── core-orientations.spec.ts # Core Orientations tests (12)
│   ├── approve-surveys.spec.ts   # Approve Surveys tests (24)
│   └── e2e/
│       └── e2e-flows.spec.ts # E2E flow tests (4)
├── utils/                   # Utility classes
│   ├── SelfHealingLocator.ts # 4-tier self-healing engine
│   ├── AIObserver.ts       # Claude Vision AI integration
│   ├── StandardLocator.ts  # Standard (non-healing) locator
│   ├── LocatorStrategy.ts  # Strategy pattern factory
│   ├── HealingReporter.ts  # Healing statistics reporter
│   ├── HealingPatcher.ts   # Auto-patches source files
│   └── TestHelpers.ts      # Common test utilities
├── playwright.config.ts     # Playwright configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── .env.example            # Environment template
```

## Quick Start

### 1. Install Dependencies
```bash
cd playwright-projects/IMDEX_HubIQ
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials and API key
```

### 3. Run Tests

```bash
# Run all tests (standard mode)
npm test

# Run with AI self-healing enabled
npm run test:ai

# Run specific module
npm run test:auth
npm run test:dashboard
npm run test:view-data
npm run test:add-project
npm run test:add-drillhole
npm run test:core-orientations
npm run test:approve-surveys

# Run by tag
npm run test:smoke
npm run test:regression
npm run test:e2e
npm run test:security
npm run test:negative

# Debug mode
npm run test:headed
npm run test:debug
npm run test:ui
```

## Test Modules

| Module | Tests | Tags |
|--------|-------|------|
| Authentication | 16 | @smoke @regression @security |
| Dashboard | 11 | @smoke @regression @security |
| View Data | 21 | @smoke @regression @security |
| Add Project | 27 | @smoke @regression @boundary @security |
| Add Drillhole | 28 | @smoke @regression @boundary @security |
| Core Orientations | 12 | @smoke @regression @security |
| Approve Surveys | 24 | @smoke @regression @security |
| E2E Flows | 4 | @e2e @regression |

## Self-Healing Architecture

The framework uses a 4-tier self-healing strategy:

1. **Tier 1 - Primary Selector**: Direct CSS/Playwright selector
2. **Tier 2 - Fallback Selectors**: Pre-defined alternative selectors
3. **Tier 3 - AI Visual Analysis**: Claude Vision API analyzes screenshots
4. **Tier 4 - AI DOM Analysis**: Claude analyzes page HTML

After test execution, healed selectors are automatically patched back into source files.

## Reports

```bash
# View Playwright HTML report
npm run report

# Generate Allure report
npm run allure:generate
npm run allure:open
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | Application URL | `https://iq.dev.imdexhub.com` |
| `ADMIN_USERNAME` | Admin username | `N.Rao` |
| `ADMIN_PASSWORD` | Admin password | - |
| `ANTHROPIC_API_KEY` | Claude API key for AI healing | - |
| `AI_HEALING_ENABLED` | Enable AI self-healing | `true` |
| `AI_MODEL` | Claude model for healing | `claude-sonnet-4-20250514` |
