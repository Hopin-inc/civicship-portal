import { useAuthStore } from "@/hooks/auth/auth-store";
import { lineAuth } from "@/lib/auth/firebase-config";
import { TokenManager } from "@/lib/auth/token-manager";
import { fetchCurrentUserClient } from "@/lib/auth/fetchCurrentUser";
import { User } from "firebase/auth";
import type { LiffService } from "@/lib/auth/liff-service";
import type { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthEnvironment, detectEnvironment } from "@/lib/auth/environment-detector";

export async function initAuth({
  liffService,
  authStateManager,
}: {
  liffService: LiffService;
  authStateManager: AuthStateManager;
}) {
  const environment = detectEnvironment();
  const { setState } = useAuthStore.getState();
  setState({ authenticationState: "loading", isAuthenticating: true });

  try {
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

    // --- LIFF 初期化 or Firebase 認証失敗
    if (!firebaseUser || !liffOk) {
      setState({ authenticationState: "unauthenticated", isAuthenticating: false });
      return;
    }

    // --- Firebase トークン取得（API呼び出しは1回だけ）
    const tokenResult = await firebaseUser.getIdTokenResult();
    TokenManager.saveLineTokens({
      accessToken: tokenResult.token,
      refreshToken: firebaseUser.refreshToken,
      expiresAt: new Date(tokenResult.expirationTime).getTime(),
    });

    setState({ firebaseUser });

    // --- 並列で User 情報取得
    const [currentUser] = await Promise.all([fetchCurrentUserClient()]);

    if (currentUser) {
      setState({
        currentUser,
        authenticationState: "user_registered",
        isAuthenticating: false,
      });
      await authStateManager.handleUserRegistrationStateChange(true);
      return;
    }

    // --- Phone Token チェック
    const phoneTokens = TokenManager.getPhoneTokens();
    if (phoneTokens?.accessToken) {
      setState({ authenticationState: "phone_authenticated", isAuthenticating: false });
      return;
    }

    // --- LINE 認証だけの場合
    setState({ authenticationState: "line_authenticated", isAuthenticating: false });

    // --- 🔑 リダイレクト後処理
    const { isInitialized, isLoggedIn } = liffService.getState();
    const alreadyProcessed = useAuthStore.getState().state.processedRedirect;

    if (isInitialized && isLoggedIn && !alreadyProcessed) {
      setState({ processedRedirect: true });
      const success = await liffService.signInWithLiffToken();
      if (success) {
        const newUser = await fetchCurrentUserClient(); // 👈 refetchUser の代わりに再取得
        if (newUser) {
          setState({
            currentUser: newUser,
            authenticationState: "user_registered",
            isAuthenticating: false,
          });
          await authStateManager.handleUserRegistrationStateChange(true);
        }
      }
    }
  } catch (e) {
    setState({ authenticationState: "unauthenticated", isAuthenticating: false });
  }
}
