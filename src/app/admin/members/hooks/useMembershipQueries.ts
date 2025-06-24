import {
  GqlMembershipStatus,
  GqlSortDirection,
  useGetDidIssuanceRequestsQuery,
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
  const { data: didIssuanceRequestsData } = useGetDidIssuanceRequestsQuery({
    variables: {
      userId: "cmbuuhrd5000fawk43l843voo",
    },
  });
  // console.log(membershipListData);
  console.log(didIssuanceRequestsData);
  return {
    fetchMembershipList,
    membershipListData,
  };
};
