#!/usr/bin/env node

/**
 * Automation Generator MCP Server
 *
 * An MCP server that generates complete Playwright automation frameworks
 * from manual test case files.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs/promises';
import * as path from 'path';

// Configuration
const WORKSPACE_DIR = process.env.WORKSPACE_DIR || process.cwd();
const MANUAL_TESTS_DIR = path.join(WORKSPACE_DIR, 'manual-tests');
const PLAYWRIGHT_PROJECTS_DIR = path.join(WORKSPACE_DIR, 'playwright-projects');

// Server instance
const server = new Server(
  {
    name: 'automation-generator-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Types
interface TestCase {
  testId: string;
  title: string;
  type: string;
  priority: string;
  precondition: string;
  testData: Record<string, string>;
  steps: string[];
  expectedResult: string[];
}

interface ModuleInfo {
  name: string;
  prefix: string;
  testCases: TestCase[];
}

/**
 * Parse manual test case file
 */
async function parseTestCaseFile(filePath: string): Promise<{
  appName: string;
  baseUrl: string;
  modules: ModuleInfo[];
}> {
  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.split('\n');

  let appName = '';
  let baseUrl = '';
  const modules: Map<string, ModuleInfo> = new Map();
  let currentModule: string | null = null;
  let currentTestCase: Partial<TestCase> | null = null;
  let section: 'none' | 'testData' | 'steps' | 'expectedResult' = 'none';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Extract app name from title
    if (line.includes('MANUAL TEST CASES') && !appName) {
      const match = line.match(/^\s*(.+?)\s*-\s*MANUAL TEST CASES/);
      if (match) appName = match[1].trim();
    }

    // Extract base URL
    if (line.startsWith('Application URL:')) {
      baseUrl = line.replace('Application URL:', '').trim();
    }

    // Module section
    if (line.startsWith('MODULE:')) {
      currentModule = line.replace('MODULE:', '').trim();
      if (!modules.has(currentModule)) {
        const prefix = `TC_${currentModule.split(' ')[0].toUpperCase()}_`;
        modules.set(currentModule, {
          name: currentModule,
          prefix,
          testCases: [],
        });
      }
    }

    // Test case start
    if (line.match(/^TC_[A-Z]+_\d+:/)) {
      if (currentTestCase && currentModule) {
        modules.get(currentModule)?.testCases.push(currentTestCase as TestCase);
      }

      const match = line.match(/^(TC_[A-Z]+_\d+):\s*(.+)/);
      if (match) {
        currentTestCase = {
          testId: match[1],
          title: match[2],
          type: '',
          priority: '',
          precondition: '',
          testData: {},
          steps: [],
          expectedResult: [],
        };
      }
      section = 'none';
    }

    // Test case fields
    if (currentTestCase) {
      if (line.startsWith('Test Type:')) {
        currentTestCase.type = line.replace('Test Type:', '').trim();
      } else if (line.startsWith('Priority:')) {
        currentTestCase.priority = line.replace('Priority:', '').trim();
      } else if (line.startsWith('Precondition:')) {
        currentTestCase.precondition = line.replace('Precondition:', '').trim();
      } else if (line.startsWith('Test Data:')) {
        section = 'testData';
      } else if (line.startsWith('Steps:')) {
        section = 'steps';
      } else if (line.startsWith('Expected Result:')) {
        section = 'expectedResult';
      } else if (line.startsWith('-') && section === 'testData') {
        const match = line.match(/^-\s*(.+?):\s*(.+)/);
        if (match && currentTestCase.testData) {
          currentTestCase.testData[match[1].trim()] = match[2].trim();
        }
      } else if (line.match(/^\d+\./) && section === 'steps') {
        currentTestCase.steps?.push(line.replace(/^\d+\.\s*/, ''));
      } else if (line.startsWith('-') && section === 'expectedResult') {
        currentTestCase.expectedResult?.push(line.replace(/^-\s*/, ''));
      }
    }
  }

  // Add last test case
  if (currentTestCase && currentModule) {
    modules.get(currentModule)?.testCases.push(currentTestCase as TestCase);
  }

  return {
    appName: appName || 'App',
    baseUrl: baseUrl || 'https://example.com',
    modules: Array.from(modules.values()),
  };
}

/**
 * Generate project structure
 */
async function generateProject(
  projectPath: string,
  appName: string,
  baseUrl: string,
  modules: ModuleInfo[]
): Promise<string[]> {
  const generatedFiles: string[] = [];

  // Create directories
  await fs.mkdir(path.join(projectPath, 'pages'), { recursive: true });
  await fs.mkdir(path.join(projectPath, 'tests'), { recursive: true });
  await fs.mkdir(path.join(projectPath, 'data'), { recursive: true });
  await fs.mkdir(path.join(projectPath, 'utils'), { recursive: true });

  // Generate files
  const files = [
    { path: 'pages/BasePage.ts', content: generateBasePage() },
    { path: 'playwright.config.ts', content: generatePlaywrightConfig(baseUrl) },
    { path: 'tsconfig.json', content: generateTsConfig() },
    { path: 'package.json', content: generatePackageJson(appName) },
    { path: '.env.example', content: generateEnvExample(baseUrl) },
    { path: '.gitignore', content: generateGitignore() },
    { path: 'README.md', content: generateReadme(appName, baseUrl, modules) },
  ];

  for (const file of files) {
    const filePath = path.join(projectPath, file.path);
    await fs.writeFile(filePath, file.content, 'utf-8');
    generatedFiles.push(file.path);
  }

  // Generate page objects and tests for each module
  for (const module of modules) {
    const pageName = module.name.replace(/\s+/g, '') + 'Page';
    const pageFile = `pages/${pageName}.ts`;
    const testFile = `tests/${module.name.toLowerCase().replace(/\s+/g, '-')}.spec.ts`;
    const dataFile = `data/${module.name.toLowerCase().replace(/\s+/g, '-')}Data.json`;

    await fs.writeFile(
      path.join(projectPath, pageFile),
      generatePageObject(pageName, module),
      'utf-8'
    );
    generatedFiles.push(pageFile);

    await fs.writeFile(
      path.join(projectPath, testFile),
      generateTestSpec(pageName, module, appName),
      'utf-8'
    );
    generatedFiles.push(testFile);

    await fs.writeFile(
      path.join(projectPath, dataFile),
      generateTestData(module),
      'utf-8'
    );
    generatedFiles.push(dataFile);
  }

  return generatedFiles;
}

// Code generation functions (templates)

function generateBasePage(): string {
  return `import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  readonly loadingSpinner: Locator;
  readonly toastMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingSpinner = page.locator('[data-test="loading"], .loading, .spinner');
    this.toastMessage = page.locator('[data-test="toast"], .toast, .notification');
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForSpinnerToDisappear(): Promise<void> {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  }

  async getToastMessage(): Promise<string> {
    await this.toastMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.toastMessage.textContent() || '';
  }

  getCurrentUrl(): string {
    return this.page.url();
  }

  urlContains(path: string): boolean {
    return this.page.url().includes(path);
  }
}
`;
}

function generatePageObject(pageName: string, module: ModuleInfo): string {
  // Extract fields from test data
  const fields = new Set<string>();
  module.testCases.forEach(tc => {
    Object.keys(tc.testData).forEach(field => fields.add(field));
  });

  const fieldsList = Array.from(fields);

  return `import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ${pageName} extends BasePage {
  readonly pageUrl: string = '/${module.name.toLowerCase().replace(/\s+/g, '-')}';

  // Locators${
    fieldsList
      .map(
        field => `
  readonly ${field}Input: Locator;`
      )
      .join('') || '\n  // Add locators for your page elements'
  }
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
${
  fieldsList
    .map(
      field => `
    this.${field}Input = page.locator('[data-test="${field}"], #${field}, input[name="${field}"]');`
    )
    .join('') || '    // Initialize locators'
}
    this.submitButton = page.locator('[data-test="submit"], button[type="submit"]');
    this.errorMessage = page.locator('[data-test="error"], .error-message, .alert-danger');
    this.successMessage = page.locator('[data-test="success"], .success-message');
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  async isOnPage(): Promise<boolean> {
    return this.urlContains(this.pageUrl);
  }
${
  fieldsList
    .map(
      field => `
  async fill${field.charAt(0).toUpperCase() + field.slice(1)}(value: string): Promise<void> {
    await this.${field}Input.fill(value);
  }`
    )
    .join('')
}

  async submit(): Promise<void> {
    await this.submitButton.click();
    await this.waitForSpinnerToDisappear();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent() || '';
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}
`;
}

function generateTestSpec(pageName: string, module: ModuleInfo, appName: string): string {
  const dataFileName = module.name.toLowerCase().replace(/\s+/g, '-');

  return `import { test, expect } from '@playwright/test';
import { ${pageName} } from '../pages/${pageName}';
import testData from '../data/${dataFileName}Data.json';

test.describe('${module.name} - ${appName}', () => {
  let page: ${pageName};

  test.beforeEach(async ({ page: browserPage }) => {
    page = new ${pageName}(browserPage);
    await page.navigate();
  });

  // Positive Tests
  test.describe('Positive Scenarios', () => {
    for (const scenario of testData.validScenarios || []) {
      test(\`\${scenario.testId}: \${scenario.description}\`, async () => {
        // Implement test based on scenario data
        // Add your test logic here
      });
    }
  });

  // Negative Tests
  test.describe('Negative Scenarios', () => {
    for (const scenario of testData.invalidScenarios || []) {
      test(\`\${scenario.testId}: \${scenario.description}\`, async () => {
        expect(await page.isErrorDisplayed()).toBe(true);
      });
    }
  });

  // Boundary Tests
  test.describe('Boundary Tests', () => {
    for (const scenario of testData.boundaryTests || []) {
      test(\`\${scenario.testId}: \${scenario.description}\`, async () => {
        // Implement boundary test logic
      });
    }
  });

  // Security Tests
  test.describe('Security Tests', () => {
    for (const scenario of testData.securityTests || []) {
      test(\`\${scenario.testId}: \${scenario.description}\`, async () => {
        const pageContent = await page.page.content();
        expect(pageContent).not.toContain('<script>');
      });
    }
  });
});
`;
}

function generateTestData(module: ModuleInfo): string {
  const data: any = {
    _metadata: {
      module: module.name,
      generatedBy: 'Automation Generator MCP Agent v1.0',
      generatedDate: new Date().toISOString().split('T')[0],
    },
    validScenarios: [],
    invalidScenarios: [],
    boundaryTests: [],
    securityTests: [],
  };

  module.testCases.forEach(tc => {
    const scenario = {
      testId: tc.testId,
      description: tc.title,
      priority: tc.priority,
      ...tc.testData,
    };

    if (tc.type.toLowerCase().includes('positive')) {
      data.validScenarios.push({ ...scenario, expectedResult: 'success' });
    } else if (tc.type.toLowerCase().includes('negative')) {
      data.invalidScenarios.push({
        ...scenario,
        expectedError: tc.expectedResult[0] || 'Error occurred',
      });
    } else if (tc.type.toLowerCase().includes('boundary')) {
      data.boundaryTests.push(scenario);
    } else if (tc.type.toLowerCase().includes('security')) {
      data.securityTests.push({
        ...scenario,
        category: 'security',
        expectedBehavior: 'reject_gracefully',
      });
    }
  });

  return JSON.stringify(data, null, 2);
}

function generatePlaywrightConfig(baseUrl: string): string {
  return `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-report' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || '${baseUrl}',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    viewport: { width: 1920, height: 1080 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
`;
}

function generateTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        module: 'commonjs',
        moduleResolution: 'node',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        resolveJsonModule: true,
      },
      include: ['tests/**/*', 'pages/**/*', 'data/**/*'],
    },
    null,
    2
  );
}

function generatePackageJson(appName: string): string {
  return JSON.stringify(
    {
      name: `${appName.toLowerCase().replace(/\s+/g, '-')}-automation`,
      version: '1.0.0',
      description: `Playwright automation for ${appName}`,
      scripts: {
        test: 'npx playwright test',
        'test:headed': 'npx playwright test --headed',
        'test:debug': 'npx playwright test --debug',
        report: 'npx playwright show-report reports/playwright-report',
      },
      devDependencies: {
        '@playwright/test': '^1.40.0',
        '@types/node': '^20.10.0',
        typescript: '^5.3.0',
      },
    },
    null,
    2
  );
}

function generateEnvExample(baseUrl: string): string {
  return `BASE_URL=${baseUrl}
TEST_USERNAME=testuser@example.com
TEST_PASSWORD=TestPass123!
`;
}

function generateGitignore(): string {
  return `node_modules/
dist/
reports/
test-results/
.env
*.log
`;
}

function generateReadme(appName: string, baseUrl: string, modules: ModuleInfo[]): string {
  return `# ${appName} - Playwright Automation

> Generated by Automation Generator MCP Agent v1.0

## Quick Start

\`\`\`bash
npm install
npx playwright install
cp .env.example .env
npm test
\`\`\`

## Configuration

Base URL: ${baseUrl}

## Test Modules

${modules.map(m => `- ${m.name}: ${m.testCases.length} test cases`).join('\n')}

## Generated Structure

\`\`\`
├── pages/         # Page Object Model
├── tests/         # Test specifications
├── data/          # Test data (JSON)
└── reports/       # Test reports
\`\`\`

## Run Tests

\`\`\`bash
npm test                    # Run all tests
npm run test:headed         # Run with browser visible
npm run test:debug          # Debug mode
npm run report              # View HTML report
\`\`\`
`;
}

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'generate_playwright_automation',
        description:
          'Generate complete Playwright automation framework from manual test case file. ' +
          'Creates page objects, test specs, test data, and all configuration files.',
        inputSchema: {
          type: 'object',
          properties: {
            test_case_file: {
              type: 'string',
              description: 'Path to manual test case file (e.g., manual-tests/MyApp_Manual_Test_Cases.txt)',
            },
            base_url: {
              type: 'string',
              description: 'Base URL for the application (optional, will use from test case file)',
            },
            output_dir: {
              type: 'string',
              description: 'Output directory name (optional, defaults to app name)',
            },
          },
          required: ['test_case_file'],
        },
      },
      {
        name: 'list_projects',
        description: 'List all generated Playwright projects',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'parse_test_cases',
        description: 'Parse manual test case file and show summary without generating code',
        inputSchema: {
          type: 'object',
          properties: {
            test_case_file: {
              type: 'string',
              description: 'Path to manual test case file',
            },
          },
          required: ['test_case_file'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'generate_playwright_automation': {
        const { test_case_file, base_url, output_dir } = args as {
          test_case_file: string;
          base_url?: string;
          output_dir?: string;
        };

        // Parse test case file
        const filePath = path.isAbsolute(test_case_file)
          ? test_case_file
          : path.join(MANUAL_TESTS_DIR, test_case_file);

        const parsed = await parseTestCaseFile(filePath);
        const projectName = output_dir || parsed.appName.replace(/\s+/g, '');
        const projectPath = path.join(PLAYWRIGHT_PROJECTS_DIR, projectName);
        const finalBaseUrl = base_url || parsed.baseUrl;

        // Generate project
        const files = await generateProject(projectPath, parsed.appName, finalBaseUrl, parsed.modules);

        return {
          content: [
            {
              type: 'text',
              text: `# Playwright Automation Generated! ✅

## Project Details
- **Name**: ${parsed.appName}
- **Location**: ${projectPath}
- **Base URL**: ${finalBaseUrl}
- **Modules**: ${parsed.modules.length}
- **Total Test Cases**: ${parsed.modules.reduce((sum, m) => sum + m.testCases.length, 0)}

## Generated Files (${files.length})
${files.map(f => `- ${f}`).join('\n')}

## Module Breakdown
${parsed.modules.map(m => `- **${m.name}**: ${m.testCases.length} tests`).join('\n')}

## Next Steps

\`\`\`bash
cd ${projectPath}
npm install
npx playwright install
npm test
\`\`\`

Your Playwright automation is ready to run!`,
            },
          ],
        };
      }

      case 'parse_test_cases': {
        const { test_case_file } = args as { test_case_file: string };

        const filePath = path.isAbsolute(test_case_file)
          ? test_case_file
          : path.join(MANUAL_TESTS_DIR, test_case_file);

        const parsed = await parseTestCaseFile(filePath);

        return {
          content: [
            {
              type: 'text',
              text: `# Test Case Analysis

## Application
- **Name**: ${parsed.appName}
- **Base URL**: ${parsed.baseUrl}

## Modules (${parsed.modules.length})
${parsed.modules
  .map(
    m => `
### ${m.name}
- Test Cases: ${m.testCases.length}
- Test IDs: ${m.testCases.map(tc => tc.testId).join(', ')}`
  )
  .join('\n')}

## Total Test Cases: ${parsed.modules.reduce((sum, m) => sum + m.testCases.length, 0)}`,
            },
          ],
        };
      }

      case 'list_projects': {
        try {
          await fs.mkdir(PLAYWRIGHT_PROJECTS_DIR, { recursive: true });
          const dirs = await fs.readdir(PLAYWRIGHT_PROJECTS_DIR, { withFileTypes: true });
          const projects = dirs.filter(d => d.isDirectory()).map(d => d.name);

          return {
            content: [
              {
                type: 'text',
                text:
                  projects.length > 0
                    ? `Generated Playwright projects:\n${projects.map(p => `- ${p}`).join('\n')}`
                    : 'No Playwright projects found.',
              },
            ],
          };
        } catch {
          return {
            content: [{ type: 'text', text: 'No projects directory found.' }],
          };
        }
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Register resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  try {
    await fs.mkdir(PLAYWRIGHT_PROJECTS_DIR, { recursive: true });
    const dirs = await fs.readdir(PLAYWRIGHT_PROJECTS_DIR, { withFileTypes: true });
    const projects = dirs.filter(d => d.isDirectory()).map(d => d.name);

    return {
      resources: projects.map(project => ({
        uri: `playwright-project:///${project}`,
        name: project,
        description: `Playwright automation project for ${project}`,
        mimeType: 'text/plain',
      })),
    };
  } catch {
    return { resources: [] };
  }
});

// Read resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  const projectName = uri.replace('playwright-project:///', '');
  const projectPath = path.join(PLAYWRIGHT_PROJECTS_DIR, projectName);

  try {
    const readmePath = path.join(projectPath, 'README.md');
    const content = await fs.readFile(readmePath, 'utf-8');
    return {
      contents: [{ uri, mimeType: 'text/plain', text: content }],
    };
  } catch {
    throw new Error(`Failed to read project: ${projectName}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Automation Generator MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
