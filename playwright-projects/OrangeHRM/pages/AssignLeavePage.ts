// pages/AssignLeavePage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ElementDefinition } from '../utils/SelfHealingLocator';

export class AssignLeavePage extends BasePage {
  readonly pageUrl = '/web/index.php/leave/assignLeave';

  // Element definitions
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

  private readonly leaveTypeDropdownDef: ElementDefinition = {
    name: 'leaveTypeDropdown',
    description: 'Leave Type dropdown',
    primary: '.oxd-form-row:has-text("Leave Type") .oxd-select-wrapper',
    fallbacks: [
      '.oxd-select-text-input',
      '[class*="select"]:has-text("Select")'
    ],
    type: 'dropdown'
  };

  private readonly leaveBalanceDef: ElementDefinition = {
    name: 'leaveBalance',
    description: 'Leave Balance display',
    primary: '.oxd-form-row:has-text("Leave Balance") .oxd-text',
    fallbacks: [
      '.orangehrm-leave-balance',
      'p:has-text("Day(s)")'
    ],
    type: 'text'
  };

  private readonly fromDateInputDef: ElementDefinition = {
    name: 'fromDateInput',
    description: 'From Date input',
    primary: '.oxd-form-row:has-text("From Date") input',
    fallbacks: [
      'input[placeholder="yyyy-mm-dd"]:first-of-type',
      '.oxd-date-input input:first-of-type'
    ],
    type: 'input'
  };

  private readonly toDateInputDef: ElementDefinition = {
    name: 'toDateInput',
    description: 'To Date input',
    primary: '.oxd-form-row:has-text("To Date") input',
    fallbacks: [
      'input[placeholder="yyyy-mm-dd"]:last-of-type',
      '.oxd-date-input input:last-of-type'
    ],
    type: 'input'
  };

  private readonly commentsTextareaDef: ElementDefinition = {
    name: 'commentsTextarea',
    description: 'Comments textarea',
    primary: 'textarea',
    fallbacks: [
      '.oxd-textarea',
      '[class*="textarea"]'
    ],
    type: 'textarea'
  };

  private readonly assignButtonDef: ElementDefinition = {
    name: 'assignButton',
    description: 'Assign button',
    primary: 'button[type="submit"]',
    fallbacks: [
      'button:has-text("Assign")',
      '.oxd-button--secondary:has-text("Assign")'
    ],
    type: 'button'
  };

  private readonly cancelButtonDef: ElementDefinition = {
    name: 'cancelButton',
    description: 'Cancel button',
    primary: 'button:has-text("Cancel")',
    fallbacks: [
      '.oxd-button--ghost:has-text("Cancel")'
    ],
    type: 'button'
  };

  private readonly validationErrorDef: ElementDefinition = {
    name: 'validationError',
    description: 'Validation error message',
    primary: '.oxd-input-field-error-message',
    fallbacks: [
      '.oxd-input-group__message',
      'span:has-text("Required")'
    ],
    type: 'text'
  };

  private readonly partialDaysDropdownDef: ElementDefinition = {
    name: 'partialDaysDropdown',
    description: 'Partial Days dropdown',
    primary: '.oxd-form-row:has-text("Partial Days") .oxd-select-wrapper',
    fallbacks: [],
    type: 'dropdown'
  };

  private readonly durationDropdownDef: ElementDefinition = {
    name: 'durationDropdown',
    description: 'Duration dropdown',
    primary: '.oxd-form-row:has-text("Duration") .oxd-select-wrapper',
    fallbacks: [],
    type: 'dropdown'
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to Assign Leave page
   */
  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  /**
   * Check if on Assign Leave page
   */
  async isOnAssignLeavePage(): Promise<boolean> {
    return this.page.url().includes('/leave/assignLeave');
  }

  /**
   * Enter Employee Name
   */
  async enterEmployeeName(name: string): Promise<void> {
    await this.healer.fill(this.employeeNameInputDef, name);
    await this.page.waitForTimeout(500); // Wait for autocomplete
  }

  /**
   * Select Employee from autocomplete
   */
  async selectEmployeeFromAutocomplete(name: string): Promise<void> {
    await this.enterEmployeeName(name);
    const option = this.page.locator(`.oxd-autocomplete-option:has-text("${name}")`);
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();
  }

  /**
   * Select Leave Type
   */
  async selectLeaveType(leaveType: string): Promise<void> {
    await this.healer.click(this.leaveTypeDropdownDef);
    await this.page.locator(`.oxd-select-option:has-text("${leaveType}")`).click();
    await this.waitForSpinnerToDisappear();
  }

  /**
   * Get Leave Balance
   */
  async getLeaveBalance(): Promise<string> {
    try {
      return await this.healer.getText(this.leaveBalanceDef);
    } catch {
      return '0.00 Day(s)';
    }
  }

  /**
   * Get Leave Balance as number
   */
  async getLeaveBalanceNumber(): Promise<number> {
    const balanceText = await this.getLeaveBalance();
    const match = balanceText.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Enter From Date
   */
  async enterFromDate(date: string): Promise<void> {
    const input = await this.healer.locate(this.fromDateInputDef);
    await input.clear();
    await input.fill(date);
    await this.page.keyboard.press('Escape'); // Close date picker if open
  }

  /**
   * Enter To Date
   */
  async enterToDate(date: string): Promise<void> {
    const input = await this.healer.locate(this.toDateInputDef);
    await input.clear();
    await input.fill(date);
    await this.page.keyboard.press('Escape'); // Close date picker if open
  }

  /**
   * Enter Comments
   */
  async enterComments(comments: string): Promise<void> {
    await this.healer.fill(this.commentsTextareaDef, comments);
  }

  /**
   * Click Assign button
   */
  async clickAssign(): Promise<void> {
    await this.healer.click(this.assignButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  /**
   * Click Cancel button
   */
  async clickCancel(): Promise<void> {
    await this.healer.click(this.cancelButtonDef);
    await this.waitForPageLoad();
  }

  /**
   * Assign Leave with full data
   */
  async assignLeave(data: {
    employeeName: string;
    leaveType: string;
    fromDate: string;
    toDate: string;
    comments?: string;
  }): Promise<void> {
    await this.selectEmployeeFromAutocomplete(data.employeeName);
    await this.selectLeaveType(data.leaveType);
    await this.enterFromDate(data.fromDate);
    await this.enterToDate(data.toDate);
    if (data.comments) {
      await this.enterComments(data.comments);
    }
    await this.clickAssign();
  }

  /**
   * Check if validation error is displayed
   */
  async isValidationErrorDisplayed(): Promise<boolean> {
    return await this.healer.isVisible(this.validationErrorDef, 3000);
  }

  /**
   * Get all validation error messages
   */
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

  /**
   * Check if Assign button is enabled
   */
  async isAssignButtonEnabled(): Promise<boolean> {
    const button = await this.healer.locate(this.assignButtonDef);
    return await button.isEnabled();
  }

  /**
   * Check if Employee Name autocomplete is visible
   */
  async isAutocompleteVisible(): Promise<boolean> {
    const autocomplete = this.page.locator('.oxd-autocomplete-dropdown');
    return await autocomplete.isVisible();
  }

  /**
   * Get autocomplete suggestions
   */
  async getAutocompleteSuggestions(): Promise<string[]> {
    const options = this.page.locator('.oxd-autocomplete-option');
    const count = await options.count();
    const suggestions: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await options.nth(i).textContent();
      if (text) suggestions.push(text.trim());
    }
    return suggestions;
  }

  /**
   * Select Partial Days option
   */
  async selectPartialDays(option: string): Promise<void> {
    await this.healer.click(this.partialDaysDropdownDef);
    await this.page.locator(`.oxd-select-option:has-text("${option}")`).click();
  }
}
