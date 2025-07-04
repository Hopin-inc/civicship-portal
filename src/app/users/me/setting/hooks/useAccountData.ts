import { useAuth } from "@/contexts/AuthProvider";
import { 
  GqlDidIssuanceStatus, 
  useGetUserFlexibleQuery 
} from "@/types/graphql";

export function useAccountData() {
  const { user: currentUser, isAuthenticated, isPhoneVerified, isAuthenticating } = useAuth();
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