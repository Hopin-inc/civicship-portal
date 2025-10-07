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

interface InitAuthFullParams {
  liffService: LiffService;
  authStateManager: AuthStateManager;
  environment: AuthEnvironment;
  ssrCurrentUser?: GqlUser | undefined | null;
  ssrPhoneAuthenticated?: boolean;
  setState: ReturnType<typeof useAuthStore.getState>["setState"];
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

  setState({
    isAuthInProgress: true,
    isAuthenticating: true,
  });

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

    // SSR時点でユーザーが存在する = 登録完了状態。
    // 電話認証済みであれば user_registered、それ以外でも最低限 line_authenticated 扱い。
    finalizeAuthState(
      ssrPhoneAuthenticated ? "user_registered" : "line_authenticated",
      ssrCurrentUser,
      setState,
      authStateManager,
    );

    TokenManager.saveLineAuthFlag(true);
    if (ssrPhoneAuthenticated) TokenManager.savePhoneAuthFlag(true);

    await authStateManager.handleUserRegistrationStateChange(true, { ssrMode: true });

    logger.debug("🚀 initAuthFast completed");
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
}: InitAuthFullParams) {
  try {
    prepareInitialState(setState);

    const firebaseUser = await initializeFirebase(liffService, environment);
    if (!firebaseUser) {
      const result = handleUnauthenticatedBranch(
        liffService,
        environment,
        setState,
        authStateManager,
      );
      if (result !== "continue") return;
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
    logger.error("initAuthFull failed", { error });
    finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
  }
}
