"use client";

import React from "react";
import { GqlMembershipsConnection, GqlUser } from "@/types/graphql";
import UserInfoCard from "./UserInfoCard";
import { useMemberWithDidSearch as useMemberSearchFromCredentials } from "@/app/admin/credentials/hooks/useMemberWithDidSearch";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useTranslations } from "next-intl";

interface MemberTabProps {
  members: { user: GqlUser; wallet: { currentPointView?: { currentPoint: bigint } } }[];
  searchQuery: string;
  onSelect: (user: GqlUser) => void;
  loadMoreRef?: React.RefObject<HTMLDivElement>;
  isLoadingMore?: boolean;
  initialConnection?: GqlMembershipsConnection | null;
}

export function MemberTab({ members, searchQuery, onSelect, initialConnection }: MemberTabProps) {
  const t = useTranslations();
  // Use runtime communityId from CommunityConfigContext
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId || "";
  
  const {
    data: searchMembershipData,
    error,
    loadMoreRef: searchLoadMoreRef,
    isLoadingMore: searchIsLoadingMore,
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

  return (
    <div className="space-y-3 px-4">
      {searchMembershipData?.map((m) => {
        return (
          <UserInfoCard
            key={m.id}
            otherUser={m}
            label={m.name}
            point={m.wallet?.currentPointView?.currentPoint ?? BigInt(0)}
            showPoint={true}
            showDate={false}
            didValue={m.didInfo?.didValue ?? undefined}
            onClick={() => onSelect(m)}
          />
        );
      })}

      {/* 無限スクロール用のローディング要素 - 常に表示 */}
      <div ref={searchLoadMoreRef} className="flex justify-center py-8">
        {searchIsLoadingMore && (
          <div className="flex items-center space-x-2">
            <LoadingIndicator fullScreen={false} />
          </div>
        )}
      </div>
    </div>
  );
}
