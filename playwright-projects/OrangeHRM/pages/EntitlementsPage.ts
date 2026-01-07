// pages/EntitlementsPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ElementDefinition } from '../utils/SelfHealingLocator';

export class EntitlementsPage extends BasePage {
  readonly addEntitlementUrl = '/web/index.php/leave/addLeaveEntitlement';
  readonly employeeEntitlementsUrl = '/web/index.php/leave/viewLeaveEntitlements';
  readonly myEntitlementsUrl = '/web/index.php/leave/viewMyLeaveEntitlements';

  // Add Entitlement elements
  private readonly individualEmployeeRadioDef: ElementDefinition = {
    name: 'individualEmployeeRadio',
    description: 'Individual Employee radio button',
    primary: 'label:has-text("Individual Employee") input',
    fallbacks: ['input[type="radio"]:first-of-type', '.oxd-radio-input:first-of-type'],
    type: 'radio'
  };

  private readonly multipleEmployeesRadioDef: ElementDefinition = {
    name: 'multipleEmployeesRadio',
    description: 'Multiple Employees radio button',
    primary: 'label:has-text("Multiple Employees") input',
    fallbacks: ['input[type="radio"]:last-of-type', '.oxd-radio-input:last-of-type'],
    type: 'radio'
  };

  private readonly employeeNameInputDef: ElementDefinition = {
    name: 'employeeNameInput',
    description: 'Employee Name autocomplete input',
    primary: '.oxd-form-row:has-text("Employee Name") input',
    fallbacks: ['input[placeholder="Type for hints..."]', '.oxd-autocomplete-wrapper input'],
    type: 'input'
  };

  private readonly leaveTypeDropdownDef: ElementDefinition = {
    name: 'leaveTypeDropdown',
    description: 'Leave Type dropdown',
    primary: '.oxd-form-row:has-text("Leave Type") .oxd-select-wrapper',
    fallbacks: ['.oxd-select-wrapper:has-text("Select")'],
    type: 'dropdown'
  };

  private readonly leavePeriodDropdownDef: ElementDefinition = {
    name: 'leavePeriodDropdown',
    description: 'Leave Period dropdown',
    primary: '.oxd-form-row:has-text("Leave Period") .oxd-select-wrapper',
    fallbacks: ['.oxd-select-wrapper:has-text("to")'],
    type: 'dropdown'
  };

  private readonly entitlementInputDef: ElementDefinition = {
    name: 'entitlementInput',
    description: 'Entitlement days input',
    primary: '.oxd-form-row:has-text("Entitlement") input',
    fallbacks: ['input.oxd-input:last-of-type', 'input[class*="input"]'],
    type: 'input'
  };

  private readonly saveButtonDef: ElementDefinition = {
    name: 'saveButton',
    description: 'Save button',
    primary: 'button[type="submit"]',
    fallbacks: ['button:has-text("Save")', '.oxd-button--secondary:has-text("Save")'],
    type: 'button'
  };

  private readonly cancelButtonDef: ElementDefinition = {
    name: 'cancelButton',
    description: 'Cancel button',
    primary: 'button:has-text("Cancel")',
    fallbacks: ['.oxd-button--ghost:has-text("Cancel")'],
    type: 'button'
  };

  // Employee Entitlements search elements
  private readonly searchButtonDef: ElementDefinition = {
    name: 'searchButton',
    description: 'Search button',
    primary: 'button:has-text("Search")',
    fallbacks: ['.oxd-button--secondary:has-text("Search")'],
    type: 'button'
  };

  // My Entitlements elements
  private readonly totalDaysDef: ElementDefinition = {
    name: 'totalDays',
    description: 'Total days display',
    primary: '.orangehrm-header-container span:has-text("Day")',
    fallbacks: ['span:has-text("Total")'],
    type: 'text'
  };

  private readonly addButtonDef: ElementDefinition = {
    name: 'addButton',
    description: 'Add entitlement button',
    primary: 'button:has-text("Add")',
    fallbacks: ['.oxd-button--secondary:has-text("Add")'],
    type: 'button'
  };

  private readonly recordCountDef: ElementDefinition = {
    name: 'recordCount',
    description: 'Record count display',
    primary: '.orangehrm-horizontal-padding span',
    fallbacks: ['span:has-text("Record")'],
    type: 'text'
  };

  private readonly entitlementsTableDef: ElementDefinition = {
    name: 'entitlementsTable',
    description: 'Entitlements results table',
    primary: '.oxd-table-body',
    fallbacks: ['[class*="table-body"]'],
    type: 'container'
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
  async navigateToAddEntitlement(): Promise<void> {
    await this.page.goto(this.addEntitlementUrl);
    await this.waitForPageLoad();
  }

  async navigateToEmployeeEntitlements(): Promise<void> {
    await this.page.goto(this.employeeEntitlementsUrl);
    await this.waitForPageLoad();
  }

  async navigateToMyEntitlements(): Promise<void> {
    await this.page.goto(this.myEntitlementsUrl);
    await this.waitForPageLoad();
  }

  // Add Entitlement methods
  async selectIndividualEmployee(): Promise<void> {
    await this.page.locator('label:has-text("Individual Employee")').click();
  }

  async selectMultipleEmployees(): Promise<void> {
    await this.page.locator('label:has-text("Multiple Employees")').click();
  }

  async enterEmployeeName(name: string): Promise<void> {
    await this.healer.fill(this.employeeNameInputDef, name);
    await this.page.waitForTimeout(500); // Wait for autocomplete
  }

  async selectEmployeeFromAutocomplete(name: string): Promise<void> {
    await this.enterEmployeeName(name);
    await this.page.locator(`.oxd-autocomplete-option:has-text("${name}")`).click();
  }

  async selectLeaveType(leaveType: string): Promise<void> {
    await this.healer.click(this.leaveTypeDropdownDef);
    await this.page.locator(`.oxd-select-option:has-text("${leaveType}")`).click();
  }

  async selectLeavePeriod(period: string): Promise<void> {
    await this.healer.click(this.leavePeriodDropdownDef);
    await this.page.locator(`.oxd-select-option:has-text("${period}")`).click();
  }

  async enterEntitlement(days: string): Promise<void> {
    await this.healer.fill(this.entitlementInputDef, days);
  }

  async clickSave(): Promise<void> {
    await this.healer.click(this.saveButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  async clickCancel(): Promise<void> {
    await this.healer.click(this.cancelButtonDef);
    await this.waitForPageLoad();
  }

  async addEntitlementToEmployee(data: {
    employeeName: string;
    leaveType: string;
    entitlement: string;
  }): Promise<void> {
    await this.selectIndividualEmployee();
    await this.selectEmployeeFromAutocomplete(data.employeeName);
    await this.selectLeaveType(data.leaveType);
    await this.enterEntitlement(data.entitlement);
    await this.clickSave();
  }

  // Employee Entitlements search methods
  async searchEmployeeEntitlements(filters: {
    employeeName?: string;
    leaveType?: string;
  }): Promise<void> {
    if (filters.employeeName) {
      await this.selectEmployeeFromAutocomplete(filters.employeeName);
    }
    if (filters.leaveType) {
      await this.selectLeaveType(filters.leaveType);
    }
    await this.healer.click(this.searchButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  // My Entitlements methods
  async getTotalDays(): Promise<string> {
    return await this.healer.getText(this.totalDaysDef);
  }

  async getTotalDaysNumber(): Promise<number> {
    const text = await this.getTotalDays();
    const match = text.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async filterMyEntitlements(filters: {
    leaveType?: string;
    leavePeriod?: string;
  }): Promise<void> {
    if (filters.leaveType) {
      await this.selectLeaveType(filters.leaveType);
    }
    if (filters.leavePeriod) {
      await this.selectLeavePeriod(filters.leavePeriod);
    }
    await this.healer.click(this.searchButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  async clickAddButton(): Promise<void> {
    await this.healer.click(this.addButtonDef);
    await this.waitForPageLoad();
  }

  // Common methods
  async getRecordCount(): Promise<number> {
    const text = await this.healer.getText(this.recordCountDef);
    const match = text.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async isValidationErrorDisplayed(): Promise<boolean> {
    return await this.healer.isVisible(this.validationErrorDef, 3000);
  }

  async getValidationErrors(): Promise<string[]> {
    const errors = this.page.locator(this.validationErrorDef.primary);
    const count = await errors.count();
    const errorTexts: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await errors.nth(i).textContent();
      if (text) errorTexts.push(text.trim());
    }
    return errorTexts;
  }

  async isOnAddEntitlementPage(): Promise<boolean> {
    return this.page.url().includes('/leave/addLeaveEntitlement');
  }

  async isOnEmployeeEntitlementsPage(): Promise<boolean> {
    return this.page.url().includes('/leave/viewLeaveEntitlements');
  }

  async isOnMyEntitlementsPage(): Promise<boolean> {
    return this.page.url().includes('/leave/viewMyLeaveEntitlements');
  }
}
