import { useAuth } from "@/contexts/AuthProvider";
import { 
  GqlDidIssuanceStatus, 
  useGetDidIssuanceRequestsQuery, 
  useGetUserFlexibleQuery 
} from "@/types/graphql";

export function useAccountData() {
  const { user: currentUser, isAuthenticated, isPhoneVerified, isAuthenticating } = useAuth();
  // ユーザー詳細データ
  const { data: userData, loading: userLoading } = useGetUserFlexibleQuery({
    variables: {
      id: currentUser?.id ?? "",
    },
    skip: !currentUser,
  });
  // DID発行リクエストデータ
  const { data: didIssuanceRequests, loading: didLoading } = useGetDidIssuanceRequestsQuery({
    variables: {
      userIds: [currentUser?.id ?? ""],
    },
    skip: !currentUser,
  });
  // DID値を取得
  const didValue = didIssuanceRequests?.users?.edges
    ?.find(edge => edge?.node?.id === currentUser?.id)
    ?.node?.didIssuanceRequests
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
    loading: userLoading || didLoading,
  };
} 