#!/usr/bin/env tsx

/**
 * Script to detect unused and missing translation keys
 * 
 * Usage:
 *   pnpm tsx scripts/check-i18n-keys.ts
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const MESSAGES_DIR = path.join(process.cwd(), 'src/messages');
const SRC_DIR = path.join(process.cwd(), 'src');

interface TranslationKeys {
  [locale: string]: Set<string>;
}

interface UsageReport {
  usedKeys: Set<string>;
  unusedKeys: { [locale: string]: string[] };
  missingKeys: { [locale: string]: string[] };
  inconsistentKeys: string[];
}

/**
 * Load all translation keys from JSON files
 */
function loadTranslationKeys(): TranslationKeys {
  const keys: TranslationKeys = {};
  const locales = fs.readdirSync(MESSAGES_DIR);

  for (const locale of locales) {
    const localePath = path.join(MESSAGES_DIR, locale);
    if (!fs.statSync(localePath).isDirectory()) continue;

    keys[locale] = new Set();
    const files = fs.readdirSync(localePath).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(localePath, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      Object.keys(content).forEach(key => keys[locale].add(key));
    }
  }

  return keys;
}

/**
 * Find all translation key usages in source code
 */
async function findUsedKeys(): Promise<Set<string>> {
  const usedKeys = new Set<string>();
  
  const files = await glob('**/*.{ts,tsx}', {
    cwd: SRC_DIR,
    ignore: ['**/*.d.ts', '**/*.test.ts', '**/*.test.tsx', '**/node_modules/**'],
    absolute: true,
  });

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    
    const singleQuoteMatches = content.matchAll(/(?:^|[^A-Za-z0-9_])t(?:\s*\.\s*rich)?\s*\(\s*['"]([^'"]+)['"]\s*[,)]/g);
    const templateMatches = content.matchAll(/(?:^|[^A-Za-z0-9_])t(?:\s*\.\s*rich)?\s*\(\s*`([^`]+)`\s*[,)]/g);
    
    for (const match of singleQuoteMatches) {
      const key = match[1];
      if (key.includes('.') && /^[A-Za-z][\w.-]*\.[\w.-]+$/.test(key)) {
        usedKeys.add(key);
      }
    }
    
    for (const match of templateMatches) {
      const key = match[1];
      if (!key.includes('${') && key.includes('.') && /^[A-Za-z][\w.-]*\.[\w.-]+$/.test(key)) {
        usedKeys.add(key);
      }
    }
  }

  return usedKeys;
}

/**
 * Generate usage report
 */
function generateReport(translationKeys: TranslationKeys, usedKeys: Set<string>): UsageReport {
  const report: UsageReport = {
    usedKeys,
    unusedKeys: {},
    missingKeys: {},
    inconsistentKeys: [],
  };

  const locales = Object.keys(translationKeys);
  const allDefinedKeys = new Set<string>();

  for (const locale of locales) {
    translationKeys[locale].forEach(key => allDefinedKeys.add(key));
  }

  for (const locale of locales) {
    report.unusedKeys[locale] = [];
    for (const key of translationKeys[locale]) {
      if (!usedKeys.has(key)) {
        report.unusedKeys[locale].push(key);
      }
    }
  }

  for (const locale of locales) {
    report.missingKeys[locale] = [];
    for (const key of usedKeys) {
      if (!translationKeys[locale].has(key)) {
        report.missingKeys[locale].push(key);
      }
    }
  }

  for (const key of allDefinedKeys) {
    const presentIn = locales.filter(locale => translationKeys[locale].has(key));
    if (presentIn.length > 0 && presentIn.length < locales.length) {
      report.inconsistentKeys.push(key);
    }
  }

  return report;
}

/**
 * Print report
 */
function printReport(report: UsageReport) {
  console.log('\n📊 i18n Translation Keys Report\n');
  console.log('='.repeat(60));

  console.log('\n📈 Summary:');
  console.log(`  Used keys: ${report.usedKeys.size}`);
  
  const totalUnused = Object.values(report.unusedKeys).reduce((sum, keys) => sum + keys.length, 0);
  const totalMissing = Object.values(report.missingKeys).reduce((sum, keys) => sum + keys.length, 0);
  
  console.log(`  Unused keys: ${totalUnused}`);
  console.log(`  Missing keys: ${totalMissing}`);
  console.log(`  Inconsistent keys: ${report.inconsistentKeys.length}`);

  if (totalUnused > 0) {
    console.log('\n⚠️  Unused Keys (defined but not used in code):');
    for (const [locale, keys] of Object.entries(report.unusedKeys)) {
      if (keys.length > 0) {
        console.log(`\n  ${locale}:`);
        keys.forEach(key => console.log(`    - ${key}`));
      }
    }
  }

  if (totalMissing > 0) {
    console.log('\n❌ Missing Keys (used in code but not defined):');
    for (const [locale, keys] of Object.entries(report.missingKeys)) {
      if (keys.length > 0) {
        console.log(`\n  ${locale}:`);
        keys.forEach(key => console.log(`    - ${key}`));
      }
    }
  }

  if (report.inconsistentKeys.length > 0) {
    console.log('\n⚠️  Inconsistent Keys (not present in all locales):');
    report.inconsistentKeys.forEach(key => console.log(`  - ${key}`));
  }

  if (totalUnused === 0 && totalMissing === 0 && report.inconsistentKeys.length === 0) {
    console.log('\n✅ All translation keys are consistent and properly used!');
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🔍 Analyzing translation keys...\n');

    const translationKeys = loadTranslationKeys();
    const usedKeys = await findUsedKeys();
    const report = generateReport(translationKeys, usedKeys);

    printReport(report);

    const hasIssues = 
      Object.values(report.missingKeys).some(keys => keys.length > 0) ||
      report.inconsistentKeys.length > 0;

    if (hasIssues) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
