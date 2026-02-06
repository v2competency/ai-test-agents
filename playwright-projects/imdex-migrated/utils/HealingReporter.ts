import * as fs from 'fs';
import * as path from 'path';

/**
 * Healing result record
 */
export interface HealingResult {
  element: string;
  original: string;
  healed: string | null;
  tier: 'cache' | 'fallback' | 'ai_visual' | 'ai_dom' | 'failed';
  duration: number;
  timestamp?: Date;
  originalSelenium?: string;  // Track original Selenium locator for migration traceability
}

/**
 * Healing statistics
 */
export interface HealingStats {
  total: number;
  successful: number;
  failed: number;
  byTier: Record<string, number>;
  avgDuration: number;
}

/**
 * Healing Reporter
 * Tracks and reports on self-healing activities
 *
 * Enhanced from Healenium reporting to include:
 * - Original Selenium locator tracking
 * - 4-tier healing statistics
 * - Migration traceability
 */
export class HealingReporter {
  private results: HealingResult[] = [];

  /**
   * Record a healing result
   */
  record(result: HealingResult): void {
    this.results.push({
      ...result,
      timestamp: new Date()
    });
  }

  /**
   * Get healing statistics
   */
  getStats(): HealingStats {
    if (this.results.length === 0) {
      return {
        total: 0,
        successful: 0,
        failed: 0,
        byTier: {},
        avgDuration: 0
      };
    }

    const successful = this.results.filter(r => r.tier !== 'failed');
    const byTier = this.results.reduce((acc, r) => {
      acc[r.tier] = (acc[r.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    return {
      total: this.results.length,
      successful: successful.length,
      failed: this.results.length - successful.length,
      byTier,
      avgDuration: totalDuration / this.results.length
    };
  }

  /**
   * Generate human-readable report
   */
  generateReport(): string {
    const stats = this.getStats();

    const lines = [
      '═'.repeat(70),
      '                    SELF-HEALING MIGRATION REPORT',
      '═'.repeat(70),
      '',
      `Generated: ${new Date().toISOString()}`,
      '',
      '── SUMMARY ──────────────────────────────────────────────────────────',
      `Total Healing Attempts: ${stats.total}`,
      `Successful: ${stats.successful} (${stats.total > 0 ? ((stats.successful / stats.total) * 100).toFixed(1) : 0}%)`,
      `Failed: ${stats.failed}`,
      `Average Duration: ${stats.avgDuration.toFixed(0)}ms`,
      '',
      '── BY TIER ──────────────────────────────────────────────────────────',
    ];

    // Add tier breakdown
    const tierOrder = ['cache', 'fallback', 'ai_visual', 'ai_dom', 'failed'];
    for (const tier of tierOrder) {
      const count = stats.byTier[tier] || 0;
      const pct = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0;
      const tierName = tier.toUpperCase().replace('_', ' ');
      lines.push(`  ${tierName.padEnd(12)}: ${count.toString().padStart(3)} (${pct}%)`);
    }

    lines.push('');
    lines.push('── HEALING DETAILS ──────────────────────────────────────────────────');

    // Add detailed results
    for (const r of this.results) {
      lines.push('');
      lines.push(`  Element: ${r.element}`);
      lines.push(`  Status: ${r.tier.toUpperCase()}`);
      lines.push(`  Original Playwright: ${r.original}`);
      if (r.originalSelenium) {
        lines.push(`  Original Selenium: ${r.originalSelenium}`);
      }
      lines.push(`  Healed To: ${r.healed || 'FAILED'}`);
      lines.push(`  Duration: ${r.duration}ms`);
      lines.push('  ' + '-'.repeat(66));
    }

    lines.push('');
    lines.push('═'.repeat(70));

    return lines.join('\n');
  }

  /**
   * Save report to file
   */
  async save(filePath: string): Promise<void> {
    const dir = path.dirname(filePath);

    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const report = {
      generatedAt: new Date().toISOString(),
      migrationSource: 'Imdex Selenium (QAF) to Playwright',
      stats: this.getStats(),
      results: this.results.map(r => ({
        ...r,
        timestamp: r.timestamp?.toISOString()
      }))
    };

    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
    console.log(`[HealingReporter] Report saved to: ${filePath}`);
  }

  /**
   * Clear all results
   */
  clear(): void {
    this.results = [];
  }

  /**
   * Get results filtered by tier
   */
  getResultsByTier(tier: string): HealingResult[] {
    return this.results.filter(r => r.tier === tier);
  }

  /**
   * Get failed results
   */
  getFailedResults(): HealingResult[] {
    return this.results.filter(r => r.tier === 'failed');
  }
}
