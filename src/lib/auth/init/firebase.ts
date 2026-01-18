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

  logger.info("[LIFF DEBUG] initializeFirebase() called", {
    component: "initializeFirebase",
    environment,
    isLiffEnvironment: environment === AuthEnvironment.LIFF,
  });

  if (environment === AuthEnvironment.LIFF) {
    try {
      logger.info("[LIFF DEBUG] initializeFirebase() - calling liffService.initialize()", {
        component: "initializeFirebase",
      });
      
      await liffService.initialize();
      const liffState = liffService.getState();
      
      logger.info("[LIFF DEBUG] initializeFirebase() - LIFF initialized", {
        component: "initializeFirebase",
        isLoggedIn: liffState.isLoggedIn,
        isInitialized: liffState.isInitialized,
        hasError: !!liffState.error,
        errorMessage: liffState.error?.message,
      });
      
      if (liffState.isLoggedIn) {
        try {
          logger.info("[LIFF DEBUG] initializeFirebase() - calling signInWithLiffToken()", {
            component: "initializeFirebase",
          });
          
          const success = await liffService.signInWithLiffToken();
          if (!success) {
            logger.warn("[LIFF DEBUG] initializeFirebase() - signInWithLiffToken returned false", {
              component: "initializeFirebase",
            });
            signInFailed = true;
          } else {
            logger.info("[LIFF DEBUG] initializeFirebase() - signInWithLiffToken succeeded", {
              component: "initializeFirebase",
            });
          }
        } catch (signInErr) {
          logger.warn("[LIFF DEBUG] initializeFirebase() - signInWithLiffToken threw error", { 
            component: "initializeFirebase",
            err: signInErr,
          });
          signInFailed = true;
        }
      } else {
        logger.warn("[LIFF DEBUG] initializeFirebase() - LIFF not logged in, skipping signInWithLiffToken", {
          component: "initializeFirebase",
          liffState,
        });
      }
    } catch (initErr) {
      logger.warn("[LIFF DEBUG] initializeFirebase() - LIFF initialization threw error", { 
        component: "initializeFirebase",
        err: initErr,
      });
      signInFailed = true;
    }
  } else {
    logger.info("[LIFF DEBUG] initializeFirebase() - not LIFF environment, skipping LIFF init", {
      component: "initializeFirebase",
      environment,
    });
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
