import { lineAuth } from "@/lib/auth/core/firebase-config";
import { AuthEnvironment } from "@/lib/auth/core/environment-detector";
import { logger } from "@/lib/logging";
import { LiffService } from "@/lib/auth/service/liff-service";
import { User } from "@firebase/auth";

export async function initializeFirebase(
  liffService: LiffService,
  environment: AuthEnvironment,
): Promise<User | null> {
  logger.info("[initializeFirebase] Starting", {
    environment,
    component: "initializeFirebase",
  });

  if (environment === AuthEnvironment.LIFF) {
    try {
      await liffService.initialize();
      const liffState = liffService.getState();

      logger.info("[initializeFirebase] LIFF state after init", {
        isLoggedIn: liffState.isLoggedIn,
        isInitialized: liffState.isInitialized,
        hasError: !!liffState.error,
        component: "initializeFirebase",
      });

      if (liffState.isLoggedIn) {
        // Level 2: ゲートキーパー
        // LIFF サインインが成功した者だけを「認証済み」として通過させる。
        // 失敗時に古い currentUser へフォールバックすることを禁止する。
        const signInSuccess = await liffService.signInWithLiffToken();
        if (!signInSuccess) {
          logger.warn("[initializeFirebase] LIFF sign-in failed — returning null to block stale session", {
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
