import { GqlMembershipStatus, GqlSortDirection, useGetMembershipListQuery } from "@/types/graphql";

export const useMembershipQueries = (communityId: string) => {
  const { data, loading, error, refetch } = useGetMembershipListQuery({
    variables: {
      filter: {
        communityId,
        status: GqlMembershipStatus.Joined,
      },
      sort: {
        createdAt: GqlSortDirection.Asc,
      },
      first: 500,
      withDidIssuanceRequests: true,
    },
    fetchPolicy: "network-only",
  });

  return {
    membershipListData: data,
    loading,
    error,
    refetch,
  };
};
