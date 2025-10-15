import { lineAuth } from "@/lib/auth/core/firebase-config";
import { AuthEnvironment } from "@/lib/auth/core/environment-detector";
import { logger } from "@/lib/logging";
import { LiffService } from "@/lib/auth/service/liff-service";
import { User } from "@firebase/auth";

export async function initializeFirebase(
  liffService: LiffService,
  environment: AuthEnvironment,
): Promise<User | null> {
  if (environment === AuthEnvironment.LIFF) {
    try {
      await liffService.initialize();
      const liffState = liffService.getState();
      if (liffState.isLoggedIn) {
        await liffService.signInWithLiffToken();
      }
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
