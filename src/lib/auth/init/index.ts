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
import { fetchCurrentUserClient } from "@/lib/auth/init/fetchCurrentUser";
import { CommunityPortalConfig } from "@/lib/communities/config";

interface InitAuthParams {
  communityConfig: CommunityPortalConfig | null;
  liffService: LiffService;
  authStateManager: AuthStateManager;
  ssrCurrentUser?: GqlUser | undefined | null;
  ssrLineAuthenticated?: boolean;
  ssrPhoneAuthenticated?: boolean;
}

export async function initAuth(params: InitAuthParams) {
  const {
    communityConfig,
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

  logger.debug("[AUTH] initAuth", {
    environment,
    ssrCurrentUser: !!ssrCurrentUser,
    ssrCurrentUserId: ssrCurrentUser?.id,
    ssrLineAuthenticated,
    ssrPhoneAuthenticated,
    willUseInitAuthFast: !!(ssrCurrentUser && ssrLineAuthenticated),
  });

  if (ssrCurrentUser && ssrLineAuthenticated) {
    return await initAuthFast({
      communityConfig,
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
    communityConfig,
    liffService,
    authStateManager,
    environment,
    ssrCurrentUser,
    ssrPhoneAuthenticated,
    setState,
  });
}

async function initAuthFast({
  communityConfig,
  ssrCurrentUser,
  ssrPhoneAuthenticated,
  environment,
  liffService,
  authStateManager,
  setState,
}: {
  communityConfig: CommunityPortalConfig | null;
  ssrCurrentUser: GqlUser;
  ssrPhoneAuthenticated?: boolean;
  environment: AuthEnvironment;
  liffService: LiffService;
  authStateManager: AuthStateManager;
  setState: ReturnType<typeof useAuthStore.getState>["setState"];
}) {
  try {
    // Step 1: トークンを確保してからUIを解放する（問題3対応）
    // finalizeAuthState より先に initializeFirebase を完了させることで、
    // UIが解放された直後にミューテーションが発火しても Bearer トークンが
    // 必ず存在することを保証する。
    if (typeof window !== "undefined") {
      const firebaseUser = await initializeFirebase(
        liffService,
        environment,
        communityConfig?.firebaseTenantId,
      );
      if (firebaseUser) {
        useAuthStore.getState().setState({ firebaseUser });
        logger.debug("[AUTH] initAuthFast: Firebase user hydrated for CSR", {
          uid: firebaseUser.uid,
        });
      } else {
        // Exchange 経由の場合は lineTokens.idToken が signInWithLiffToken でセット済み。
        // どちらも存在しない場合はトークンなしとみなして未認証に遷移する。
        const { lineTokens } = useAuthStore.getState().state;
        if (!lineTokens.idToken) {
          logger.error("[AUTH] initAuthFast: No token after Firebase init — falling back to unauthenticated", {
            component: "initAuthFast",
          });
          finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
          return;
        }
      }
    }

    // Step 2: トークン確認済み — UIを解放する
    finalizeAuthState(
      ssrPhoneAuthenticated ? "user_registered" : "line_authenticated",
      ssrCurrentUser,
      setState,
      authStateManager,
    );
    if (ssrPhoneAuthenticated) TokenManager.savePhoneAuthFlag(true);
    await authStateManager.handleUserRegistrationStateChange(!!ssrPhoneAuthenticated, {
      ssrMode: true,
    });
  } catch (e) {
    logger.error("initAuthFast failed", { error: e });
    finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
  }
}

async function initAuthFull({
  communityConfig,
  liffService,
  authStateManager,
  environment,
  ssrCurrentUser,
  ssrPhoneAuthenticated,
  setState,
}: {
  communityConfig: CommunityPortalConfig | null;
  liffService: LiffService;
  authStateManager: AuthStateManager;
  environment: AuthEnvironment;
  ssrCurrentUser?: GqlUser | undefined | null;
  ssrPhoneAuthenticated?: boolean;
  setState: ReturnType<typeof useAuthStore.getState>["setState"];
}) {
  try {
    prepareInitialState(setState);

    const firebaseUser = await initializeFirebase(
      liffService,
      environment,
      communityConfig?.firebaseTenantId,
    );
    if (!firebaseUser) {
      // Server-side exchange 経由で signInWithLiffToken が成功した場合、
      // Firebase SDK の signInWithCustomToken をクライアントで呼ばないため
      // lineAuth.currentUser は null のまま。lineTokens.idToken が存在すれば
      // exchange 済みと判断して cookie セッション経由でユーザー復元へ進む。
      const { lineTokens } = useAuthStore.getState().state;
      if (lineTokens.idToken) {
        logger.info("[initAuthFull] Exchange-based session restore (no Firebase SDK user)", {
          component: "initAuthFull",
        });
        const user = await fetchCurrentUserClient(communityConfig, null, lineTokens.idToken);
        if (!user) {
          finalizeAuthState("line_authenticated", undefined, setState, authStateManager);
          return;
        }
        setState({ currentUser: user });
        await evaluateUserRegistrationState(user, ssrPhoneAuthenticated, setState, authStateManager);
        return;
      }

      const shouldContinue = handleUnauthenticatedBranch(
        liffService,
        environment,
        setState,
        authStateManager,
      );
      if (!shouldContinue) return;
      return;
    }

    const sessionOk = await establishSessionFromFirebaseUser(firebaseUser, setState, communityConfig?.firebaseTenantId);
    if (!sessionOk) {
      finalizeAuthState("unauthenticated", undefined, setState, authStateManager);
      return;
    }

    const user = await restoreUserSession(communityConfig, ssrCurrentUser, firebaseUser, setState);
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
