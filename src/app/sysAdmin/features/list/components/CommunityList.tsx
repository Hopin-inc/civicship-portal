"use client";

import { useRef } from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { useCommunities } from "../hooks/useCommunities";
import { CommunityItem } from "./CommunityItem";

export function CommunityList() {
  const { communities, loading, error, refetch } = useCommunities();

  const refetchRef = useRef<(() => void) | null>(null);
  refetchRef.current = refetch;

  if (loading && communities.length === 0) {
    return <LoadingIndicator fullScreen={false} />;
  }

  if (error) {
    return <ErrorState title="コミュニティの読み込みに失敗しました" refetchRef={refetchRef} />;
  }

  if (communities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">コミュニティがありません</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {communities.map((community, idx) => (
        <div key={community.id}>
          {idx !== 0 && <hr className="border-muted" />}
          <CommunityItem community={community} />
        </div>
      ))}
    </div>
  );
}
