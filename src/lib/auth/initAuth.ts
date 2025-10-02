import { useAuthStore } from "@/hooks/auth/auth-store";
import { lineAuth } from "@/lib/auth/firebase-config";
import { TokenManager } from "@/lib/auth/token-manager";
import { fetchCurrentUserClient } from "@/lib/auth/fetchCurrentUser";
import { User } from "firebase/auth";
import type { LiffService } from "@/lib/auth/liff-service";
import type { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthEnvironment, detectEnvironment } from "@/lib/auth/environment-detector";
import { logger } from "@/lib/logging";

export async function initAuth({
  liffService,
  authStateManager,
}: {
  liffService: LiffService;
  authStateManager: AuthStateManager;
}) {
  const { state, setState } = useAuthStore.getState();

  // --- 多重初期化防止（store 管理）
  if (state.isAuthInProgress) return;
  setState({ authenticationState: "loading", isAuthenticating: true, isAuthInProgress: true });

  try {
    const environment = detectEnvironment();

    // --- 並列で LIFF 初期化 & Firebase ユーザー取得
    const [liffOk, firebaseUser] = await Promise.all([
      environment === AuthEnvironment.LIFF ? liffService.initialize() : Promise.resolve(true),
      new Promise<User | null>((resolve) => {
        const unsub = lineAuth.onAuthStateChanged((user) => {
          unsub();
          resolve(user);
        });
      }),
    ]);

    if (!firebaseUser || !liffOk) {
      setState({
        authenticationState: "unauthenticated",
        isAuthenticating: false,
        isAuthInProgress: false,
      });
      return;
    }

    // --- Firebase トークン保存（有効期限チェックして更新が必要な場合のみ）
    const tokenResult = await firebaseUser.getIdTokenResult();
    const newExpiresAt = new Date(tokenResult.expirationTime).getTime();
    const existingTokens = TokenManager.getLineTokens();

    if (!existingTokens.accessToken || TokenManager.isTokenExpiredSync(existingTokens)) {
      TokenManager.saveLineTokens({
        accessToken: tokenResult.token,
        refreshToken: firebaseUser.refreshToken,
        expiresAt: newExpiresAt,
      });
    }

    setState({ firebaseUser });

    // --- SSRですでに currentUser がある場合は skip
    let currentUser = state.currentUser;
    if (!currentUser) {
      currentUser = await fetchCurrentUserClient();
    }

    if (currentUser) {
      setState({
        currentUser,
        authenticationState: "user_registered",
        isAuthenticating: false,
        isAuthInProgress: false,
      });
      await authStateManager.handleUserRegistrationStateChange(true);
      return;
    }

    // --- Phone Token チェック
    const phoneTokens = TokenManager.getPhoneTokens();
    if (phoneTokens?.accessToken) {
      setState({
        authenticationState: "phone_authenticated",
        isAuthenticating: false,
        isAuthInProgress: false,
      });
      await authStateManager.handleUserRegistrationStateChange(false);
      return;
    }

    // --- LINE 認証だけの場合
    setState({
      authenticationState: "line_authenticated",
      isAuthenticating: false,
      isAuthInProgress: false,
    });
    await authStateManager.handleUserRegistrationStateChange(false);

    // --- 非LIFF環境のみ追加サインイン処理
    if (environment !== AuthEnvironment.LIFF) {
      const { isInitialized, isLoggedIn } = liffService.getState();
      if (isInitialized && isLoggedIn) {
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
      }
    }
  } catch (e) {
    logger.error("initAuth failed", { error: e, component: "initAuth" });
    setState({
      authenticationState: "unauthenticated",
      isAuthenticating: false,
      isAuthInProgress: false,
    });
  }
}
