// pages/DashboardPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { SidebarNav } from './components/SidebarNav';
import { ElementDefinition } from '../utils/SelfHealingLocator';

export class DashboardPage extends BasePage {
  readonly pageUrl = '/web/index.php/dashboard/index';
  readonly sidebar: SidebarNav;

  // Element definitions
  private readonly userDropdownDef: ElementDefinition = {
    name: 'userDropdown',
    description: 'User profile dropdown in header',
    primary: '.oxd-userdropdown',
    fallbacks: [
      '.oxd-userdropdown-tab',
      '.oxd-topbar-header-userarea',
      '[class*="userdropdown"]'
    ],
    type: 'button'
  };

  private readonly logoutLinkDef: ElementDefinition = {
    name: 'logoutLink',
    description: 'Logout link in user dropdown',
    primary: 'a:has-text("Logout")',
    fallbacks: [
      '.oxd-userdropdown-link:has-text("Logout")',
      'a[href*="logout"]',
      '[role="menuitem"]:has-text("Logout")'
    ],
    type: 'link'
  };

  private readonly upgradeButtonDef: ElementDefinition = {
    name: 'upgradeButton',
    description: 'Upgrade button in header',
    primary: 'button:has-text("Upgrade")',
    fallbacks: [
      '.oxd-topbar-header-breadcrumb-module button',
      '.oxd-button--secondary:has-text("Upgrade")'
    ],
    type: 'button'
  };

  private readonly dashboardTitleDef: ElementDefinition = {
    name: 'dashboardTitle',
    description: 'Dashboard page title',
    primary: '.oxd-topbar-header-breadcrumb-module',
    fallbacks: [
      'h6:has-text("Dashboard")',
      '.oxd-text--h6:has-text("Dashboard")'
    ],
    type: 'text'
  };

  // Widget definitions
  private readonly timeAtWorkWidgetDef: ElementDefinition = {
    name: 'timeAtWorkWidget',
    description: 'Time at Work widget',
    primary: '.orangehrm-attendance-card',
    fallbacks: [
      '[class*="attendance"]',
      '.oxd-grid-item:has-text("Time at Work")'
    ],
    type: 'container'
  };

  private readonly myActionsWidgetDef: ElementDefinition = {
    name: 'myActionsWidget',
    description: 'My Actions widget',
    primary: '.orangehrm-todo-list',
    fallbacks: [
      '[class*="todo"]',
      '.oxd-grid-item:has-text("My Actions")'
    ],
    type: 'container'
  };

  private readonly quickLaunchWidgetDef: ElementDefinition = {
    name: 'quickLaunchWidget',
    description: 'Quick Launch widget',
    primary: '.orangehrm-quick-launch',
    fallbacks: [
      '[class*="quick-launch"]',
      '.oxd-grid-item:has-text("Quick Launch")'
    ],
    type: 'container'
  };

  // Quick Launch buttons
  private readonly assignLeaveShortcutDef: ElementDefinition = {
    name: 'assignLeaveShortcut',
    description: 'Assign Leave quick launch button',
    primary: 'button:has-text("Assign Leave")',
    fallbacks: [
      '.orangehrm-quick-launch-card:has-text("Assign Leave")',
      '[title="Assign Leave"]'
    ],
    type: 'button'
  };

  private readonly leaveListShortcutDef: ElementDefinition = {
    name: 'leaveListShortcut',
    description: 'Leave List quick launch button',
    primary: 'button:has-text("Leave List")',
    fallbacks: [
      '.orangehrm-quick-launch-card:has-text("Leave List")',
      '[title="Leave List"]'
    ],
    type: 'button'
  };

  private readonly applyLeaveShortcutDef: ElementDefinition = {
    name: 'applyLeaveShortcut',
    description: 'Apply Leave quick launch button',
    primary: 'button:has-text("Apply Leave")',
    fallbacks: [
      '.orangehrm-quick-launch-card:has-text("Apply Leave")',
      '[title="Apply Leave"]'
    ],
    type: 'button'
  };

  private readonly myLeaveShortcutDef: ElementDefinition = {
    name: 'myLeaveShortcut',
    description: 'My Leave quick launch button',
    primary: 'button:has-text("My Leave")',
    fallbacks: [
      '.orangehrm-quick-launch-card:has-text("My Leave")',
      '[title="My Leave"]'
    ],
    type: 'button'
  };

  constructor(page: Page) {
    super(page);
    this.sidebar = new SidebarNav(page);
  }

  /**
   * Navigate to dashboard
   */
  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  /**
   * Check if on dashboard page
   */
  async isOnDashboard(): Promise<boolean> {
    return this.page.url().includes('/dashboard');
  }

  /**
   * Click user dropdown
   */
  async clickUserDropdown(): Promise<void> {
    await this.healer.click(this.userDropdownDef);
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await this.clickUserDropdown();
    await this.healer.click(this.logoutLinkDef);
    await this.waitForPageLoad();
  }

  /**
   * Get logged in username
   */
  async getLoggedInUsername(): Promise<string> {
    const dropdown = await this.healer.locate(this.userDropdownDef);
    const nameElement = dropdown.locator('.oxd-userdropdown-name');
    return await nameElement.textContent() || '';
  }

  /**
   * Check if upgrade button is visible
   */
  async isUpgradeButtonVisible(): Promise<boolean> {
    return await this.healer.isVisible(this.upgradeButtonDef);
  }

  /**
   * Check if Time at Work widget is visible
   */
  async isTimeAtWorkWidgetVisible(): Promise<boolean> {
    return await this.healer.isVisible(this.timeAtWorkWidgetDef);
  }

  /**
   * Check if My Actions widget is visible
   */
  async isMyActionsWidgetVisible(): Promise<boolean> {
    return await this.healer.isVisible(this.myActionsWidgetDef);
  }

  /**
   * Check if Quick Launch widget is visible
   */
  async isQuickLaunchWidgetVisible(): Promise<boolean> {
    return await this.healer.isVisible(this.quickLaunchWidgetDef);
  }

  /**
   * Click Assign Leave shortcut
   */
  async clickAssignLeaveShortcut(): Promise<void> {
    await this.healer.click(this.assignLeaveShortcutDef);
    await this.waitForPageLoad();
  }

  /**
   * Click Leave List shortcut
   */
  async clickLeaveListShortcut(): Promise<void> {
    await this.healer.click(this.leaveListShortcutDef);
    await this.waitForPageLoad();
  }

  /**
   * Click Apply Leave shortcut
   */
  async clickApplyLeaveShortcut(): Promise<void> {
    await this.healer.click(this.applyLeaveShortcutDef);
    await this.waitForPageLoad();
  }

  /**
   * Click My Leave shortcut
   */
  async clickMyLeaveShortcut(): Promise<void> {
    await this.healer.click(this.myLeaveShortcutDef);
    await this.waitForPageLoad();
  }

  /**
   * Get all visible menu items from sidebar
   */
  async getVisibleMenuItems(): Promise<string[]> {
    return await this.sidebar.getVisibleMenuItems();
  }

  /**
   * Navigate to Leave module via sidebar
   */
  async navigateToLeave(): Promise<void> {
    await this.sidebar.navigateTo('leave');
  }

  /**
   * Navigate to Admin module via sidebar
   */
  async navigateToAdmin(): Promise<void> {
    await this.sidebar.navigateTo('admin');
  }

  /**
   * Navigate to PIM module via sidebar
   */
  async navigateToPIM(): Promise<void> {
    await this.sidebar.navigateTo('pim');
  }

  /**
   * Toggle sidebar
   */
  async toggleSidebar(): Promise<void> {
    await this.sidebar.toggleSidebar();
  }

  /**
   * Check if sidebar is collapsed
   */
  async isSidebarCollapsed(): Promise<boolean> {
    return await this.sidebar.isSidebarCollapsed();
  }
}
