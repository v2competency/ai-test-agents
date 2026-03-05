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

interface BrokenFallbackRecord {
  elementName: string;
  brokenFallbacks: string[];
  workingSelector: string;
  timestamp: string;
}

const HEALED_FILE = path.join(__dirname, '..', 'reports', 'healed-selectors.json');
const BROKEN_FALLBACKS_FILE = path.join(__dirname, '..', 'reports', 'broken-fallbacks.json');

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
 * Save broken fallbacks to the shared JSON file (called during test execution)
 */
export function saveBrokenFallbacks(record: BrokenFallbackRecord): void {
  if (record.brokenFallbacks.length === 0) return;

  const dir = path.dirname(BROKEN_FALLBACKS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let records: BrokenFallbackRecord[] = [];
  if (fs.existsSync(BROKEN_FALLBACKS_FILE)) {
    try {
      records = JSON.parse(fs.readFileSync(BROKEN_FALLBACKS_FILE, 'utf-8'));
    } catch {
      records = [];
    }
  }

  // Deduplicate — keep latest per element
  records = records.filter(r => r.elementName !== record.elementName);
  records.push(record);

  fs.writeFileSync(BROKEN_FALLBACKS_FILE, JSON.stringify(records, null, 2));
}

/**
 * Apply broken fallback fixes back to page object source files
 * Removes broken fallbacks and adds the working selector as a new fallback
 */
export function applyFallbackFixes(): { patched: number; details: string[] } {
  if (!fs.existsSync(BROKEN_FALLBACKS_FILE)) {
    return { patched: 0, details: [] };
  }

  let records: BrokenFallbackRecord[];
  try {
    records = JSON.parse(fs.readFileSync(BROKEN_FALLBACKS_FILE, 'utf-8'));
  } catch {
    return { patched: 0, details: ['Failed to parse broken-fallbacks.json.'] };
  }

  if (records.length === 0) {
    return { patched: 0, details: [] };
  }

  const pagesDir = path.join(__dirname, '..', 'pages');
  const pageFiles = getAllTsFiles(pagesDir);
  const details: string[] = [];
  let patched = 0;

  for (const record of records) {
    for (const file of pageFiles) {
      let content = fs.readFileSync(file, 'utf-8');
      const relFile = path.relative(path.join(__dirname, '..'), file);
      let modified = false;

      // Check this file contains the element definition
      const elementCheck = new RegExp(`name:\\s*['"]${escapeRegex(record.elementName)}['"]`);
      if (!elementCheck.test(content)) continue;

      // Remove each broken fallback string from the file
      for (const broken of record.brokenFallbacks) {
        const patterns = [
          new RegExp(`\\n\\s*'${escapeRegex(broken)}'\\s*,?`, 'g'),
          new RegExp(`\\n\\s*"${escapeRegex(broken)}"\\s*,?`, 'g'),
        ];

        for (const pattern of patterns) {
          const newContent = content.replace(pattern, '');
          if (newContent !== content) {
            content = newContent;
            modified = true;
          }
        }
      }

      // Fix any trailing commas before closing bracket
      content = content.replace(/,(\s*\])/g, '$1');
      // Collapse empty arrays with blank lines: [\n\n  ] → []
      content = content.replace(/\[\s*\]/g, '[]');

      // Add the working selector as a fallback if we have one and it's not already the primary
      if (record.workingSelector) {
        // Find the fallbacks array for this element: fallbacks: [...] or fallbacks: []
        const fallbacksPattern = new RegExp(
          `(name:\\s*['"]${escapeRegex(record.elementName)}['"][\\s\\S]*?fallbacks:\\s*)(\\[[^\\]]*\\])`,
        );
        const fallbackMatch = content.match(fallbacksPattern);

        if (fallbackMatch) {
          const currentArray = fallbackMatch[2];
          const escapedWorking = record.workingSelector.replace(/'/g, "\\'");

          // Only add if not already present
          if (!currentArray.includes(record.workingSelector)) {
            let newArray: string;
            if (currentArray === '[]') {
              // Empty array — add the working selector with proper indentation
              // Detect indentation from context: find the line with 'fallbacks:'
              const indentMatch = content.match(new RegExp(`([ \\t]*)fallbacks:\\s*\\[`));
              const baseIndent = indentMatch ? indentMatch[1] : '    ';
              const itemIndent = baseIndent + '  ';
              newArray = `[\n${itemIndent}'${escapedWorking}'\n${baseIndent}]`;
            } else {
              // Has existing entries — add before closing bracket
              const indentMatch = currentArray.match(/\n(\s*)\]/);
              const baseIndent = indentMatch ? indentMatch[1] : '    ';
              const itemIndent = baseIndent + '  ';
              newArray = currentArray.replace(
                /(\s*)\]/,
                `,\n${itemIndent}'${escapedWorking}'$1]`
              );
            }

            content = content.replace(fallbacksPattern, `$1${newArray}`);
            modified = true;
          }
        }
      }

      if (modified) {
        fs.writeFileSync(file, content);
        const actions: string[] = [];
        if (record.brokenFallbacks.length > 0) {
          actions.push(`removed ${record.brokenFallbacks.length} broken`);
        }
        if (record.workingSelector) {
          actions.push(`added '${record.workingSelector}'`);
        }
        details.push(`Fallbacks for "${record.elementName}" in ${relFile}: ${actions.join(', ')}`);
        patched++;
        break;
      }
    }
  }

  // Clean up
  if (patched > 0) {
    try { fs.unlinkSync(BROKEN_FALLBACKS_FILE); } catch { /* ignore */ }
  }

  return { patched, details };
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
