import { lineAuth } from "@/lib/auth/core/firebase-config";
import { AuthEnvironment } from "@/lib/auth/core/environment-detector";
import { logger } from "@/lib/logging";
import { LiffService } from "@/lib/auth/service/liff-service";

export async function initializeFirebase(liffService: LiffService, environment: AuthEnvironment) {
  if (environment === AuthEnvironment.LIFF) {
    try {
      await liffService.initialize();
    } catch (err) {
      logger.warn("LIFF initialization failed", { err });
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
