"use client";

import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { GqlUser } from "@/types/graphql";

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
  members: MemberSearchTarget[],
  options?: {
    searchParamKey?: string;
    route?: string;
  },
) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchKey = options?.searchParamKey || "q";
  const route = options?.route || "/admin/wallet/grant";
  const initialQuery = searchParams.get(searchKey) || "";

  const form = useForm<MemberSearchFormValues>({
    defaultValues: {
      searchQuery: initialQuery,
    },
  });

  const searchQuery = form.watch("searchQuery");

  const filteredMembers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return members;
    return members.filter(({ user }) => user.name?.toLowerCase().includes(query));
  }, [members, searchQuery]);

  const onSubmit = useCallback(
    (data: MemberSearchFormValues) => {
      const params = new URLSearchParams(searchParams.toString());
      if (data.searchQuery) {
        params.set(searchKey, data.searchQuery);
      } else {
        params.delete(searchKey);
      }
      router.push(`${route}?${params.toString()}`);
    },
    [searchParams, router, searchKey, route],
  );

  return {
    form,
    filteredMembers,
    onSubmit,
  };
};
