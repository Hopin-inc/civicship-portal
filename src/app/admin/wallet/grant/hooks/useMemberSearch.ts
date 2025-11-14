"use client";

import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { GqlDidIssuanceStatus, GqlUser, useGetDidIssuanceRequestsQuery } from "@/types/graphql";

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
  members: MemberSearchTarget[] = [],
  options?: {
    searchParamKey?: string;
    route?: string;
    communityId?: string;
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

  const searchQuery = form.watch("searchQuery")?.toLowerCase() ?? "";

  const filteredMembers = members.filter(({ user }) =>
    user.name?.toLowerCase().includes(searchQuery)
  );

  const userIds = filteredMembers.map(({ user }) => user.id);

  const { data: didIssuanceRequests } = useGetDidIssuanceRequestsQuery({
    variables: { userIds },
    fetchPolicy: "network-only",
  });

  const filteredMembersWithDid = filteredMembers.map(member => {
    const didInfo = didIssuanceRequests?.users?.edges
      ?.find(edge => edge?.node?.id === member.user.id)
      ?.node?.didIssuanceRequests
      ?.find(request => request?.status === GqlDidIssuanceStatus.Completed);
  
    return {
      ...member,
      didInfo,
    };
  });

  return {
    form,
    filteredMembers: filteredMembersWithDid,
  };
};
