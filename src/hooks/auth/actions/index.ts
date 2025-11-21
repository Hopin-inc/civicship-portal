import { LiffService } from "@/lib/auth/service/liff-service";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { useLogout } from "@/hooks/auth/actions/useLogout";

export type AuthDeps = {
  liffService: LiffService;
  phoneAuthService: PhoneAuthService;
};

export const useAuthActions = (deps: AuthDeps) => {
  const { liffService, phoneAuthService } = deps;

  const logout = useLogout(liffService, phoneAuthService);

  return { logout };
};
