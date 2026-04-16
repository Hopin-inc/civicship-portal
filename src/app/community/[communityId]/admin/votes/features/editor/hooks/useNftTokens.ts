import { useMemo } from "react";
import { useGetNftTokensQuery } from "@/types/graphql";

export interface NftTokenOption {
  id: string;
  name: string | null;
  address: string;
  symbol: string | null;
}

/**
 * NFT Token list for gate/power-policy dropdowns.
 *
 * Note: `NftTokenFilterInput` does not have a communityId filter in the current
 * schema, so this returns all NftTokens. If per-community filtering becomes
 * necessary, the backend filter needs to be extended first.
 */
export function useNftTokens() {
  const { data, loading, error } = useGetNftTokensQuery({
    variables: { first: 100 },
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
