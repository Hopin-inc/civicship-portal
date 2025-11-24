import { GqlRole, GqlUser } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { matchPaths } from "@/utils/path";
import { logger } from "@/lib/logging";

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

  public static canAccessRole(user: GqlUser | null | undefined, pathname: string): boolean {
    logger.info("[LIFF-DEBUG] AccessPolicy.canAccessRole: start", {
      pathname,
      userId: user?.id,
      hasMemberships: !!user?.memberships?.length,
      membershipsCount: user?.memberships?.length ?? 0,
      currentCommunityId: COMMUNITY_ID,
      component: "AccessPolicy",
    });

    if (!user) {
      logger.info("[LIFF-DEBUG] AccessPolicy.canAccessRole: no user", {
        pathname,
        result: false,
        component: "AccessPolicy",
      });
      return false;
    }

    const membership = this.getMembership(user);
    logger.info("[LIFF-DEBUG] AccessPolicy.canAccessRole: membership check", {
      pathname,
      userId: user.id,
      hasMembership: !!membership,
      membershipCommunityId: membership?.community?.id,
      membershipRole: membership?.role,
      currentCommunityId: COMMUNITY_ID,
      allMembershipIds: user.memberships?.map(m => m.community?.id) ?? [],
      component: "AccessPolicy",
    });

    if (!membership) {
      logger.info("[LIFF-DEBUG] AccessPolicy.canAccessRole: no membership for current community", {
        pathname,
        userId: user.id,
        currentCommunityId: COMMUNITY_ID,
        result: false,
        component: "AccessPolicy",
      });
      return false;
    }

    if (this.isOwnerOnlyPath(pathname)) {
      const hasOwner = this.hasOwnerPrivileges(membership.role);
      logger.info("[LIFF-DEBUG] AccessPolicy.canAccessRole: owner-only path", {
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
      logger.info("[LIFF-DEBUG] AccessPolicy.canAccessRole: admin path", {
        pathname,
        userId: user.id,
        role: membership.role,
        result: hasManager,
        component: "AccessPolicy",
      });
      return hasManager;
    }

    // 一般ページは誰でもアクセス可能
    logger.info("[LIFF-DEBUG] AccessPolicy.canAccessRole: general path allowed", {
      pathname,
      userId: user.id,
      result: true,
      component: "AccessPolicy",
    });
    return true;
  }

  public static getFallbackPath(user: GqlUser | null | undefined): string {
    if (!user) return "/login";
    const membership = this.getMembership(user);
    
    if (!membership) {
      logger.warn("[CRITICAL] user_registered but no membership", {
        userId: user.id,
        communityId: COMMUNITY_ID,
        membershipIds: user.memberships?.map(m => m.community?.id) ?? [],
        component: "AccessPolicy",
      });
      return "/sign-up/phone-verification";
    }
    
    return "/";
  }
}
