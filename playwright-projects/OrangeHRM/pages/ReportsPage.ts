// pages/ReportsPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ElementDefinition } from '../utils/SelfHealingLocator';

export class ReportsPage extends BasePage {
  readonly leaveUsageReportUrl = '/web/index.php/leave/viewLeaveBalanceReport';
  readonly myLeaveUsageReportUrl = '/web/index.php/leave/viewMyLeaveBalanceReport';

  // Generate For radio buttons
  private readonly leaveTypeRadioDef: ElementDefinition = {
    name: 'leaveTypeRadio',
    description: 'Leave Type radio button',
    primary: 'label:has-text("Leave Type") input[type="radio"]',
    fallbacks: ['input[type="radio"]:first-of-type'],
    type: 'radio'
  };

  private readonly employeeRadioDef: ElementDefinition = {
    name: 'employeeRadio',
    description: 'Employee radio button',
    primary: 'label:has-text("Employee") input[type="radio"]',
    fallbacks: ['input[type="radio"]:last-of-type'],
    type: 'radio'
  };

  // Filter elements
  private readonly leaveTypeDropdownDef: ElementDefinition = {
    name: 'leaveTypeDropdown',
    description: 'Leave Type filter dropdown',
    primary: '.oxd-form-row:has-text("Leave Type") .oxd-select-wrapper',
    fallbacks: ['.oxd-select-wrapper:first-of-type'],
    type: 'dropdown'
  };

  private readonly leavePeriodDropdownDef: ElementDefinition = {
    name: 'leavePeriodDropdown',
    description: 'Leave Period filter dropdown',
    primary: '.oxd-form-row:has-text("Leave Period") .oxd-select-wrapper',
    fallbacks: ['.oxd-select-wrapper:has-text("to")'],
    type: 'dropdown'
  };

  private readonly locationDropdownDef: ElementDefinition = {
    name: 'locationDropdown',
    description: 'Location filter dropdown',
    primary: '.oxd-form-row:has-text("Location") .oxd-select-wrapper',
    fallbacks: [],
    type: 'dropdown'
  };

  private readonly subUnitDropdownDef: ElementDefinition = {
    name: 'subUnitDropdown',
    description: 'Sub Unit filter dropdown',
    primary: '.oxd-form-row:has-text("Sub Unit") .oxd-select-wrapper',
    fallbacks: [],
    type: 'dropdown'
  };

  private readonly jobTitleDropdownDef: ElementDefinition = {
    name: 'jobTitleDropdown',
    description: 'Job Title filter dropdown',
    primary: '.oxd-form-row:has-text("Job Title") .oxd-select-wrapper',
    fallbacks: [],
    type: 'dropdown'
  };

  private readonly includePastEmployeesToggleDef: ElementDefinition = {
    name: 'includePastEmployeesToggle',
    description: 'Include Past Employees toggle',
    primary: '.oxd-switch-input',
    fallbacks: ['input[type="checkbox"]'],
    type: 'checkbox'
  };

  private readonly generateButtonDef: ElementDefinition = {
    name: 'generateButton',
    description: 'Generate report button',
    primary: 'button[type="submit"]',
    fallbacks: ['button:has-text("Generate")', '.oxd-button--secondary:has-text("Generate")'],
    type: 'button'
  };

  // Report table elements
  private readonly reportTableDef: ElementDefinition = {
    name: 'reportTable',
    description: 'Report results table',
    primary: '.oxd-table-body',
    fallbacks: ['[class*="table-body"]', 'table tbody'],
    type: 'container'
  };

  private readonly recordCountDef: ElementDefinition = {
    name: 'recordCount',
    description: 'Record count display',
    primary: '.orangehrm-horizontal-padding span:has-text("Record")',
    fallbacks: ['span:has-text("Record")'],
    type: 'text'
  };

  // Report columns (My Leave Usage)
  private readonly leaveEntitlementColumnDef: ElementDefinition = {
    name: 'leaveEntitlementColumn',
    description: 'Leave Entitlements column',
    primary: '.oxd-table-header-cell:has-text("Leave Entitlements")',
    fallbacks: [],
    type: 'text'
  };

  private readonly pendingApprovalColumnDef: ElementDefinition = {
    name: 'pendingApprovalColumn',
    description: 'Leave Pending Approval column',
    primary: '.oxd-table-header-cell:has-text("Pending")',
    fallbacks: [],
    type: 'text'
  };

  private readonly scheduledColumnDef: ElementDefinition = {
    name: 'scheduledColumn',
    description: 'Leave Scheduled column',
    primary: '.oxd-table-header-cell:has-text("Scheduled")',
    fallbacks: [],
    type: 'text'
  };

  private readonly takenColumnDef: ElementDefinition = {
    name: 'takenColumn',
    description: 'Leave Taken column',
    primary: '.oxd-table-header-cell:has-text("Taken")',
    fallbacks: [],
    type: 'text'
  };

  private readonly balanceColumnDef: ElementDefinition = {
    name: 'balanceColumn',
    description: 'Leave Balance column',
    primary: '.oxd-table-header-cell:has-text("Balance")',
    fallbacks: [],
    type: 'text'
  };

  private readonly validationErrorDef: ElementDefinition = {
    name: 'validationError',
    description: 'Validation error message',
    primary: '.oxd-input-field-error-message',
    fallbacks: ['span:has-text("Required")'],
    type: 'text'
  };

  constructor(page: Page) {
    super(page);
  }

  // Navigation methods
  async navigateToLeaveUsageReport(): Promise<void> {
    await this.page.goto(this.leaveUsageReportUrl);
    await this.waitForPageLoad();
  }

  async navigateToMyLeaveUsageReport(): Promise<void> {
    await this.page.goto(this.myLeaveUsageReportUrl);
    await this.waitForPageLoad();
  }

  // Generate For selection
  async selectGenerateForLeaveType(): Promise<void> {
    await this.page.locator('label:has-text("Leave Type")').click();
  }

  async selectGenerateForEmployee(): Promise<void> {
    await this.page.locator('label:has-text("Employee")').click();
  }

  // Filter methods
  async selectLeaveType(leaveType: string): Promise<void> {
    await this.healer.click(this.leaveTypeDropdownDef);
    await this.page.locator(`.oxd-select-option:has-text("${leaveType}")`).click();
  }

  async selectLeavePeriod(period: string): Promise<void> {
    await this.healer.click(this.leavePeriodDropdownDef);
    await this.page.locator(`.oxd-select-option:has-text("${period}")`).click();
  }

  async selectLocation(location: string): Promise<void> {
    await this.healer.click(this.locationDropdownDef);
    await this.page.locator(`.oxd-select-option:has-text("${location}")`).click();
  }

  async selectSubUnit(subUnit: string): Promise<void> {
    await this.healer.click(this.subUnitDropdownDef);
    await this.page.locator(`.oxd-select-option:has-text("${subUnit}")`).click();
  }

  async selectJobTitle(jobTitle: string): Promise<void> {
    await this.healer.click(this.jobTitleDropdownDef);
    await this.page.locator(`.oxd-select-option:has-text("${jobTitle}")`).click();
  }

  async toggleIncludePastEmployees(): Promise<void> {
    await this.healer.click(this.includePastEmployeesToggleDef);
  }

  // Generate report
  async clickGenerate(): Promise<void> {
    await this.healer.click(this.generateButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  async generateLeaveUsageReport(filters: {
    generateFor: 'Leave Type' | 'Employee';
    leavePeriod: string;
    leaveType?: string;
    location?: string;
    subUnit?: string;
    jobTitle?: string;
    includePastEmployees?: boolean;
  }): Promise<void> {
    if (filters.generateFor === 'Leave Type') {
      await this.selectGenerateForLeaveType();
    } else {
      await this.selectGenerateForEmployee();
    }

    await this.selectLeavePeriod(filters.leavePeriod);

    if (filters.leaveType) {
      await this.selectLeaveType(filters.leaveType);
    }
    if (filters.location) {
      await this.selectLocation(filters.location);
    }
    if (filters.subUnit) {
      await this.selectSubUnit(filters.subUnit);
    }
    if (filters.jobTitle) {
      await this.selectJobTitle(filters.jobTitle);
    }
    if (filters.includePastEmployees) {
      await this.toggleIncludePastEmployees();
    }

    await this.clickGenerate();
  }

  async generateMyLeaveUsageReport(leavePeriod: string): Promise<void> {
    await this.selectLeavePeriod(leavePeriod);
    await this.clickGenerate();
  }

  // Report data methods
  async getRecordCount(): Promise<number> {
    const text = await this.healer.getText(this.recordCountDef);
    const match = text.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async isReportTableVisible(): Promise<boolean> {
    return await this.healer.isVisible(this.reportTableDef);
  }

  async getReportData(): Promise<Array<Record<string, string>>> {
    const table = await this.healer.locate(this.reportTableDef);
    const rows = table.locator('.oxd-table-row');
    const count = await rows.count();
    const data: Array<Record<string, string>> = [];

    for (let i = 0; i < count; i++) {
      const cells = rows.nth(i).locator('.oxd-table-cell');
      const cellCount = await cells.count();
      const rowData: Record<string, string> = {};

      for (let j = 0; j < cellCount; j++) {
        rowData[`col${j}`] = await cells.nth(j).textContent() || '';
      }
      data.push(rowData);
    }

    return data;
  }

  // Validation methods
  async isValidationErrorDisplayed(): Promise<boolean> {
    return await this.healer.isVisible(this.validationErrorDef, 3000);
  }

  async getValidationError(): Promise<string> {
    return await this.healer.getText(this.validationErrorDef);
  }

  // Page check methods
  async isOnLeaveUsageReportPage(): Promise<boolean> {
    return this.page.url().includes('/leave/viewLeaveBalanceReport');
  }

  async isOnMyLeaveUsageReportPage(): Promise<boolean> {
    return this.page.url().includes('/leave/viewMyLeaveBalanceReport');
  }
}
