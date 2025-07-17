import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
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
  members: MemberSearchTarget[] = [],
  options?: {
    searchParamKey?: string;
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

  return {
    form,
    filteredMembers,
  };
}; 