import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GET_COMMUNITY_MEMBERS_SERVER_QUERY } from "@/graphql/account/membership/community-members";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import {
  GqlMembershipsConnection,
  GqlGetCommunityMembersQuery,
  GqlGetCommunityMembersQueryVariables,
  GqlMembershipStatus,
  GqlSortDirection,
} from "@/types/graphql";

export interface ServerCommunityMembersParams {
  first?: number;
  after?: string;
}

const fallbackConnection: GqlMembershipsConnection = {
  edges: [],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  },
  totalCount: 0,
};

export async function getServerCommunityMembers(
  params: ServerCommunityMembersParams = {}
): Promise<GqlMembershipsConnection> {
  const { first = 50, after } = params;

  try {
    const variables: GqlGetCommunityMembersQueryVariables = {
      filter: {
        communityId: COMMUNITY_ID,
        status: GqlMembershipStatus.Active,
      },
      first,
      cursor: after ? { cursor: after } : undefined,
      sort: {
        createdAt: GqlSortDirection.Desc,
      },
    };

    const data = await executeServerGraphQLQuery<
      GqlGetCommunityMembersQuery,
      GqlGetCommunityMembersQueryVariables
    >(GET_COMMUNITY_MEMBERS_SERVER_QUERY, variables);

    return data.memberships ?? fallbackConnection;
  } catch (error) {
    console.error("Failed to fetch community members:", error);
    return fallbackConnection;
  }
}

export async function getServerCommunityMembersWithCursor(
  cursor?: string,
  first: number = 20
): Promise<GqlMembershipsConnection> {
  return getServerCommunityMembers({
    first,
    after: cursor,
  });
}
