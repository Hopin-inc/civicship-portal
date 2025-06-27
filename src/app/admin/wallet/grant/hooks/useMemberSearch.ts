"use client";

import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { GqlUser, useGetSingleMembershipQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

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
    searchParamKey?: string;
    route?: string;
  },
) => {
  const searchParams = useSearchParams();
  const searchKey = options?.searchParamKey || "q";
  const initialQuery = searchParams.get(searchKey) || "";

  const form = useForm<MemberSearchFormValues>({
    defaultValues: {
      searchQuery: initialQuery,
    },
  });

  const searchQuery = form.watch("searchQuery");

  const { data: singleMembershipData, loading, error } = useGetSingleMembershipQuery({
    variables: {
      communityId: COMMUNITY_ID,
      userKey: searchQuery,
    },
    skip: !searchQuery,
  });

  return {
    form,
    singleMembershipData,
    loading,
    error,
  };
};
