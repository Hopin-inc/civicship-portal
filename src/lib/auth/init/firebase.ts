import { lineAuth } from "@/lib/auth/core/firebase-config";
import { AuthEnvironment } from "@/lib/auth/core/environment-detector";
import { logger } from "@/lib/logging";
import { LiffService } from "@/lib/auth/service/liff-service";
import { User, signOut } from "@firebase/auth";

export async function initializeFirebase(
  liffService: LiffService,
  environment: AuthEnvironment,
  tenantId?: string | null,
): Promise<User | null> {
  logger.info("[initializeFirebase] Starting", {
    environment,
    tenantId,
    tenantIdType: typeof tenantId,
    component: "initializeFirebase",
  });

  // Level 1: 水源の浄化
  // キャッシュされているユーザーのテナントが期待するテナントと異なる場合は
  // いったんサインアウトしてクリーンな状態から認証を開始する。
  if (tenantId != null && lineAuth.currentUser && lineAuth.currentUser.tenantId !== tenantId) {
    logger.info("[initializeFirebase] Stale cached user detected, signing out before auth", {
      cachedTenantId: lineAuth.currentUser.tenantId,
      expectedTenantId: tenantId,
      component: "initializeFirebase",
    });
    await signOut(lineAuth);
  }

  if (environment === AuthEnvironment.LIFF) {
    try {
      await liffService.initialize();
      const liffState = liffService.getState();

      logger.info("[initializeFirebase] LIFF state after init", {
        isLoggedIn: liffState.isLoggedIn,
        isInitialized: liffState.isInitialized,
        hasError: !!liffState.error,
        tenantId,
        component: "initializeFirebase",
      });

      if (liffState.isLoggedIn) {
        // Level 2: ゲートキーパー
        // LIFF サインインが成功した者だけを「認証済み」として通過させる。
        // 失敗時に古い currentUser へフォールバックすることを禁止する。
        const signInSuccess = await liffService.signInWithLiffToken(tenantId);
        if (!signInSuccess) {
          logger.warn("[initializeFirebase] LIFF sign-in failed — returning null to block stale session", {
            tenantId,
            component: "initializeFirebase",
          });
          return null;
        }

        // 新フロー（/api/auth/exchange 経由）では Firebase SDK の
        // signInWithCustomToken をクライアント側で呼ばないため、
        // lineAuth.currentUser は null のまま。
        // onAuthStateChanged を待つと永久にハングするので即座に null を返す。
        // 呼び出し元 initAuthFull は lineTokens.accessToken の存在で
        // cookie 経由セッション復元にフォールバックする。
        if (!lineAuth.currentUser) {
          logger.info("[initializeFirebase] LIFF sign-in succeeded via exchange but no Firebase SDK user — returning null for cookie-based session restore", {
            tenantId,
            component: "initializeFirebase",
          });
          return null;
        }
      }
    } catch (initErr) {
      logger.warn("LIFF initialization failed", { err: initErr });
    }
  }

  return (
    lineAuth.currentUser ??
    (await new Promise((resolve) => {
      const unsub = lineAuth.onAuthStateChanged((u) => {
        unsub();
        resolve(u);
      });
    }))
  );
}
