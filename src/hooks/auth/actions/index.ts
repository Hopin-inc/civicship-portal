import { LiffService } from "@/lib/auth/service/liff-service";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { useLogout } from "@/hooks/auth/actions/useLogout";
import { useVerifyPhoneCode } from "@/hooks/auth/actions/useVerifyPhoneCode";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { useStartPhoneVerification } from "@/hooks/auth/actions/useStartPhoneVerification";

export type AuthDeps = {
  authStateManager: AuthStateManager | null;
  liffService: LiffService;
  phoneAuthService: PhoneAuthService;
};

export const useAuthActions = (deps: AuthDeps) => {
  const { liffService, phoneAuthService, authStateManager } = deps;

  const logout = useLogout(liffService, phoneAuthService);

  const startPhoneVerification = useStartPhoneVerification(phoneAuthService);
  const verifyPhoneCode = useVerifyPhoneCode(phoneAuthService, authStateManager);

  return { logout, startPhoneVerification, verifyPhoneCode };
};
