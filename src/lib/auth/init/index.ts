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

  logger.debug("[AUTH] initAuth", {
    environment,
    ssrCurrentUser: !!ssrCurrentUser,
    ssrCurrentUserId: ssrCurrentUser?.id,
    ssrLineAuthenticated,
    ssrPhoneAuthenticated,
    willUseInitAuthFast: !!(ssrCurrentUser && ssrLineAuthenticated),
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
    
    logger.debug("[AUTH] initAuthFast: checking membership", {
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
    TokenManager.saveLineAuthFlag(true);
    if (ssrPhoneAuthenticated) TokenManager.savePhoneAuthFlag(true);
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

    const sessionOk = await establishSessionFromFirebaseUser(firebaseUser, setState);
    if (!sessionOk) {
      finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
      return;
    }

    const user = await restoreUserSession(ssrCurrentUser, firebaseUser, setState);
    if (!user) {
      finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
      return;
    }

    // Pass runtime communityId from LiffService instead of build-time COMMUNITY_ID
    const communityId = liffService.getCommunityId();
    await evaluateUserRegistrationState(user, ssrPhoneAuthenticated, setState, authStateManager, communityId);
  } catch (error) {
    logger.warn("initAuthFull failed", { error });
    finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
  }
}
