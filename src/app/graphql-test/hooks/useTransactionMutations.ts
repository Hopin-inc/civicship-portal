"use client";

import { useApolloClient } from "@apollo/client";
import { ISSUE_POINT, GRANT_POINT, DONATE_POINT } from "@/graphql/transaction/mutation";

interface IssuePointInput {
  communityId: string;
  userId: string;
  amount: number;
  reason?: string;
}

interface GrantPointInput {
  communityId: string;
  userId: string;
  amount: number;
  reason?: string;
}

interface DonatePointInput {
  communityId: string;
  toUserId: string;
  amount: number;
  reason?: string;
}

export const useTransactionMutations = () => {
  const client = useApolloClient();

  const issuePoint = async (input: IssuePointInput) => {
    if (!input.communityId || !input.userId) {
      throw new Error("Community ID and User ID are required");
    }

    const { data } = await client.mutate({
      mutation: ISSUE_POINT,
      variables: {
        input: {
          communityId: input.communityId,
          userId: input.userId,
          amount: input.amount,
          reason: input.reason,
        },
        permission: { communityId: input.communityId },
      },
    });

    return data;
  };

  const grantPoint = async (input: GrantPointInput) => {
    if (!input.communityId || !input.userId) {
      throw new Error("Community ID and User ID are required");
    }

    const { data } = await client.mutate({
      mutation: GRANT_POINT,
      variables: {
        input: {
          communityId: input.communityId,
          userId: input.userId,
          amount: input.amount,
          reason: input.reason,
        },
        permission: { communityId: input.communityId },
      },
    });

    return data;
  };

  const donatePoint = async (input: DonatePointInput) => {
    if (!input.communityId || !input.toUserId) {
      throw new Error("Community ID and Target User ID are required");
    }

    const { data } = await client.mutate({
      mutation: DONATE_POINT,
      variables: {
        input: {
          communityId: input.communityId,
          toUserId: input.toUserId,
          amount: input.amount,
          reason: input.reason,
        },
        permission: { communityId: input.communityId },
      },
    });

    return data;
  };

  return {
    issuePoint,
    grantPoint,
    donatePoint,
  };
};
