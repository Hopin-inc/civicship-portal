"use client";

import React from "react";
import { GqlUser } from "@/types/graphql";
import UserInfoCard from "./UserInfoCard";
import { useMemberWithDidSearch as useMemberSearchFromCredentials } from "@/app/admin/credentials/hooks/useMemberWithDidSearch";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

interface MemberTabProps {
  members: { user: GqlUser; wallet: { currentPointView?: { currentPoint: bigint } } }[];
  searchQuery: string;
  onSelect: (user: GqlUser) => void;
  loadMoreRef?: React.RefObject<HTMLDivElement>;
  isLoadingMore?: boolean;
}

export function MemberTab({
  members,
  searchQuery,
  onSelect,
}: MemberTabProps) {
  const communityId = COMMUNITY_ID;
  const {
    data: searchMembershipData,
    error,
    loadMoreRef: searchLoadMoreRef,
    isLoadingMore: searchIsLoadingMore,
    loading: searchIsLoading,
  } = useMemberSearchFromCredentials(communityId, members, { 
    searchQuery ,
    pageSize: 20,
    enablePagination: true,
  });

  if (error) {
    return (
      <div className="space-y-3 px-4">
        <p className="text-sm text-center text-red-500 pt-4">メンバーの読み込みに失敗しました</p>
      </div>
    );
  }

  if (searchMembershipData.length === 0 && searchIsLoading ) {
    return (
      <div className="space-y-3 px-4">
        <p className="text-sm text-center text-muted-foreground pt-4">
          読み込み中
        </p>
      </div>
    );
  }

  if (searchMembershipData.length === 0 && !searchIsLoading ) {
    return (
      <div className="space-y-3 px-4">
        <p className="text-sm text-center text-muted-foreground pt-4">
          一致するメンバーが見つかりません
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
            tabType="member"
            onClick={() => onSelect(m)}
          />
        );
      })}

      {/* 無限スクロール用のローディング要素 - 常に表示 */}
      <div ref={searchLoadMoreRef} className="flex justify-center py-8">
        {searchIsLoadingMore && (
          <div className="flex items-center space-x-2">
            <LoadingIndicator fullScreen={false}/>
          </div>
        )}
      </div>
    </div>
  );
}
