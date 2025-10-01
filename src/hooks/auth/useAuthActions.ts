import { AuthState } from "@/types/auth";
import { LiffService } from "@/lib/auth/liff-service";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { useLogout } from "@/hooks/auth/actions/useLogout";
import { useCreateUser } from "@/hooks/auth/actions/useCreateUser";
import { useVerifyPhoneCode } from "@/hooks/auth/actions/useVerifyPhoneCode";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { useLogin } from "@/hooks/auth/actions/useLogin";
import { useStartPhoneVerification } from "@/hooks/auth/actions/useStartPhoneVerification";

export type AuthDeps = {
  state: AuthState;
  setState: (partial: Partial<AuthState>) => void;
  authStateManager: AuthStateManager | null;
  liffService: LiffService;
  phoneAuthService: PhoneAuthService;
  refetchUser: () => Promise<any>;
};

export const useAuthActions = (deps: AuthDeps) => {
  const { state, setState, liffService, phoneAuthService, refetchUser } = deps;

  const loginWithLiff = useLogin(setState, liffService, refetchUser);
  const createUser = useCreateUser(state, refetchUser);
  const logout = useLogout(setState, liffService, phoneAuthService);

  const startPhoneVerification = useStartPhoneVerification(phoneAuthService);
  const verifyPhoneCode = useVerifyPhoneCode(setState, phoneAuthService, deps.authStateManager);

  return { logout, createUser, loginWithLiff, startPhoneVerification, verifyPhoneCode };
};
