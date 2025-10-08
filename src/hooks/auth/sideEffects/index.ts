import { useFirebaseAuthState } from "@/hooks/auth/sideEffects/useFirebaseAuthState";
import { useAuthStateChangeListener } from "@/hooks/auth/sideEffects/useAuthStateChangeListener";
import { useTokenExpirationHandler } from "@/hooks/auth/sideEffects/useTokenExpirationHandler";
import { useLineAuthRedirectDetection } from "@/hooks/auth/sideEffects/useLineAuthRedirectDetection";
import { useLineAuthProcessing } from "@/hooks/auth/sideEffects/useLineAuthProcessing";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { LiffService } from "@/lib/auth/service/liff-service";
import { GqlUser } from "@/types/graphql";

export function useAuthSideEffects({
  authStateManager,
  liffService,
  logout,
  refetchUser,
}: {
  authStateManager: AuthStateManager | null;
  liffService: LiffService;
  logout: () => Promise<void>;
  refetchUser: () => Promise<GqlUser | null>;
}) {
  useFirebaseAuthState({ authStateManager });
  useAuthStateChangeListener({ authStateManager });
  useTokenExpirationHandler({ logout });

  const { shouldProcessRedirect } = useLineAuthRedirectDetection({ liffService });
  useLineAuthProcessing({ shouldProcessRedirect, liffService, refetchUser, authStateManager });
}
