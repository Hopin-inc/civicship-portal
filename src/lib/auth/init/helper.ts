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
    const idToken = await firebaseUser.getIdToken(true);
    const tokenResult = await firebaseUser.getIdTokenResult();

    await createSession(idToken);
    TokenManager.saveLineAuthFlag(true);

    setState({
      lineTokens: {
        accessToken: idToken,
        refreshToken: firebaseUser.refreshToken ?? null,
        expiresAt: String(new Date(tokenResult.expirationTime).getTime()),
      },
    });

    return true;
  } catch {
    return false;
  }
}

async function createSession(idToken: string) {
  const res = await fetch("/api/sessionLogin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    credentials: "include",
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("createSession failed", res.status, errText);
    throw new Error(`Failed to create session cookie (${res.status})`);
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("✅ Session cookie successfully created (via proxy)");
  }
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
  const tokenResult = await firebaseUser.getIdTokenResult();
  useAuthStore.getState().setState({
    firebaseUser,
    lineTokens: {
      accessToken: tokenResult.token,
      refreshToken: firebaseUser.refreshToken ?? null,
      expiresAt: String(new Date(tokenResult.expirationTime).getTime()),
    },
  });

  if (ssrCurrentUser) {
    setState({ currentUser: ssrCurrentUser });
    return ssrCurrentUser;
  }

  const user = await fetchCurrentUserClient(firebaseUser);
  if (user) {
    setState({ currentUser: user });
    return user;
  }

  return null;
}

/**
 * 5️⃣ phone認証 or 登録状態を評価して認証状態を確定
 * @param communityId - Runtime community ID from URL path (via LiffService.getCommunityId())
 */
export async function evaluateUserRegistrationState(
  user: GqlUser,
  ssrPhoneAuthenticated: boolean | undefined,
  setState: ReturnType<typeof useAuthStore.getState>["setState"],
  authStateManager: AuthStateManager,
  communityId: string,
): Promise<boolean> {
  const hasPhoneIdentity = !!user.identities?.some((i) => i.platform?.toUpperCase() === "PHONE");
  
  // Use runtime communityId from URL path instead of build-time COMMUNITY_ID
  const hasMembershipInCurrentCommunity = !!user.memberships?.some(
    (m) => m.community?.id === communityId
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
  setState({
    isAuthenticating: false,
    isAuthInProgress: false,
    currentUser: user ?? null,
  });

  authStateManager.updateState(newState);
}
