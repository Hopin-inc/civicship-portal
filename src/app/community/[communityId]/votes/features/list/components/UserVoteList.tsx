"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { UserVoteListItem } from "./UserVoteListItem";
import { useUserVoteTopics } from "../hooks/useUserVoteTopics";

interface UserVoteListProps {
  communityId: string;
}

export function UserVoteList({ communityId }: UserVoteListProps) {
  const t = useTranslations();
  const { items, loading, error, loadMoreRef, hasNextPage, isLoadingMore, refetch } =
    useUserVoteTopics({ communityId });

  const refetchRef = useRef<(() => void) | null>(null);
  refetchRef.current = refetch;

  if (loading && items.length === 0) {
    return <LoadingIndicator fullScreen={false} />;
  }

  if (error) {
    return <ErrorState title={t("votes.list.loadError")} refetchRef={refetchRef} />;
  }

  if (items.length === 0) {
    return (
      <Empty className="py-16">
        <EmptyHeader>
          <EmptyTitle>{t("votes.list.emptyTitle")}</EmptyTitle>
          <EmptyDescription>{t("votes.list.emptyDescription")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col">
      {items.map((item, idx) => (
        <div key={item.id}>
          {idx !== 0 && <hr className="border-muted" />}
          <UserVoteListItem item={item} />
        </div>
      ))}

      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isLoadingMore && <LoadingIndicator fullScreen={false} />}
        </div>
      )}
    </div>
  );
}
