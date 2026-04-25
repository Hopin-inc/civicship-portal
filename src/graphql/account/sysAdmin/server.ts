/**
 * SysAdmin ダッシュボード用 server-side string query。
 * `executeServerGraphQLQuery` がパース不可の TypedDocumentNode ではなく
 * 生 string を期待するので、`graphql/account/sysAdmin/query.ts` の
 * gql tag 版とは別ファイルで保守する。
 *
 * fragment は inline 展開 (executeServerGraphQLQuery は単一 string を
 * fetch body の query に乗せるだけなので、fragment を別途送る術がない)。
 */

export const GET_SYS_ADMIN_DASHBOARD_SERVER_QUERY = `
  query GetSysAdminDashboardServer($input: SysAdminDashboardInput) {
    sysAdminDashboard(input: $input) {
      asOf
      platform {
        communitiesCount
        latestMonthDonationPoints
        totalMembers
      }
      communities {
        communityId
        communityName
        totalMembers
        segmentCounts {
          total
          activeCount
          passiveCount
          tier1Count
          tier2Count
        }
        windowActivity {
          senderCount
          senderCountPrev
          newMemberCount
          newMemberCountPrev
          retainedSenders
        }
        weeklyRetention {
          retainedSenders
          churnedSenders
        }
        latestCohort {
          size
          activeAtM1
        }
      }
    }
  }
`;
