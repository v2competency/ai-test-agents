// pages/ApplyLeavePage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ElementDefinition } from '../utils/SelfHealingLocator';

export class ApplyLeavePage extends BasePage {
  readonly pageUrl = '/orangehrm/web/index.php/leave/applyLeave';

  // Element definitions
  private readonly leaveTypeDropdownDef: ElementDefinition = {
    name: 'leaveTypeDropdown',
    description: 'Leave Type dropdown selector',
    primary: '.oxd-form-row:has-text("Leave Type") .oxd-select-wrapper',
    fallbacks: [
      '.oxd-select-text-input',
      '.oxd-select-wrapper:first-of-type',
      '[class*="select"]:has-text("Select")'
    ],
    type: 'dropdown'
  };

  private readonly leaveBalanceDef: ElementDefinition = {
    name: 'leaveBalance',
    description: 'Leave Balance display',
    primary: '.oxd-form-row:has-text("Leave Balance") .oxd-text',
    fallbacks: [
      '.orangehrm-leave-balance-text',
      '[class*="balance"]',
      'p:has-text("Day(s)")'
    ],
    type: 'text'
  };

  private readonly fromDateInputDef: ElementDefinition = {
    name: 'fromDateInput',
    description: 'From Date input field',
    primary: '.oxd-form-row:has-text("From Date") input',
    fallbacks: [
      'input[placeholder="yyyy-mm-dd"]:first-of-type',
      '.oxd-date-input input:first-of-type'
    ],
    type: 'input'
  };

  private readonly toDateInputDef: ElementDefinition = {
    name: 'toDateInput',
    description: 'To Date input field',
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
      '[class*="textarea"]',
      'textarea[placeholder]'
    ],
    type: 'textarea'
  };

  private readonly applyButtonDef: ElementDefinition = {
    name: 'applyButton',
    description: 'Apply button',
    primary: 'button[type="submit"]',
    fallbacks: [
      'button:has-text("Apply")',
      '.oxd-button--secondary:has-text("Apply")'
    ],
    type: 'button'
  };

  private readonly cancelButtonDef: ElementDefinition = {
    name: 'cancelButton',
    description: 'Cancel button',
    primary: 'button[type="button"]:has-text("Cancel")',
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
      'span.oxd-text--span:has-text("Required")'
    ],
    type: 'text'
  };

  private readonly partialDayDropdownDef: ElementDefinition = {
    name: 'partialDayDropdown',
    description: 'Partial Days dropdown',
    primary: '.oxd-form-row:has-text("Partial Days") .oxd-select-wrapper',
    fallbacks: [
      '.oxd-select-wrapper:has-text("Partial")'
    ],
    type: 'dropdown'
  };

  private readonly durationDropdownDef: ElementDefinition = {
    name: 'durationDropdown',
    description: 'Duration dropdown',
    primary: '.oxd-form-row:has-text("Duration") .oxd-select-wrapper',
    fallbacks: [
      '.oxd-select-wrapper:has-text("Duration")'
    ],
    type: 'dropdown'
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to Apply Leave page
   */
  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  /**
   * Check if on Apply Leave page
   */
  async isOnApplyLeavePage(): Promise<boolean> {
    return this.page.url().includes('/leave/applyLeave');
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
   * Click Apply button
   */
  async clickApply(): Promise<void> {
    await this.healer.click(this.applyButtonDef);
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
   * Apply Leave with full data
   */
  async applyLeave(data: {
    leaveType: string;
    fromDate: string;
    toDate: string;
    comments?: string;
  }): Promise<void> {
    await this.selectLeaveType(data.leaveType);
    await this.enterFromDate(data.fromDate);
    await this.enterToDate(data.toDate);
    if (data.comments) {
      await this.enterComments(data.comments);
    }
    await this.clickApply();
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
   * Check if Leave Type dropdown is visible
   */
  async isLeaveTypeDropdownVisible(): Promise<boolean> {
    return await this.healer.isVisible(this.leaveTypeDropdownDef);
  }

  /**
   * Check if Apply button is enabled
   */
  async isApplyButtonEnabled(): Promise<boolean> {
    const button = await this.healer.locate(this.applyButtonDef);
    return await button.isEnabled();
  }

  /**
   * Get date placeholder text
   */
  async getDatePlaceholder(): Promise<string> {
    const input = await this.healer.locate(this.fromDateInputDef);
    return await input.getAttribute('placeholder') || '';
  }

  /**
   * Select Partial Day option
   */
  async selectPartialDay(option: string): Promise<void> {
    await this.healer.click(this.partialDayDropdownDef);
    await this.page.locator(`.oxd-select-option:has-text("${option}")`).click();
  }
}
