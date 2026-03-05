// config/global-teardown.ts
import { applyHealedSelectors } from '../utils/HealingPatcher';
import { HealingReporter } from '../utils/HealingReporter';
import * as path from 'path';

const RECORDS_FILE = path.join(__dirname, '..', 'reports', 'healing-records.json');

async function globalTeardown() {
  // Generate merged healing report from all workers
  const report = HealingReporter.generateReportFromFile(RECORDS_FILE);
  if (report) {
    console.log(report);
  }

  // Apply healed selectors back to source files
  const { patched, details } = applyHealedSelectors();

  if (patched > 0) {
    console.log(`\n[SelfHealing] Patched ${patched} selector(s) in source files:`);
    for (const detail of details) {
      console.log(`  ${detail}`);
    }
    console.log(`[SelfHealing] Re-run tests to verify the patched selectors.\n`);
  }
}

export default globalTeardown;
