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
    const paths = [
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
      "/admin/reservations"
    ];

    paths.forEach(path => this.validAdminPaths.add(path));
    this.addDynamicPathPatterns();
  }

  private addDynamicPathPatterns(): void {
    const dynamicPatterns = [
      "/admin/tickets/[id]",
      "/admin/credentials/[id]",
      "/admin/reservations/[id]"
    ];

    dynamicPatterns.forEach(pattern => this.validAdminPaths.add(pattern));
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
