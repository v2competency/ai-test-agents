// pages/CoreOrientationsPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ElementDefinition } from '../utils/SelfHealingLocator';

export class CoreOrientationsPage extends BasePage {
  // ============================================================
  // Element Definitions - Page Actions
  // ============================================================
  private readonly assignButtonDef: ElementDefinition = {
    name: 'assignButton',
    description: 'Assign button on the Core Orientations page to open the assignment modal',
    primary: 'button:has-text("Assign")',
    fallbacks: [
      '.btn-primary:has-text("Assign")',
      'button[class*="assign"]',
      '[data-action="assign"]',
      '.toolbar button:has-text("Assign")'
    ],
    type: 'button'
  };

  private readonly deleteButtonDef: ElementDefinition = {
    name: 'deleteButton',
    description: 'Red delete button for removing selected core orientation assignments',
    primary: 'button:has-text("Delete")',
    fallbacks: [
      '.btn-danger:has-text("Delete")',
      'button[class*="delete"]',
      '[data-action="delete"]',
      '.toolbar button.btn-danger'
    ],
    type: 'button'
  };

  private readonly exportDropdownDef: ElementDefinition = {
    name: 'exportDropdown',
    description: 'Export dropdown button for exporting core orientation data',
    primary: 'button:has-text("Export")',
    fallbacks: [
      '.dropdown-toggle:has-text("Export")',
      'button[class*="export"]',
      '[data-action="export"]',
      '.btn-group:has-text("Export") button'
    ],
    type: 'dropdown'
  };

  // ============================================================
  // Element Definitions - Table
  // ============================================================
  private readonly assignmentsTableDef: ElementDefinition = {
    name: 'assignmentsTable',
    description: 'Core orientations assignments table showing Project, Drillhole, Date columns',
    primary: 'table.table, table[class*="assignments"]',
    fallbacks: [
      '.table-responsive table',
      '[role="grid"]',
      '.ag-root-wrapper',
      'table'
    ],
    type: 'container'
  };

  private readonly rowCheckboxDef: ElementDefinition = {
    name: 'rowCheckbox',
    description: 'Checkbox for selecting a row in the core orientations table',
    primary: 'table tbody input[type="checkbox"]',
    fallbacks: [
      '.ag-selection-checkbox',
      'tbody tr input[type="checkbox"]',
      '[role="row"] input[type="checkbox"]',
      '.row-select-checkbox'
    ],
    type: 'checkbox'
  };

  private readonly selectAllCheckboxDef: ElementDefinition = {
    name: 'selectAllCheckbox',
    description: 'Select all checkbox in the core orientations table header',
    primary: 'table thead input[type="checkbox"]',
    fallbacks: [
      '.ag-header-select-all',
      'th input[type="checkbox"]',
      '[role="columnheader"] input[type="checkbox"]',
      '.select-all-checkbox'
    ],
    type: 'checkbox'
  };

  // ============================================================
  // Element Definitions - Assign Modal
  // ============================================================
  private readonly modalProjectDropdownDef: ElementDefinition = {
    name: 'modalProjectDropdown',
    description: 'Project dropdown selector inside the assign core orientations modal',
    primary: '.modal select[name*="project" i], .modal [class*="project"] select',
    fallbacks: [
      '.modal .form-group:has-text("Project") select',
      '.modal select:first-of-type',
      '.modal [role="dialog"] select[name*="project" i]',
      '.modal [class*="dropdown"]:has-text("Project")'
    ],
    type: 'dropdown'
  };

  private readonly modalDrillholeDropdownDef: ElementDefinition = {
    name: 'modalDrillholeDropdown',
    description: 'Drillhole dropdown selector inside the assign modal, filtered by selected project',
    primary: '.modal select[name*="drillhole" i], .modal [class*="drillhole"] select',
    fallbacks: [
      '.modal .form-group:has-text("Drillhole") select',
      '.modal select:nth-of-type(2)',
      '.modal [role="dialog"] select[name*="drillhole" i]',
      '.modal [class*="dropdown"]:has-text("Drillhole")'
    ],
    type: 'dropdown'
  };

  private readonly modalAddButtonDef: ElementDefinition = {
    name: 'modalAddButton',
    description: 'Add button inside the assign modal to add a drillhole to the assignment list',
    primary: '.modal button:has-text("Add")',
    fallbacks: [
      '.modal .btn:has-text("Add")',
      '.modal [data-action="add"]',
      '[role="dialog"] button:has-text("Add")',
      '.modal-body button:has-text("Add")'
    ],
    type: 'button'
  };

  private readonly modalAssignButtonDef: ElementDefinition = {
    name: 'modalAssignButton',
    description: 'Assign button inside the modal to confirm all core orientation assignments',
    primary: '.modal-footer button:has-text("Assign")',
    fallbacks: [
      '.modal .btn-primary:has-text("Assign")',
      '[role="dialog"] button:has-text("Assign")',
      '.modal-footer .btn-primary',
      '.modal button[class*="confirm"]:has-text("Assign")'
    ],
    type: 'button'
  };

  private readonly modalCancelButtonDef: ElementDefinition = {
    name: 'modalCancelButton',
    description: 'Cancel button inside the assign modal to close without saving',
    primary: '.modal-footer button:has-text("Cancel")',
    fallbacks: [
      '.modal .btn-secondary:has-text("Cancel")',
      '[role="dialog"] button:has-text("Cancel")',
      '.modal-footer .btn-secondary',
      '.modal button[data-dismiss="modal"]'
    ],
    type: 'button'
  };

  // ============================================================
  // Element Definitions - Delete Confirmation
  // ============================================================
  private readonly confirmDeleteButtonDef: ElementDefinition = {
    name: 'confirmDeleteButton',
    description: 'Confirm button in the delete confirmation dialog for core orientations',
    primary: '.modal button:has-text("Confirm"), .modal button:has-text("Yes")',
    fallbacks: [
      '.modal .btn-danger:has-text("Delete")',
      '[role="dialog"] button:has-text("Confirm")',
      '.modal-footer .btn-danger',
      '.swal2-confirm, .confirm-delete'
    ],
    type: 'button'
  };

  // ============================================================
  // Element Definitions - Page Identification
  // ============================================================
  private readonly pageHeadingDef: ElementDefinition = {
    name: 'coreOrientationsHeading',
    description: 'Page heading for the Core Orientations page',
    primary: 'h1:has-text("Core Orientation"), h2:has-text("Core Orientation")',
    fallbacks: [
      '.page-title:has-text("Core Orientation")',
      '.content-header:has-text("Core Orientation")',
      '[class*="heading"]:has-text("Core Orientation")',
      'h3:has-text("Core Orientation")'
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
    await this.page.goto('/Assign/CoreOrientations');
    await this.waitForPageLoad();
    await this.waitForSpinnerToDisappear();
  }

  async isOnCoreOrientationsPage(): Promise<boolean> {
    const url = this.getCurrentUrl();
    return url.includes('CoreOrientation') || await this.healer.isVisible(this.pageHeadingDef, 3000);
  }

  // ============================================================
  // Page Actions
  // ============================================================
  async clickAssign(): Promise<void> {
    await this.healer.click(this.assignButtonDef);
    await this.page.waitForTimeout(500);
  }

  async clickDelete(): Promise<void> {
    await this.healer.click(this.deleteButtonDef);
    await this.page.waitForTimeout(300);
  }

  async confirmDelete(): Promise<void> {
    await this.healer.click(this.confirmDeleteButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  async clickExport(format?: string): Promise<void> {
    await this.healer.click(this.exportDropdownDef);
    if (format) {
      await this.page.waitForTimeout(300);
      const exportOptionDef: ElementDefinition = {
        name: 'exportOption',
        description: `Export option for ${format} format`,
        primary: `.dropdown-menu a:has-text("${format}"), .dropdown-item:has-text("${format}")`,
        fallbacks: [
          `li:has-text("${format}") a`,
          `[role="menuitem"]:has-text("${format}")`,
          `button:has-text("${format}")`
        ],
        type: 'link'
      };
      await this.healer.click(exportOptionDef);
    }
  }

  // ============================================================
  // Modal Actions
  // ============================================================
  async selectModalProject(name: string): Promise<void> {
    await this.healer.selectOption(this.modalProjectDropdownDef, name);
    await this.page.waitForTimeout(500);
  }

  async selectModalDrillhole(name: string): Promise<void> {
    await this.healer.selectOption(this.modalDrillholeDropdownDef, name);
  }

  async clickModalAdd(): Promise<void> {
    await this.healer.click(this.modalAddButtonDef);
    await this.page.waitForTimeout(300);
  }

  async clickModalAssign(): Promise<void> {
    await this.healer.click(this.modalAssignButtonDef);
    await this.waitForSpinnerToDisappear();
  }

  async clickModalCancel(): Promise<void> {
    await this.healer.click(this.modalCancelButtonDef);
    await this.page.waitForTimeout(300);
  }

  // ============================================================
  // Table Actions
  // ============================================================
  async selectRow(index: number): Promise<void> {
    const locator = await this.healer.locate(this.rowCheckboxDef);
    await locator.nth(index).click();
  }

  async selectAllRows(): Promise<void> {
    await this.healer.click(this.selectAllCheckboxDef);
  }

  async getTableRowCount(): Promise<number> {
    try {
      const table = await this.healer.locate(this.assignmentsTableDef);
      const rows = table.locator('tbody tr');
      return await rows.count();
    } catch {
      return 0;
    }
  }

  // ============================================================
  // Assertions / Getters
  // ============================================================
  async isAssignButtonEnabled(): Promise<boolean> {
    const locator = await this.healer.locate(this.assignButtonDef);
    return await locator.isEnabled();
  }

  async isDeleteButtonEnabled(): Promise<boolean> {
    const locator = await this.healer.locate(this.deleteButtonDef);
    return await locator.isEnabled();
  }
}
