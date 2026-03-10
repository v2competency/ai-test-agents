// pages/ViewDataPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ElementDefinition } from '../utils/SelfHealingLocator';

export class ViewDataPage extends BasePage {
  // ============================================================
  // Element Definitions
  // ============================================================
  private readonly projectDropdownDef: ElementDefinition = {
    name: 'projectDropdown',
    description: 'Project dropdown selector on the View Data page',
    primary: 'select[name*="Project" i], select[id*="Project" i]',
    fallbacks: [
      '#ProjectId',
      '.project-dropdown select',
      'select:near(:text("Project"))',
      '[class*="project"] select',
      'label:has-text("Project") ~ select'
    ],
    type: 'dropdown'
  };

  private readonly dateFromInputDef: ElementDefinition = {
    name: 'dateFromInput',
    description: 'Date From input field for filtering data by start date',
    primary: 'input[name*="DateFrom" i], input[id*="DateFrom" i]',
    fallbacks: [
      '#DateFrom',
      'input[type="date"]:first-of-type',
      'input[placeholder*="From" i]',
      'label:has-text("Date From") ~ input',
      'input[name*="startDate" i]'
    ],
    type: 'input'
  };

  private readonly dateToInputDef: ElementDefinition = {
    name: 'dateToInput',
    description: 'Date To input field for filtering data by end date',
    primary: 'input[name*="DateTo" i], input[id*="DateTo" i]',
    fallbacks: [
      '#DateTo',
      'input[type="date"]:last-of-type',
      'input[placeholder*="To" i]',
      'label:has-text("Date To") ~ input',
      'input[name*="endDate" i]'
    ],
    type: 'input'
  };

  private readonly toolsListDef: ElementDefinition = {
    name: 'toolsList',
    description: 'List container of tool checkboxes (EZ-GYRO, ACTx, etc.) for filtering',
    primary: '[class*="tools-list"], [class*="tool-filter"]',
    fallbacks: [
      '.checkbox-list',
      '.filter-tools',
      '[class*="tools"] .checkbox-group',
      'div:has(input[type="checkbox"]):near(:text("Tools"))'
    ],
    type: 'container'
  };

  private readonly selectAllButtonDef: ElementDefinition = {
    name: 'selectAllButton',
    description: 'Select All button to check all tool checkboxes',
    primary: 'button:has-text("Select All"), a:has-text("Select All")',
    fallbacks: [
      '[class*="select-all"]',
      'button:has-text("select all" i)',
      'a:has-text("select all" i)',
      'input[type="button"][value*="Select All" i]'
    ],
    type: 'button'
  };

  private readonly deselectAllButtonDef: ElementDefinition = {
    name: 'deselectAllButton',
    description: 'Deselect All button to uncheck all tool checkboxes',
    primary: 'button:has-text("Deselect All"), a:has-text("Deselect All")',
    fallbacks: [
      '[class*="deselect-all"]',
      'button:has-text("deselect all" i)',
      'a:has-text("deselect all" i)',
      'input[type="button"][value*="Deselect All" i]'
    ],
    type: 'button'
  };

  private readonly viewDataButtonDef: ElementDefinition = {
    name: 'viewDataButton',
    description: 'View Data button to execute the search and load results',
    primary: 'button:has-text("View Data"), input[type="submit"][value*="View Data" i]',
    fallbacks: [
      '#btnViewData',
      'button:has-text("view data" i)',
      '.btn-primary:has-text("View")',
      '[class*="view-data"] button',
      'button[type="submit"]:has-text("View")'
    ],
    type: 'button'
  };

  private readonly savedSearchDropdownDef: ElementDefinition = {
    name: 'savedSearchDropdown',
    description: 'Saved Search dropdown to load previously saved search configurations',
    primary: 'select[name*="SavedSearch" i], select[id*="SavedSearch" i]',
    fallbacks: [
      '#SavedSearchId',
      '.saved-search select',
      'select:near(:text("Saved Search"))',
      'label:has-text("Saved Search") ~ select',
      '[class*="saved-search"] select'
    ],
    type: 'dropdown'
  };

  private readonly saveSearchButtonDef: ElementDefinition = {
    name: 'saveSearchButton',
    description: 'Save Search button to save the current search configuration',
    primary: 'button:has-text("Save Search"), a:has-text("Save Search")',
    fallbacks: [
      '#btnSaveSearch',
      'button:has-text("save search" i)',
      '[class*="save-search"] button',
      'button[class*="save"]',
      'a:has-text("save search" i)'
    ],
    type: 'button'
  };

  private readonly drillholesTableDef: ElementDefinition = {
    name: 'drillholesTable',
    description: 'Drillholes results table with columns for Drillhole, Project, Owner, Group',
    primary: 'table[class*="drillhole" i], table[id*="drillhole" i]',
    fallbacks: [
      '.drillholes-table table',
      'table.table',
      '#drillholesGrid table',
      '[class*="grid"] table',
      'table:has(th:has-text("Drillhole"))'
    ],
    type: 'container'
  };

  private readonly resultsTabsDef: ElementDefinition = {
    name: 'resultsTabs',
    description: 'Tool tabs in the results section for switching between different tool data',
    primary: '.nav-tabs, [role="tablist"]',
    fallbacks: [
      '.results-tabs',
      '.tab-header',
      'ul[class*="tabs"]',
      '[class*="result"] .nav'
    ],
    type: 'container'
  };

  private readonly exportAllButtonDef: ElementDefinition = {
    name: 'exportAllButton',
    description: 'Export All button to export all data across all tool tabs',
    primary: 'button:has-text("Export All"), a:has-text("Export All")',
    fallbacks: [
      '#btnExportAll',
      'button:has-text("export all" i)',
      '[class*="export-all"]',
      'a:has-text("export all" i)',
      'button[class*="export"]:has-text("All")'
    ],
    type: 'button'
  };

  private readonly refreshDataButtonDef: ElementDefinition = {
    name: 'refreshDataButton',
    description: 'Refresh Data button to reload the current data results',
    primary: 'button:has-text("Refresh"), a:has-text("Refresh")',
    fallbacks: [
      '#btnRefresh',
      'button:has-text("refresh" i)',
      '[class*="refresh"] button',
      'button[class*="refresh"]',
      'a:has-text("refresh" i)'
    ],
    type: 'button'
  };

  private readonly itemsPerPageDropdownDef: ElementDefinition = {
    name: 'itemsPerPageDropdown',
    description: 'Items per page dropdown in pagination controls',
    primary: 'select[name*="pageSize" i], select[name*="PageSize" i]',
    fallbacks: [
      '.page-size select',
      'select:near(:text("items per page"))',
      '[class*="pagination"] select',
      '[class*="page-size"] select',
      'select[class*="per-page"]'
    ],
    type: 'dropdown'
  };

  private readonly paginationInfoDef: ElementDefinition = {
    name: 'paginationInfo',
    description: 'Pagination info text showing current page and total results count',
    primary: '.pagination-info, [class*="pagination-info"]',
    fallbacks: [
      '.pager-info',
      '[class*="pagination"] span',
      '.page-info',
      'text=/\\d+.*of.*\\d+/',
      '[class*="grid-pager"] span'
    ],
    type: 'text'
  };

  constructor(page: Page) {
    super(page);
  }

  // ============================================================
  // Navigation
  // ============================================================
  async navigate(): Promise<void> {
    await this.page.goto('/View/Data');
    await this.waitForPageLoad();
  }

  isOnViewDataPage(): boolean {
    const url = this.getCurrentUrl();
    return url.includes('View/Data') || url.includes('view/data');
  }

  // ============================================================
  // Filter Actions
  // ============================================================
  async selectProject(name: string): Promise<void> {
    await this.healer.selectOption(this.projectDropdownDef, name);
  }

  async enterDateFrom(date: string): Promise<void> {
    await this.healer.fill(this.dateFromInputDef, date);
  }

  async enterDateTo(date: string): Promise<void> {
    await this.healer.fill(this.dateToInputDef, date);
  }

  async selectTool(toolName: string): Promise<void> {
    const toolCheckboxDef: ElementDefinition = {
      name: `toolCheckbox_${toolName}`,
      description: `Checkbox for the ${toolName} tool in the tools filter list`,
      primary: `input[type="checkbox"][value="${toolName}"], label:has-text("${toolName}") input[type="checkbox"]`,
      fallbacks: [
        `input[type="checkbox"]:near(:text("${toolName}"))`,
        `label:has-text("${toolName}") >> input`,
        `[class*="tool"] input[value="${toolName}"]`,
        `text=${toolName} >> xpath=ancestor::label >> input[type="checkbox"]`
      ],
      type: 'checkbox'
    };
    await this.healer.click(toolCheckboxDef);
  }

  async selectAllTools(): Promise<void> {
    await this.healer.click(this.selectAllButtonDef);
  }

  async deselectAllTools(): Promise<void> {
    await this.healer.click(this.deselectAllButtonDef);
  }

  async clickViewData(): Promise<void> {
    await this.healer.click(this.viewDataButtonDef);
    await this.waitForPageLoad();
    await this.waitForSpinnerToDisappear();
  }

  // ============================================================
  // Saved Search Actions
  // ============================================================
  async selectSavedSearch(name: string): Promise<void> {
    await this.healer.selectOption(this.savedSearchDropdownDef, name);
    await this.waitForPageLoad();
  }

  async saveSearch(name: string): Promise<void> {
    await this.healer.click(this.saveSearchButtonDef);
    // Handle save search dialog if one appears
    const searchNameInputDef: ElementDefinition = {
      name: 'searchNameInput',
      description: 'Input field for naming a saved search in the save dialog',
      primary: 'input[name*="SearchName" i], input[id*="SearchName" i]',
      fallbacks: [
        '.modal input[type="text"]',
        '[class*="dialog"] input[type="text"]',
        'input[placeholder*="name" i]'
      ],
      type: 'input'
    };
    await this.healer.fill(searchNameInputDef, name);
    await this.page.keyboard.press('Enter');
    await this.waitForPageLoad();
  }

  // ============================================================
  // Results Actions
  // ============================================================
  async getDrillholesTableRowCount(): Promise<number> {
    const tableLocator = await this.healer.locate(this.drillholesTableDef);
    const rows = tableLocator.locator('tbody tr');
    return await rows.count();
  }

  async clickToolTab(toolName: string): Promise<void> {
    const toolTabDef: ElementDefinition = {
      name: `toolTab_${toolName}`,
      description: `Tab for ${toolName} tool in the results section`,
      primary: `.nav-tabs a:has-text("${toolName}"), [role="tab"]:has-text("${toolName}")`,
      fallbacks: [
        `a[role="tab"]:has-text("${toolName}")`,
        `.tab-header a:has-text("${toolName}")`,
        `li:has-text("${toolName}") a`,
        `[class*="tabs"] a:has-text("${toolName}")`
      ],
      type: 'link'
    };
    await this.healer.click(toolTabDef);
    await this.waitForPageLoad();
  }

  async clickExportAll(): Promise<void> {
    await this.healer.click(this.exportAllButtonDef);
  }

  async clickExportTab(): Promise<void> {
    const exportTabButtonDef: ElementDefinition = {
      name: 'exportTabButton',
      description: 'Export button for the currently active tool tab',
      primary: '.tab-pane.active button:has-text("Export"), .tab-content .active button:has-text("Export")',
      fallbacks: [
        'button:has-text("Export"):not(:has-text("All"))',
        '.active [class*="export"] button',
        '.tab-pane.active a:has-text("Export")',
        'button[class*="export"]:visible'
      ],
      type: 'button'
    };
    await this.healer.click(exportTabButtonDef);
  }

  async clickRefreshData(): Promise<void> {
    await this.healer.click(this.refreshDataButtonDef);
    await this.waitForPageLoad();
    await this.waitForSpinnerToDisappear();
  }

  // ============================================================
  // Pagination
  // ============================================================
  async getItemsPerPage(): Promise<string> {
    const locator = await this.healer.locate(this.itemsPerPageDropdownDef);
    return await locator.inputValue();
  }

  async changeItemsPerPage(count: string): Promise<void> {
    await this.healer.selectOption(this.itemsPerPageDropdownDef, count);
    await this.waitForPageLoad();
    await this.waitForSpinnerToDisappear();
  }

  async getPaginationInfo(): Promise<string> {
    return await this.healer.getText(this.paginationInfoDef);
  }
}
