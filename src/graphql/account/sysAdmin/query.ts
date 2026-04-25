import { gql } from "@apollo/client";
import {
  SYS_ADMIN_COMMUNITY_OVERVIEW_ROW_FRAGMENT,
  SYS_ADMIN_PLATFORM_SUMMARY_FRAGMENT,
} from "./fragment";

export const GET_SYS_ADMIN_DASHBOARD = gql`
  query GetSysAdminDashboard($input: SysAdminDashboardInput) {
    sysAdminDashboard(input: $input) {
      asOf
      platform {
        ...SysAdminPlatformSummaryFields
      }
      communities {
        ...SysAdminCommunityOverviewRowFields
      }
    }
  }
  ${SYS_ADMIN_PLATFORM_SUMMARY_FRAGMENT}
  ${SYS_ADMIN_COMMUNITY_OVERVIEW_ROW_FRAGMENT}
`;
