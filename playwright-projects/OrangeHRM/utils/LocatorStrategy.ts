// utils/LocatorStrategy.ts
import { Page, Locator } from '@playwright/test';
import { ElementDefinition } from './SelfHealingLocator';
import { HealingStatistics } from './HealingReporter';
import { SelfHealingLocator } from './SelfHealingLocator';
import { StandardLocator } from './StandardLocator';

export interface ILocatorStrategy {
  locate(element: ElementDefinition, timeout?: number): Promise<Locator>;
  fill(element: ElementDefinition, value: string): Promise<void>;
  click(element: ElementDefinition): Promise<void>;
  getText(element: ElementDefinition): Promise<string>;
  isVisible(element: ElementDefinition, timeout?: number): Promise<boolean>;
  selectOption(element: ElementDefinition, value: string): Promise<void>;
  getReport(): string;
  saveReport(path: string): Promise<void>;
  getStatistics(): HealingStatistics;
  clearCache(): void;
}

export function createLocatorStrategy(page: Page): ILocatorStrategy {
  const aiEnabled = process.env.AI_HEALING_ENABLED === 'true';
  return aiEnabled ? new SelfHealingLocator(page) : new StandardLocator(page);
}
