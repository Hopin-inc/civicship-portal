"use client";

import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { GqlUser } from "@/types/graphql";

export type MemberSearchFormValues = {
  searchQuery: string;
};

export const useMemberSearch = (
  members: { user: GqlUser; wallet: { currentPointView?: { currentPoint: number } } }[],
) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

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
        params.set("q", data.searchQuery);
      } else {
        params.delete("q");
      }
      router.push(`/admin/wallet/grant?${params.toString()}`);
    },
    [router, searchParams],
  );

  return {
    form,
    filteredMembers,
    onSubmit,
  };
};
