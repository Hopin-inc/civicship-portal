import { useMemo } from "react";
import { useGetNftTokensQuery } from "@/types/graphql";

export interface NftTokenOption {
  id: string;
  name: string | null;
  address: string;
  symbol: string | null;
}

interface UseNftTokensParams {
  communityId: string;
}

/**
 * NFT Token list for gate/power-policy dropdowns.
 * Filtered by `communityId` so only NftTokens directly attached to the
 * current community appear (NftTokens with `community_id = NULL` are excluded).
 */
export function useNftTokens({ communityId }: UseNftTokensParams) {
  const { data, loading, error } = useGetNftTokensQuery({
    variables: { first: 100, filter: { communityId } },
  });

  const tokens: NftTokenOption[] = useMemo(() => {
    return (
      data?.nftTokens.edges.map((edge) => ({
        id: edge.node.id,
        name: edge.node.name ?? null,
        address: edge.node.address,
        symbol: edge.node.symbol ?? null,
      })) ?? []
    );
  }, [data]);

  return { tokens, loading, error };
}
