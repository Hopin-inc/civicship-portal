import { AuthStateManager } from "../core/auth-state-manager";
import { GqlUser } from "@/types/graphql";
import { encodeURIComponentWithType, matchPaths, RawURIComponent } from "@/utils/path";
import { AccessPolicy } from "@/lib/auth/core/access-policy";
import { AuthenticationState } from "@/types/auth";
import { logger } from "@/lib/logging";
import {
  extractCommunityIdFromPath,
  stripCommunityPrefix,
  addCommunityPrefix,
} from "@/lib/communities/communityIds";
import { useAuthStore } from "@/lib/auth/core/auth-store";

export class AuthRedirectService {
  private static instance: AuthRedirectService;
  private authStateManager: AuthStateManager;

  private constructor() {
    this.authStateManager = AuthStateManager.getInstance();
  }

  public static getInstance(): AuthRedirectService {
    if (!AuthRedirectService.instance) {
      AuthRedirectService.instance = new AuthRedirectService();
    }
    return AuthRedirectService.instance;
  }

  public getRedirectPath(
    pathname: RawURIComponent,
    next?: RawURIComponent | null,
    currentUser?: GqlUser | null,
  ): RawURIComponent | null {
    const authState = this.authStateManager.getState();
    const fullBasePath = pathname.split("?")[0];
    
    // Extract community prefix and normalize path for matching
    const communityId = extractCommunityIdFromPath(fullBasePath);
    const basePath = stripCommunityPrefix(fullBasePath);
    
    // Keep the original pathname (with community prefix) for next param
    const nextParam = next ? this.generateNextParam(next) : this.generateNextParam(pathname);

    logger.debug("[AUTH] AuthRedirectService.getRedirectPath", {
      pathname,
      fullBasePath,
      basePath,
      communityId,
      authState,
      currentUser: !!currentUser,
      currentUserId: currentUser?.id,
      next,
    });

    if (authState === "loading" || authState === "authenticating") {
      logger.debug("[AUTH] AuthRedirectService: skipping (loading/authenticating)");
      return null;
    }

    const redirectFromLogin = this.handleAuthEntryFlow(
      pathname,
      basePath,
      authState,
      next,
      nextParam,
      communityId,
    );
    if (redirectFromLogin) {
      // Add community prefix to redirect path if we have one
      const finalRedirect = communityId
        ? addCommunityPrefix(redirectFromLogin, communityId)
        : redirectFromLogin;
      logger.debug("[AUTH] AuthRedirectService: redirect from handleAuthEntryFlow", {
        redirectPath: finalRedirect,
      });
      return finalRedirect as RawURIComponent;
    }

    const redirectFromUserPath = this.handleUserPath(basePath, authState, currentUser, nextParam, communityId);
    if (redirectFromUserPath) {
      // Add community prefix to redirect path if we have one
      const finalRedirect = communityId
        ? addCommunityPrefix(redirectFromUserPath, communityId)
        : redirectFromUserPath;
      logger.debug("[AUTH] AuthRedirectService: redirect from handleUserPath", {
        redirectPath: finalRedirect,
      });
      return finalRedirect as RawURIComponent;
    }

    const redirectByRole = this.handleRoleRestriction(currentUser, basePath, communityId);
    if (redirectByRole) {
      // Add community prefix to redirect path if we have one
      const finalRedirect = communityId
        ? addCommunityPrefix(redirectByRole, communityId)
        : redirectByRole;
      logger.debug("[AUTH] AuthRedirectService: redirect from handleRoleRestriction", {
        redirectPath: finalRedirect,
      });
      return finalRedirect as RawURIComponent;
    }

    logger.debug("[AUTH] AuthRedirectService: no redirect needed");
    return null;
  }

  private generateNextParam(nextPath: RawURIComponent): RawURIComponent {
    return `?next=${encodeURIComponentWithType(nextPath)}` as RawURIComponent;
  }

  private isAuthEntryPath(pathname: string): boolean {
    const authEntryPaths = ["/login", "/sign-up", "/sign-up/phone-verification"];
    return matchPaths(pathname, ...authEntryPaths);
  }

  private handleAuthEntryFlow(
    pathname: string,
    basePath: string,
    authState: AuthenticationState,
    next?: string | null,
    nextParam?: string,
    currentCommunityId?: string | null,
  ): RawURIComponent | null {
    if (!this.isAuthEntryPath(basePath)) return null;

    switch (authState) {
      case "unauthenticated":
        if (basePath !== "/login") {
          return `/login${nextParam}` as RawURIComponent; // 未ログイン → ログインへ
        }
        return null;

      case "line_authenticated": {
        // Check if the LINE authentication is for the current community
        // If authenticatedCommunityId is set and doesn't match, redirect to login
        // If authenticatedCommunityId is null (legacy session), allow access (backward compatibility)
        const { authenticatedCommunityId } = useAuthStore.getState().state;
        const isAuthenticatedForDifferentCommunity = 
          authenticatedCommunityId && currentCommunityId && authenticatedCommunityId !== currentCommunityId;
        
        if (isAuthenticatedForDifferentCommunity) {
          // LINE authentication is for a different community, stay on login page
          if (basePath !== "/login") {
            return `/login${nextParam}` as RawURIComponent;
          }
          return null;
        }
        
        const target = `/sign-up/phone-verification${nextParam}`;
        if (pathname === target || basePath === "/sign-up/phone-verification") return null; // すでに居る場合はリダイレクト不要
        return target as RawURIComponent; // LINE認証済み → 電話認証へ
      }

      case "phone_authenticated":
        // Don't redirect if already on sign-up or phone-verification page
        // User may still be completing the identityCheckPhoneUser flow
        if (basePath !== "/sign-up" && basePath !== "/sign-up/phone-verification") {
          return `/sign-up${nextParam}` as RawURIComponent; // 電話認証済み → サインアップへ
        }
        return null;

      case "user_registered": {
        // Check if the user is registered for the current community
        // If authenticatedCommunityId is set and doesn't match, redirect to login
        // If authenticatedCommunityId is null (legacy session), allow access (backward compatibility)
        const { authenticatedCommunityId } = useAuthStore.getState().state;
        const isAuthenticatedForDifferentCommunity = 
          authenticatedCommunityId && currentCommunityId && authenticatedCommunityId !== currentCommunityId;
        
        if (isAuthenticatedForDifferentCommunity) {
          // User is registered for a different community, stay on login page
          if (basePath !== "/login") {
            return `/login${nextParam}` as RawURIComponent;
          }
          return null;
        }
        
        // 登録済みユーザーが sign-up 系や login に来たらトップ or nextへ
        if (next?.startsWith("/") && !next.startsWith("/login") && !next.startsWith("/sign-up")) {
          return next as RawURIComponent;
        }
        return "/" as RawURIComponent;
      }

      default:
        return null;
    }
  }

  private isUserPath(pathname: string): boolean {
    const userPaths = ["/users/me", "/tickets", "/wallets", "/wallets/*", "/admin", "/admin/*"];
    return matchPaths(pathname, ...userPaths);
  }

  private handleUserPath(
    basePath: string,
    authState: AuthenticationState,
    currentUser: GqlUser | null | undefined,
    nextParam?: string,
    currentCommunityId?: string | null,
  ): RawURIComponent | null {
    if (!this.isUserPath(basePath)) return null;

    switch (authState) {
      case "unauthenticated":
        return `/login${nextParam}` as RawURIComponent; // 未ログイン → ログインへ

      case "line_authenticated": {
        // Check if the LINE authentication is for the current community
        // If authenticatedCommunityId is set and doesn't match, redirect to login
        // If authenticatedCommunityId is null (legacy session), allow access (backward compatibility)
        const { authenticatedCommunityId } = useAuthStore.getState().state;
        const isAuthenticatedForDifferentCommunity = 
          authenticatedCommunityId && currentCommunityId && authenticatedCommunityId !== currentCommunityId;
        
        if (isAuthenticatedForDifferentCommunity) {
          logger.debug("[AUTH] LINE authentication is for a different community, redirecting to login", {
            authenticatedCommunityId,
            currentCommunityId,
          });
          return `/login${nextParam}` as RawURIComponent; // LINE認証が別コミュニティ → ログインへ
        }
        
        if (!currentUser) {
          return `/sign-up/phone-verification${nextParam}` as RawURIComponent; // LINE認証済み・未登録 → 電話認証へ
        }
        break;
      }

      case "phone_authenticated":
        if (!currentUser) {
          return `/sign-up${nextParam}` as RawURIComponent; // 電話認証済み・未登録 → サインアップへ
        }
        break;

      case "user_registered": {
        // Check if the user has membership in the current community
        // If authenticatedCommunityId is set and doesn't match, redirect to login
        // If authenticatedCommunityId is null (legacy session), check membership only
        const { authenticatedCommunityId } = useAuthStore.getState().state;
        const isAuthenticatedForDifferentCommunity = 
          authenticatedCommunityId && currentCommunityId && authenticatedCommunityId !== currentCommunityId;
        
        if (isAuthenticatedForDifferentCommunity) {
          logger.debug("[AUTH] User is registered but for a different community, redirecting to login", {
            authenticatedCommunityId,
            currentCommunityId,
          });
          return `/login${nextParam}` as RawURIComponent; // 別コミュニティで登録済み → ログインへ
        }
        
        // User is registered for the current community (or legacy session), check membership
        const hasMembershipInCurrentCommunity = currentUser?.memberships?.some(
          (m) => m.community?.id === currentCommunityId
        );
        
        if (!hasMembershipInCurrentCommunity) {
          logger.debug("[AUTH] User is registered but has no membership in current community, redirecting to login", {
            currentCommunityId,
            membershipIds: currentUser?.memberships?.map(m => m.community?.id) ?? [],
          });
          return `/login${nextParam}` as RawURIComponent; // 現コミュニティにメンバーシップなし → ログインへ
        }
        break;
      }
    }
    return null;
  }

  private handleRoleRestriction(
    currentUser: GqlUser | null | undefined,
    basePath: string,
    communityId: string | null,
  ): RawURIComponent | null {
    logger.debug("[AUTH] handleRoleRestriction: start", {
      basePath,
      communityId,
      userId: currentUser?.id,
      hasMemberships: !!currentUser?.memberships?.length,
      membershipsCount: currentUser?.memberships?.length ?? 0,
      membershipIds: currentUser?.memberships?.map(m => m.community?.id) ?? [],
      component: "AuthRedirectService",
    });

    if (!currentUser) {
      logger.debug("[AUTH] handleRoleRestriction: no currentUser", {
        component: "AuthRedirectService",
      });
      return null;
    }

    // Use runtime communityId from URL path, fallback to empty string if not available
    const effectiveCommunityId = communityId || "";
    const canAccess = AccessPolicy.canAccessRole(currentUser, basePath, effectiveCommunityId);
    logger.debug("[AUTH] handleRoleRestriction: canAccessRole result", {
      basePath,
      communityId: effectiveCommunityId,
      userId: currentUser.id,
      canAccess,
      component: "AuthRedirectService",
    });

    if (!canAccess) {
      const fallbackPath = AccessPolicy.getFallbackPath(currentUser, effectiveCommunityId);
      logger.debug("[AUTH] handleRoleRestriction: redirecting to fallback (master logic)", {
        basePath,
        userId: currentUser.id,
        fallbackPath,
        reason: "canAccessRole returned false",
        component: "AuthRedirectService",
      });
      return fallbackPath as RawURIComponent;
    }

    logger.debug("[AUTH] handleRoleRestriction: access allowed", {
      basePath,
      userId: currentUser.id,
      component: "AuthRedirectService",
    });
    return null;
  }
}
