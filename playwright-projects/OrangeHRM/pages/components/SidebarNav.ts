// pages/components/SidebarNav.ts
import { Page } from '@playwright/test';
import { SelfHealingLocator, ElementDefinition } from '../../utils/SelfHealingLocator';

export class SidebarNav {
  private page: Page;
  private healer: SelfHealingLocator;

  // Menu item definitions
  private readonly menuItems: Record<string, ElementDefinition> = {
    search: {
      name: 'searchMenu',
      description: 'Search menu item in sidebar',
      primary: '.oxd-main-menu-search input',
      fallbacks: ['input[placeholder*="Search"]', '.oxd-input--active'],
      type: 'input'
    },
    admin: {
      name: 'adminMenu',
      description: 'Admin menu item in sidebar',
      primary: 'a.oxd-main-menu-item:has-text("Admin")',
      fallbacks: ['.oxd-main-menu-item--name:has-text("Admin")', 'a[href*="/admin/"]'],
      type: 'link'
    },
    pim: {
      name: 'pimMenu',
      description: 'PIM menu item in sidebar',
      primary: 'a.oxd-main-menu-item:has-text("PIM")',
      fallbacks: ['.oxd-main-menu-item--name:has-text("PIM")', 'a[href*="/pim/"]'],
      type: 'link'
    },
    leave: {
      name: 'leaveMenu',
      description: 'Leave menu item in sidebar',
      primary: 'a.oxd-main-menu-item:has-text("Leave")',
      fallbacks: ['.oxd-main-menu-item--name:has-text("Leave")', 'a[href*="/leave/"]'],
      type: 'link'
    },
    time: {
      name: 'timeMenu',
      description: 'Time menu item in sidebar',
      primary: 'a.oxd-main-menu-item:has-text("Time")',
      fallbacks: ['.oxd-main-menu-item--name:has-text("Time")', 'a[href*="/time/"]'],
      type: 'link'
    },
    recruitment: {
      name: 'recruitmentMenu',
      description: 'Recruitment menu item in sidebar',
      primary: 'a.oxd-main-menu-item:has-text("Recruitment")',
      fallbacks: ['.oxd-main-menu-item--name:has-text("Recruitment")', 'a[href*="/recruitment/"]'],
      type: 'link'
    },
    myInfo: {
      name: 'myInfoMenu',
      description: 'My Info menu item in sidebar',
      primary: 'a.oxd-main-menu-item:has-text("My Info")',
      fallbacks: ['.oxd-main-menu-item--name:has-text("My Info")', 'a[href*="/myinfo"]'],
      type: 'link'
    },
    performance: {
      name: 'performanceMenu',
      description: 'Performance menu item in sidebar',
      primary: 'a.oxd-main-menu-item:has-text("Performance")',
      fallbacks: ['.oxd-main-menu-item--name:has-text("Performance")', 'a[href*="/performance/"]'],
      type: 'link'
    },
    dashboard: {
      name: 'dashboardMenu',
      description: 'Dashboard menu item in sidebar',
      primary: 'a.oxd-main-menu-item:has-text("Dashboard")',
      fallbacks: ['.oxd-main-menu-item--name:has-text("Dashboard")', 'a[href*="/dashboard"]'],
      type: 'link'
    },
    directory: {
      name: 'directoryMenu',
      description: 'Directory menu item in sidebar',
      primary: 'a.oxd-main-menu-item:has-text("Directory")',
      fallbacks: ['.oxd-main-menu-item--name:has-text("Directory")', 'a[href*="/directory/"]'],
      type: 'link'
    },
    maintenance: {
      name: 'maintenanceMenu',
      description: 'Maintenance menu item in sidebar',
      primary: 'a.oxd-main-menu-item:has-text("Maintenance")',
      fallbacks: ['.oxd-main-menu-item--name:has-text("Maintenance")', 'a[href*="/maintenance/"]'],
      type: 'link'
    },
    claim: {
      name: 'claimMenu',
      description: 'Claim menu item in sidebar',
      primary: 'a.oxd-main-menu-item:has-text("Claim")',
      fallbacks: ['.oxd-main-menu-item--name:has-text("Claim")', 'a[href*="/claim/"]'],
      type: 'link'
    },
    buzz: {
      name: 'buzzMenu',
      description: 'Buzz menu item in sidebar',
      primary: 'a.oxd-main-menu-item:has-text("Buzz")',
      fallbacks: ['.oxd-main-menu-item--name:has-text("Buzz")', 'a[href*="/buzz/"]'],
      type: 'link'
    }
  };

  private readonly sidebarToggleDef: ElementDefinition = {
    name: 'sidebarToggle',
    description: 'Sidebar collapse/expand toggle button',
    primary: '.oxd-main-menu-button',
    fallbacks: ['button.oxd-main-menu-button', '.oxd-sidepanel-toggle'],
    type: 'button'
  };

  constructor(page: Page) {
    this.page = page;
    this.healer = new SelfHealingLocator(page);
  }

  /**
   * Navigate to a specific menu item
   */
  async navigateTo(menuName: keyof typeof this.menuItems): Promise<void> {
    const menuDef = this.menuItems[menuName];
    if (!menuDef) {
      throw new Error(`Unknown menu item: ${menuName}`);
    }
    await this.healer.click(menuDef);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if a menu item is visible
   */
  async isMenuItemVisible(menuName: keyof typeof this.menuItems): Promise<boolean> {
    const menuDef = this.menuItems[menuName];
    if (!menuDef) {
      return false;
    }
    return await this.healer.isVisible(menuDef);
  }

  /**
   * Get all visible menu items
   */
  async getVisibleMenuItems(): Promise<string[]> {
    const visibleItems: string[] = [];
    for (const [name, def] of Object.entries(this.menuItems)) {
      if (await this.healer.isVisible(def, 1000)) {
        visibleItems.push(name);
      }
    }
    return visibleItems;
  }

  /**
   * Search in sidebar
   */
  async search(query: string): Promise<void> {
    await this.healer.fill(this.menuItems.search, query);
  }

  /**
   * Toggle sidebar collapse/expand
   */
  async toggleSidebar(): Promise<void> {
    await this.healer.click(this.sidebarToggleDef);
  }

  /**
   * Check if sidebar is collapsed
   */
  async isSidebarCollapsed(): Promise<boolean> {
    const sidebar = this.page.locator('.oxd-sidepanel');
    const classList = await sidebar.getAttribute('class') || '';
    return classList.includes('toggled');
  }
}
