import { useAuthStore } from "@/lib/auth/core/auth-store";
import { AuthenticationState } from "@/types/auth";
import { GqlUser } from "@/types/graphql";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { fetchCurrentUserClient } from "@/lib/auth/init/fetchCurrentUser";
import { TokenManager } from "@/lib/auth/core/token-manager";
import { User } from "firebase/auth";
import { LiffService } from "@/lib/auth/service/liff-service";
import { AuthEnvironment } from "@/lib/auth/core/environment-detector";
import { logger } from "@/lib/logging";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { getUidSuffix } from "@/lib/logging/client/utils";

/**
 * 1️⃣ 認証前の初期状態を設定
 */
export function prepareInitialState(
  setState: ReturnType<typeof useAuthStore.getState>["setState"],
) {
  const current = useAuthStore.getState().state.authenticationState;
  if (current !== "loading") return;
  setState({
    authenticationState: "loading",
    isAuthenticating: true,
    isAuthInProgress: true,
  });
}

/**
 * 2️⃣ FirebaseUser が存在しない場合の LIFF / 通常ブラウザハンドリング
 */
export function handleUnauthenticatedBranch(
  liffService: LiffService,
  environment: AuthEnvironment,
  setState: ReturnType<typeof useAuthStore.getState>["setState"],
  authStateManager: AuthStateManager,
): boolean {
  const liffState = liffService.getState();

  if (environment === AuthEnvironment.LIFF) {
    // 未初期化 → 継続待ち
    if (!liffState.isInitialized) {
      setState({
        authenticationState: "loading",
        isAuthenticating: true,
        isAuthInProgress: true,
      });
      return true; // 継続
    }

    // ログイン済み → トークン待ち
    if (liffState.isLoggedIn) {
      setState({
        authenticationState: "authenticating",
        isAuthenticating: true,
        isAuthInProgress: true,
      });
      return true; // 継続
    }

    // 未ログイン → 未認証確定
    finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
    return false; // 終了
  }

  finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
  return false;
}

/**
 * 3️⃣ FirebaseUser からセッションを確立
 */
export async function establishSessionFromFirebaseUser(
  firebaseUser: User,
  setState: ReturnType<typeof useAuthStore.getState>["setState"],
): Promise<boolean> {
  try {
    logger.info("[establishSession] Starting session establishment", {
      component: "helper",
      uidSuffix: getUidSuffix(firebaseUser.uid),
    });

    const idToken = await firebaseUser.getIdToken(true);
    const tokenResult = await firebaseUser.getIdTokenResult();

    logger.info("[establishSession] Token obtained", {
      component: "helper",
      uidSuffix: getUidSuffix(firebaseUser.uid),
      signInProvider: tokenResult.signInProvider,
      tenantPresent: !!(tokenResult.claims.firebase as any)?.tenant,
      expiresAt: tokenResult.expirationTime,
    });

    await createSession(idToken);
    TokenManager.saveLineAuthFlag(true);

    setState({
      lineTokens: {
        accessToken: idToken,
        refreshToken: firebaseUser.refreshToken ?? null,
        expiresAt: String(new Date(tokenResult.expirationTime).getTime()),
      },
    });

    logger.info("[establishSession] Session established successfully", {
      component: "helper",
      uidSuffix: getUidSuffix(firebaseUser.uid),
    });

    return true;
  } catch (error) {
    logger.error("[establishSession] Session establishment failed", {
      component: "helper",
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

async function createSession(idToken: string) {
  logger.info("[createSession] Starting session creation", {
    component: "helper",
    isSecureContext: typeof window !== "undefined" ? window.isSecureContext : null,
    origin: typeof window !== "undefined" ? window.location.origin : null,
  });

  const res = await fetch("/api/sessionLogin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    credentials: "include",
  });

  if (!res.ok) {
    const errText = await res.text();
    logger.error("[createSession] Session creation failed", {
      component: "helper",
      status: res.status,
      errorText: errText.substring(0, 200),
    });
    throw new Error(`Failed to create session cookie (${res.status})`);
  }

  logger.info("[createSession] Session cookie successfully created", {
    component: "helper",
    status: res.status,
  });
  return true;
}

/**
 * 4️⃣ ユーザーセッションを復元（SSR or Firebaseから）
 */
export async function restoreUserSession(
  ssrCurrentUser: GqlUser | null | undefined,
  firebaseUser: User,
  setState: ReturnType<typeof useAuthStore.getState>["setState"],
) {
  logger.info("[restoreUserSession] Starting user session restoration", {
    component: "helper",
    uidSuffix: getUidSuffix(firebaseUser.uid),
    hasSsrUser: !!ssrCurrentUser,
  });

  const tokenResult = await firebaseUser.getIdTokenResult();
  
  logger.info("[restoreUserSession] Token info", {
    component: "helper",
    uidSuffix: getUidSuffix(firebaseUser.uid),
    signInProvider: tokenResult.signInProvider,
    tenantPresent: !!(tokenResult.claims.firebase as any)?.tenant,
  });

  useAuthStore.getState().setState({
    firebaseUser,
    lineTokens: {
      accessToken: tokenResult.token,
      refreshToken: firebaseUser.refreshToken ?? null,
      expiresAt: String(new Date(tokenResult.expirationTime).getTime()),
    },
  });

  if (ssrCurrentUser) {
    logger.info("[restoreUserSession] Using SSR user", {
      component: "helper",
      userId: getUidSuffix(ssrCurrentUser.id),
    });
    setState({ currentUser: ssrCurrentUser });
    return ssrCurrentUser;
  }

  logger.info("[restoreUserSession] Fetching user from client", {
    component: "helper",
    uidSuffix: getUidSuffix(firebaseUser.uid),
  });

  const user = await fetchCurrentUserClient(firebaseUser);
  if (user) {
    logger.info("[restoreUserSession] User fetched successfully", {
      component: "helper",
      userId: getUidSuffix(user.id),
    });
    setState({ currentUser: user });
    return user;
  }

  logger.warn("[restoreUserSession] No user found", {
    component: "helper",
    uidSuffix: getUidSuffix(firebaseUser.uid),
  });

  return null;
}

/**
 * 5️⃣ phone認証 or 登録状態を評価して認証状態を確定
 */
export async function evaluateUserRegistrationState(
  user: GqlUser,
  ssrPhoneAuthenticated: boolean | undefined,
  setState: ReturnType<typeof useAuthStore.getState>["setState"],
  authStateManager: AuthStateManager,
): Promise<boolean> {
  const hasPhoneIdentity = !!user.identities?.some((i) => i.platform?.toUpperCase() === "PHONE");
  
  const hasMembershipInCurrentCommunity = !!user.memberships?.some(
    (m) => m.community?.id === COMMUNITY_ID
  );

  const isPhoneVerified = ssrPhoneAuthenticated || hasPhoneIdentity || TokenManager.phoneVerified();
  const isRegistered = isPhoneVerified && hasMembershipInCurrentCommunity;

  if (isRegistered) {
    TokenManager.savePhoneAuthFlag(true);
    finalizeAuthState("user_registered", user, setState, authStateManager);
    await authStateManager.handleUserRegistrationStateChange(true);
    return true;
  }

  finalizeAuthState("line_authenticated", user, setState, authStateManager);
  await authStateManager.handleUserRegistrationStateChange(false);
  return false;
}

/**
 * 6️⃣ 状態を確定
 */
export function finalizeAuthState(
  newState: AuthenticationState,
  user: GqlUser | undefined,
  setState: ReturnType<typeof useAuthStore.getState>["setState"],
  authStateManager: AuthStateManager,
) {
  logger.info("[finalizeAuthState] Finalizing auth state", {
    component: "helper",
    newState,
    hasUser: !!user,
    userId: user ? getUidSuffix(user.id) : null,
  });

  setState({
    isAuthenticating: false,
    isAuthInProgress: false,
    currentUser: user ?? null,
  });

  authStateManager.updateState(newState);
}
