import { lineAuth } from "@/lib/auth/core/firebase-config";
import { AuthEnvironment } from "@/lib/auth/core/environment-detector";
import { logger } from "@/lib/logging";
import { LiffService } from "@/lib/auth/service/liff-service";
import { User } from "@firebase/auth";

export interface InitializeFirebaseResult {
  user: User | null;
  signInFailed: boolean;
}

export async function initializeFirebase(
  liffService: LiffService,
  environment: AuthEnvironment,
): Promise<InitializeFirebaseResult> {
  let signInFailed = false;

  if (environment === AuthEnvironment.LIFF) {
    try {
      await liffService.initialize();
      const liffState = liffService.getState();
      if (liffState.isLoggedIn) {
        try {
          const success = await liffService.signInWithLiffToken();
          if (!success) {
            logger.warn("LIFF sign-in with token returned false - authentication failed");
            signInFailed = true;
          }
        } catch (signInErr) {
          logger.warn("LIFF sign-in with token failed", { err: signInErr });
          signInFailed = true;
        }
      }
    } catch (initErr) {
      logger.warn("LIFF initialization failed", { err: initErr });
      signInFailed = true;
    }
  }

  // If sign-in explicitly failed, return null immediately to trigger unauthenticated state
  // This prevents infinite loading when LIFF is logged in but Firebase sign-in fails
  if (signInFailed) {
    logger.debug("LIFF sign-in failed, returning null to trigger unauthenticated state");
    return { user: null, signInFailed: true };
  }

  const user = lineAuth.currentUser ??
    (await new Promise<User | null>((resolve) => {
      const unsub = lineAuth.onAuthStateChanged((u) => {
        unsub();
        resolve(u);
      });
    }));

  return { user, signInFailed: false };
}
