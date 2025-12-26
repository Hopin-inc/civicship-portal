"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { useMemberWithDidSearch } from "../credentials/hooks/useMemberWithDidSearch";
import SearchForm from "@/components/shared/SearchForm";
import { MembersList } from "./components/MembersList";
import { RoleChangeDialog } from "./components/RoleChangeDialog";
import { useMemberRoleManagement } from "./hooks/useMemberRoleManagement";
import { GqlMembershipsConnection } from "@/types/graphql";

interface MembersPageClientProps {
  initialConnection: GqlMembershipsConnection | null;
}

const EMPTY_MEMBERS: [] = [];

export default function MembersPageClient({ initialConnection }: MembersPageClientProps) {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState("");
  
  // Use runtime communityId from CommunityConfigContext
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId || "";

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

  const {
    pendingRoleChange,
    isLoading: isRoleChangeLoading,
    requestRoleChange,
    confirmRoleChange,
    cancelRoleChange,
  } = useMemberRoleManagement();

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

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
        onRoleChange={(userId, userName, newRole) => {
          requestRoleChange(userId, userName, newRole, currentUserRole);
        }}
      />

      {pendingRoleChange && (
        <RoleChangeDialog
          isOpen={true}
          userName={pendingRoleChange.userName}
          newRole={pendingRoleChange.newRole}
          isLoading={isRoleChangeLoading}
          onConfirm={confirmRoleChange}
          onCancel={cancelRoleChange}
        />
      )}
    </div>
  );
}
