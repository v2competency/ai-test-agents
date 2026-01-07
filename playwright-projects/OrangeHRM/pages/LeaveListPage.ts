// pages/LeaveListPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { SidebarNav } from './components/SidebarNav';
import { ElementDefinition } from '../utils/SelfHealingLocator';

export class LeaveListPage extends BasePage {
  readonly pageUrl = '/web/index.php/leave/viewLeaveList';
  readonly sidebar: SidebarNav;

  // Filter element definitions
  private readonly fromDateInputDef: ElementDefinition = {
    name: 'fromDateInput',
    description: 'From Date filter input',
    primary: '.oxd-form-row:has-text("From Date") input',
    fallbacks: [
      'input[placeholder="yyyy-mm-dd"]:first-of-type',
      '.oxd-date-input input:first-of-type',
      '[class*="date"]:first-of-type input'
    ],
    type: 'input'
  };

  private readonly toDateInputDef: ElementDefinition = {
    name: 'toDateInput',
    description: 'To Date filter input',
    primary: '.oxd-form-row:has-text("To Date") input',
    fallbacks: [
      'input[placeholder="yyyy-mm-dd"]:nth-of-type(2)',
      '.oxd-date-input input:last-of-type',
      '[class*="date"]:last-of-type input'
    ],
    type: 'input'
  };

  private readonly statusDropdownDef: ElementDefinition = {
    name: 'statusDropdown',
    description: 'Leave Status dropdown',
    primary: '.oxd-form-row:has-text("Status") .oxd-select-wrapper',
    fallbacks: [
      '.oxd-select-text-input:has-text("Select")',
      '[class*="select"]:has-text("Status")'
    ],
    type: 'dropdown'
  };

  private readonly leaveTypeDropdownDef: ElementDefinition = {
    name: 'leaveTypeDropdown',
    description: 'Leave Type filter dropdown',
    primary: '.oxd-form-row:has-text("Leave Type") .oxd-select-wrapper',
    fallbacks: [
      '.oxd-select-text:has-text("Leave Type")',
      '[class*="select"]:has-text("Leave Type")'
    ],
    type: 'dropdown'
  };

  private readonly employeeNameInputDef: ElementDefinition = {
    name: 'employeeNameInput',
    description: 'Employee Name autocomplete input',
    primary: '.oxd-form-row:has-text("Employee Name") input',
    fallbacks: [
      'input[placeholder="Type for hints..."]',
      '.oxd-autocomplete-wrapper input'
    ],
    type: 'input'
  };

  private readonly subUnitDropdownDef: ElementDefinition = {
    name: 'subUnitDropdown',
    description: 'Sub Unit filter dropdown',
    primary: '.oxd-form-row:has-text("Sub Unit") .oxd-select-wrapper',
    fallbacks: [
      '.oxd-select-text:has-text("Sub Unit")'
    ],
    type: 'dropdown'
  };

  private readonly includePastEmployeesToggleDef: ElementDefinition = {
    name: 'includePastEmployeesToggle',
    description: 'Include Past Employees toggle',
    primary: '.oxd-switch-input',
    fallbacks: [
      'input[type="checkbox"]',
      '.oxd-switch-wrapper input'
    ],
    type: 'checkbox'
  };

  private readonly searchButtonDef: ElementDefinition = {
    name: 'searchButton',
    description: 'Search button',
    primary: 'button[type="submit"]',
    fallbacks: [
      'button:has-text("Search")',
      '.oxd-button--secondary:has-text("Search")'
    ],
    type: 'button'
  };

  private readonly resetButtonDef: ElementDefinition = {
    name: 'resetButton',
    description: 'Reset filters button',
    primary: 'button[type="reset"]',
    fallbacks: [
      'button:has-text("Reset")',
      '.oxd-button--ghost:has-text("Reset")'
    ],
    type: 'button'
  };

  private readonly recordCountDef: ElementDefinition = {
    name: 'recordCount',
    description: 'Record count display',
    primary: '.orangehrm-horizontal-padding span',
    fallbacks: [
      'span:has-text("Record")',
      '.oxd-text--span:has-text("Record")'
    ],
    type: 'text'
  };

  private readonly statusChipDef: ElementDefinition = {
    name: 'statusChip',
    description: 'Status filter chip',
    primary: '.oxd-chip',
    fallbacks: [
      '[class*="chip"]',
      '.oxd-multiselect-chips-item'
    ],
    type: 'container'
  };

  // Navigation tabs
  private readonly applyTabDef: ElementDefinition = {
    name: 'applyTab',
    description: 'Apply leave tab',
    primary: 'a:has-text("Apply")',
    fallbacks: ['.oxd-topbar-body-nav-tab-item:has-text("Apply")'],
    type: 'link'
  };

  private readonly myLeaveTabDef: ElementDefinition = {
    name: 'myLeaveTab',
    description: 'My Leave tab',
    primary: 'a:has-text("My Leave")',
    fallbacks: ['.oxd-topbar-body-nav-tab-item:has-text("My Leave")'],
    type: 'link'
  };

  private readonly entitlementsTabDef: ElementDefinition = {
    name: 'entitlementsTab',
    description: 'Entitlements dropdown tab',
    primary: '.oxd-topbar-body-nav-tab-item:has-text("Entitlements")',
    fallbacks: ['a:has-text("Entitlements")'],
    type: 'link'
  };

  private readonly reportsTabDef: ElementDefinition = {
    name: 'reportsTab',
    description: 'Reports dropdown tab',
    primary: '.oxd-topbar-body-nav-tab-item:has-text("Reports")',
    fallbacks: ['a:has-text("Reports")'],
    type: 'link'
  };

  private readonly configureTabDef: ElementDefinition = {
    name: 'configureTab',
    description: 'Configure dropdown tab',
    primary: '.oxd-topbar-body-nav-tab-item:has-text("Configure")',
    fallbacks: ['a:has-text("Configure")'],
    type: 'link'
  };

  private readonly leaveListTabDef: ElementDefinition = {
    name: 'leaveListTab',
    description: 'Leave List tab',
    primary: 'a:has-text("Leave List")',
    fallbacks: ['.oxd-topbar-body-nav-tab-item:has-text("Leave List")'],
    type: 'link'
  };

  private readonly assignLeaveTabDef: ElementDefinition = {
    name: 'assignLeaveTab',
    description: 'Assign Leave tab',
    primary: 'a:has-text("Assign Leave")',
    fallbacks: ['.oxd-topbar-body-nav-tab-item:has-text("Assign Leave")'],
    type: 'link'
  };

  constructor(page: Page) {
    super(page);
    this.sidebar = new SidebarNav(page);
  }

  /**
   * Navigate to Leave List page
   */
  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  /**
   * Check if on Leave List page
   */
  async isOnLeaveListPage(): Promise<boolean> {
    return this.page.url().includes('/leave/viewLeaveList');
  }

  /**
   * Enter From Date
   */
  async enterFromDate(date: string): Promise<void> {
    await this.healer.fill(this.fromDateInputDef, date);
  }

  /**
   * Enter To Date
   */
  async enterToDate(date: string): Promise<void> {
    await this.healer.fill(this.toDateInputDef, date);
  }

  /**
   * Select Leave Status
   */
  async selectStatus(status: string): Promise<void> {
    await this.healer.click(this.statusDropdownDef);
    await this.page.locator(`.oxd-select-option:has-text("${status}")`).click();
  }

  /**
   * Select Leave Type
   */
  async selectLeaveType(leaveType: string): Promise<void> {
    await this.healer.click(this.leaveTypeDropdownDef);
    await this.page.locator(`.oxd-select-option:has-text("${leaveType}")`).click();
  }

  /**
   * Enter Employee Name
   */
  async enterEmployeeName(name: string): Promise<void> {
    await this.healer.fill(this.employeeNameInputDef, name);
    // Wait for autocomplete suggestions
    await this.page.waitForTimeout(500);
  }

  /**
   * Select Employee from autocomplete
   */
  async selectEmployeeFromAutocomplete(name: string): Promise<void> {
    await this.enterEmployeeName(name);
    await this.page.locator(`.oxd-autocomplete-option:has-text("${name}")`).click();
  }

  /**
   * Toggle Include Past Employees
   */
  async toggleIncludePastEmployees(): Promise<void> {
    await this.healer.click(this.includePastEmployeesToggleDef);
  }

  /**
   * Click Search button
   */
  async clickSearch(): Promise<void> {
    await this.healer.click(this.searchButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  /**
   * Click Reset button
   */
  async clickReset(): Promise<void> {
    await this.healer.click(this.resetButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  /**
   * Get record count
   */
  async getRecordCount(): Promise<number> {
    const text = await this.healer.getText(this.recordCountDef);
    const match = text.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Remove status chip
   */
  async removeStatusChip(): Promise<void> {
    const chipClose = this.page.locator('.oxd-chip .oxd-chip-icon');
    if (await chipClose.isVisible()) {
      await chipClose.click();
    }
  }

  /**
   * Search with filters
   */
  async searchWithFilters(filters: {
    fromDate?: string;
    toDate?: string;
    status?: string;
    leaveType?: string;
    employeeName?: string;
  }): Promise<void> {
    if (filters.fromDate) await this.enterFromDate(filters.fromDate);
    if (filters.toDate) await this.enterToDate(filters.toDate);
    if (filters.status) await this.selectStatus(filters.status);
    if (filters.leaveType) await this.selectLeaveType(filters.leaveType);
    if (filters.employeeName) await this.selectEmployeeFromAutocomplete(filters.employeeName);
    await this.clickSearch();
  }

  // Navigation tab methods
  async clickApplyTab(): Promise<void> {
    await this.healer.click(this.applyTabDef);
    await this.waitForPageLoad();
  }

  async clickMyLeaveTab(): Promise<void> {
    await this.healer.click(this.myLeaveTabDef);
    await this.waitForPageLoad();
  }

  async clickEntitlementsTab(): Promise<void> {
    await this.healer.click(this.entitlementsTabDef);
  }

  async clickReportsTab(): Promise<void> {
    await this.healer.click(this.reportsTabDef);
  }

  async clickConfigureTab(): Promise<void> {
    await this.healer.click(this.configureTabDef);
  }

  async clickLeaveListTab(): Promise<void> {
    await this.healer.click(this.leaveListTabDef);
    await this.waitForPageLoad();
  }

  async clickAssignLeaveTab(): Promise<void> {
    await this.healer.click(this.assignLeaveTabDef);
    await this.waitForPageLoad();
  }
}
