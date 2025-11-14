"use client";

import { useQuery } from "@apollo/client";
import { GET_COMMUNITY_MEMBERS } from "@/graphql/account/membership/community-members";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import {
  GqlGetCommunityMembersQuery,
  GqlGetCommunityMembersQueryVariables,
  GqlMembershipStatus,
  GqlSortDirection,
} from "@/types/graphql";
import { presentMember } from "../presenters/presentMember";
import { PresentedMember } from "../types/PresentedMember";

export function useCommunityMembers() {
  const { data, loading, error } = useQuery<
    GqlGetCommunityMembersQuery,
    GqlGetCommunityMembersQueryVariables
  >(GET_COMMUNITY_MEMBERS, {
    variables: {
      filter: {
        communityId: COMMUNITY_ID,
        status: GqlMembershipStatus.Joined,
      },
      first: 100,
      sort: {
        createdAt: GqlSortDirection.Desc,
      },
    },
  });

  const members: PresentedMember[] =
    data?.memberships?.edges
      ?.map((edge) => edge?.node)
      .filter((node): node is NonNullable<typeof node> => node != null)
      .map(presentMember) ?? [];

  return {
    members,
    loading,
    error,
  };
}
