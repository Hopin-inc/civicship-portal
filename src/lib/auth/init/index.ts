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

// ==================== 🪵 ログ永続関数 ====================
function log(step: string, data?: Record<string, any>) {
  const { state } = useAuthStore.getState(); // ← 現在の認証ステートを取得
  const entry = {
    ts: new Date().toISOString(),
    step,
    authenticationState: state.authenticationState,
    isAuthenticating: state.isAuthenticating,
    isAuthInProgress: state.isAuthInProgress,
    currentUser: !!state.currentUser,
    ...data,
  };

  console.log("[INIT AUTH]", entry);

  try {
    const existing = JSON.parse(localStorage.getItem("init-auth-debug") || "[]");
    existing.push(entry);
    localStorage.setItem("init-auth-debug", JSON.stringify(existing.slice(-200)));
  } catch {}
}
// =======================================================

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
  if (state.isAuthInProgress) {
    log("⏸ Already in progress");
    return;
  }

  setState({ isAuthInProgress: true, isAuthenticating: true });
  log("🚀 initAuth start", {
    ssrCurrentUser: !!ssrCurrentUser,
    ssrLineAuthenticated,
    ssrPhoneAuthenticated,
  });

  const environment = detectEnvironment();
  log("🌏 Environment detected", { environment });

  if (ssrCurrentUser && ssrLineAuthenticated) {
    log("⚡ Fast path (SSR user exists)");
    return await initAuthFast({
      ssrCurrentUser,
      ssrPhoneAuthenticated,
      environment,
      liffService,
      authStateManager,
      setState,
    });
  }

  log("🐢 Full path (no SSR user)");
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
    log("⚙️ initAuthFast start");

    if (environment === AuthEnvironment.LIFF) {
      try {
        log("🔧 initializing LIFF...");
        await liffService.initialize();
        log("✅ LIFF initialized");
      } catch (err) {
        logger.warn("LIFF initialization skipped", { error: err });
        log("⚠️ LIFF init skipped", { error: String(err) });
      }
    }

    finalizeAuthState(
      ssrPhoneAuthenticated ? "user_registered" : "line_authenticated",
      ssrCurrentUser,
      setState,
      authStateManager,
    );
    log("🏁 finalizeAuthState applied", {
      state: ssrPhoneAuthenticated ? "user_registered" : "line_authenticated",
    });

    TokenManager.saveLineAuthFlag(true);
    if (ssrPhoneAuthenticated) TokenManager.savePhoneAuthFlag(true);
    await authStateManager.handleUserRegistrationStateChange(true, { ssrMode: true });

    log("✅ initAuthFast completed");
  } catch (e) {
    logger.error("initAuthFast failed", { error: e });
    log("💥 initAuthFast failed", { error: String(e) });
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
    log("⚙️ initAuthFull start");
    prepareInitialState(setState);

    const firebaseUser = await initializeFirebase(liffService, environment);
    log("🔥 Firebase init result", { hasUser: !!firebaseUser });

    if (!firebaseUser) {
      const result = handleUnauthenticatedBranch(
        liffService,
        environment,
        setState,
        authStateManager,
      );
      log("🙅 handleUnauthenticatedBranch", { result });
      if (result !== "continue") return;
      return;
    }

    const sessionOk = await establishSessionFromFirebaseUser(firebaseUser, setState);
    log("🔑 establishSessionFromFirebaseUser", { sessionOk });

    if (!sessionOk) {
      finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
      log("🚫 finalize unauthenticated (no session)");
      return;
    }

    const user = await restoreUserSession(ssrCurrentUser, firebaseUser, setState);
    log("👤 restoreUserSession", { hasUser: !!user });

    if (!user) {
      finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
      log("🚫 finalize unauthenticated (no user)");
      return;
    }

    await evaluateUserRegistrationState(user, ssrPhoneAuthenticated, setState, authStateManager);
    log("✅ evaluateUserRegistrationState done");
  } catch (error) {
    logger.error("initAuthFull failed", { error });
    log("💥 initAuthFull failed", { error: String(error) });
    finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
  }
}
