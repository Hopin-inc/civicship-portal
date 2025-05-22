"use client";

import { ASSIGN_OWNER, ASSIGN_MANAGER, ASSIGN_MEMBER } from "@/graphql/account/membership/mutation";
import { testApolloClient } from "../lib/apollo";

interface MembershipSetRoleInput {
  userId: string;
  communityId: string;
}

export const useMembershipMutations = () => {
  const assignOwner = async (input: MembershipSetRoleInput) => {
    if (!input.communityId || !input.userId) {
      throw new Error("Community ID and User ID are required");
    }

    const { data } = await testApolloClient.mutate({
      mutation: ASSIGN_OWNER,
      variables: {
        input,
        permission: { communityId: input.communityId },
      },
    });

    return data;
  };

  const assignManager = async (input: MembershipSetRoleInput) => {
    if (!input.communityId || !input.userId) {
      throw new Error("Community ID and User ID are required");
    }

    const { data } = await testApolloClient.mutate({
      mutation: ASSIGN_MANAGER,
      variables: {
        input,
        permission: { communityId: input.communityId },
      },
    });

    return data;
  };

  const assignMember = async (input: MembershipSetRoleInput) => {
    if (!input.communityId || !input.userId) {
      throw new Error("Community ID and User ID are required");
    }

    const { data } = await testApolloClient.mutate({
      mutation: ASSIGN_MEMBER,
      variables: {
        input,
        permission: { communityId: input.communityId },
      },
    });

    return data;
  };

  return {
    assignOwner,
    assignManager,
    assignMember,
  };
};
