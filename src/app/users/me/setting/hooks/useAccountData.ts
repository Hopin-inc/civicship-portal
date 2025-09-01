import { useAuthStore } from "@/stores/auth-store";
import { 
  GqlDidIssuanceStatus, 
  useGetUserFlexibleQuery 
} from "@/types/graphql";

export function useAccountData() {
  const { currentUser, authenticationState, isAuthenticating } = useAuthStore();
  const isAuthenticated = authenticationState === "user_registered";
  const isPhoneVerified = authenticationState === "phone_authenticated" || authenticationState === "user_registered";
  // ユーザー詳細データ
  const { data: userData, loading: userLoading } = useGetUserFlexibleQuery({
    variables: {
      id: currentUser?.id ?? "",
      withDidIssuanceRequests: true,
    },
    skip: !currentUser,
  });
  // DID値を取得
  const didValue = userData?.user?.didIssuanceRequests
    ?.find(req => req?.status === GqlDidIssuanceStatus.Completed)
    ?.didValue;
  // NFTウォレット連携状態
  const isNftWalletLinked = !!userData?.user?.nftWallet?.id;

  return {
    userData,
    isAuthenticated,
    isPhoneVerified,
    isAuthenticating,
    didValue,
    isNftWalletLinked,
    loading: userLoading,
  };
}  