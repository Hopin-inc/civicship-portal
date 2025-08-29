import { GqlUser, useGetNftInstancesQuery } from "@/types/graphql";
import { logger } from "@/lib/logging";

interface UseUserNftProps {
    userId: GqlUser["id"];
}

export const useUserNfts = ({ userId }: UseUserNftProps) => {
    const queryStartTime = performance.now();
    const requestId = `nft-${queryStartTime}`;
    
    const { data: nftInstances } = useGetNftInstancesQuery(
      {
        variables: {
          filter: {
            userId: [userId],
          },
        },
        fetchPolicy: "cache-first",
        skip: !userId,
        onCompleted: (data) => {
          const queryEndTime = performance.now();
          const queryDuration = queryEndTime - queryStartTime;
          const nftCount = data?.nftInstances?.edges?.length || 0;
          logger.info("🎨 [NFT] クエリ完了", {
            queryDuration: `${queryDuration.toFixed(2)}ms`,
            nftCount,
            requestId,
            component: "useUserNfts"
          });
        },
        onError: (error) => {
          const queryEndTime = performance.now();
          const queryDuration = queryEndTime - queryStartTime;
          logger.error("❌ [NFT] クエリエラー", {
            queryDuration: `${queryDuration.toFixed(2)}ms`,
            error: error.message,
            requestId,
            component: "useUserNfts"
          });
        }
      }
    );
    
    const processedNfts = nftInstances?.nftInstances?.edges?.map(edge => edge.node) ?? [];
    
    return {
      nftInstances: processedNfts,
    };
};
