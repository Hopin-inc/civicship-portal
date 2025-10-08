import { GqlRole, GqlUser } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { matchPaths } from "@/utils/path";

const OWNER_ONLY_PATHS = ["/admin/wallet", "/admin/members"];
const MANAGER_PATHS = ["/admin", "/admin/*"];

export class AccessPolicy {
  private static getMembership(user: GqlUser | null | undefined) {
    if (!user?.memberships?.length) return null;
    return user.memberships.find((m) => m.community?.id === COMMUNITY_ID) ?? null;
  }

  public static isAdminPath(pathname: string): boolean {
    return matchPaths(pathname, ...MANAGER_PATHS);
  }

  public static isOwnerOnlyPath(pathname: string): boolean {
    return matchPaths(pathname, ...OWNER_ONLY_PATHS);
  }

  private static hasManagerPrivileges(role: GqlRole | null | undefined): boolean {
    return role === GqlRole.Owner || role === GqlRole.Manager;
  }

  private static hasOwnerPrivileges(role: GqlRole | null | undefined): boolean {
    return role === GqlRole.Owner;
  }

  public static canAccess(user: GqlUser | null | undefined, pathname: string): boolean {
    if (!user) return false;

    const membership = this.getMembership(user);
    if (!membership) return false;

    if (this.isOwnerOnlyPath(pathname)) {
      return this.hasOwnerPrivileges(membership.role);
    }

    if (this.isAdminPath(pathname)) {
      return this.hasManagerPrivileges(membership.role);
    }

    // 一般ページは誰でもアクセス可能
    return true;
  }

  public static getFallbackPath(user: GqlUser | null | undefined): string {
    if (!user) return "/login";
    const membership = this.getMembership(user);
    return membership ? "/" : "/";
  }
}
