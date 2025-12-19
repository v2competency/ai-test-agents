# MCP Agent Setup Guide

> Step-by-step guide to set up and use the Test Case Generator MCP Agent

---

## What You'll Get

After setup, you can simply say:

```
Analyze d:/screenshots/login.png for MyApp and generate test cases.
```

No long prompts needed! 🎉

---

## Setup Steps

### Step 1: Install Dependencies

**Test Case Generator:**
```bash
cd d:\Work\Claude-QE\Agents\mcp-agents\testcase-generator-mcp
npm install
npm run build
```

**Automation Generator:**
```bash
cd d:\Work\Claude-QE\Agents\mcp-agents\automation-generator-mcp
npm install
npm run build
```

### Step 2: Get Anthropic API Key

**Note**: Only needed for Test Case Generator (uses Claude Vision API)

1. Go to https://console.anthropic.com/
2. Create an account or sign in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key

### Step 3: Configure Claude Desktop

**Windows**: Open `%APPDATA%\Claude\claude_desktop_config.json`

**Mac/Linux**: Open `~/Library/Application Support/Claude/claude_desktop_config.json`

Add both MCP servers:

```json
{
  "mcpServers": {
    "testcase-generator": {
      "command": "node",
      "args": ["d:\\Work\\Claude-QE\\Agents\\mcp-agents\\testcase-generator-mcp\\dist\\index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-YOUR-API-KEY-HERE",
        "WORKSPACE_DIR": "d:\\Work\\Claude-QE\\Agents"
      }
    },
    "automation-generator": {
      "command": "node",
      "args": ["d:\\Work\\Claude-QE\\Agents\\mcp-agents\\automation-generator-mcp\\dist\\index.js"],
      "env": {
        "WORKSPACE_DIR": "d:\\Work\\Claude-QE\\Agents"
      }
    }
  }
}
```

**⚠️ Important**:
- Use double backslashes (`\\`) for Windows paths
- Replace `YOUR-API-KEY-HERE` with your actual Anthropic API key
- Adjust `WORKSPACE_DIR` to match your actual workspace path
- Automation Generator doesn't need API key (uses local parsing)

### Step 4: Restart Claude Desktop

Completely quit and restart Claude Desktop application.

### Step 5: Verify Installation

In Claude Desktop, type:

```
/tools
```

You should see **Test Case Generator** tools:
- `analyze_screenshot`
- `save_test_cases`
- `list_test_cases`

And **Automation Generator** tools:
- `generate_playwright_automation`
- `parse_test_cases`
- `list_projects`

---

## Usage Examples

### Complete Workflow: Screenshot to Automation

**Step 1: Generate Test Cases from Screenshot**

```
I have a screenshot at: d:/Work/screenshots/login.png

Please analyze it for MyApp (https://myapp.com) and generate test cases.
```

Claude will:
1. Use the `analyze_screenshot` tool automatically
2. Analyze the screenshot using vision
3. Generate comprehensive test cases
4. Save to `manual-tests/MyApp_Manual_Test_Cases.txt`

**Step 2: Generate Playwright Automation**

```
Generate Playwright automation from manual-tests/MyApp_Manual_Test_Cases.txt
```

Claude will:
1. Use the `generate_playwright_automation` tool
2. Parse the test cases
3. Generate complete Playwright project
4. Create project in `playwright-projects/MyApp/`

**Step 3: Run the Tests**

```bash
cd playwright-projects/MyApp
npm install
npm test
```

---

### Example 1: E-Commerce Flow

```
Analyze d:/screenshots/checkout.png for ShopEasy (https://shopeasy.com)

Focus on: payment validation, security testing, form errors
```

Then:

```
Generate automation for ShopEasy test cases
```

### Example 2: Preview Before Generating

```
Parse the test cases from manual-tests/MyApp_Manual_Test_Cases.txt
without generating automation yet. Show me what modules were found.
```

### Example 3: List All Projects

```
Show me all generated Playwright projects
```

### Example 4: SaaS Application

```
I have a dashboard screenshot at d:/screenshots/dashboard.png

App: MySaaS (https://mysaas.io)
App Type: SaaS

Generate test cases focusing on:
- User management
- Data validation
- Permission controls
```

---

## File Output

**Test Cases** are saved to:
```
d:\Work\Claude-QE\Agents\manual-tests\{AppName}_Manual_Test_Cases.txt
```

**Playwright Projects** are created in:
```
d:\Work\Claude-QE\Agents\playwright-projects\{AppName}\
```

### Generated Project Structure:

```
playwright-projects/MyApp/
├── pages/
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   └── DashboardPage.ts
├── tests/
│   ├── auth.spec.ts
│   └── dashboard.spec.ts
├── data/
│   ├── authData.json
│   └── dashboardData.json
├── utils/
│   ├── SelfHealingLocator.ts
│   └── AIObserver.ts
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Troubleshooting

### Issue: Tools not showing in `/tools`

**Solution**:
1. Check config file syntax (valid JSON)
2. Verify file path is correct (use `\\` on Windows)
3. Restart Claude Desktop completely (quit, not just close window)
4. Check for error messages in Claude Desktop logs

### Issue: "ANTHROPIC_API_KEY not configured"

**Solution**:
- Make sure API key is set in `claude_desktop_config.json`
- Verify the key starts with `sk-ant-`
- Restart Claude Desktop after adding the key

### Issue: "Failed to read screenshot"

**Solution**:
- Use absolute file path (e.g., `d:/Work/screenshots/image.png`)
- Check file exists and is readable
- Supported formats: PNG, JPG, JPEG

### Issue: Build fails

**Solution**:
```bash
# Clean and rebuild
cd mcp-agents/testcase-generator-mcp
rm -rf node_modules dist
npm install
npm run build
```

---

## Advanced Configuration

### Custom Workspace Directory

Change `WORKSPACE_DIR` in the config to use a different location:

```json
"env": {
  "WORKSPACE_DIR": "c:\\Users\\YourName\\TestAutomation"
}
```

### Multiple MCP Servers

You can add multiple servers:

```json
{
  "mcpServers": {
    "testcase-generator": {
      "command": "node",
      "args": ["..."],
      "env": { ... }
    },
    "another-server": {
      "command": "node",
      "args": ["..."],
      "env": { ... }
    }
  }
}
```

---

## Next Steps

### Complete Pipeline Flow:

1. **Capture Screenshot** of your application page
2. **Generate Test Cases**:
   ```
   Analyze d:/screenshots/page.png for MyApp (https://myapp.com)
   ```
3. **Review Test Cases** in `manual-tests/MyApp_Manual_Test_Cases.txt`
4. **Generate Automation**:
   ```
   Generate Playwright automation from manual-tests/MyApp_Manual_Test_Cases.txt
   ```
5. **Run Tests**:
   ```bash
   cd playwright-projects/MyApp
   npm install
   npm test
   ```

---

## Comparison: Before vs After

### Before (Documentation-based Agent)

```
Please act as the Test Case Generator Agent using the system prompt at:
sub-agents/testcase-generator-agent/system-prompt.md

I have a screenshot of my application's login page.

Application Name: MyApp
Base URL: https://myapp.example.com

Please analyze this screenshot and generate comprehensive test cases covering:
- Functional/Positive tests
- Negative tests
- Boundary tests
- Security tests

[Attach screenshot]
```

### After (MCP Agent)

```
Analyze d:/screenshots/login.png for MyApp (https://myapp.com)
```

**Much simpler!** 🎉

---

## Support

For issues:
1. Check this guide's troubleshooting section
2. Verify your setup matches the examples
3. Check Claude Desktop logs for errors
4. Ensure Node.js 18+ is installed

---

## Version Info

- **Test Case Generator**: 1.0.0
- **Automation Generator**: 1.0.0
- **Required**: Claude Desktop with MCP support
- **Node.js**: 18+
- **Playwright**: 1.40+
- **API**: Anthropic Claude API (Test Case Generator only)
