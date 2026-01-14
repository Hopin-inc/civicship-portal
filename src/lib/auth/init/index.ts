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
    logger.warn("[DEBUG] initAuthFull: START", {
      environment,
      ssrCurrentUser: !!ssrCurrentUser,
      ssrPhoneAuthenticated,
      currentState: useAuthStore.getState().state,
    });

    prepareInitialState(setState);

    logger.warn("[DEBUG] initAuthFull: After prepareInitialState", {
      currentState: useAuthStore.getState().state,
    });

    const firebaseUser = await initializeFirebase(liffService, environment);
    logger.warn("[DEBUG] initAuthFull: After initializeFirebase", {
      firebaseUser: !!firebaseUser,
      firebaseUid: firebaseUser?.uid,
      liffState: liffService.getState(),
    });

    if (!firebaseUser) {
      logger.warn("[DEBUG] initAuthFull: No firebaseUser, calling handleUnauthenticatedBranch");
      const shouldContinue = handleUnauthenticatedBranch(
        liffService,
        environment,
        setState,
        authStateManager,
      );
      logger.warn("[DEBUG] initAuthFull: handleUnauthenticatedBranch returned", {
        shouldContinue,
        currentState: useAuthStore.getState().state,
      });
      if (!shouldContinue) return;
      return;
    }

    const sessionOk = await establishSessionFromFirebaseUser(firebaseUser, setState);
    logger.warn("[DEBUG] initAuthFull: After establishSessionFromFirebaseUser", {
      sessionOk,
      currentState: useAuthStore.getState().state,
    });

    if (!sessionOk) {
      logger.warn("[DEBUG] initAuthFull: Session failed, setting unauthenticated");
      finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
      return;
    }

    const user = await restoreUserSession(ssrCurrentUser, firebaseUser, setState);
    logger.warn("[DEBUG] initAuthFull: After restoreUserSession", {
      user: !!user,
      userId: user?.id,
      currentState: useAuthStore.getState().state,
    });

    if (!user) {
      logger.warn("[DEBUG] initAuthFull: No user found in DB, setting unauthenticated", {
        firebaseUid: firebaseUser.uid,
        beforeState: useAuthStore.getState().state,
      });
      finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
      logger.warn("[DEBUG] initAuthFull: COMPLETE (no user path)", {
        finalState: useAuthStore.getState().state,
      });
      return;
    }

    logger.warn("[DEBUG] initAuthFull: User found, evaluating registration state");
    await evaluateUserRegistrationState(user, ssrPhoneAuthenticated, setState, authStateManager);
    logger.warn("[DEBUG] initAuthFull: COMPLETE (user found path)", {
      finalState: useAuthStore.getState().state,
    });
  } catch (error) {
    logger.warn("[DEBUG] initAuthFull: FAILED with error", { error });
    finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
  }
}
