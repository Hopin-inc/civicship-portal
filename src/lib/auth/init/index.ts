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
  setState({ isAuthInProgress: true, isAuthenticating: true });

  const environment = detectEnvironment();
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
    if (environment === AuthEnvironment.LIFF) {
      try {
        await liffService.initialize();
      } catch (err) {
        logger.warn("LIFF initialization skipped", { error: err });
      }
    }

    finalizeAuthState(
      ssrPhoneAuthenticated ? "user_registered" : "line_authenticated",
      ssrCurrentUser,
      setState,
      authStateManager,
    );
    TokenManager.saveLineAuthFlag(true);
    if (ssrPhoneAuthenticated) TokenManager.savePhoneAuthFlag(true);
    await authStateManager.handleUserRegistrationStateChange(true, { ssrMode: true });
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
    logger.info("🔍 [initAuthFull] Starting full auth initialization");
    prepareInitialState(setState);

    logger.info("🔍 [initAuthFull] Initializing Firebase");
    const firebaseUser = await initializeFirebase(liffService, environment);
    if (!firebaseUser) {
      logger.info("🔍 [initAuthFull] No Firebase user, handling unauthenticated branch");
      const shouldContinue = handleUnauthenticatedBranch(
        liffService,
        environment,
        setState,
        authStateManager,
      );
      if (!shouldContinue) return;
      return;
    }

    logger.info("🔍 [initAuthFull] Firebase user found, establishing session", {
      firebaseUserId: firebaseUser.uid,
    });
    const sessionOk = await establishSessionFromFirebaseUser(firebaseUser, setState);
    if (!sessionOk) {
      logger.info("🔍 [initAuthFull] Session establishment failed");
      finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
      return;
    }

    logger.info("🔍 [initAuthFull] Session established, restoring user session");
    const user = await restoreUserSession(ssrCurrentUser, firebaseUser, setState);
    if (!user) {
      logger.info("🔍 [initAuthFull] User restoration failed");
      finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
      return;
    }

    logger.info("🔍 [initAuthFull] User restored, evaluating registration state", {
      userId: user.id,
    });
    await evaluateUserRegistrationState(user, ssrPhoneAuthenticated, setState, authStateManager);
  } catch (error) {
    logger.error("initAuthFull failed", { error });
    finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
  }
}
