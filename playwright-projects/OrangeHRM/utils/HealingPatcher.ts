// utils/HealingPatcher.ts
import * as fs from 'fs';
import * as path from 'path';

interface HealedSelector {
  elementName: string;
  originalSelector: string;
  healedSelector: string;
  method: string;
  timestamp: string;
}

const HEALED_FILE = path.join(__dirname, '..', 'reports', 'healed-selectors.json');

/**
 * Save a healed selector to the shared JSON file (called during test execution)
 */
export function saveHealedSelector(record: HealedSelector): void {
  const dir = path.dirname(HEALED_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let records: HealedSelector[] = [];
  if (fs.existsSync(HEALED_FILE)) {
    try {
      records = JSON.parse(fs.readFileSync(HEALED_FILE, 'utf-8'));
    } catch {
      records = [];
    }
  }

  // Deduplicate — keep latest healing per element
  records = records.filter(r => r.elementName !== record.elementName);
  records.push(record);

  fs.writeFileSync(HEALED_FILE, JSON.stringify(records, null, 2));
}

/**
 * Apply healed selectors back to page object source files
 * Returns the number of selectors patched
 */
export function applyHealedSelectors(): { patched: number; details: string[] } {
  if (!fs.existsSync(HEALED_FILE)) {
    return { patched: 0, details: ['No healed-selectors.json found.'] };
  }

  let records: HealedSelector[];
  try {
    records = JSON.parse(fs.readFileSync(HEALED_FILE, 'utf-8'));
  } catch {
    return { patched: 0, details: ['Failed to parse healed-selectors.json.'] };
  }

  if (records.length === 0) {
    return { patched: 0, details: ['No healed selectors to apply.'] };
  }

  const pagesDir = path.join(__dirname, '..', 'pages');
  const pageFiles = getAllTsFiles(pagesDir);
  const details: string[] = [];
  let patched = 0;

  for (const record of records) {
    let found = false;

    for (const file of pageFiles) {
      let content = fs.readFileSync(file, 'utf-8');

      // Find the ElementDefinition block for this element by name
      // Pattern: name: 'elementName', ... primary: 'originalSelector'
      const namePattern = new RegExp(
        `(name:\\s*['"])${escapeRegex(record.elementName)}(['"][\\s\\S]*?primary:\\s*['"])` +
        `${escapeRegex(record.originalSelector)}(['"])`,
      );

      if (namePattern.test(content)) {
        const newContent = content.replace(
          namePattern,
          `$1${record.elementName}$2${record.healedSelector}$3`
        );

        if (newContent !== content) {
          fs.writeFileSync(file, newContent);
          const relFile = path.relative(path.join(__dirname, '..'), file);
          details.push(`Updated "${record.elementName}" in ${relFile}: ${record.originalSelector} → ${record.healedSelector}`);
          patched++;
          found = true;
          break;
        }
      }
    }

    if (!found) {
      details.push(`Could not find "${record.elementName}" with primary "${record.originalSelector}" in page files`);
    }
  }

  // Clear the healed file after applying
  if (patched > 0) {
    fs.unlinkSync(HEALED_FILE);
  }

  return { patched, details };
}

function getAllTsFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllTsFiles(fullPath));
    } else if (entry.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
