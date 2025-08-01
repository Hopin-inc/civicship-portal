import * as fs from 'fs';
import * as path from 'path';

export class AdminPathManager {
  private static instance: AdminPathManager;
  private validAdminPaths: Set<string> = new Set();

  private constructor() {
    this.initializeValidPaths();
  }

  public static getInstance(): AdminPathManager {
    if (!AdminPathManager.instance) {
      AdminPathManager.instance = new AdminPathManager();
    }
    return AdminPathManager.instance;
  }

  private initializeValidPaths(): void {
    try {
      const adminDir = path.join(process.cwd(), 'src/app/admin');
      const paths = this.scanAdminDirectory(adminDir);
      paths.forEach(routePath => this.validAdminPaths.add(routePath));
    } catch (error) {
      console.warn('AdminPathManager: Failed to scan admin directory, using fallback paths', error);
      this.initializeFallbackPaths();
    }
  }

  private scanAdminDirectory(dir: string): string[] {
    const paths: string[] = [];
    
    if (!fs.existsSync(dir)) {
      return paths;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subPaths = this.scanAdminDirectory(fullPath);
        paths.push(...subPaths);
      } else if (entry.name === 'page.tsx') {
        const routePath = this.convertToRoutePath(dir);
        if (routePath) {
          paths.push(routePath);
        }
      }
    }
    
    return paths;
  }

  private convertToRoutePath(dirPath: string): string | null {
    try {
      const adminDir = path.join(process.cwd(), 'src/app/admin');
      const relativePath = path.relative(adminDir, dirPath);
      
      if (relativePath === '') {
        return '/admin';
      }
      
      const routePath = '/admin/' + relativePath.replace(/\\/g, '/');
      return routePath;
    } catch (error) {
      console.warn('AdminPathManager: Failed to convert path', dirPath, error);
      return null;
    }
  }

  private initializeFallbackPaths(): void {
    const fallbackPaths = [
      "/admin",
      "/admin/tickets",
      "/admin/tickets/utilities",
      "/admin/members",
      "/admin/setting",
      "/admin/wallet",
      "/admin/wallet/issue",
      "/admin/wallet/grant",
      "/admin/credentials",
      "/admin/credentials/issue",
      "/admin/reservations",
      "/admin/tickets/[id]",
      "/admin/credentials/[id]",
      "/admin/reservations/[id]"
    ];

    fallbackPaths.forEach(path => this.validAdminPaths.add(path));
  }

  public isValidAdminPath(pathname: string): boolean {
    if (this.validAdminPaths.has(pathname)) {
      return true;
    }

    return this.matchesDynamicPattern(pathname);
  }

  private matchesDynamicPattern(pathname: string): boolean {
    const segments = pathname.split('/').filter(Boolean);
    
    if (segments.length < 2 || segments[0] !== 'admin') {
      return false;
    }

    for (const pattern of this.validAdminPaths) {
      if (this.matchesPattern(pathname, pattern)) {
        return true;
      }
    }

    return false;
  }

  private matchesPattern(pathname: string, pattern: string): boolean {
    const pathSegments = pathname.split('/').filter(Boolean);
    const patternSegments = pattern.split('/').filter(Boolean);

    if (pathSegments.length !== patternSegments.length) {
      return false;
    }

    return patternSegments.every((segment, index) => {
      if (segment.startsWith('[') && segment.endsWith(']')) {
        return true;
      }
      return segment === pathSegments[index];
    });
  }

  public addValidPath(path: string): void {
    this.validAdminPaths.add(path);
  }

  public getValidPaths(): string[] {
    return Array.from(this.validAdminPaths);
  }
}
