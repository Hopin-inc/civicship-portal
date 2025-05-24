import {
  GqlMembershipStatus,
  GqlSortDirection,
  useGetMembershipListLazyQuery,
} from "@/types/graphql";

export const useMembershipQueries = () => {
  const [fetchMembershipList, { data: membershipListData }] = useGetMembershipListLazyQuery({
    variables: {
      filter: {
        status: GqlMembershipStatus.Joined,
      },
      sort: {
        createdAt: GqlSortDirection.Asc,
      },
    },
    fetchPolicy: "network-only",
  });

  return {
    fetchMembershipList,
    membershipListData,
  };
};
