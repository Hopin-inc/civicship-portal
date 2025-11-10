// import { executeServerGraphQLQuery } from "@/lib/graphql/server";
// import { COMMUNITY_ID } from "@/lib/communities/metadata";
// import { GqlCommunity } from "@/types/graphql";
// import { GET_COMMUNITY_POINT_FLOW_STATS_QUERY } from "@/graphql/account/community/server";
//
// export interface ServerCommunityPointFlowStatsParams {
//   weeklyLimit?: number;
//   weeklyFrom?: Date;
//   weeklyTo?: Date;
// }
//
// interface CommunityPointFlowStatsResponse {
//   community: Pick<GqlCommunity, "pointFlowStat" | "pointFlowStatsWeekly"> | null;
// }
//
// const fallbackStats = {
//   pointFlowStat: null,
//   pointFlowStatsWeekly: [],
// };
//
// /**
//  * サーバーサイドでコミュニティのポイントフロー統計を取得する関数
//  */
// export async function getServerCommunityPointFlowStats(
//   params: ServerCommunityPointFlowStatsParams = {},
// ): Promise<Pick<GqlCommunity, "pointFlowStat" | "pointFlowStatsWeekly">> {
//   const { weeklyLimit = 8, weeklyFrom, weeklyTo } = params;
//
//   try {
//     const variables = {
//       communityId: COMMUNITY_ID,
//       weeklyLimit,
//       weeklyFrom,
//       weeklyTo,
//     };
//
//     const data = await executeServerGraphQLQuery<CommunityPointFlowStatsResponse>(
//       GET_COMMUNITY_POINT_FLOW_STATS_QUERY,
//       variables,
//     );
//
//     return {
//       pointFlowStat: data.community?.pointFlowStat ?? null,
//       pointFlowStatsWeekly: data.community?.pointFlowStatsWeekly ?? [],
//     };
//   } catch (error) {
//     console.error("Failed to fetch community point flow stats:", error);
//     return fallbackStats;
//   }
// }
//
// /**
//  * 直近N週間のポイントフロー統計を取得する関数
//  */
// export async function getServerCommunityPointFlowStatsRecent(
//   weeks: number = 8,
// ): Promise<Pick<GqlCommunity, "pointFlowStat" | "pointFlowStatsWeekly">> {
//   return getServerCommunityPointFlowStats({
//     weeklyLimit: weeks,
//   });
// }
