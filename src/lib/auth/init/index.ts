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
import { fetchCurrentUserClient } from "@/lib/auth/init/fetchCurrentUser";
import { CommunityPortalConfig } from "@/lib/communities/config";

interface InitAuthParams {
  communityConfig: CommunityPortalConfig | null;
  liffService: LiffService;
  authStateManager: AuthStateManager;
  ssrCurrentUser?: GqlUser | undefined | null;
  ssrLineAuthenticated?: boolean;
  ssrPhoneAuthenticated?: boolean;
}

export async function initAuth(params: InitAuthParams) {
  const {
    communityConfig,
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
    logger.warn("[initAuth] 🔍 taking initAuthFast path", {
      ssrPhoneAuthenticated,
      ssrCurrentUserId: ssrCurrentUser?.id,
      component: "initAuth",
    });
    return await initAuthFast({
      communityConfig,
      ssrCurrentUser,
      ssrPhoneAuthenticated,
      environment,
      liffService,
      authStateManager,
      setState,
    });
  }

  logger.warn("[initAuth] 🔍 taking initAuthFull path - setting isAuthInProgress=true", {
    environment,
    ssrCurrentUser: !!ssrCurrentUser,
    component: "initAuth",
  });
  setState({ isAuthInProgress: true, isAuthenticating: true });
  return await initAuthFull({
    communityConfig,
    liffService,
    authStateManager,
    environment,
    ssrCurrentUser,
    ssrPhoneAuthenticated,
    setState,
  });
}

async function initAuthFast({
  communityConfig,
  ssrCurrentUser,
  ssrPhoneAuthenticated,
  environment,
  liffService,
  authStateManager,
  setState,
}: {
  communityConfig: CommunityPortalConfig | null;
  ssrCurrentUser: GqlUser;
  ssrPhoneAuthenticated?: boolean;
  environment: AuthEnvironment;
  liffService: LiffService;
  authStateManager: AuthStateManager;
  setState: ReturnType<typeof useAuthStore.getState>["setState"];
}) {
  try {
    finalizeAuthState(
      ssrPhoneAuthenticated ? "user_registered" : "line_authenticated",
      ssrCurrentUser,
      setState,
      authStateManager,
    );
    if (ssrPhoneAuthenticated) TokenManager.savePhoneAuthFlag(true);
    await authStateManager.handleUserRegistrationStateChange(!!ssrPhoneAuthenticated, {
      ssrMode: true,
    });

    // Initialize Firebase in background for CSR (non-blocking)
    // This ensures firebaseUser is available for client-side Apollo queries
    if (typeof window !== "undefined") {
      (async () => {
        try {
          const firebaseUser = await initializeFirebase(
            liffService,
            environment,
            communityConfig?.firebaseTenantId,
          );
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
  communityConfig,
  liffService,
  authStateManager,
  environment,
  ssrCurrentUser,
  ssrPhoneAuthenticated,
  setState,
}: {
  communityConfig: CommunityPortalConfig | null;
  liffService: LiffService;
  authStateManager: AuthStateManager;
  environment: AuthEnvironment;
  ssrCurrentUser?: GqlUser | undefined | null;
  ssrPhoneAuthenticated?: boolean;
  setState: ReturnType<typeof useAuthStore.getState>["setState"];
}) {
  try {
    prepareInitialState(setState);

    const firebaseUser = await initializeFirebase(
      liffService,
      environment,
      communityConfig?.firebaseTenantId,
    );
    if (!firebaseUser) {
      // 新フロー: signInWithLiffToken が /api/auth/exchange 経由で成功したが
      // Firebase SDK へのサインインがないため lineAuth.currentUser = null になる。
      // lineTokens.accessToken が存在すれば exchange 済みと判断してセッション復元へ進む。
      const { lineTokens } = useAuthStore.getState().state;
      logger.warn("[initAuthFull] 🔍 firebaseUser is null, checking lineTokens", {
        hasLineTokenAccessToken: !!lineTokens.accessToken,
        lineTokenAccessTokenLength: lineTokens.accessToken?.length ?? 0,
        component: "initAuthFull",
      });
      if (lineTokens.accessToken) {
        logger.warn("[initAuthFull] lineTokens present without Firebase user, restoring session via cookie", {
          component: "initAuthFull",
        });
        const user = await fetchCurrentUserClient(communityConfig, null);
        logger.warn("[initAuthFull] 🔍 fetchCurrentUserClient result", {
          hasUser: !!user,
          userId: user?.id,
          component: "initAuthFull",
        });
        if (!user) {
          finalizeAuthState("line_authenticated", undefined, setState, authStateManager);
          return;
        }
        await evaluateUserRegistrationState(user, ssrPhoneAuthenticated, setState, authStateManager);
        return;
      }

      const shouldContinue = handleUnauthenticatedBranch(
        liffService,
        environment,
        setState,
        authStateManager,
      );
      if (!shouldContinue) return;
      return;
    }

    const sessionOk = await establishSessionFromFirebaseUser(firebaseUser, setState, communityConfig?.firebaseTenantId);
    if (!sessionOk) {
      finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
      return;
    }

    const user = await restoreUserSession(communityConfig, ssrCurrentUser, firebaseUser, setState);
    if (!user) {
      finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
      return;
    }

    await evaluateUserRegistrationState(user, ssrPhoneAuthenticated, setState, authStateManager);
  } catch (error) {
    logger.warn("initAuthFull failed", { error });
    finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
  }
}
