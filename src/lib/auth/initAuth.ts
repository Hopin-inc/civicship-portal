import { useAuthStore } from "@/hooks/auth/auth-store";
import { logger } from "@/lib/logging";
import { TokenManager } from "@/lib/auth/token-manager";
import { AuthenticationState } from "@/types/auth";
import { LiffService } from "./liff-service";
import { AuthStateManager } from "./auth-state-manager";
import { GqlUser } from "@/types/graphql";
import { User } from "firebase/auth";
import { fetchCurrentUserClient } from "@/lib/auth/fetchCurrentUser";
import { AuthEnvironment, detectEnvironment } from "@/lib/auth/environment-detector";
import { lineAuth } from "@/lib/auth/firebase-config";
import { createSession } from "@/hooks/auth/actions/createSession";

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
  const environment = detectEnvironment();

  if (state.isAuthInProgress) return;

  // --- SSR完全保証モード（最速復元） ---
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

  console.log("⚠️Start initAuthFull", {
    isAuthInProgress: useAuthStore.getState().state.isAuthInProgress,
    authState: useAuthStore.getState().state,
  });

  // --- 通常モード ---
  return await initAuthFull({
    liffService,
    authStateManager,
    environment,
    ssrCurrentUser,
    ssrLineAuthenticated,
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
    );

    TokenManager.saveLineAuthFlag(true);
    if (ssrPhoneAuthenticated) TokenManager.savePhoneAuthFlag(true);

    await authStateManager.handleUserRegistrationStateChange(true, { ssrMode: true });

    logger.debug("🚀 initAuthFast completed");
  } catch (e) {
    logger.error("initAuthFast failed", { error: e });
    finalizeAuthState("unauthenticated", undefined, setState);
  }
}

async function initAuthFull({
  liffService,
  authStateManager,
  environment,
  ssrCurrentUser,
  ssrLineAuthenticated,
  ssrPhoneAuthenticated,
  setState,
}: {
  liffService: LiffService;
  authStateManager: AuthStateManager;
  environment: AuthEnvironment;
  ssrCurrentUser?: GqlUser | null | undefined;
  ssrLineAuthenticated?: boolean;
  ssrPhoneAuthenticated?: boolean;
  setState: ReturnType<typeof useAuthStore.getState>["setState"];
}) {
  try {
    prepareInitialState({ ssrLineAuthenticated, ssrPhoneAuthenticated }, setState);

    const firebaseUser = await initializeFirebase(liffService, environment, setState);
    if (!firebaseUser) {
      if (environment !== AuthEnvironment.LIFF) {
        await tryReSignIn(liffService, authStateManager, setState);
      }
      finalizeAuthState("unauthenticated", undefined, setState);
      return;
    }
    try {
      const idToken = await firebaseUser.getIdToken(true);
      await createSession(idToken);
      TokenManager.saveLineAuthFlag(true);
    } catch (err) {
      console.error("Failed to refresh server session", { err });
    }

    // --- ① PHONE認証済みかを先に確認（DB基準 or token基準） ---
    const isPhoneVerified = TokenManager.phoneVerified();
    if (ssrPhoneAuthenticated || isPhoneVerified) {
      // SSRでphone認証済みなら → user登録確認
      const user = await restoreUserSession(ssrCurrentUser, firebaseUser, setState);
      if (user) {
        finalizeAuthState("user_registered", user, setState);
        await authStateManager.handleUserRegistrationStateChange(true);
        return;
      }

      // phone認証済みだがuser未登録
      finalizeAuthState("phone_authenticated", undefined, setState);
      await authStateManager.handleUserRegistrationStateChange(false);
      return;
    }

    // --- ② phone認証まだ（ローカル補完 or LINEのみ） ---
    const localPhoneAuth = TokenManager.getPhoneAuthFlag?.() ?? false;
    if (localPhoneAuth) {
      finalizeAuthState("phone_authenticated", undefined, setState);
      await authStateManager.handleUserRegistrationStateChange(false);
      return;
    }

    // --- ③ user登録確認（LINEだけで登録済みパターン） ---
    const user = await restoreUserSession(ssrCurrentUser, firebaseUser, setState);
    if (user) {
      finalizeAuthState("user_registered", user, setState);
      await authStateManager.handleUserRegistrationStateChange(true);
      return;
    }

    // --- fallback: 非LIFF再署名 (401防止ライン) ---
    if (environment !== AuthEnvironment.LIFF) {
      await tryReSignIn(liffService, authStateManager, setState);
    }

    finalizeAuthState("line_authenticated", undefined, setState);
    await authStateManager.handleUserRegistrationStateChange(false);
  } catch (e) {
    logger.error("initAuthFull failed", { error: e });
    finalizeAuthState("unauthenticated", undefined, setState);
  }
}

function prepareInitialState(
  {
    ssrLineAuthenticated,
    ssrPhoneAuthenticated,
  }: {
    ssrLineAuthenticated?: boolean;
    ssrPhoneAuthenticated?: boolean;
  },
  setState: ReturnType<typeof useAuthStore.getState>["setState"],
) {
  if (ssrLineAuthenticated) {
    let initialState: AuthenticationState = "line_authenticated";

    if (ssrPhoneAuthenticated) {
      initialState = "phone_authenticated";
    }

    setState({
      authenticationState: initialState,
      isAuthenticating: true,
      isAuthInProgress: true,
    });
  } else {
    setState({
      authenticationState: "loading",
      isAuthenticating: true,
      isAuthInProgress: true,
    });
  }
}

async function initializeFirebase(
  liffService: LiffService,
  environment: AuthEnvironment,
  _setState: ReturnType<typeof useAuthStore.getState>["setState"],
): Promise<User | null> {
  if (environment === AuthEnvironment.LIFF) {
    try {
      await liffService.initialize();
    } catch (err) {
      logger.warn("LIFF init skipped", { err });
    }
  }

  return (
    lineAuth.currentUser ??
    (await new Promise<User | null>((resolve) => {
      const unsub = lineAuth.onAuthStateChanged((u) => {
        unsub();
        resolve(u);
      });
    }))
  );
}

async function tryReSignIn(
  liffService: LiffService,
  authStateManager: AuthStateManager,
  setState: ReturnType<typeof useAuthStore.getState>["setState"],
) {
  const { isInitialized, isLoggedIn } = liffService.getState();
  if (isInitialized && isLoggedIn) {
    try {
      const success = await liffService.signInWithLiffToken();
      if (success) {
        const newUser = await fetchCurrentUserClient();
        if (newUser) {
          setState({
            currentUser: newUser,
            authenticationState: "user_registered",
            isAuthenticating: false,
            isAuthInProgress: false,
          });
          await authStateManager.handleUserRegistrationStateChange(true);
        }
      }
    } catch (error) {
      logger.error("ReSignIn failed", { error, component: "tryReSignIn" });
    }
  }
}

async function restoreUserSession(
  ssrCurrentUser: GqlUser | null | undefined,
  firebaseUser: User,
  setState: ReturnType<typeof useAuthStore.getState>["setState"],
): Promise<GqlUser | null> {
  const idToken = await firebaseUser.getIdToken(true);
  const tokenResult = await firebaseUser.getIdTokenResult();
  const expiresAt = new Date(tokenResult.expirationTime).getTime();

  useAuthStore.getState().setState({
    lineTokens: {
      accessToken: idToken,
      refreshToken: firebaseUser.refreshToken ?? null,
      expiresAt,
    },
  });

  if (ssrCurrentUser) {
    setState({ currentUser: ssrCurrentUser });
    return ssrCurrentUser;
  }

  const user = await fetchCurrentUserClient();
  if (user) {
    setState({ currentUser: user });
    return user;
  }

  return null;
}

function finalizeAuthState(
  state: AuthenticationState,
  user?: GqlUser,
  setState?: ReturnType<typeof useAuthStore.getState>["setState"],
) {
  setState?.({
    authenticationState: state,
    currentUser: user ?? null,
    isAuthenticating: false,
    isAuthInProgress: false,
  });
}
