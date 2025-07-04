"use client";

import { GqlUser, useGetMembershipListQuery, useGetSingleMembershipQuery } from "@/types/graphql";

export type MemberSearchFormValues = {
  searchQuery: string;
};

export interface MemberSearchTarget {
  user: GqlUser;
  wallet?: {
    currentPointView?: {
      currentPoint: number;
    };
  };
}

export const useMemberSearch = (
  options?: {
    searchQuery?: string;
  },
) => {
  const searchQuery = options?.searchQuery ?? "";

  const { data: searchMembershipData, loading, error } = useGetMembershipListQuery({
    variables: {
      filter: {
        keyword: searchQuery,
      },
    },
    skip: !searchQuery,
  });
  return {
    searchMembershipData,
    loading,
    error,
  };
};
