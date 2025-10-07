import { lineAuth } from "@/lib/auth/firebase-config";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { logger } from "@/lib/logging";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { fetchCurrentUserClient } from "@/lib/auth/init/fetchCurrentUser";

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

export async function tryReSignIn(
  liffService: LiffService,
  authStateManager: AuthStateManager,
  setState: any,
) {
  const { isInitialized, isLoggedIn } = liffService.getState();
  if (!(isInitialized && isLoggedIn)) return;

  try {
    const success = await liffService.signInWithLiffToken();
    if (!success) return;

    authStateManager.updateState("line_authenticated", "tryReSignIn");
    const newUser = await fetchCurrentUserClient();
    if (newUser) {
      setState({ currentUser: newUser });
      authStateManager.updateState("user_registered", "tryReSignIn (user found)");
      await authStateManager.handleUserRegistrationStateChange(true);
    }
  } catch (error) {
    logger.error("ReSignIn failed", { error, component: "tryReSignIn" });
  }
}
