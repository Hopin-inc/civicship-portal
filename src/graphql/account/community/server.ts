// export const GET_COMMUNITY_POINT_FLOW_STATS_QUERY = `
//   query getCommunityPointFlowStats(
//     $communityId: ID!
//     $weeklyLimit: Int
//     $weeklyFrom: Datetime
//     $weeklyTo: Datetime
//   ) {
//     community(id: $communityId) {
//       id
//       name
//       pointFlowStat {
//         communityId
//         issuedPoints
//         grantedPoints
//         transferredPoints
//         updatedAt
//       }
//       pointFlowStatsWeekly(limit: $weeklyLimit, from: $weeklyFrom, to: $weeklyTo) {
//         communityId
//         week
//         issuedPoints
//         grantedPoints
//         transferredPoints
//         updatedAt
//       }
//     }
//   }
// `;
