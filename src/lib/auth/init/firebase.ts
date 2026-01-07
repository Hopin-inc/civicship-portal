import { lineAuth } from "@/lib/auth/core/firebase-config";
import { AuthEnvironment } from "@/lib/auth/core/environment-detector";
import { logger } from "@/lib/logging";
import { LiffService } from "@/lib/auth/service/liff-service";
import { User } from "@firebase/auth";

export async function initializeFirebase(
  liffService: LiffService,
  environment: AuthEnvironment,
): Promise<User | null> {
  // Using warn level temporarily to ensure logs appear in staging/production
  logger.warn("[AUTH] initializeFirebase: ENTRY", {
    environment,
    communityId: liffService.getCommunityId(),
    firebaseTenantId: liffService.getFirebaseTenantId(),
    hasCurrentUser: !!lineAuth.currentUser,
    currentUserTenantId: lineAuth.currentUser?.tenantId,
  });

  if (environment === AuthEnvironment.LIFF) {
    try {
      await liffService.initialize();
      const liffState = liffService.getState();
      if (liffState.isLoggedIn) {
        try {
          await liffService.signInWithLiffToken();
        } catch (signInErr) {
          logger.warn("LIFF sign-in with token failed", { err: signInErr });
        }
      }
    } catch (initErr) {
      logger.warn("LIFF initialization failed", { err: initErr });
    }
  }

  const firebaseUser = lineAuth.currentUser ??
    (await new Promise<User | null>((resolve) => {
      const unsub = lineAuth.onAuthStateChanged((u) => {
        unsub();
        resolve(u);
      });
    }));

  // Using warn level temporarily to ensure logs appear in staging/production
  logger.warn("[AUTH] initializeFirebase: EXIT", {
    hasFirebaseUser: !!firebaseUser,
    firebaseUserUid: firebaseUser?.uid,
    firebaseUserTenantId: firebaseUser?.tenantId,
  });

  return firebaseUser;
}
