import { useGetMemberWalletsQuery, GqlWalletType } from "@/types/graphql";

interface UseOrganizerWalletArgs {
  organizerId?: string;
  communityId?: string;
}

export const useOrganizerWallet = ({ organizerId, communityId }: UseOrganizerWalletArgs) => {
  const { data, loading } = useGetMemberWalletsQuery({
    variables: {
      filter: {
        userId: organizerId,
        communityId,
        type: GqlWalletType.Member,
      },
    },
    skip: !organizerId || !communityId,
  });

  const wallet = data?.wallets.edges?.find((edge) => edge?.node)?.node;
  const currentPoint = BigInt(wallet?.currentPointView?.currentPoint ?? "0");

  return {
    wallet,
    currentPoint,
    loading,
  };
};
