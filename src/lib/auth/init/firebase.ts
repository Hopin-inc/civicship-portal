import { lineAuth } from "@/lib/auth/core/firebase-config";
import { AuthEnvironment } from "@/lib/auth/core/environment-detector";
import { logger } from "@/lib/logging";
import { LiffService } from "@/lib/auth/service/liff-service";
import { User } from "@firebase/auth";

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
        try {
          await liffService.signInWithLiffToken(tenantId);
        } catch (signInErr) {
          logger.warn("LIFF sign-in with token failed", {
            err: signInErr instanceof Error ? signInErr.message : String(signInErr),
            tenantId,
            component: "initializeFirebase",
          });
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
