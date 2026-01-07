import { useAuthStore } from "@/lib/auth/core/auth-store";
import { logger } from "@/lib/logging";
import { TokenManager } from "@/lib/auth/core/token-manager";
import { GqlUser } from "@/types/graphql";
import { AuthEnvironment, detectEnvironment } from "@/lib/auth/core/environment-detector";
import { LiffService } from "@/lib/auth/service/liff-service";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import {
  establishSessionFromFirebaseUser,
  evaluateUserRegistrationState,
  finalizeAuthState,
  handleUnauthenticatedBranch,
  prepareInitialState,
  restoreUserSession,
} from "@/lib/auth/init/helper";
import { initializeFirebase } from "@/lib/auth/init/firebase";

interface InitAuthParams {
  liffService: LiffService;
  authStateManager: AuthStateManager;
  ssrCurrentUser?: GqlUser | undefined | null;
  ssrLineAuthenticated?: boolean;
  ssrPhoneAuthenticated?: boolean;
}

export async function initAuth(params: InitAuthParams) {
  const {
    authStateManager,
    ssrCurrentUser,
    ssrLineAuthenticated,
    ssrPhoneAuthenticated,
    liffService,
  } = params;

  const { setState, state } = useAuthStore.getState();
  if (state.isAuthInProgress) return;

  TokenManager.clearDeprecatedCookies();

  const environment = detectEnvironment();

  // Using warn level temporarily to ensure logs appear in staging/production
  logger.warn("[AUTH] initAuth: ENTRY", {
    environment,
    ssrCurrentUser: !!ssrCurrentUser,
    ssrCurrentUserId: ssrCurrentUser?.id,
    ssrLineAuthenticated,
    ssrPhoneAuthenticated,
    willUseInitAuthFast: !!(ssrCurrentUser && ssrLineAuthenticated),
    communityId: liffService.getCommunityId(),
    firebaseTenantId: liffService.getFirebaseTenantId(),
  });

  if (ssrCurrentUser && ssrLineAuthenticated) {
    return await initAuthFast({
      ssrCurrentUser,
      ssrPhoneAuthenticated,
      environment,
      liffService,
      authStateManager,
      setState,
    });
  }

  setState({ isAuthInProgress: true, isAuthenticating: true });
  return await initAuthFull({
    liffService,
    authStateManager,
    environment,
    ssrCurrentUser,
    ssrPhoneAuthenticated,
    setState,
  });
}

async function initAuthFast({
  ssrCurrentUser,
  ssrPhoneAuthenticated,
  environment,
  liffService,
  authStateManager,
  setState,
}: {
  ssrCurrentUser: GqlUser;
  ssrPhoneAuthenticated?: boolean;
  environment: AuthEnvironment;
  liffService: LiffService;
  authStateManager: AuthStateManager;
  setState: ReturnType<typeof useAuthStore.getState>["setState"];
}) {
  try {
    // Check if the user has membership in the current community
    // This is critical for multi-tenant isolation: a user logged into Community A
    // should not be considered authenticated when navigating to Community B
    const currentCommunityId = liffService.getCommunityId();
    const hasMembershipInCurrentCommunity = ssrCurrentUser.memberships?.some(
      (m) => m.community?.id === currentCommunityId
    );
    
    // Using warn level temporarily to ensure logs appear in staging/production
    logger.warn("[AUTH] initAuthFast: ENTRY - checking membership", {
      currentCommunityId,
      hasMembershipInCurrentCommunity,
      membershipIds: ssrCurrentUser.memberships?.map(m => m.community?.id) ?? [],
    });
    
    if (!hasMembershipInCurrentCommunity) {
      // User is authenticated but not for this community
      // Treat as unauthenticated so they get redirected to login
      logger.debug("[AUTH] initAuthFast: user has no membership in current community, treating as unauthenticated");
      finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
      return;
    }
    
    // User has membership in current community, proceed with normal auth flow
    // Store the community ID for which the user is authenticated
    setState({ authenticatedCommunityId: currentCommunityId });
    
    finalizeAuthState(
      ssrPhoneAuthenticated ? "user_registered" : "line_authenticated",
      ssrCurrentUser,
      setState,
      authStateManager,
    );
    // Save community-specific auth cookies
    TokenManager.saveLineAuthFlag(true, currentCommunityId);
    if (ssrPhoneAuthenticated) TokenManager.savePhoneAuthFlag(true, currentCommunityId);
    await authStateManager.handleUserRegistrationStateChange(
      !!ssrPhoneAuthenticated,
      { ssrMode: true }
    );

    // Initialize Firebase in background for CSR (non-blocking)
    // This ensures firebaseUser is available for client-side Apollo queries
    if (typeof window !== "undefined") {
      (async () => {
        try {
          const firebaseUser = await initializeFirebase(liffService, environment);
          if (firebaseUser) {
            useAuthStore.getState().setState({ firebaseUser });
            logger.debug("[AUTH] initAuthFast: Firebase user hydrated for CSR", {
              uid: firebaseUser.uid,
            });
          }
        } catch (error) {
          logger.warn("[AUTH] initAuthFast: Failed to hydrate Firebase user", { error });
        }
      })();
    }
  } catch (e) {
    logger.error("initAuthFast failed", { error: e });
    finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
  }
}

async function initAuthFull({
  liffService,
  authStateManager,
  environment,
  ssrCurrentUser,
  ssrPhoneAuthenticated,
  setState,
}: {
  liffService: LiffService;
  authStateManager: AuthStateManager;
  environment: AuthEnvironment;
  ssrCurrentUser?: GqlUser | undefined | null;
  ssrPhoneAuthenticated?: boolean;
  setState: ReturnType<typeof useAuthStore.getState>["setState"];
}) {
  try {
    prepareInitialState(setState);

    const firebaseUser = await initializeFirebase(liffService, environment);
    if (!firebaseUser) {
      const shouldContinue = handleUnauthenticatedBranch(
        liffService,
        environment,
        setState,
        authStateManager,
      );
      if (!shouldContinue) return;
      return;
    }

    // Get runtime communityId and tenantId from LiffService for community-specific handling
    const communityId = liffService.getCommunityId();
    const expectedTenantId = liffService.getFirebaseTenantId();
    
    // CRITICAL: Validate that the Firebase user's tenant matches the current community's tenant
    // This prevents cross-community authentication bypass where a user logged into Community A
    // could access Community B by having a valid Firebase session from Community A
    const firebaseUserTenantId = firebaseUser.tenantId;
    
    // Using warn level temporarily to ensure logs appear in staging/production
    logger.warn("[AUTH] initAuthFull: ENTRY - checking tenant validation", {
      firebaseUserTenantId,
      expectedTenantId,
      communityId,
      firebaseUserUid: firebaseUser.uid,
    });
    
    // Tenant validation logic:
    // 1. If Firebase user has a tenant ID but we don't have expected tenant ID (config not loaded),
    //    treat as unauthenticated - we can't verify the user belongs to this community
    // 2. If Firebase user has a tenant ID that doesn't match expected, treat as unauthenticated
    // 3. If Firebase user has no tenant ID but we expect one, treat as unauthenticated
    // 4. If both are null/undefined, allow (legacy case or non-tenant setup)
    const hasTenantMismatch = 
      (firebaseUserTenantId && !expectedTenantId) || // User has tenant but we don't know expected
      (firebaseUserTenantId && expectedTenantId && firebaseUserTenantId !== expectedTenantId) || // Tenant mismatch
      (!firebaseUserTenantId && expectedTenantId); // We expect tenant but user doesn't have one
    
    if (hasTenantMismatch) {
      // Using warn level temporarily to ensure logs appear in staging/production
      logger.warn("[AUTH] initAuthFull: Firebase tenant mismatch, treating as unauthenticated", {
        firebaseUserTenantId,
        expectedTenantId,
        communityId,
        reason: firebaseUserTenantId && !expectedTenantId 
          ? "user has tenant but expected is unknown" 
          : firebaseUserTenantId !== expectedTenantId 
            ? "tenant IDs do not match"
            : "expected tenant but user has none",
      });
      finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
      return;
    }
    
    // Log when tenant validation passes
    logger.warn("[AUTH] initAuthFull: Tenant validation passed, proceeding with session", {
      firebaseUserTenantId,
      expectedTenantId,
      communityId,
    });
    
    const sessionOk = await establishSessionFromFirebaseUser(firebaseUser, setState, communityId);
    if (!sessionOk) {
      finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
      return;
    }

    const user = await restoreUserSession(ssrCurrentUser, firebaseUser, setState);
    if (!user) {
      finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
      return;
    }

    await evaluateUserRegistrationState(user, ssrPhoneAuthenticated, setState, authStateManager, communityId);
  } catch (error) {
    logger.warn("initAuthFull failed", { error });
    finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
  }
}
