// pages/AddDrillholePage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ElementDefinition } from '../utils/SelfHealingLocator';

export interface AddDrillholeData {
  project: string;
  drillholeName: string;
  holeType?: string;
  dip?: string;
  trueNorthAzimuth?: string;
  plannedDepth?: string;
  preCollarDepth?: string;
  grid?: string;
  collarElevation?: string;
  latitude?: string;
  longitude?: string;
  targetX?: string;
  targetY?: string;
  targetZ?: string;
  program?: string;
  group?: string;
  tenement?: string;
}

export class AddDrillholePage extends BasePage {
  // ============================================================
  // Element Definitions
  // ============================================================
  private readonly projectDropdownDef: ElementDefinition = {
    name: 'projectDropdown',
    description: 'Project dropdown selector on the Add Drillhole form (required)',
    primary: 'select[name="Project"], select[name="project"]',
    fallbacks: [
      '#Project',
      'select[formcontrolname="project"]',
      'label:has-text("Project") + select',
      'label:has-text("Project") ~ select',
      '[data-field="project"] select'
    ],
    type: 'dropdown'
  };

  private readonly drillholeNameInputDef: ElementDefinition = {
    name: 'drillholeNameInput',
    description: 'Drillhole Name text input field on the Add Drillhole form (required, max 50 chars)',
    primary: 'input[name="DrillholeName"], input[name="drillholeName"]',
    fallbacks: [
      '#DrillholeName',
      'input[formcontrolname="drillholeName"]',
      'input[placeholder*="Drillhole Name" i]',
      'label:has-text("Drillhole Name") + input',
      'label:has-text("Drillhole Name") ~ input'
    ],
    type: 'input'
  };

  private readonly holeTypeDropdownDef: ElementDefinition = {
    name: 'holeTypeDropdown',
    description: 'Hole Type dropdown (Diamond, RC, etc.) on the Add Drillhole form',
    primary: 'select[name="HoleType"], select[name="holeType"]',
    fallbacks: [
      '#HoleType',
      'select[formcontrolname="holeType"]',
      'label:has-text("Hole Type") + select',
      'label:has-text("Hole Type") ~ select',
      '[data-field="holeType"] select'
    ],
    type: 'dropdown'
  };

  private readonly dipInputDef: ElementDefinition = {
    name: 'dipInput',
    description: 'Dip number input (-90 to 90, 3 decimal places) on the Add Drillhole form',
    primary: 'input[name="Dip"], input[name="dip"]',
    fallbacks: [
      '#Dip',
      'input[formcontrolname="dip"]',
      'label:has-text("Dip") + input',
      'label:has-text("Dip") ~ input',
      '[data-field="dip"] input'
    ],
    type: 'input'
  };

  private readonly trueNorthAzimuthInputDef: ElementDefinition = {
    name: 'trueNorthAzimuthInput',
    description: 'True North Azimuth number input (0-360) on the Add Drillhole form',
    primary: 'input[name="TrueNorthAzimuth"], input[name="trueNorthAzimuth"]',
    fallbacks: [
      '#TrueNorthAzimuth',
      'input[formcontrolname="trueNorthAzimuth"]',
      'label:has-text("True North Azimuth") + input',
      'label:has-text("True North Azimuth") ~ input',
      '[data-field="trueNorthAzimuth"] input'
    ],
    type: 'input'
  };

  private readonly plannedDepthInputDef: ElementDefinition = {
    name: 'plannedDepthInput',
    description: 'Planned Depth number input (0-25000, 3 decimal places) on the Add Drillhole form',
    primary: 'input[name="PlannedDepth"], input[name="plannedDepth"]',
    fallbacks: [
      '#PlannedDepth',
      'input[formcontrolname="plannedDepth"]',
      'label:has-text("Planned Depth") + input',
      'label:has-text("Planned Depth") ~ input',
      '[data-field="plannedDepth"] input'
    ],
    type: 'input'
  };

  private readonly preCollarDepthInputDef: ElementDefinition = {
    name: 'preCollarDepthInput',
    description: 'Pre-Collar Depth number input on the Add Drillhole form',
    primary: 'input[name="PreCollarDepth"], input[name="preCollarDepth"]',
    fallbacks: [
      '#PreCollarDepth',
      'input[formcontrolname="preCollarDepth"]',
      'label:has-text("Pre-Collar Depth") + input',
      'label:has-text("Pre-Collar Depth") ~ input',
      '[data-field="preCollarDepth"] input'
    ],
    type: 'input'
  };

  private readonly gridDropdownDef: ElementDefinition = {
    name: 'gridDropdown',
    description: 'Grid dropdown selector on the Add Drillhole form',
    primary: 'select[name="Grid"], select[name="grid"]',
    fallbacks: [
      '#Grid',
      'select[formcontrolname="grid"]',
      'label:has-text("Grid") + select',
      'label:has-text("Grid") ~ select',
      '[data-field="grid"] select'
    ],
    type: 'dropdown'
  };

  private readonly collarElevationInputDef: ElementDefinition = {
    name: 'collarElevationInput',
    description: 'Collar Elevation number input (max 100000) on the Add Drillhole form',
    primary: 'input[name="CollarElevation"], input[name="collarElevation"]',
    fallbacks: [
      '#CollarElevation',
      'input[formcontrolname="collarElevation"]',
      'label:has-text("Collar Elevation") + input',
      'label:has-text("Collar Elevation") ~ input',
      '[data-field="collarElevation"] input'
    ],
    type: 'input'
  };

  private readonly latitudeInputDef: ElementDefinition = {
    name: 'latitudeInput',
    description: 'Latitude number input (-90 to 90, 5 decimal places) on the Add Drillhole form',
    primary: 'input[name="Latitude"], input[name="latitude"]',
    fallbacks: [
      '#Latitude',
      'input[formcontrolname="latitude"]',
      'label:has-text("Latitude") + input',
      'label:has-text("Latitude") ~ input',
      '[data-field="latitude"] input'
    ],
    type: 'input'
  };

  private readonly longitudeInputDef: ElementDefinition = {
    name: 'longitudeInput',
    description: 'Longitude number input (-180 to 180, 5 decimal places) on the Add Drillhole form',
    primary: 'input[name="Longitude"], input[name="longitude"]',
    fallbacks: [
      '#Longitude',
      'input[formcontrolname="longitude"]',
      'label:has-text("Longitude") + input',
      'label:has-text("Longitude") ~ input',
      '[data-field="longitude"] input'
    ],
    type: 'input'
  };

  private readonly targetXInputDef: ElementDefinition = {
    name: 'targetXInput',
    description: 'Target X coordinate input on the Add Drillhole form',
    primary: 'input[name="TargetX"], input[name="targetX"]',
    fallbacks: [
      '#TargetX',
      'input[formcontrolname="targetX"]',
      'label:has-text("Target X") + input',
      'label:has-text("Target X") ~ input',
      '[data-field="targetX"] input'
    ],
    type: 'input'
  };

  private readonly targetYInputDef: ElementDefinition = {
    name: 'targetYInput',
    description: 'Target Y coordinate input on the Add Drillhole form',
    primary: 'input[name="TargetY"], input[name="targetY"]',
    fallbacks: [
      '#TargetY',
      'input[formcontrolname="targetY"]',
      'label:has-text("Target Y") + input',
      'label:has-text("Target Y") ~ input',
      '[data-field="targetY"] input'
    ],
    type: 'input'
  };

  private readonly targetZInputDef: ElementDefinition = {
    name: 'targetZInput',
    description: 'Target Z coordinate input on the Add Drillhole form',
    primary: 'input[name="TargetZ"], input[name="targetZ"]',
    fallbacks: [
      '#TargetZ',
      'input[formcontrolname="targetZ"]',
      'label:has-text("Target Z") + input',
      'label:has-text("Target Z") ~ input',
      '[data-field="targetZ"] input'
    ],
    type: 'input'
  };

  private readonly programDropdownDef: ElementDefinition = {
    name: 'programDropdown',
    description: 'Program dropdown selector on the Add Drillhole form',
    primary: 'select[name="Program"], select[name="program"]',
    fallbacks: [
      '#Program',
      'select[formcontrolname="program"]',
      'label:has-text("Program") + select',
      'label:has-text("Program") ~ select',
      '[data-field="program"] select'
    ],
    type: 'dropdown'
  };

  private readonly groupDropdownDef: ElementDefinition = {
    name: 'groupDropdown',
    description: 'Group dropdown selector on the Add Drillhole form',
    primary: 'select[name="Group"], select[name="group"]',
    fallbacks: [
      '#Group',
      'select[formcontrolname="group"]',
      'label:has-text("Group") + select',
      'label:has-text("Group") ~ select',
      '[data-field="group"] select'
    ],
    type: 'dropdown'
  };

  private readonly tenementDropdownDef: ElementDefinition = {
    name: 'tenementDropdown',
    description: 'Tenement dropdown selector on the Add Drillhole form',
    primary: 'select[name="Tenement"], select[name="tenement"]',
    fallbacks: [
      '#Tenement',
      'select[formcontrolname="tenement"]',
      'label:has-text("Tenement") + select',
      'label:has-text("Tenement") ~ select',
      '[data-field="tenement"] select'
    ],
    type: 'dropdown'
  };

  private readonly addButtonDef: ElementDefinition = {
    name: 'addButton',
    description: 'Add button to submit the Add Drillhole form',
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

  private readonly addAnotherButtonDef: ElementDefinition = {
    name: 'addAnotherButton',
    description: 'Add Another button to submit and stay on the Add Drillhole form',
    primary: 'button:has-text("Add another"), button:has-text("ADD ANOTHER")',
    fallbacks: [
      'button:has-text("Add Another")',
      'button:has-text("Save & Add")',
      'button.btn-secondary:has-text("another")',
      '[data-action="addAnother"] button',
      'button:has-text("Save and Add")'
    ],
    type: 'button'
  };

  private readonly cancelButtonDef: ElementDefinition = {
    name: 'cancelButton',
    description: 'Cancel button on the Add Drillhole form',
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
    description: 'Validation error message displayed on the Add Drillhole form',
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
    await this.page.goto('/Drillhole/Add');
    await this.waitForPageLoad();
  }

  isOnAddDrillholePage(): boolean {
    const url = this.getCurrentUrl();
    return url.includes('Drillhole/Add') || url.includes('drillhole/add');
  }

  // ============================================================
  // Actions - Core Fields
  // ============================================================
  async selectProject(name: string): Promise<void> {
    await this.healer.click(this.projectDropdownDef);
    const projectOption = this.page.locator(`option:has-text("${name}")`);
    await projectOption.click();
  }

  async enterDrillholeName(name: string): Promise<void> {
    await this.healer.fill(this.drillholeNameInputDef, name);
  }

  async selectHoleType(type: string): Promise<void> {
    await this.healer.click(this.holeTypeDropdownDef);
    const typeOption = this.page.locator(`option:has-text("${type}")`);
    await typeOption.click();
  }

  // ============================================================
  // Actions - Survey Fields
  // ============================================================
  async enterDip(val: string): Promise<void> {
    await this.healer.fill(this.dipInputDef, val);
  }

  async enterTrueNorthAzimuth(val: string): Promise<void> {
    await this.healer.fill(this.trueNorthAzimuthInputDef, val);
  }

  async enterPlannedDepth(val: string): Promise<void> {
    await this.healer.fill(this.plannedDepthInputDef, val);
  }

  async enterPreCollarDepth(val: string): Promise<void> {
    await this.healer.fill(this.preCollarDepthInputDef, val);
  }

  // ============================================================
  // Actions - Location Fields
  // ============================================================
  async selectGrid(grid: string): Promise<void> {
    await this.healer.click(this.gridDropdownDef);
    const gridOption = this.page.locator(`option:has-text("${grid}")`);
    await gridOption.click();
  }

  async enterCollarElevation(val: string): Promise<void> {
    await this.healer.fill(this.collarElevationInputDef, val);
  }

  async enterLatitude(val: string): Promise<void> {
    await this.healer.fill(this.latitudeInputDef, val);
  }

  async enterLongitude(val: string): Promise<void> {
    await this.healer.fill(this.longitudeInputDef, val);
  }

  // ============================================================
  // Actions - Target Coordinates
  // ============================================================
  async enterTargetX(val: string): Promise<void> {
    await this.healer.fill(this.targetXInputDef, val);
  }

  async enterTargetY(val: string): Promise<void> {
    await this.healer.fill(this.targetYInputDef, val);
  }

  async enterTargetZ(val: string): Promise<void> {
    await this.healer.fill(this.targetZInputDef, val);
  }

  // ============================================================
  // Actions - Classification Dropdowns
  // ============================================================
  async selectProgram(program: string): Promise<void> {
    await this.healer.click(this.programDropdownDef);
    const programOption = this.page.locator(`option:has-text("${program}")`);
    await programOption.click();
  }

  async selectGroup(group: string): Promise<void> {
    await this.healer.click(this.groupDropdownDef);
    const groupOption = this.page.locator(`option:has-text("${group}")`);
    await groupOption.click();
  }

  async selectTenement(tenement: string): Promise<void> {
    await this.healer.click(this.tenementDropdownDef);
    const tenementOption = this.page.locator(`option:has-text("${tenement}")`);
    await tenementOption.click();
  }

  // ============================================================
  // Actions - Form Submission
  // ============================================================
  async clickAdd(): Promise<void> {
    await this.healer.click(this.addButtonDef);
    await this.waitForPageLoad();
  }

  async clickAddAnother(): Promise<void> {
    await this.healer.click(this.addAnotherButtonDef);
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
  async addDrillhole(data: AddDrillholeData): Promise<void> {
    await this.selectProject(data.project);
    await this.enterDrillholeName(data.drillholeName);

    if (data.holeType) {
      await this.selectHoleType(data.holeType);
    }
    if (data.dip) {
      await this.enterDip(data.dip);
    }
    if (data.trueNorthAzimuth) {
      await this.enterTrueNorthAzimuth(data.trueNorthAzimuth);
    }
    if (data.plannedDepth) {
      await this.enterPlannedDepth(data.plannedDepth);
    }
    if (data.preCollarDepth) {
      await this.enterPreCollarDepth(data.preCollarDepth);
    }
    if (data.grid) {
      await this.selectGrid(data.grid);
    }
    if (data.collarElevation) {
      await this.enterCollarElevation(data.collarElevation);
    }
    if (data.latitude) {
      await this.enterLatitude(data.latitude);
    }
    if (data.longitude) {
      await this.enterLongitude(data.longitude);
    }
    if (data.targetX) {
      await this.enterTargetX(data.targetX);
    }
    if (data.targetY) {
      await this.enterTargetY(data.targetY);
    }
    if (data.targetZ) {
      await this.enterTargetZ(data.targetZ);
    }
    if (data.program) {
      await this.selectProgram(data.program);
    }
    if (data.group) {
      await this.selectGroup(data.group);
    }
    if (data.tenement) {
      await this.selectTenement(data.tenement);
    }

    await this.clickAdd();
  }
}
