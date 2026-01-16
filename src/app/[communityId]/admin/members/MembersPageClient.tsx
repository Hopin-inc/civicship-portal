"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { useMemberWithDidSearch } from "../credentials/hooks/useMemberWithDidSearch";
import SearchForm from "@/components/shared/SearchForm";
import { MembersList } from "./components/MembersList";
import { useMembershipCommand } from "./hooks/useMembershipMutations";
import { GqlMembershipsConnection, GqlRole } from "@/types/graphql";
import { toast } from "react-toastify";

interface MembersPageClientProps {
  initialConnection: GqlMembershipsConnection | null;
}

const EMPTY_MEMBERS: [] = [];

export default function MembersPageClient({ initialConnection }: MembersPageClientProps) {
  const { user: currentUser } = useAuth();
  const params = useParams();
  const communityId = params.communityId as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState("");

  const currentUserRole = currentUser?.memberships?.find(
    (m) => m.community?.id === communityId,
  )?.role;

  const headerConfig = useMemo(
    () => ({
      title: "権限管理",
      showLogo: false,
      showBackButton: true,
      backTo: "/admin",
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const {
    data: members,
    loading,
    error,
    hasNextPage,
    isFetchingMore,
    loadMoreRef,
    refetch,
  } = useMemberWithDidSearch(communityId, EMPTY_MEMBERS, {
    searchQuery,
    pageSize: 20,
    enablePagination: true,
    initialConnection,
  });

  const { assignOwner, assignManager, assignMember } = useMembershipCommand();

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const handleRoleChange = async (userId: string, newRole: GqlRole) => {
    if (currentUserRole !== GqlRole.Owner) {
      toast.error("この操作を行う権限がありません");
      return false;
    }

    const roleMutationMap = {
      OWNER: assignOwner,
      MANAGER: assignManager,
      MEMBER: assignMember,
    };

    const mutate = roleMutationMap[newRole];
    if (!mutate) {
      toast.error("無効な権限です");
      return false;
    }

    try {
      const result = await mutate({ communityId, userId });
      if (!result.success) {
        toast.error(`権限変更に失敗しました（${result.code ?? "UNKNOWN"}）`);
        return false;
      }
      toast.success("権限を更新しました");
      refetch();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "不明なエラーが発生しました");
      return false;
    }
  };

  if (loading && members.length === 0) return <LoadingIndicator fullScreen />;
  if (error) return <ErrorState title={"メンバーを読み込めませんでした"} refetchRef={refetchRef} />;

  return (
    <div className="py-4">
      <SearchForm
        value={input}
        onInputChange={setInput}
        onSearch={setSearchQuery}
        placeholder={"名前・DIDで検索"}
      />

      <MembersList
        members={members}
        currentUserRole={currentUserRole}
        hasNextPage={hasNextPage}
        isFetchingMore={isFetchingMore}
        loadMoreRef={loadMoreRef}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
}
