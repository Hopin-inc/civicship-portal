import { GqlUser, useGetNftInstancesQuery } from "@/types/graphql";
import { logger } from "@/lib/logging";

interface UseUserNftProps {
    userId: GqlUser["id"];
}

export const useUserNfts = ({ userId }: UseUserNftProps) => {
    const queryStartTime = performance.now();
    const requestId = `nft-${queryStartTime}`;
    
    logger.info("🚀 useUserNfts: NFTクエリ開始", {
      timestamp: queryStartTime,
      requestId,
      userId,
      component: "useUserNfts"
    });
    
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
          logger.info("✅ useUserNfts: NFTクエリ完了", {
            queryDuration: `${queryDuration.toFixed(2)}ms`,
            nftCount,
            fetchPolicy: "cache-first",
            timestamp: queryEndTime,
            requestId,
            component: "useUserNfts"
          });
        },
        onError: (error) => {
          const queryEndTime = performance.now();
          const queryDuration = queryEndTime - queryStartTime;
          logger.error("❌ useUserNfts: NFTクエリエラー", {
            queryDuration: `${queryDuration.toFixed(2)}ms`,
            error: error.message,
            timestamp: queryEndTime,
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
