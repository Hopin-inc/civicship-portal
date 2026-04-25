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
        communityActivityRate
        growthRateActivity
        latestCohortRetentionM1
        totalMembers
        passiveCount
        tier1Count
        tier2Count
        segmentCounts {
          total
          activeCount
          passiveCount
          tier1Count
          tier2Count
        }
        alerts {
          activeDrop
          churnSpike
          noNewMembers
        }
      }
    }
  }
`;

export const GET_SYS_ADMIN_COMMUNITY_DETAIL_SERVER_QUERY = `
  query GetSysAdminCommunityDetailServer($input: SysAdminCommunityDetailInput!) {
    sysAdminCommunityDetail(input: $input) {
      asOf
      communityId
      communityName
      windowMonths
      alerts {
        activeDrop
        churnSpike
        noNewMembers
      }
      summary {
        communityId
        communityName
        communityActivityRate
        communityActivityRate3mAvg
        growthRateActivity
        totalMembers
        tier2Count
        tier2Pct
        totalDonationPointsAllTime
        maxChainDepthAllTime
        dataFrom
        dataTo
      }
      stages {
        habitual {
          count
          pct
          avgSendRate
          avgMonthsIn
          pointsContributionPct
        }
        regular {
          count
          pct
          avgSendRate
          avgMonthsIn
          pointsContributionPct
        }
        occasional {
          count
          pct
          avgSendRate
          avgMonthsIn
          pointsContributionPct
        }
        latent {
          count
          pct
          avgSendRate
          avgMonthsIn
          pointsContributionPct
        }
      }
      monthlyActivityTrend {
        month
        communityActivityRate
        senderCount
        newMembers
        donationPointsSum
        chainPct
      }
      retentionTrend {
        week
        communityActivityRate
        retainedSenders
        churnedSenders
        returnedSenders
        newMembers
      }
      cohortRetention {
        cohortMonth
        cohortSize
        retentionM1
        retentionM3
        retentionM6
      }
      memberList {
        hasNextPage
        nextCursor
        users {
          userId
          name
          userSendRate
          totalPointsOut
          donationOutMonths
          monthsIn
        }
      }
    }
  }
`;
