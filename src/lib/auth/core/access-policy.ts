import { GqlRole, GqlUser } from "@/types/graphql";
import { matchPaths } from "@/utils/path";
import { logger } from "@/lib/logging";

const OWNER_ONLY_PATHS = ["/admin/wallet", "/admin/members"];
const MANAGER_PATHS = ["/admin", "/admin/*"];

export class AccessPolicy {
  /**
   * Get user's membership for a specific community
   * @param communityId - Runtime community ID from URL path
   */
  private static getMembership(user: GqlUser | null | undefined, communityId: string) {
    if (!user?.memberships?.length) return null;
    return user.memberships.find((m) => m.community?.id === communityId) ?? null;
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

  /**
   * Check if user can access a specific path based on their role in the community
   * @param communityId - Runtime community ID from URL path
   */
  public static canAccessRole(user: GqlUser | null | undefined, pathname: string, communityId: string): boolean {
    logger.debug("[AUTH] AccessPolicy.canAccessRole: start", {
      pathname,
      userId: user?.id,
      hasMemberships: !!user?.memberships?.length,
      membershipsCount: user?.memberships?.length ?? 0,
      currentCommunityId: communityId,
      component: "AccessPolicy",
    });

    if (!user) {
      logger.debug("[AUTH] AccessPolicy.canAccessRole: no user", {
        pathname,
        result: false,
        component: "AccessPolicy",
      });
      return false;
    }

    const membership = this.getMembership(user, communityId);
    logger.debug("[AUTH] AccessPolicy.canAccessRole: membership check", {
      pathname,
      userId: user.id,
      hasMembership: !!membership,
      membershipCommunityId: membership?.community?.id,
      membershipRole: membership?.role,
      currentCommunityId: communityId,
      allMembershipIds: user.memberships?.map(m => m.community?.id) ?? [],
      component: "AccessPolicy",
    });

    if (!membership) {
      logger.debug("[AUTH] AccessPolicy.canAccessRole: no membership for current community", {
        pathname,
        userId: user.id,
        currentCommunityId: communityId,
        result: false,
        component: "AccessPolicy",
      });
      return false;
    }

    if (this.isOwnerOnlyPath(pathname)) {
      const hasOwner = this.hasOwnerPrivileges(membership.role);
      logger.debug("[AUTH] AccessPolicy.canAccessRole: owner-only path", {
        pathname,
        userId: user.id,
        role: membership.role,
        result: hasOwner,
        component: "AccessPolicy",
      });
      return hasOwner;
    }

    if (this.isAdminPath(pathname)) {
      const hasManager = this.hasManagerPrivileges(membership.role);
      logger.debug("[AUTH] AccessPolicy.canAccessRole: admin path", {
        pathname,
        userId: user.id,
        role: membership.role,
        result: hasManager,
        component: "AccessPolicy",
      });
      return hasManager;
    }

    // 一般ページは誰でもアクセス可能
    logger.debug("[AUTH] AccessPolicy.canAccessRole: general path allowed", {
      pathname,
      userId: user.id,
      result: true,
      component: "AccessPolicy",
    });
    return true;
  }

  /**
   * Get fallback path for user based on their membership status
   * @param communityId - Runtime community ID from URL path
   */
  public static getFallbackPath(user: GqlUser | null | undefined, communityId: string): string {
    if (!user) return "/login";
    const membership = this.getMembership(user, communityId);
    
    if (!membership) {
      logger.warn("[AUTH] user_registered but no membership", {
        userId: user.id,
        communityId: communityId,
        membershipIds: user.memberships?.map(m => m.community?.id) ?? [],
        component: "AccessPolicy",
      });
      return "/sign-up/phone-verification";
    }
    
    return "/";
  }
}
