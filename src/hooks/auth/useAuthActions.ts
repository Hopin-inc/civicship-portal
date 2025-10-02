import { LiffService } from "@/lib/auth/liff-service";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { useLogout } from "@/hooks/auth/actions/useLogout";
import { useCreateUser } from "@/hooks/auth/actions/useCreateUser";
import { useVerifyPhoneCode } from "@/hooks/auth/actions/useVerifyPhoneCode";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { useLogin } from "@/hooks/auth/actions/useLogin";
import { useStartPhoneVerification } from "@/hooks/auth/actions/useStartPhoneVerification";

export type AuthDeps = {
  authStateManager: AuthStateManager | null;
  liffService: LiffService;
  phoneAuthService: PhoneAuthService;
  refetchUser: () => Promise<any>;
};

export const useAuthActions = (deps: AuthDeps) => {
  const { liffService, phoneAuthService, refetchUser, authStateManager } = deps;

  const loginWithLiff = useLogin(liffService, refetchUser);
  const createUser = useCreateUser(refetchUser);
  const logout = useLogout(liffService, phoneAuthService);

  const startPhoneVerification = useStartPhoneVerification(phoneAuthService);
  const verifyPhoneCode = useVerifyPhoneCode(phoneAuthService, authStateManager);

  return { logout, createUser, loginWithLiff, startPhoneVerification, verifyPhoneCode };
};
