// pages/DashboardPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ElementDefinition } from '../utils/SelfHealingLocator';
import { SidebarNav } from './components/SidebarNav';

export class DashboardPage extends BasePage {
  // ============================================================
  // Public Components
  // ============================================================
  public sidebar: SidebarNav;

  // ============================================================
  // Element Definitions
  // ============================================================
  private readonly userAvatarDef: ElementDefinition = {
    name: 'userAvatar',
    description: 'User avatar/profile icon in the top right corner of the header',
    primary: '.user-avatar, .avatar',
    fallbacks: [
      'img[class*="avatar"]',
      '.navbar .dropdown-toggle img',
      '.header .profile-icon',
      '[class*="user-profile"] img',
      '.nav-item.dropdown >> img'
    ],
    type: 'button'
  };

  private readonly logoutLinkDef: ElementDefinition = {
    name: 'logoutLink',
    description: 'Logout option in the user profile dropdown menu',
    primary: 'a:has-text("Logout"), a:has-text("Log out")',
    fallbacks: [
      'a[href*="Logout"]',
      'a[href*="logout"]',
      '.dropdown-menu a:has-text("Logout")',
      '.dropdown-item:has-text("Logout")',
      'button:has-text("Logout")'
    ],
    type: 'link'
  };

  private readonly companyNameDef: ElementDefinition = {
    name: 'companyName',
    description: 'Company name displayed in the header (TESTKP_COMPANY01)',
    primary: '.company-name, [class*="company"]',
    fallbacks: [
      'text=TESTKP_COMPANY01',
      '.navbar .company-label',
      '.header [class*="company"]',
      '.top-bar [class*="company"]',
      '[class*="header"] span:has-text("TESTKP")'
    ],
    type: 'text'
  };

  private readonly userNameDef: ElementDefinition = {
    name: 'userName',
    description: 'User name displayed in the header (N. Rao)',
    primary: '.user-name, [class*="user-name"]',
    fallbacks: [
      'text=N. Rao',
      '.navbar [class*="user"]',
      '.header .display-name',
      '.dropdown-toggle:has-text("Rao")',
      '[class*="header"] span:has-text("Rao")'
    ],
    type: 'text'
  };

  private readonly dashboardTitleDef: ElementDefinition = {
    name: 'dashboardTitle',
    description: 'Dashboard page title heading',
    primary: 'h1:has-text("Dashboard"), h2:has-text("Dashboard")',
    fallbacks: [
      '.page-title:has-text("Dashboard")',
      '[class*="title"]:has-text("Dashboard")',
      '.content-header:has-text("Dashboard")',
      'text=Dashboard'
    ],
    type: 'text'
  };

  private readonly pendingDataSectionDef: ElementDefinition = {
    name: 'pendingDataSection',
    description: 'Pending data section container with tool cards showing pending counts',
    primary: '[class*="pending"], section:has-text("Pending")',
    fallbacks: [
      '.card-section:has-text("Pending")',
      '.dashboard-section:has-text("Pending")',
      'div:has-text("PENDING") >> xpath=ancestor::section',
      '[data-section="pending"]'
    ],
    type: 'container'
  };

  private readonly pendingDataCardDef: ElementDefinition = {
    name: 'pendingDataCard',
    description: 'Generic data card in the pending data section showing tool name and count',
    primary: '[class*="pending"] .card, [class*="pending"] [class*="card"]',
    fallbacks: [
      '.dashboard-card',
      '.data-card',
      '.tool-card',
      '[class*="card"]:has-text("PENDING")'
    ],
    type: 'container'
  };

  private readonly unassignedDataSectionDef: ElementDefinition = {
    name: 'unassignedDataSection',
    description: 'Unassigned data section container with tool cards showing unassigned counts',
    primary: '[class*="unassigned"], section:has-text("Unassigned")',
    fallbacks: [
      '.card-section:has-text("Unassigned")',
      '.dashboard-section:has-text("Unassigned")',
      'div:has-text("Unassigned") >> xpath=ancestor::section',
      '[data-section="unassigned"]'
    ],
    type: 'container'
  };

  private readonly submittedDataSectionDef: ElementDefinition = {
    name: 'submittedDataSection',
    description: 'Submitted data section container with total bar chart',
    primary: '[class*="submitted"], section:has-text("Submitted")',
    fallbacks: [
      '.card-section:has-text("Submitted")',
      '.dashboard-section:has-text("Submitted")',
      'div:has-text("Submitted") >> xpath=ancestor::section',
      '[data-section="submitted"]'
    ],
    type: 'container'
  };

  private readonly viewLinkDef: ElementDefinition = {
    name: 'viewLink',
    description: 'The "View >" link on dashboard tool cards',
    primary: 'a:has-text("View >"), a:has-text("View>")',
    fallbacks: [
      '.card a:has-text("View")',
      '[class*="card"] a[class*="view"]',
      'a[class*="view-link"]',
      '.view-more'
    ],
    type: 'link'
  };

  constructor(page: Page) {
    super(page);
    this.sidebar = new SidebarNav(page);
  }

  // ============================================================
  // Navigation
  // ============================================================
  async navigate(): Promise<void> {
    await this.page.goto('/Dashboard');
    await this.waitForPageLoad();
  }

  isOnDashboardPage(): boolean {
    const url = this.getCurrentUrl();
    return url.includes('Dashboard') || url.includes('dashboard');
  }

  // ============================================================
  // User Profile Actions
  // ============================================================
  async clickUserAvatar(): Promise<void> {
    await this.healer.click(this.userAvatarDef);
  }

  async clickLogout(): Promise<void> {
    await this.healer.click(this.logoutLinkDef);
  }

  async logout(): Promise<void> {
    await this.clickUserAvatar();
    await this.page.waitForTimeout(500);
    await this.clickLogout();
    await this.waitForPageLoad();
  }

  // ============================================================
  // Assertions / Getters
  // ============================================================
  async getCompanyName(): Promise<string> {
    return await this.healer.getText(this.companyNameDef);
  }

  async getUserName(): Promise<string> {
    return await this.healer.getText(this.userNameDef);
  }

  async isPendingDataSectionVisible(): Promise<boolean> {
    return await this.healer.isVisible(this.pendingDataSectionDef);
  }

  async isUnassignedDataSectionVisible(): Promise<boolean> {
    return await this.healer.isVisible(this.unassignedDataSectionDef);
  }

  async isSubmittedDataSectionVisible(): Promise<boolean> {
    return await this.healer.isVisible(this.submittedDataSectionDef);
  }

  // ============================================================
  // Card Interactions
  // ============================================================
  async clickViewLinkOnCard(toolName: string): Promise<void> {
    const toolCardViewLinkDef: ElementDefinition = {
      name: `viewLink_${toolName}`,
      description: `"View >" link on the ${toolName} tool card in the dashboard`,
      primary: `.card:has-text("${toolName}") a:has-text("View"), [class*="card"]:has-text("${toolName}") a:has-text("View")`,
      fallbacks: [
        `text=${toolName} >> xpath=ancestor::div[contains(@class,"card")] >> a:has-text("View")`,
        `.card:has-text("${toolName}") .view-link`,
        `a[href*="View"]:near(:text("${toolName}"))`,
        `[class*="card"]:has-text("${toolName}") a`
      ],
      type: 'link'
    };
    await this.healer.click(toolCardViewLinkDef);
    await this.waitForPageLoad();
  }

  async getPendingCardCount(toolName: string): Promise<string> {
    const toolCardCountDef: ElementDefinition = {
      name: `pendingCount_${toolName}`,
      description: `Pending count number displayed on the ${toolName} tool card`,
      primary: `.card:has-text("${toolName}") .count, [class*="card"]:has-text("${toolName}") [class*="count"]`,
      fallbacks: [
        `text=${toolName} >> xpath=ancestor::div[contains(@class,"card")] >> [class*="count"]`,
        `.card:has-text("${toolName}") .badge`,
        `[class*="card"]:has-text("${toolName}") span`,
        `.card:has-text("${toolName}") strong`
      ],
      type: 'text'
    };
    return await this.healer.getText(toolCardCountDef);
  }
}
