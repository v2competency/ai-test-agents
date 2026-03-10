// pages/components/SidebarNav.ts
import { Page } from '@playwright/test';
import { ElementDefinition } from '../../utils/SelfHealingLocator';
import { ILocatorStrategy, createLocatorStrategy } from '../../utils/LocatorStrategy';

export class SidebarNav {
  private page: Page;
  private healer: ILocatorStrategy;

  // ============================================================
  // Menu Item Definitions
  // ============================================================
  private readonly menuItems: Record<string, ElementDefinition> = {
    dashboard: {
      name: 'menuDashboard',
      description: 'Dashboard menu item in left sidebar navigation',
      primary: 'a:has-text("Dashboard"), [class*="nav"] >> text=Dashboard',
      fallbacks: ['li:has-text("Dashboard") a', '.sidebar a[href*="Dashboard"]', '[data-menu="dashboard"]'],
      type: 'link'
    },
    plan: {
      name: 'menuPlan',
      description: 'Plan menu item in left sidebar navigation',
      primary: 'a:has-text("Plan"), [class*="nav"] >> text=Plan',
      fallbacks: ['li:has-text("Plan") > a', '.sidebar a[href*="Plan"]'],
      type: 'link'
    },
    assign: {
      name: 'menuAssign',
      description: 'Assign menu item in left sidebar navigation',
      primary: 'a:has-text("Assign"), [class*="nav"] >> text=Assign',
      fallbacks: ['li:has-text("Assign") > a', '.sidebar a[href*="Assign"]'],
      type: 'link'
    },
    approve: {
      name: 'menuApprove',
      description: 'Approve menu item in left sidebar navigation',
      primary: 'a:has-text("Approve"), [class*="nav"] >> text=Approve',
      fallbacks: ['li:has-text("Approve") > a', '.sidebar a[href*="Approve"]'],
      type: 'link'
    },
    view: {
      name: 'menuView',
      description: 'View menu item in left sidebar navigation',
      primary: 'a:has-text("View"), [class*="nav"] >> text=View',
      fallbacks: ['li:has-text("View") > a', '.sidebar a[href*="View"]'],
      type: 'link'
    },
    imsights: {
      name: 'menuIMSIGHTs',
      description: 'IMSIGHTs menu item in left sidebar navigation',
      primary: 'a:has-text("IMSIGHTs"), [class*="nav"] >> text=IMSIGHTs',
      fallbacks: ['li:has-text("IMSIGHTs") > a', '.sidebar a[href*="IMSIGHTs"]'],
      type: 'link'
    },
    reports: {
      name: 'menuReports',
      description: 'Reports menu item in left sidebar navigation',
      primary: 'a:has-text("Reports"), [class*="nav"] >> text=Reports',
      fallbacks: ['li:has-text("Reports") > a', '.sidebar a[href*="Reports"]'],
      type: 'link'
    },
    manage: {
      name: 'menuManage',
      description: 'Manage menu item in left sidebar navigation',
      primary: 'a:has-text("Manage"), [class*="nav"] >> text=Manage',
      fallbacks: ['li:has-text("Manage") > a', '.sidebar a[href*="Manage"]'],
      type: 'link'
    },
    mobileForms: {
      name: 'menuMobileForms',
      description: 'Mobile Forms menu item in left sidebar navigation',
      primary: 'a:has-text("Mobile Forms"), [class*="nav"] >> text=Mobile Forms',
      fallbacks: ['li:has-text("Mobile Forms") > a', '.sidebar a[href*="MobileForms"]'],
      type: 'link'
    },
    help: {
      name: 'menuHelp',
      description: 'Help menu item in left sidebar navigation',
      primary: 'a:has-text("Help"), [class*="nav"] >> text=Help',
      fallbacks: ['li:has-text("Help") > a', '.sidebar a[href*="Help"]'],
      type: 'link'
    }
  };

  // Sub-menu items
  private readonly subMenuItems: Record<string, ElementDefinition> = {
    // Assign sub-menus
    assignAssays: {
      name: 'subMenuAssignAssays',
      description: 'Assays sub-menu item under Assign in sidebar',
      primary: 'a:has-text("Assays")',
      fallbacks: ['.sub-menu a[href*="Assays"]', 'li.sub-item a:has-text("Assays")'],
      type: 'link'
    },
    assignGammas: {
      name: 'subMenuAssignGammas',
      description: 'Gammas sub-menu item under Assign in sidebar',
      primary: 'a:has-text("Gammas")',
      fallbacks: ['.sub-menu a[href*="Gammas"]'],
      type: 'link'
    },
    assignSurveys: {
      name: 'subMenuAssignSurveys',
      description: 'Surveys sub-menu item under Assign in sidebar',
      primary: 'a:has-text("Surveys")',
      fallbacks: ['.sub-menu a[href*="Surveys"]'],
      type: 'link'
    },
    assignStructuralReadings: {
      name: 'subMenuAssignStructuralReadings',
      description: 'Structural Readings sub-menu item under Assign in sidebar',
      primary: 'a:has-text("Structural Readings")',
      fallbacks: ['.sub-menu a[href*="StructuralReadings"]'],
      type: 'link'
    },
    assignCoreOrientations: {
      name: 'subMenuAssignCoreOrientations',
      description: 'Core Orientations sub-menu item under Assign in sidebar',
      primary: 'a:has-text("Core Orientations")',
      fallbacks: ['.sub-menu a[href*="CoreOrientation"]'],
      type: 'link'
    },
    assignReassign: {
      name: 'subMenuAssignReassign',
      description: 'Reassign sub-menu item under Assign in sidebar',
      primary: 'a:has-text("Reassign")',
      fallbacks: ['.sub-menu a[href*="Reassign"]'],
      type: 'link'
    },
    // Approve sub-menus
    approveSurveys: {
      name: 'subMenuApproveSurveys',
      description: 'Surveys sub-menu item under Approve in sidebar',
      primary: 'a:has-text("Surveys")',
      fallbacks: ['.sub-menu a[href*="ApproveSurveys"]'],
      type: 'link'
    },
    // View sub-menus
    viewData: {
      name: 'subMenuViewData',
      description: 'Data sub-menu item under View in sidebar',
      primary: 'a:has-text("Data")',
      fallbacks: ['.sub-menu a[href*="ViewData"]', 'a[href*="View/Data"]'],
      type: 'link'
    },
    viewCoreOrientation: {
      name: 'subMenuViewCoreOrientation',
      description: 'Core Orientation sub-menu item under View in sidebar',
      primary: 'a:has-text("Core Orientation")',
      fallbacks: ['.sub-menu a[href*="CoreOrientation"]'],
      type: 'link'
    },
    viewMudActivities: {
      name: 'subMenuViewMudActivities',
      description: 'Mud Activities sub-menu item under View in sidebar',
      primary: 'a:has-text("Mud Activities")',
      fallbacks: ['.sub-menu a[href*="MudActivities"]'],
      type: 'link'
    }
  };

  private readonly sidebarToggleDef: ElementDefinition = {
    name: 'sidebarToggle',
    description: 'Sidebar collapse/expand toggle button',
    primary: '.sidebar-toggle, button[class*="sidebar-toggle"]',
    fallbacks: ['[class*="hamburger"]', '.navbar-toggler', 'button[class*="collapse"]'],
    type: 'button'
  };

  constructor(page: Page) {
    this.page = page;
    this.healer = createLocatorStrategy(page);
  }

  // ============================================================
  // Navigation Methods
  // ============================================================
  async navigateTo(menuName: string): Promise<void> {
    const menuDef = this.menuItems[menuName.toLowerCase()];
    if (!menuDef) {
      throw new Error(`Unknown menu item: ${menuName}`);
    }
    await this.healer.click(menuDef);
    await this.page.waitForLoadState('networkidle');
  }

  async expandMenu(menuName: string): Promise<void> {
    const menuDef = this.menuItems[menuName.toLowerCase()];
    if (!menuDef) {
      throw new Error(`Unknown menu item: ${menuName}`);
    }
    await this.healer.click(menuDef);
  }

  async clickSubMenu(subMenuName: string): Promise<void> {
    const subMenuDef = this.subMenuItems[subMenuName];
    if (!subMenuDef) {
      throw new Error(`Unknown sub-menu item: ${subMenuName}`);
    }
    await this.healer.click(subMenuDef);
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToSubMenu(parentMenu: string, subMenuName: string): Promise<void> {
    await this.expandMenu(parentMenu);
    await this.page.waitForTimeout(500);
    await this.clickSubMenu(subMenuName);
  }

  // ============================================================
  // Visibility Methods
  // ============================================================
  async isMenuItemVisible(menuName: string): Promise<boolean> {
    const menuDef = this.menuItems[menuName.toLowerCase()];
    if (!menuDef) return false;
    return await this.healer.isVisible(menuDef);
  }

  async getVisibleMenuItems(): Promise<string[]> {
    const visible: string[] = [];
    for (const [name, def] of Object.entries(this.menuItems)) {
      if (await this.healer.isVisible(def)) {
        visible.push(name);
      }
    }
    return visible;
  }

  async toggleSidebar(): Promise<void> {
    await this.healer.click(this.sidebarToggleDef);
  }
}
