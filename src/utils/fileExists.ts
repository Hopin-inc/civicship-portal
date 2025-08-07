import fs from 'fs';
import path from 'path';

export function getAssetWithFallback(assetPath: string, fallbackPath: string): string {
  if (typeof window !== 'undefined') {
    return assetPath;
  }
  
  try {
    const fullPath = path.join(process.cwd(), 'public', assetPath.replace(/^\//, ''));
    fs.accessSync(fullPath);
    return assetPath;
  } catch {
    return fallbackPath;
  }
}
