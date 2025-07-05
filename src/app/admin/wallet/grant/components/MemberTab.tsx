"use client";

import React, { useRef, useEffect } from "react";
import { GqlUser } from "@/types/graphql";
import UserInfoCard from "./UserInfoCard";
import { useMemberWithDidSearch as useMemberSearchFromCredentials } from "@/app/admin/credentials/hooks/useMemberWithDidSearch";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

interface MemberTabProps {
  members: { user: GqlUser; wallet: { currentPointView?: { currentPoint: number } } }[];
  searchQuery: string;
  onSelect: (user: GqlUser) => void;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
}

export function MemberTab({ 
  members, 
  searchQuery, 
  onSelect, 
  onLoadMore, 
  hasNextPage 
}: MemberTabProps) {
  const communityId = COMMUNITY_ID;
  const { data: searchMembershipData, loading, error } = useMemberSearchFromCredentials(communityId, members, { searchQuery });
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasNextPage || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 1 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasNextPage, onLoadMore]);

  if (error) {
    return (
      <div className="space-y-3 px-4">
        <p className="text-sm text-center text-red-500 pt-4">
          メンバーの読み込みに失敗しました
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3 px-4">
        <p className="text-sm text-center text-muted-foreground pt-4">
          読み込み中...
        </p>
      </div>
    );
  }

  if (searchMembershipData.length === 0) {
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
      {searchMembershipData?.map((m) => (
        <UserInfoCard
          key={m.id}
          otherUser={m}
          label={m.name}
          showPoint={false}
          showDate={false}
          didValue={m.didInfo?.didValue ?? "did取得中"}
          onClick={() => onSelect(m)}
        />
      ))}
      {hasNextPage && <div ref={loadMoreRef} className="h-10" />}
    </div>
  );
} 