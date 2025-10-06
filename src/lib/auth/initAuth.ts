import { useAuthStore } from "@/hooks/auth/auth-store";
import { lineAuth, getPhoneAuth } from "@/lib/auth/firebase-config";
import { fetchCurrentUserClient } from "@/lib/auth/fetchCurrentUser";
import { User } from "firebase/auth";
import type { LiffService } from "@/lib/auth/liff-service";
import type { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthEnvironment, detectEnvironment } from "@/lib/auth/environment-detector";
import { logger } from "@/lib/logging";
import { GqlUser } from "@/types/graphql";
import { createSession } from "@/hooks/auth/actions/createSession";
import { TokenManager } from "@/lib/auth/token-manager";

export async function initAuth({
  liffService,
  authStateManager,
  ssrCurrentUser,
  ssrLineAuthenticated,
  ssrPhoneAuthenticated,
}: {
  liffService: LiffService;
  authStateManager: AuthStateManager | null;
  ssrCurrentUser?: GqlUser | undefined | null;
  ssrLineAuthenticated?: boolean;
  ssrPhoneAuthenticated?: boolean;
}) {
  if (!authStateManager) return;
  const { state, setState } = useAuthStore.getState();

  // --- 多重初期化防止（store 管理）
  if (state.isAuthInProgress) return;

  if (ssrLineAuthenticated) {
    setState({
      authenticationState: ssrPhoneAuthenticated ? "phone_authenticated" : "line_authenticated",
      isAuthenticating: true,
      isAuthInProgress: true,
    });
  } else {
    setState({ authenticationState: "loading", isAuthenticating: true, isAuthInProgress: true });
  }

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
    setState({ firebaseUser });

    const idToken = await firebaseUser.getIdToken(true);
    await createSession(idToken);

    // --- SSRですでに currentUser がある場合はそれを使用
    if (ssrCurrentUser) {
      setState({
        currentUser: ssrCurrentUser,
        authenticationState: "user_registered",
        isAuthenticating: false,
        isAuthInProgress: false,
      });
      await authStateManager.handleUserRegistrationStateChange(true);
      return;
    }

    // --- SSRにユーザー情報がない場合はクライアントで取得
    let effectiveUser = state.currentUser;
    if (!effectiveUser) {
      effectiveUser = await fetchCurrentUserClient();
      if (effectiveUser) {
        setState({
          currentUser: effectiveUser,
          authenticationState: "user_registered",
          isAuthenticating: false,
          isAuthInProgress: false,
        });
        await authStateManager.handleUserRegistrationStateChange(true);
        return;
      }
    } else {
      setState({
        currentUser: effectiveUser,
        authenticationState: "user_registered",
        isAuthenticating: false,
        isAuthInProgress: false,
      });
      await authStateManager.handleUserRegistrationStateChange(true);
      return;
    }

    // --- SSRフラグがある場合はそれを信頼して終了
    if (ssrPhoneAuthenticated) {
      setState({
        authenticationState: "phone_authenticated",
        isAuthenticating: false,
        isAuthInProgress: false,
      });
      await authStateManager.handleUserRegistrationStateChange(false);
      return;
    }

    if (ssrLineAuthenticated) {
      setState({
        authenticationState: "line_authenticated",
        isAuthenticating: false,
        isAuthInProgress: false,
      });
      await authStateManager.handleUserRegistrationStateChange(false);
      return;
    }

    // --- SSRフラグがない場合、Firebase Authから復元を試みる
    setState({
      authenticationState: "authenticating",
      isAuthenticating: true,
      isAuthInProgress: true,
    });

    const phoneAuth = getPhoneAuth();
    const phoneUser = await new Promise<User | null>((resolve) => {
      const unsub = phoneAuth.onAuthStateChanged((user) => {
        unsub();
        resolve(user);
      });
    });

    if (phoneUser?.phoneNumber) {
      try {
        const idToken = await phoneUser.getIdToken();
        const refreshToken = phoneUser.refreshToken;
        const tokenResult = await phoneUser.getIdTokenResult();
        const expirationTime = new Date(tokenResult.expirationTime).getTime();

        useAuthStore.getState().setPhoneAuth({
          isVerified: true,
          phoneUid: phoneUser.uid,
          phoneNumber: phoneUser.phoneNumber,
          phoneTokens: {
            accessToken: idToken,
            refreshToken,
            expiresAt: expirationTime,
          },
        });

        TokenManager.savePhoneAuthFlag(true);

        setState({
          authenticationState: "phone_authenticated",
          isAuthenticating: false,
          isAuthInProgress: false,
        });
        await authStateManager.handleUserRegistrationStateChange(false);
        return;
      } catch (error) {
        logger.error("Failed to restore phone auth from Firebase", {
          error,
          component: "initAuth",
        });
      }
    }

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
