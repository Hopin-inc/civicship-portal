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
        logger.debug("[initializeFirebase] currentUser before signInWithLiffToken", {
          currentUserTenantId: lineAuth.currentUser?.tenantId ?? null,
          currentUserUid: lineAuth.currentUser?.uid ?? null,
          component: "initializeFirebase",
        });
        const signInSuccess = await liffService.signInWithLiffToken(tenantId);
        logger.debug("[initializeFirebase] currentUser after signInWithLiffToken", {
          currentUserTenantId: lineAuth.currentUser?.tenantId ?? null,
          currentUserUid: lineAuth.currentUser?.uid ?? null,
          component: "initializeFirebase",
        });
        if (!signInSuccess) {
          logger.warn("[initializeFirebase] LIFF sign-in failed — returning null to block stale session", {
            tenantId,
            component: "initializeFirebase",
          });
          return null;
        }

        // signInWithLiffToken 完了後、Firebase SDK が localStorage から別テナントの
        // ユーザーを非同期復元していた場合、lineAuth.currentUser が stale になっている。
        // tenantId が一致しない currentUser はここでサインアウトして排除する。
        if (
          lineAuth.currentUser &&
          tenantId != null &&
          lineAuth.currentUser.tenantId !== tenantId
        ) {
          logger.warn("[initializeFirebase] Stale user detected after signInWithLiffToken — signing out", {
            cachedTenantId: lineAuth.currentUser.tenantId,
            expectedTenantId: tenantId,
            component: "initializeFirebase",
          });
          await signOut(lineAuth);
        }

        // Server-side exchange では signInWithCustomToken をクライアントで呼ばないため
        // lineAuth.currentUser は null のまま。onAuthStateChanged を待つとハングするので
        // 即座に null を返し、呼び出し元 initAuthFull の cookie セッション復元に委ねる。
        if (!lineAuth.currentUser) {
          logger.info("[initializeFirebase] LIFF sign-in succeeded via exchange — returning null for session-based restore", {
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
