// pages/ApproveSurveysPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ElementDefinition } from '../utils/SelfHealingLocator';

export class ApproveSurveysPage extends BasePage {
  // ============================================================
  // Element Definitions - List View: Search & Filters
  // ============================================================
  private readonly searchInputDef: ElementDefinition = {
    name: 'searchInput',
    description: 'Search input field on the Approve Surveys list page',
    primary: 'input[type="search"], input[placeholder*="Search" i]',
    fallbacks: [
      'input[name*="search" i]',
      '.search-box input',
      '[class*="search"] input',
      'input[class*="search"]'
    ],
    type: 'input'
  };

  private readonly searchButtonDef: ElementDefinition = {
    name: 'searchButton',
    description: 'Search button next to the search input on Approve Surveys list',
    primary: 'button:has-text("Search")',
    fallbacks: [
      '.btn:has-text("Search")',
      'button[type="submit"]:near(input[type="search"])',
      '.search-box button',
      '[class*="search"] button'
    ],
    type: 'button'
  };

  private readonly filterChipDef: ElementDefinition = {
    name: 'filterChip',
    description: 'Filter chip/tag showing an active filter on the surveys list',
    primary: '.filter-chip, .badge-filter, .chip',
    fallbacks: [
      '.tag',
      '[class*="filter-tag"]',
      '[class*="chip"]',
      '.active-filter'
    ],
    type: 'container'
  };

  private readonly clearAllFiltersDef: ElementDefinition = {
    name: 'clearAllFilters',
    description: 'Clear All button to remove all active filter chips',
    primary: 'button:has-text("Clear all"), a:has-text("Clear all")',
    fallbacks: [
      'button:has-text("Clear All")',
      '.clear-filters',
      '[class*="clear"]:has-text("Clear")',
      'a:has-text("Reset")'
    ],
    type: 'button'
  };

  // ============================================================
  // Element Definitions - List View: Table
  // ============================================================
  private readonly surveyListTableDef: ElementDefinition = {
    name: 'surveyListTable',
    description: 'Survey results table showing drillholes with tool columns and pending counts',
    primary: 'table.table, table[class*="survey"]',
    fallbacks: [
      '.table-responsive table',
      '[role="grid"]',
      '.ag-root-wrapper',
      'table'
    ],
    type: 'container'
  };

  private readonly toolCountLinkDef: ElementDefinition = {
    name: 'toolCountLink',
    description: 'Clickable pending count link in a tool column that navigates to survey detail view',
    primary: 'table tbody td a, table tbody td .badge a',
    fallbacks: [
      'tbody a[href*="Approve"]',
      'td a.count-link',
      '[role="row"] a',
      'td .pending-count'
    ],
    type: 'link'
  };

  private readonly listColumnsButtonDef: ElementDefinition = {
    name: 'listColumnsButton',
    description: 'Columns button on the survey list view to toggle column visibility',
    primary: 'button:has-text("Columns")',
    fallbacks: [
      '.btn:has-text("Columns")',
      'button[class*="column"]',
      '[data-action="columns"]',
      '.toolbar button:has-text("Columns")'
    ],
    type: 'button'
  };

  // ============================================================
  // Element Definitions - Detail View: Header
  // ============================================================
  private readonly projectLabelDef: ElementDefinition = {
    name: 'projectLabel',
    description: 'Project name label displayed on the survey detail view header',
    primary: '.project-name, [class*="project-label"]',
    fallbacks: [
      'h2:has-text("Project")',
      '.detail-header .project',
      '.breadcrumb li:has-text("Project")',
      '[class*="header"] [class*="project"]'
    ],
    type: 'text'
  };

  private readonly drillholeLabelDef: ElementDefinition = {
    name: 'drillholeLabel',
    description: 'Drillhole name label displayed on the survey detail view header',
    primary: '.drillhole-name, [class*="drillhole-label"]',
    fallbacks: [
      'h3:has-text("Drillhole")',
      '.detail-header .drillhole',
      '.breadcrumb li:nth-child(2)',
      '[class*="header"] [class*="drillhole"]'
    ],
    type: 'text'
  };

  // ============================================================
  // Element Definitions - Detail View: Tabs & Table
  // ============================================================
  private readonly toolTabsDef: ElementDefinition = {
    name: 'toolTabs',
    description: 'Tool tabs (EZ-GYRO, DeviGyro, etc.) on the survey detail view',
    primary: '.nav-tabs a, [role="tab"]',
    fallbacks: [
      '.tab-item a',
      'ul.nav-tabs li a',
      '[class*="tab-header"] a',
      '.tabs a'
    ],
    type: 'link'
  };

  private readonly surveyDataTableDef: ElementDefinition = {
    name: 'surveyDataTable',
    description: 'Survey data table with depth, dip, azimuth columns in the detail view',
    primary: 'table.table, table[class*="survey-data"]',
    fallbacks: [
      '.table-responsive table',
      '[role="grid"]',
      '.ag-root-wrapper',
      '.detail-view table'
    ],
    type: 'container'
  };

  // ============================================================
  // Element Definitions - Detail View: Dropdowns
  // ============================================================
  private readonly startOfHoleRefDropdownDef: ElementDefinition = {
    name: 'startOfHoleRefDropdown',
    description: 'Start of hole reference dropdown on the survey detail view',
    primary: 'select[name*="startOfHole" i], select[name*="StartOfHole" i]',
    fallbacks: [
      '.form-group:has-text("Start of Hole") select',
      'select[class*="start-of-hole"]',
      'label:has-text("Start of Hole") + select',
      '[class*="soh"] select'
    ],
    type: 'dropdown'
  };

  private readonly azimuthModeDropdownDef: ElementDefinition = {
    name: 'azimuthModeDropdown',
    description: 'Azimuth Mode dropdown selector on the survey detail view',
    primary: 'select[name*="azimuth" i], select[name*="Azimuth" i]',
    fallbacks: [
      '.form-group:has-text("Azimuth") select',
      'select[class*="azimuth"]',
      'label:has-text("Azimuth Mode") + select',
      '[class*="azimuth"] select'
    ],
    type: 'dropdown'
  };

  // ============================================================
  // Element Definitions - Detail View: Action Buttons
  // ============================================================
  private readonly acceptQAButtonDef: ElementDefinition = {
    name: 'acceptQAButton',
    description: 'Accept QA Results button on the survey detail view',
    primary: 'button:has-text("Accept QA"), button:has-text("Accept QA Results")',
    fallbacks: [
      '.btn:has-text("Accept QA")',
      'button[class*="accept-qa"]',
      '[data-action="accept-qa"]',
      '.toolbar button:has-text("Accept")'
    ],
    type: 'button'
  };

  private readonly approveButtonDef: ElementDefinition = {
    name: 'approveButton',
    description: 'Approve button to approve selected surveys on the detail view',
    primary: 'button:has-text("Approve")',
    fallbacks: [
      '.btn-success:has-text("Approve")',
      'button[class*="approve"]',
      '[data-action="approve"]',
      '.toolbar button.btn-success'
    ],
    type: 'button'
  };

  private readonly rejectButtonDef: ElementDefinition = {
    name: 'rejectButton',
    description: 'Reject button with count indicator on the survey detail view',
    primary: 'button:has-text("Reject")',
    fallbacks: [
      '.btn-danger:has-text("Reject")',
      'button[class*="reject"]',
      '[data-action="reject"]',
      '.toolbar button.btn-danger'
    ],
    type: 'button'
  };

  private readonly saveButtonDef: ElementDefinition = {
    name: 'saveButton',
    description: 'Save button to persist changes on the survey detail view',
    primary: 'button:has-text("Save")',
    fallbacks: [
      '.btn-primary:has-text("Save")',
      'button[class*="save"]',
      '[data-action="save"]',
      '.toolbar button:has-text("Save")'
    ],
    type: 'button'
  };

  private readonly undoButtonDef: ElementDefinition = {
    name: 'undoButton',
    description: 'Undo button to revert recent changes on the survey detail view',
    primary: 'button:has-text("Undo")',
    fallbacks: [
      '.btn:has-text("Undo")',
      'button[class*="undo"]',
      '[data-action="undo"]',
      '.toolbar button:has-text("Undo")'
    ],
    type: 'button'
  };

  // ============================================================
  // Element Definitions - Detail View: Counters & Toggles
  // ============================================================
  private readonly pendingChangesCounterDef: ElementDefinition = {
    name: 'pendingChangesCounter',
    description: 'Pending changes counter displaying number of unsaved modifications',
    primary: '.pending-changes, [class*="pending-count"]',
    fallbacks: [
      '.badge:has-text("pending")',
      '[class*="changes-counter"]',
      '.unsaved-count',
      'span[class*="pending"]'
    ],
    type: 'text'
  };

  private readonly exportAllButtonDef: ElementDefinition = {
    name: 'exportAllButton',
    description: 'Export All button on the survey detail view',
    primary: 'button:has-text("Export All"), button:has-text("Export")',
    fallbacks: [
      '.btn:has-text("Export All")',
      'button[class*="export"]',
      '[data-action="export-all"]',
      '.toolbar button:has-text("Export")'
    ],
    type: 'button'
  };

  private readonly generateReportButtonDef: ElementDefinition = {
    name: 'generateReportButton',
    description: 'Generate Report button on the survey detail view',
    primary: 'button:has-text("Generate Report")',
    fallbacks: [
      '.btn:has-text("Generate Report")',
      'button:has-text("Report")',
      'button[class*="report"]',
      '[data-action="generate-report"]'
    ],
    type: 'button'
  };

  private readonly showChartsToggleDef: ElementDefinition = {
    name: 'showChartsToggle',
    description: 'Show Charts toggle switch on the survey detail view',
    primary: 'input[type="checkbox"]:near(:text("Charts")), label:has-text("Charts") input',
    fallbacks: [
      '.toggle:has-text("Charts")',
      '[class*="chart-toggle"]',
      'button:has-text("Charts")',
      'label:has-text("Show Charts") input[type="checkbox"]'
    ],
    type: 'checkbox'
  };

  private readonly detailColumnsButtonDef: ElementDefinition = {
    name: 'detailColumnsButton',
    description: 'Columns button on the survey detail view to toggle table column visibility',
    primary: 'button:has-text("Columns")',
    fallbacks: [
      '.btn:has-text("Columns")',
      'button[class*="column"]',
      '[data-action="columns"]',
      '.detail-view button:has-text("Columns")'
    ],
    type: 'button'
  };

  // ============================================================
  // Element Definitions - Page Identification
  // ============================================================
  private readonly listPageHeadingDef: ElementDefinition = {
    name: 'surveyListHeading',
    description: 'Page heading for the Approve Surveys list page',
    primary: 'h1:has-text("Survey"), h2:has-text("Survey")',
    fallbacks: [
      '.page-title:has-text("Survey")',
      '.content-header:has-text("Approve")',
      '[class*="heading"]:has-text("Survey")',
      'h3:has-text("Survey")'
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
    await this.page.goto('/Approve/Surveys');
    await this.waitForPageLoad();
    await this.waitForSpinnerToDisappear();
  }

  async isOnSurveyListPage(): Promise<boolean> {
    const url = this.getCurrentUrl();
    return url.includes('Approve/Surveys') && !url.includes('Detail');
  }

  async isOnSurveyDetailPage(): Promise<boolean> {
    const url = this.getCurrentUrl();
    return url.includes('Approve/Survey') && (url.includes('Detail') || url.includes('detail') || url.match(/Survey\/\d+/) !== null);
  }

  // ============================================================
  // List View Actions
  // ============================================================
  async enterSearch(text: string): Promise<void> {
    await this.healer.fill(this.searchInputDef, text);
  }

  async clickSearch(): Promise<void> {
    await this.healer.click(this.searchButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  async clearAllFilters(): Promise<void> {
    await this.healer.click(this.clearAllFiltersDef);
    await this.waitForSpinnerToDisappear();
  }

  async removeFilter(name: string): Promise<void> {
    const filterRemoveDef: ElementDefinition = {
      name: 'filterRemove',
      description: `Remove button (X) on filter chip for "${name}"`,
      primary: `.chip:has-text("${name}") .close, .filter-chip:has-text("${name}") button`,
      fallbacks: [
        `.badge:has-text("${name}") .close`,
        `.tag:has-text("${name}") button`,
        `[class*="chip"]:has-text("${name}") [class*="remove"]`,
        `[class*="filter"]:has-text("${name}") button`
      ],
      type: 'button'
    };
    await this.healer.click(filterRemoveDef);
    await this.waitForSpinnerToDisappear();
  }

  async clickToolCount(drillholeName: string, toolName: string): Promise<void> {
    const toolCountDef: ElementDefinition = {
      name: 'specificToolCount',
      description: `Pending count link for tool "${toolName}" on drillhole "${drillholeName}" in surveys list`,
      primary: `tr:has-text("${drillholeName}") td a:has-text("${toolName}"), tr:has-text("${drillholeName}") a`,
      fallbacks: [
        `tr:has-text("${drillholeName}") td:has(a)`,
        `[role="row"]:has-text("${drillholeName}") a`,
        `tbody tr:has-text("${drillholeName}") .count-link`
      ],
      type: 'link'
    };
    await this.healer.click(toolCountDef);
    await this.waitForPageLoad();
    await this.waitForSpinnerToDisappear();
  }

  async getTableRowCount(): Promise<number> {
    try {
      const table = await this.healer.locate(this.surveyListTableDef);
      const rows = table.locator('tbody tr');
      return await rows.count();
    } catch {
      return 0;
    }
  }

  async toggleColumns(): Promise<void> {
    const isDetail = await this.isOnSurveyDetailPage();
    if (isDetail) {
      await this.healer.click(this.detailColumnsButtonDef);
    } else {
      await this.healer.click(this.listColumnsButtonDef);
    }
  }

  // ============================================================
  // Detail View - Dropdowns
  // ============================================================
  async selectStartOfHoleRef(option: string): Promise<void> {
    await this.healer.selectOption(this.startOfHoleRefDropdownDef, option);
    await this.page.waitForTimeout(300);
  }

  async selectAzimuthMode(mode: string): Promise<void> {
    await this.healer.selectOption(this.azimuthModeDropdownDef, mode);
    await this.page.waitForTimeout(300);
  }

  // ============================================================
  // Detail View - Action Buttons
  // ============================================================
  async clickAcceptQA(): Promise<void> {
    await this.healer.click(this.acceptQAButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  async clickApprove(): Promise<void> {
    await this.healer.click(this.approveButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  async clickReject(): Promise<void> {
    await this.healer.click(this.rejectButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  async clickSave(): Promise<void> {
    await this.healer.click(this.saveButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  async clickUndo(): Promise<void> {
    await this.healer.click(this.undoButtonDef);
    await this.page.waitForTimeout(300);
  }

  // ============================================================
  // Detail View - Info & Toggles
  // ============================================================
  async getPendingChangesCount(): Promise<number> {
    try {
      const text = await this.healer.getText(this.pendingChangesCounterDef);
      const match = text.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    } catch {
      return 0;
    }
  }

  async clickExportAll(): Promise<void> {
    await this.healer.click(this.exportAllButtonDef);
    await this.page.waitForTimeout(500);
  }

  async clickGenerateReport(): Promise<void> {
    await this.healer.click(this.generateReportButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  async toggleShowCharts(): Promise<void> {
    await this.healer.click(this.showChartsToggleDef);
    await this.page.waitForTimeout(500);
  }

  async selectSurveyRow(index: number): Promise<void> {
    const surveyRowCheckboxDef: ElementDefinition = {
      name: 'surveyRowCheckbox',
      description: 'Checkbox for selecting a row in the survey data table',
      primary: 'table tbody input[type="checkbox"]',
      fallbacks: [
        '.ag-selection-checkbox',
        'tbody tr input[type="checkbox"]',
        '[role="row"] input[type="checkbox"]'
      ],
      type: 'checkbox'
    };
    const locator = await this.healer.locate(surveyRowCheckboxDef);
    await locator.nth(index).click();
  }
}
