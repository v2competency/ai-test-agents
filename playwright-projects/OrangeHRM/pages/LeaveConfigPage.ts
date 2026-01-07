// pages/LeaveConfigPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ElementDefinition } from '../utils/SelfHealingLocator';

export class LeaveConfigPage extends BasePage {
  readonly leavePeriodUrl = '/web/index.php/leave/defineLeavePeriod';
  readonly leaveTypesUrl = '/web/index.php/leave/leaveTypeList';
  readonly workWeekUrl = '/web/index.php/leave/defineWorkWeek';
  readonly holidaysUrl = '/web/index.php/leave/viewHolidayList';

  // Leave Period elements
  private readonly startMonthDropdownDef: ElementDefinition = {
    name: 'startMonthDropdown',
    description: 'Start Month dropdown',
    primary: '.oxd-form-row:has-text("Start Month") .oxd-select-wrapper',
    fallbacks: ['.oxd-select-wrapper:first-of-type'],
    type: 'dropdown'
  };

  private readonly startDateDropdownDef: ElementDefinition = {
    name: 'startDateDropdown',
    description: 'Start Date dropdown',
    primary: '.oxd-form-row:has-text("Start Date") .oxd-select-wrapper',
    fallbacks: ['.oxd-select-wrapper:last-of-type'],
    type: 'dropdown'
  };

  private readonly currentLeavePeriodDef: ElementDefinition = {
    name: 'currentLeavePeriod',
    description: 'Current Leave Period display',
    primary: '.oxd-form-row:has-text("Current Leave Period") .oxd-text',
    fallbacks: ['p:has-text("to")'],
    type: 'text'
  };

  // Leave Types elements
  private readonly addLeaveTypeButtonDef: ElementDefinition = {
    name: 'addLeaveTypeButton',
    description: 'Add Leave Type button',
    primary: 'button:has-text("Add")',
    fallbacks: ['.oxd-button--secondary:has-text("Add")', '.orangehrm-header-container button'],
    type: 'button'
  };

  private readonly leaveTypeNameInputDef: ElementDefinition = {
    name: 'leaveTypeNameInput',
    description: 'Leave Type name input',
    primary: '.oxd-form-row:has-text("Name") input',
    fallbacks: ['input.oxd-input', '.oxd-input:first-of-type'],
    type: 'input'
  };

  private readonly leaveTypesTableDef: ElementDefinition = {
    name: 'leaveTypesTable',
    description: 'Leave Types table',
    primary: '.oxd-table-body',
    fallbacks: ['[class*="table-body"]', '.orangehrm-container table'],
    type: 'container'
  };

  // Work Week elements
  private readonly mondayDropdownDef: ElementDefinition = {
    name: 'mondayDropdown',
    description: 'Monday work day dropdown',
    primary: '.oxd-form-row:has-text("Monday") .oxd-select-wrapper',
    fallbacks: [],
    type: 'dropdown'
  };

  private readonly tuesdayDropdownDef: ElementDefinition = {
    name: 'tuesdayDropdown',
    description: 'Tuesday work day dropdown',
    primary: '.oxd-form-row:has-text("Tuesday") .oxd-select-wrapper',
    fallbacks: [],
    type: 'dropdown'
  };

  private readonly wednesdayDropdownDef: ElementDefinition = {
    name: 'wednesdayDropdown',
    description: 'Wednesday work day dropdown',
    primary: '.oxd-form-row:has-text("Wednesday") .oxd-select-wrapper',
    fallbacks: [],
    type: 'dropdown'
  };

  private readonly thursdayDropdownDef: ElementDefinition = {
    name: 'thursdayDropdown',
    description: 'Thursday work day dropdown',
    primary: '.oxd-form-row:has-text("Thursday") .oxd-select-wrapper',
    fallbacks: [],
    type: 'dropdown'
  };

  private readonly fridayDropdownDef: ElementDefinition = {
    name: 'fridayDropdown',
    description: 'Friday work day dropdown',
    primary: '.oxd-form-row:has-text("Friday") .oxd-select-wrapper',
    fallbacks: [],
    type: 'dropdown'
  };

  private readonly saturdayDropdownDef: ElementDefinition = {
    name: 'saturdayDropdown',
    description: 'Saturday work day dropdown',
    primary: '.oxd-form-row:has-text("Saturday") .oxd-select-wrapper',
    fallbacks: [],
    type: 'dropdown'
  };

  private readonly sundayDropdownDef: ElementDefinition = {
    name: 'sundayDropdown',
    description: 'Sunday work day dropdown',
    primary: '.oxd-form-row:has-text("Sunday") .oxd-select-wrapper',
    fallbacks: [],
    type: 'dropdown'
  };

  // Holidays elements
  private readonly addHolidayButtonDef: ElementDefinition = {
    name: 'addHolidayButton',
    description: 'Add Holiday button',
    primary: 'button:has-text("Add")',
    fallbacks: ['.oxd-button--secondary:has-text("Add")'],
    type: 'button'
  };

  private readonly holidayNameInputDef: ElementDefinition = {
    name: 'holidayNameInput',
    description: 'Holiday name input',
    primary: '.oxd-form-row:has-text("Name") input',
    fallbacks: ['input.oxd-input'],
    type: 'input'
  };

  private readonly holidayDateInputDef: ElementDefinition = {
    name: 'holidayDateInput',
    description: 'Holiday date input',
    primary: '.oxd-form-row:has-text("Date") input',
    fallbacks: ['input[placeholder="yyyy-mm-dd"]'],
    type: 'input'
  };

  private readonly holidaysTableDef: ElementDefinition = {
    name: 'holidaysTable',
    description: 'Holidays table',
    primary: '.oxd-table-body',
    fallbacks: ['[class*="table-body"]'],
    type: 'container'
  };

  // Common elements
  private readonly saveButtonDef: ElementDefinition = {
    name: 'saveButton',
    description: 'Save button',
    primary: 'button[type="submit"]',
    fallbacks: ['button:has-text("Save")', '.oxd-button--secondary:has-text("Save")'],
    type: 'button'
  };

  private readonly resetButtonDef: ElementDefinition = {
    name: 'resetButton',
    description: 'Reset button',
    primary: 'button[type="reset"]',
    fallbacks: ['button:has-text("Reset")', '.oxd-button--ghost:has-text("Reset")'],
    type: 'button'
  };

  private readonly searchButtonDef: ElementDefinition = {
    name: 'searchButton',
    description: 'Search button',
    primary: 'button:has-text("Search")',
    fallbacks: ['.oxd-button--secondary:has-text("Search")'],
    type: 'button'
  };

  private readonly recordCountDef: ElementDefinition = {
    name: 'recordCount',
    description: 'Record count display',
    primary: '.orangehrm-horizontal-padding span',
    fallbacks: ['span:has-text("Record")'],
    type: 'text'
  };

  private readonly deleteIconDef: ElementDefinition = {
    name: 'deleteIcon',
    description: 'Delete action icon',
    primary: '.oxd-icon-button:has(.bi-trash)',
    fallbacks: ['button:has(.bi-trash)', '[class*="trash"]'],
    type: 'button'
  };

  private readonly editIconDef: ElementDefinition = {
    name: 'editIcon',
    description: 'Edit action icon',
    primary: '.oxd-icon-button:has(.bi-pencil)',
    fallbacks: ['button:has(.bi-pencil)', '[class*="pencil"]'],
    type: 'button'
  };

  private readonly confirmDeleteButtonDef: ElementDefinition = {
    name: 'confirmDeleteButton',
    description: 'Confirm delete button in modal',
    primary: '.oxd-dialog button:has-text("Yes, Delete")',
    fallbacks: ['button:has-text("Yes, Delete")', '.oxd-button--label-danger'],
    type: 'button'
  };

  private readonly cancelDeleteButtonDef: ElementDefinition = {
    name: 'cancelDeleteButton',
    description: 'Cancel delete button in modal',
    primary: '.oxd-dialog button:has-text("No, Cancel")',
    fallbacks: ['button:has-text("No, Cancel")'],
    type: 'button'
  };

  constructor(page: Page) {
    super(page);
  }

  // Navigation methods
  async navigateToLeavePeriod(): Promise<void> {
    await this.page.goto(this.leavePeriodUrl);
    await this.waitForPageLoad();
  }

  async navigateToLeaveTypes(): Promise<void> {
    await this.page.goto(this.leaveTypesUrl);
    await this.waitForPageLoad();
  }

  async navigateToWorkWeek(): Promise<void> {
    await this.page.goto(this.workWeekUrl);
    await this.waitForPageLoad();
  }

  async navigateToHolidays(): Promise<void> {
    await this.page.goto(this.holidaysUrl);
    await this.waitForPageLoad();
  }

  // Leave Period methods
  async selectStartMonth(month: string): Promise<void> {
    await this.healer.click(this.startMonthDropdownDef);
    await this.page.locator(`.oxd-select-option:has-text("${month}")`).click();
  }

  async selectStartDate(date: string): Promise<void> {
    await this.healer.click(this.startDateDropdownDef);
    await this.page.locator(`.oxd-select-option:has-text("${date}")`).click();
  }

  async getCurrentLeavePeriod(): Promise<string> {
    return await this.healer.getText(this.currentLeavePeriodDef);
  }

  // Leave Types methods
  async clickAddLeaveType(): Promise<void> {
    await this.healer.click(this.addLeaveTypeButtonDef);
    await this.waitForPageLoad();
  }

  async enterLeaveTypeName(name: string): Promise<void> {
    await this.healer.fill(this.leaveTypeNameInputDef, name);
  }

  async addLeaveType(name: string): Promise<void> {
    await this.clickAddLeaveType();
    await this.enterLeaveTypeName(name);
    await this.clickSave();
  }

  async getLeaveTypesCount(): Promise<number> {
    const text = await this.healer.getText(this.recordCountDef);
    const match = text.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async isLeaveTypeInList(name: string): Promise<boolean> {
    const table = await this.healer.locate(this.leaveTypesTableDef);
    const row = table.locator(`.oxd-table-row:has-text("${name}")`);
    return await row.isVisible();
  }

  async deleteLeaveType(name: string): Promise<void> {
    const table = await this.healer.locate(this.leaveTypesTableDef);
    const row = table.locator(`.oxd-table-row:has-text("${name}")`);
    await row.locator('.oxd-icon-button:has(.bi-trash)').click();
    await this.healer.click(this.confirmDeleteButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  async editLeaveType(oldName: string, newName: string): Promise<void> {
    const table = await this.healer.locate(this.leaveTypesTableDef);
    const row = table.locator(`.oxd-table-row:has-text("${oldName}")`);
    await row.locator('.oxd-icon-button:has(.bi-pencil)').click();
    await this.waitForPageLoad();
    await this.enterLeaveTypeName(newName);
    await this.clickSave();
  }

  // Work Week methods
  async selectDayType(day: string, type: 'Full Day' | 'Half Day' | 'Non-working Day'): Promise<void> {
    const dayDropdowns: Record<string, ElementDefinition> = {
      Monday: this.mondayDropdownDef,
      Tuesday: this.tuesdayDropdownDef,
      Wednesday: this.wednesdayDropdownDef,
      Thursday: this.thursdayDropdownDef,
      Friday: this.fridayDropdownDef,
      Saturday: this.saturdayDropdownDef,
      Sunday: this.sundayDropdownDef
    };

    const dropdown = dayDropdowns[day];
    if (dropdown) {
      await this.healer.click(dropdown);
      await this.page.locator(`.oxd-select-option:has-text("${type}")`).click();
    }
  }

  async configureWorkWeek(config: Record<string, 'Full Day' | 'Half Day' | 'Non-working Day'>): Promise<void> {
    for (const [day, type] of Object.entries(config)) {
      await this.selectDayType(day, type);
    }
    await this.clickSave();
  }

  // Holidays methods
  async clickAddHoliday(): Promise<void> {
    await this.healer.click(this.addHolidayButtonDef);
    await this.waitForPageLoad();
  }

  async enterHolidayName(name: string): Promise<void> {
    await this.healer.fill(this.holidayNameInputDef, name);
  }

  async enterHolidayDate(date: string): Promise<void> {
    const input = await this.healer.locate(this.holidayDateInputDef);
    await input.clear();
    await input.fill(date);
  }

  async addHoliday(name: string, date: string): Promise<void> {
    await this.clickAddHoliday();
    await this.enterHolidayName(name);
    await this.enterHolidayDate(date);
    await this.clickSave();
  }

  async searchHolidays(fromDate: string, toDate: string): Promise<void> {
    const fromInput = this.page.locator('.oxd-form-row:has-text("From") input');
    const toInput = this.page.locator('.oxd-form-row:has-text("To") input');
    await fromInput.fill(fromDate);
    await toInput.fill(toDate);
    await this.healer.click(this.searchButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  // Common methods
  async clickSave(): Promise<void> {
    await this.healer.click(this.saveButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  async clickReset(): Promise<void> {
    await this.healer.click(this.resetButtonDef);
  }

  async isValidationErrorDisplayed(): Promise<boolean> {
    const error = this.page.locator('.oxd-input-field-error-message');
    return await error.isVisible();
  }

  async getValidationError(): Promise<string> {
    const error = this.page.locator('.oxd-input-field-error-message');
    return await error.textContent() || '';
  }
}
