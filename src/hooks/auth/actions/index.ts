import { LiffService } from "@/lib/auth/service/liff-service";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { useLogout } from "@/hooks/auth/actions/useLogout";
import { useLogin } from "@/hooks/auth/actions/useLogin";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";

export type AuthDeps = {
  liffService: LiffService;
  phoneAuthService: PhoneAuthService;
  authStateManager: AuthStateManager | null;
};

export const useAuthActions = (deps: AuthDeps) => {
  const { liffService, phoneAuthService, authStateManager } = deps;

  const logout = useLogout(liffService, phoneAuthService);
  const loginWithLiff = useLogin(liffService, authStateManager);

  return { logout, loginWithLiff };
};
