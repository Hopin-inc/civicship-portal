"use client";

import { useApolloClient } from "@apollo/client";
import { GET_SINGLE_MEMBERSHIP, GET_MEMBERSHIP_LIST } from "@/graphql/account/membership/query";

export const useMembershipQueries = () => {
  const client = useApolloClient();

  const getSingleMembership = async (communityId: string, userId: string) => {
    if (!communityId || !userId) {
      throw new Error("Community ID and User ID are required");
    }

    const { data } = await client.query({
      query: GET_SINGLE_MEMBERSHIP,
      variables: { communityId, userId },
      fetchPolicy: "network-only",
    });

    return data;
  };

  const getMembershipList = async (variables = {}) => {
    const { data } = await client.query({
      query: GET_MEMBERSHIP_LIST,
      variables: { first: 10, ...variables },
      fetchPolicy: "network-only",
    });

    return data;
  };

  return {
    getSingleMembership,
    getMembershipList,
  };
};
