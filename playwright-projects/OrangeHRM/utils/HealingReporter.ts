// utils/HealingReporter.ts
import * as fs from 'fs';
import * as path from 'path';

export interface HealingRecord {
  elementName: string;
  originalSelector: string;
  healedSelector: string | null;
  method: 'primary' | 'cache' | 'fallback' | 'ai_visual' | 'ai_dom' | 'failed';
  duration: number;
  timestamp: string;
}

export interface HealingStatistics {
  totalAttempts: number;
  primaryHits: number;
  cacheHits: number;
  fallbackHits: number;
  aiVisualHits: number;
  aiDomHits: number;
  failures: number;
  averageHealingTime: number;
  healingRate: number;
}

export class HealingReporter {
  private records: HealingRecord[] = [];

  /**
   * Record a healing attempt
   */
  record(
    elementName: string,
    originalSelector: string,
    healedSelector: string | null,
    method: HealingRecord['method'],
    duration: number
  ): void {
    this.records.push({
      elementName,
      originalSelector,
      healedSelector,
      method,
      duration,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get healing statistics
   */
  getStatistics(): HealingStatistics {
    const total = this.records.length;
    if (total === 0) {
      return {
        totalAttempts: 0,
        primaryHits: 0,
        cacheHits: 0,
        fallbackHits: 0,
        aiVisualHits: 0,
        aiDomHits: 0,
        failures: 0,
        averageHealingTime: 0,
        healingRate: 100
      };
    }

    const primaryHits = this.records.filter(r => r.method === 'primary').length;
    const cacheHits = this.records.filter(r => r.method === 'cache').length;
    const fallbackHits = this.records.filter(r => r.method === 'fallback').length;
    const aiVisualHits = this.records.filter(r => r.method === 'ai_visual').length;
    const aiDomHits = this.records.filter(r => r.method === 'ai_dom').length;
    const failures = this.records.filter(r => r.method === 'failed').length;

    const totalDuration = this.records.reduce((sum, r) => sum + r.duration, 0);
    const successfulHeals = total - failures;

    return {
      totalAttempts: total,
      primaryHits,
      cacheHits,
      fallbackHits,
      aiVisualHits,
      aiDomHits,
      failures,
      averageHealingTime: Math.round(totalDuration / total),
      healingRate: Math.round((successfulHeals / total) * 100)
    };
  }

  /**
   * Generate a human-readable report
   */
  generateReport(): string {
    const stats = this.getStatistics();
    const failedElements = this.records.filter(r => r.method === 'failed');
    const healedElements = this.records.filter(r => r.method !== 'primary' && r.method !== 'failed');

    let report = `
========================================
   SELF-HEALING LOCATOR REPORT
========================================

STATISTICS
----------
Total Lookup Attempts: ${stats.totalAttempts}
Healing Success Rate:  ${stats.healingRate}%
Average Lookup Time:   ${stats.averageHealingTime}ms

BREAKDOWN BY METHOD
-------------------
Primary Selector:      ${stats.primaryHits} (${this.percentage(stats.primaryHits, stats.totalAttempts)}%)
Cache Hit:             ${stats.cacheHits} (${this.percentage(stats.cacheHits, stats.totalAttempts)}%)
Fallback Selector:     ${stats.fallbackHits} (${this.percentage(stats.fallbackHits, stats.totalAttempts)}%)
AI Visual Analysis:    ${stats.aiVisualHits} (${this.percentage(stats.aiVisualHits, stats.totalAttempts)}%)
AI DOM Analysis:       ${stats.aiDomHits} (${this.percentage(stats.aiDomHits, stats.totalAttempts)}%)
Failed:                ${stats.failures} (${this.percentage(stats.failures, stats.totalAttempts)}%)
`;

    if (healedElements.length > 0) {
      report += `
HEALED ELEMENTS (Consider updating selectors)
----------------------------------------------
`;
      for (const record of healedElements) {
        report += `
Element: ${record.elementName}
  Original: ${record.originalSelector}
  Healed:   ${record.healedSelector}
  Method:   ${record.method}
  Time:     ${record.duration}ms
`;
      }
    }

    if (failedElements.length > 0) {
      report += `
FAILED ELEMENTS (Require manual fix)
-------------------------------------
`;
      for (const record of failedElements) {
        report += `
Element: ${record.elementName}
  Selector: ${record.originalSelector}
  Time:     ${record.timestamp}
`;
      }
    }

    report += `
========================================
`;
    return report;
  }

  /**
   * Save report to JSON file
   */
  async save(filePath: string): Promise<void> {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const report = {
      generatedAt: new Date().toISOString(),
      statistics: this.getStatistics(),
      records: this.records
    };

    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
  }

  /**
   * Clear all records
   */
  clear(): void {
    this.records = [];
  }

  /**
   * Get all records
   */
  getRecords(): HealingRecord[] {
    return [...this.records];
  }

  private percentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }
}
