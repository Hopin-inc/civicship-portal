#!/bin/bash

set -e

echo "🔍 Checking for server-only imports in client components..."

SERVER_ONLY_FILES=$(grep -rl "from [\"']next/headers[\"']" src/ || true)

if [ -z "$SERVER_ONLY_FILES" ]; then
  echo "✅ No files importing next/headers found"
  exit 0
fi

echo "📋 Files importing next/headers:"
echo "$SERVER_ONLY_FILES"
echo ""

ERRORS=0

for file in $SERVER_ONLY_FILES; do
  if ! grep -q "import [\"']server-only[\"']" "$file"; then
    echo "❌ ERROR: $file imports next/headers but is missing 'server-only' import"
    ERRORS=$((ERRORS + 1))
  fi
  
  MODULE_PATH=$(echo "$file" | sed 's|^src/||' | sed 's|\.[jt]sx\?$||')
  
  CLIENT_IMPORTS=$(grep -rl "\"use client\"" src/ | xargs grep -l "from [\"']@/$MODULE_PATH[\"']" 2>/dev/null || true)
  
  if [ -n "$CLIENT_IMPORTS" ]; then
    echo "❌ ERROR: $file is imported by client components:"
    echo "$CLIENT_IMPORTS"
    ERRORS=$((ERRORS + 1))
  fi
done

if [ $ERRORS -eq 0 ]; then
  echo "✅ All server-only imports are properly isolated"
  exit 0
else
  echo ""
  echo "❌ Found $ERRORS issue(s) with server-only imports"
  echo ""
  echo "To fix:"
  echo "1. Add 'import \"server-only\"' at the top of files importing next/headers"
  echo "2. Refactor client components to accept data as props instead of importing server-only modules"
  exit 1
fi
