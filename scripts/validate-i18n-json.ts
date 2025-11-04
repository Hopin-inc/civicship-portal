#!/usr/bin/env tsx

/**
 * Script to validate JSON syntax in translation files
 * 
 * Usage:
 *   pnpm tsx scripts/validate-i18n-json.ts
 */

import fs from 'fs';
import path from 'path';

const MESSAGES_DIR = path.join(process.cwd(), 'src/messages');

interface ValidationResult {
  valid: boolean;
  errors: Array<{ file: string; error: string }>;
}

/**
 * Validate all JSON files in messages directory
 */
function validateJsonFiles(): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
  };

  const locales = fs.readdirSync(MESSAGES_DIR);

  for (const locale of locales) {
    const localePath = path.join(MESSAGES_DIR, locale);
    if (!fs.statSync(localePath).isDirectory()) continue;

    const files = fs.readdirSync(localePath).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(localePath, file);
      const relativePath = path.relative(process.cwd(), filePath);

      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        JSON.parse(content);
        
        const parsed = JSON.parse(content);
        const keys = Object.keys(parsed);
        
        for (const key of keys) {
          if (!key.includes('.')) {
            result.valid = false;
            result.errors.push({
              file: relativePath,
              error: `Key "${key}" does not follow flat dotted format (expected format: "namespace.component.element")`,
            });
          }
          
          if (typeof parsed[key] !== 'string') {
            result.valid = false;
            result.errors.push({
              file: relativePath,
              error: `Value for key "${key}" must be a string, got ${typeof parsed[key]}`,
            });
          }
        }
      } catch (error) {
        result.valid = false;
        result.errors.push({
          file: relativePath,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  return result;
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Validating i18n JSON files...\n');

  const result = validateJsonFiles();

  if (result.valid) {
    console.log('✅ All JSON files are valid!\n');
    process.exit(0);
  } else {
    console.log('❌ Found validation errors:\n');
    for (const error of result.errors) {
      console.log(`  ${error.file}:`);
      console.log(`    ${error.error}\n`);
    }
    process.exit(1);
  }
}

main();
