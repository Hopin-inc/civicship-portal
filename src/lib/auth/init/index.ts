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

  logger.info("[AUTH] initAuth", {
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

    await evaluateUserRegistrationState(user, ssrPhoneAuthenticated, setState, authStateManager);
  } catch (error) {
    logger.warn("initAuthFull failed", { error });
    finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
  }
}
