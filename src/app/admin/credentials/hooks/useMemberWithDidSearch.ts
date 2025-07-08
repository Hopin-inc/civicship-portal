"use client";

import {
  GqlDidIssuanceRequest,
  GqlDidIssuanceStatus,
  GqlUser,
  useGetMembershipListQuery,
} from "@/types/graphql";
import { ApolloError } from "@apollo/client";

export type MemberSearchFormValues = {
  searchQuery: string;
};

export interface MemberSearchTarget {
  user: GqlUser;
  wallet?: {
    currentPointView?: {
      currentPoint: bigint;
    };
  };
}

//TODO: credentials配下ではなく、共通化する場所に移動する
export const useMemberWithDidSearch = (
  communityId: string,
  members: MemberSearchTarget[] = [],
  options?: {
    searchQuery?: string;
  },
): {
  data: (GqlUser & { didInfo?: GqlDidIssuanceRequest })[];
  loading: boolean;
  error: ApolloError | undefined;
} => {
  const searchQuery = options?.searchQuery ?? "";

  const {
    data: searchMembershipData,
    loading,
    error,
  } = useGetMembershipListQuery({
    variables: {
      filter: {
        keyword: searchQuery,
        communityId,
      },
      withDidIssuanceRequests: true,
    },
    skip: !searchQuery,
  });

  const users = searchMembershipData
    ? searchMembershipData.memberships?.edges
        ?.map((edge) => edge?.node?.user)
        .filter((user): user is GqlUser => !!user)
    : members.map((member) => member.user);

  const usersWithDid = users?.map((user) => {
    const didInfo = user.didIssuanceRequests?.find(
      (request) => request?.status === GqlDidIssuanceStatus.Completed,
    );
    return {
      ...user,
      didInfo,
    };
  });

  return {
    data: usersWithDid ?? [],
    loading,
    error,
  };
};
