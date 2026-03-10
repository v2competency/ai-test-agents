// pages/AddProjectPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ElementDefinition } from '../utils/SelfHealingLocator';

export interface AddProjectData {
  project: string;
  country?: string;
  currency?: string;
  unit?: string;
  description?: string;
}

export class AddProjectPage extends BasePage {
  // ============================================================
  // Element Definitions
  // ============================================================
  private readonly projectNameInputDef: ElementDefinition = {
    name: 'projectNameInput',
    description: 'Project Name text input field on the Add Project form (required, max 50 chars)',
    primary: 'input[name="ProjectName"], input[name="projectName"]',
    fallbacks: [
      '#ProjectName',
      'input[placeholder*="Project Name" i]',
      'input[formcontrolname="projectName"]',
      'label:has-text("Project Name") + input',
      'input[maxlength="50"]'
    ],
    type: 'input'
  };

  private readonly countryDropdownDef: ElementDefinition = {
    name: 'countryDropdown',
    description: 'Country dropdown selector on the Add Project form',
    primary: 'select[name="Country"], select[name="country"]',
    fallbacks: [
      '#Country',
      'select[formcontrolname="country"]',
      'label:has-text("Country") + select',
      'label:has-text("Country") ~ select',
      '[data-field="country"] select'
    ],
    type: 'dropdown'
  };

  private readonly currencyDropdownDef: ElementDefinition = {
    name: 'currencyDropdown',
    description: 'Currency dropdown selector on the Add Project form',
    primary: 'select[name="Currency"], select[name="currency"]',
    fallbacks: [
      '#Currency',
      'select[formcontrolname="currency"]',
      'label:has-text("Currency") + select',
      'label:has-text("Currency") ~ select',
      '[data-field="currency"] select'
    ],
    type: 'dropdown'
  };

  private readonly unitDropdownDef: ElementDefinition = {
    name: 'unitDropdown',
    description: 'Unit dropdown (Metres/Feet) on the Add Project form',
    primary: 'select[name="Unit"], select[name="unit"]',
    fallbacks: [
      '#Unit',
      'select[formcontrolname="unit"]',
      'label:has-text("Unit") + select',
      'label:has-text("Unit") ~ select',
      '[data-field="unit"] select'
    ],
    type: 'dropdown'
  };

  private readonly descriptionTextareaDef: ElementDefinition = {
    name: 'descriptionTextarea',
    description: 'Description textarea field on the Add Project form (max 250 chars)',
    primary: 'textarea[name="Description"], textarea[name="description"]',
    fallbacks: [
      '#Description',
      'textarea[formcontrolname="description"]',
      'label:has-text("Description") + textarea',
      'label:has-text("Description") ~ textarea',
      'textarea[maxlength="250"]'
    ],
    type: 'textarea'
  };

  private readonly projectGroupDropdownDef: ElementDefinition = {
    name: 'projectGroupDropdown',
    description: 'Project Group dropdown on the Add Project form',
    primary: 'select[name="ProjectGroup"], select[name="projectGroup"]',
    fallbacks: [
      '#ProjectGroup',
      'select[formcontrolname="projectGroup"]',
      'label:has-text("Project Group") + select',
      'label:has-text("Project Group") ~ select',
      '[data-field="projectGroup"] select'
    ],
    type: 'dropdown'
  };

  private readonly projectRegionDropdownDef: ElementDefinition = {
    name: 'projectRegionDropdown',
    description: 'Project Region dropdown on the Add Project form',
    primary: 'select[name="ProjectRegion"], select[name="projectRegion"]',
    fallbacks: [
      '#ProjectRegion',
      'select[formcontrolname="projectRegion"]',
      'label:has-text("Project Region") + select',
      'label:has-text("Project Region") ~ select',
      '[data-field="projectRegion"] select'
    ],
    type: 'dropdown'
  };

  private readonly mineGridOffsetInputDef: ElementDefinition = {
    name: 'mineGridOffsetInput',
    description: 'Mine Grid Offset number input (-180 to 180) on the Add Project form',
    primary: 'input[name="MineGridOffset"], input[name="mineGridOffset"]',
    fallbacks: [
      '#MineGridOffset',
      'input[formcontrolname="mineGridOffset"]',
      'label:has-text("Mine Grid Offset") + input',
      'label:has-text("Mine Grid Offset") ~ input',
      '[data-field="mineGridOffset"] input'
    ],
    type: 'input'
  };

  private readonly declinationOffsetInputDef: ElementDefinition = {
    name: 'declinationOffsetInput',
    description: 'Declination Offset number input (-180 to 180) on the Add Project form',
    primary: 'input[name="DeclinationOffset"], input[name="declinationOffset"]',
    fallbacks: [
      '#DeclinationOffset',
      'input[formcontrolname="declinationOffset"]',
      'label:has-text("Declination Offset") + input',
      'label:has-text("Declination Offset") ~ input',
      '[data-field="declinationOffset"] input'
    ],
    type: 'input'
  };

  private readonly approveSurveysDropdownDef: ElementDefinition = {
    name: 'approveSurveysDropdown',
    description: 'Approve Surveys dropdown on the Add Project form',
    primary: 'select[name="ApproveSurveys"], select[name="approveSurveys"]',
    fallbacks: [
      '#ApproveSurveys',
      'select[formcontrolname="approveSurveys"]',
      'label:has-text("Approve Surveys") + select',
      'label:has-text("Approve Surveys") ~ select',
      '[data-field="approveSurveys"] select'
    ],
    type: 'dropdown'
  };

  private readonly azimuthModeDropdownDef: ElementDefinition = {
    name: 'azimuthModeDropdown',
    description: 'Approve Surveys Default Azimuth Mode dropdown on the Add Project form',
    primary: 'select[name="AzimuthMode"], select[name="azimuthMode"]',
    fallbacks: [
      '#AzimuthMode',
      'select[formcontrolname="azimuthMode"]',
      'label:has-text("Azimuth Mode") + select',
      'label:has-text("Default Azimuth Mode") ~ select',
      '[data-field="azimuthMode"] select'
    ],
    type: 'dropdown'
  };

  private readonly fieldAppAzimuthModeDropdownDef: ElementDefinition = {
    name: 'fieldAppAzimuthModeDropdown',
    description: 'Field App Azimuth Mode dropdown on the Add Project form',
    primary: 'select[name="FieldAppAzimuthMode"], select[name="fieldAppAzimuthMode"]',
    fallbacks: [
      '#FieldAppAzimuthMode',
      'select[formcontrolname="fieldAppAzimuthMode"]',
      'label:has-text("Field App Azimuth Mode") + select',
      'label:has-text("Field App Azimuth Mode") ~ select',
      '[data-field="fieldAppAzimuthMode"] select'
    ],
    type: 'dropdown'
  };

  private readonly applyFieldAppAzimuthModeCheckboxDef: ElementDefinition = {
    name: 'applyFieldAppAzimuthModeCheckbox',
    description: 'Apply Field App Azimuth Mode to magnetic tool checkbox on the Add Project form',
    primary: 'input[type="checkbox"][name*="ApplyFieldApp" i]',
    fallbacks: [
      '#ApplyFieldAppAzimuthMode',
      'input[formcontrolname="applyFieldAppAzimuthMode"]',
      'label:has-text("Apply Field App Azimuth Mode") input[type="checkbox"]',
      'label:has-text("magnetic tool") input[type="checkbox"]',
      '[data-field="applyFieldAppAzimuthMode"] input'
    ],
    type: 'checkbox'
  };

  // QA Settings fields
  private readonly dipToleranceInputDef: ElementDefinition = {
    name: 'dipToleranceInput',
    description: 'Dip Tolerance number input (0-10) in QA Settings section',
    primary: 'input[name="DipTolerance"], input[name="dipTolerance"]',
    fallbacks: [
      '#DipTolerance',
      'input[formcontrolname="dipTolerance"]',
      'label:has-text("Dip Tolerance") + input',
      'label:has-text("Dip Tolerance") ~ input',
      '[data-field="dipTolerance"] input'
    ],
    type: 'input'
  };

  private readonly azimuthToleranceInputDef: ElementDefinition = {
    name: 'azimuthToleranceInput',
    description: 'Azimuth Tolerance number input (0-10) in QA Settings section',
    primary: 'input[name="AzimuthTolerance"], input[name="azimuthTolerance"]',
    fallbacks: [
      '#AzimuthTolerance',
      'input[formcontrolname="azimuthTolerance"]',
      'label:has-text("Azimuth Tolerance") + input',
      'label:has-text("Azimuth Tolerance") ~ input',
      '[data-field="azimuthTolerance"] input'
    ],
    type: 'input'
  };

  private readonly targetToleranceInputDef: ElementDefinition = {
    name: 'targetToleranceInput',
    description: 'Target Tolerance number input (0-50) in QA Settings section',
    primary: 'input[name="TargetTolerance"], input[name="targetTolerance"]',
    fallbacks: [
      '#TargetTolerance',
      'input[formcontrolname="targetTolerance"]',
      'label:has-text("Target Tolerance") + input',
      'label:has-text("Target Tolerance") ~ input',
      '[data-field="targetTolerance"] input'
    ],
    type: 'input'
  };

  private readonly magneticDipInputDef: ElementDefinition = {
    name: 'magneticDipInput',
    description: 'Magnetic Dip number input (-90 to 90) in QA Settings section',
    primary: 'input[name="MagneticDip"], input[name="magneticDip"]',
    fallbacks: [
      '#MagneticDip',
      'input[formcontrolname="magneticDip"]',
      'label:has-text("Magnetic Dip") + input',
      'label:has-text("Magnetic Dip") ~ input',
      '[data-field="magneticDip"] input'
    ],
    type: 'input'
  };

  private readonly magneticFieldInputDef: ElementDefinition = {
    name: 'magneticFieldInput',
    description: 'Magnetic Field number input (0-90000) in QA Settings section',
    primary: 'input[name="MagneticField"], input[name="magneticField"]',
    fallbacks: [
      '#MagneticField',
      'input[formcontrolname="magneticField"]',
      'label:has-text("Magnetic Field") + input',
      'label:has-text("Magnetic Field") ~ input',
      '[data-field="magneticField"] input'
    ],
    type: 'input'
  };

  private readonly magneticDipToleranceInputDef: ElementDefinition = {
    name: 'magneticDipToleranceInput',
    description: 'Magnetic Dip Tolerance number input (0-2) in QA Settings section',
    primary: 'input[name="MagneticDipTolerance"], input[name="magneticDipTolerance"]',
    fallbacks: [
      '#MagneticDipTolerance',
      'input[formcontrolname="magneticDipTolerance"]',
      'label:has-text("Magnetic Dip Tolerance") + input',
      'label:has-text("Magnetic Dip Tolerance") ~ input',
      '[data-field="magneticDipTolerance"] input'
    ],
    type: 'input'
  };

  private readonly addButtonDef: ElementDefinition = {
    name: 'addButton',
    description: 'ADD button to submit the Add Project form',
    primary: 'button:has-text("ADD"), button:has-text("Add")',
    fallbacks: [
      'button[type="submit"]',
      'button:has-text("Save")',
      'button.btn-primary:has-text("Add")',
      'input[type="submit"][value*="Add" i]',
      '[data-action="add"] button'
    ],
    type: 'button'
  };

  private readonly cancelButtonDef: ElementDefinition = {
    name: 'cancelButton',
    description: 'CANCEL button on the Add Project form',
    primary: 'button:has-text("CANCEL"), button:has-text("Cancel")',
    fallbacks: [
      'button[type="button"]:has-text("Cancel")',
      'a:has-text("Cancel")',
      'button.btn-secondary:has-text("Cancel")',
      '[data-action="cancel"] button',
      'button.btn-outline-secondary'
    ],
    type: 'button'
  };

  private readonly validationErrorDef: ElementDefinition = {
    name: 'validationError',
    description: 'Validation error message displayed on the Add Project form',
    primary: '.validation-message, .field-validation-error',
    fallbacks: [
      '.text-danger',
      '.invalid-feedback',
      '.error-message',
      '[class*="validation"]',
      '[class*="error"]',
      '.alert-danger'
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
    await this.page.goto('/Project/Add');
    await this.waitForPageLoad();
  }

  isOnAddProjectPage(): boolean {
    const url = this.getCurrentUrl();
    return url.includes('Project/Add') || url.includes('project/add');
  }

  // ============================================================
  // Actions - Basic Fields
  // ============================================================
  async enterProjectName(name: string): Promise<void> {
    await this.healer.fill(this.projectNameInputDef, name);
  }

  async selectCountry(country: string): Promise<void> {
    await this.healer.click(this.countryDropdownDef);
    const countryOption = this.page.locator(`option:has-text("${country}")`);
    await countryOption.click();
  }

  async selectCurrency(currency: string): Promise<void> {
    await this.healer.click(this.currencyDropdownDef);
    const currencyOption = this.page.locator(`option:has-text("${currency}")`);
    await currencyOption.click();
  }

  async selectUnit(unit: string): Promise<void> {
    await this.healer.click(this.unitDropdownDef);
    const unitOption = this.page.locator(`option:has-text("${unit}")`);
    await unitOption.click();
  }

  async enterDescription(desc: string): Promise<void> {
    await this.healer.fill(this.descriptionTextareaDef, desc);
  }

  async selectProjectGroup(group: string): Promise<void> {
    await this.healer.click(this.projectGroupDropdownDef);
    const groupOption = this.page.locator(`option:has-text("${group}")`);
    await groupOption.click();
  }

  async selectProjectRegion(region: string): Promise<void> {
    await this.healer.click(this.projectRegionDropdownDef);
    const regionOption = this.page.locator(`option:has-text("${region}")`);
    await regionOption.click();
  }

  // ============================================================
  // Actions - Offset Fields
  // ============================================================
  async enterMineGridOffset(value: string): Promise<void> {
    await this.healer.fill(this.mineGridOffsetInputDef, value);
  }

  async enterDeclinationOffset(value: string): Promise<void> {
    await this.healer.fill(this.declinationOffsetInputDef, value);
  }

  // ============================================================
  // Actions - Survey Settings
  // ============================================================
  async selectApproveSurveys(option: string): Promise<void> {
    await this.healer.click(this.approveSurveysDropdownDef);
    const surveyOption = this.page.locator(`option:has-text("${option}")`);
    await surveyOption.click();
  }

  async selectAzimuthMode(mode: string): Promise<void> {
    await this.healer.click(this.azimuthModeDropdownDef);
    const modeOption = this.page.locator(`option:has-text("${mode}")`);
    await modeOption.click();
  }

  async selectFieldAppAzimuthMode(mode: string): Promise<void> {
    await this.healer.click(this.fieldAppAzimuthModeDropdownDef);
    const modeOption = this.page.locator(`option:has-text("${mode}")`);
    await modeOption.click();
  }

  async checkApplyFieldAppAzimuthMode(): Promise<void> {
    await this.healer.click(this.applyFieldAppAzimuthModeCheckboxDef);
  }

  // ============================================================
  // Actions - QA Settings
  // ============================================================
  async enterDipTolerance(val: string): Promise<void> {
    await this.healer.fill(this.dipToleranceInputDef, val);
  }

  async enterAzimuthTolerance(val: string): Promise<void> {
    await this.healer.fill(this.azimuthToleranceInputDef, val);
  }

  async enterTargetTolerance(val: string): Promise<void> {
    await this.healer.fill(this.targetToleranceInputDef, val);
  }

  async enterMagneticDip(val: string): Promise<void> {
    await this.healer.fill(this.magneticDipInputDef, val);
  }

  async enterMagneticField(val: string): Promise<void> {
    await this.healer.fill(this.magneticFieldInputDef, val);
  }

  async enterMagneticDipTolerance(val: string): Promise<void> {
    await this.healer.fill(this.magneticDipToleranceInputDef, val);
  }

  // ============================================================
  // Actions - Form Submission
  // ============================================================
  async clickAdd(): Promise<void> {
    await this.healer.click(this.addButtonDef);
    await this.waitForPageLoad();
  }

  async clickCancel(): Promise<void> {
    await this.healer.click(this.cancelButtonDef);
    await this.waitForPageLoad();
  }

  // ============================================================
  // Assertions / Getters
  // ============================================================
  async getValidationError(): Promise<string> {
    return await this.healer.getText(this.validationErrorDef);
  }

  async isValidationErrorDisplayed(): Promise<boolean> {
    return await this.healer.isVisible(this.validationErrorDef);
  }

  // ============================================================
  // Convenience Method
  // ============================================================
  async addProject(data: AddProjectData): Promise<void> {
    await this.enterProjectName(data.project);

    if (data.country) {
      await this.selectCountry(data.country);
    }
    if (data.currency) {
      await this.selectCurrency(data.currency);
    }
    if (data.unit) {
      await this.selectUnit(data.unit);
    }
    if (data.description) {
      await this.enterDescription(data.description);
    }

    await this.clickAdd();
  }
}
