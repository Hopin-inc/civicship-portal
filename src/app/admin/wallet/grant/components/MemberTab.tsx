"use client";

import React, { useState } from "react";
import { GqlMembershipsConnection, GqlUser } from "@/types/graphql";
import { useMemberWithDidSearch as useMemberSearchFromCredentials } from "@/app/admin/credentials/hooks/useMemberWithDidSearch";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useTranslations } from "next-intl";
import { Table, TableBody } from "@/components/ui/table";
import { UserPointRow } from "@/components/shared/UserPointRow";

interface MemberTabProps {
  members: { user: GqlUser; wallet: { currentPointView?: { currentPoint: bigint } } }[];
  searchQuery: string;
  onSelect: (user: GqlUser) => void;
  initialConnection?: GqlMembershipsConnection | null;
}

export function MemberTab({ members, searchQuery, onSelect, initialConnection }: MemberTabProps) {
  const t = useTranslations();
  // Use runtime communityId from CommunityConfigContext
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId || "";
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const {
    data: searchMembershipData,
    error,
    loadMoreRef: internalLoadMoreRef,
    isLoadingMore: internalIsLoadingMore,
  } = useMemberSearchFromCredentials(communityId, members, {
    searchQuery,
    pageSize: 20,
    enablePagination: true,
    initialConnection,
  });

  if (error) {
    return (
      <div className="space-y-3 px-4">
        <p className="text-sm text-center text-red-500 pt-4">
          {t("wallets.shared.member.errorLoad")}
        </p>
      </div>
    );
  }

  if (searchMembershipData.length === 0) {
    return (
      <div className="space-y-3 px-4">
        <p className="text-sm text-center text-muted-foreground pt-4">
          {t("wallets.shared.member.noMatch")}
        </p>
      </div>
    );
  }

  const handleSelect = (user: GqlUser) => {
    // すでに選択されているユーザーをクリックした場合は選択解除
    if (selectedUserId === user.id) {
      setSelectedUserId(null);
      return;
    }

    setSelectedUserId(user.id);
    onSelect(user);
  };

  return (
    <div className="px-4">
      <Table className={"max-w-xl"}>
        <TableBody>
          {searchMembershipData?.map((m) => (
            <UserPointRow
              key={m.id}
              avatar={m.image || ""}
              name={m.name || ""}
              subText={
                m.didInfo?.didValue
                  ? `${m.didInfo.didValue.substring(0, 16)}...`
                  : m.createdAt
                    ? new Date(m.createdAt).toLocaleDateString()
                    : ""
              }
              pointValue={Number(m.wallet?.currentPointView?.currentPoint ?? 0)}
              onClick={() => handleSelect(m)}
              selected={selectedUserId === m.id}
            />
          ))}
        </TableBody>
      </Table>

      {/* 無限スクロール用のローディング要素 - 常に表示 */}
      <div ref={internalLoadMoreRef} className="flex justify-center py-8">
        {internalIsLoadingMore && (
          <div className="flex items-center space-x-2">
            <LoadingIndicator fullScreen={false} />
          </div>
        )}
      </div>
    </div>
  );
}
