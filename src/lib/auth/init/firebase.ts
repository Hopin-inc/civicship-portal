import { lineAuth, setFirebaseTenantId } from "@/lib/auth/core/firebase-config";
import { AuthEnvironment } from "@/lib/auth/core/environment-detector";
import { logger } from "@/lib/logging";
import { LiffService } from "@/lib/auth/service/liff-service";
import { User } from "@firebase/auth";

export async function initializeFirebase(
  liffService: LiffService,
  environment: AuthEnvironment,
  communityId?: string,
): Promise<User | null> {
  if (communityId) {
    setFirebaseTenantId(communityId);
  }

  if (environment === AuthEnvironment.LIFF) {
    try {
      await liffService.initialize();
      const liffState = liffService.getState();
      if (liffState.isLoggedIn) {
        try {
          await liffService.signInWithLiffToken(communityId);
        } catch (signInErr) {
          logger.warn("LIFF sign-in with token failed", { err: signInErr });
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
