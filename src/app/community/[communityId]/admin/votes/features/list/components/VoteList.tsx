"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { AppLink } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { VoteListItem } from "./VoteListItem";
import { useVoteTopics } from "../hooks/useVoteTopics";
import { useVoteTopicActions } from "../hooks/useVoteTopicActions";

interface VoteListProps {
  communityId: string;
}

export function VoteList({ communityId }: VoteListProps) {
  const t = useTranslations();
  const { items, loading, error, loadMoreRef, hasNextPage, isLoadingMore, refetch } =
    useVoteTopics({ communityId });
  const { handleEdit, handleDelete } = useVoteTopicActions({ communityId, refetch });

  const refetchRef = useRef<(() => void) | null>(null);
  refetchRef.current = refetch;

  if (loading && items.length === 0) {
    return <LoadingIndicator fullScreen={false} />;
  }

  if (error) {
    return (
      <ErrorState
        title={t("adminVotes.list.loadError")}
        refetchRef={refetchRef}
      />
    );
  }

  if (items.length === 0) {
    return (
      <Empty className="py-16">
        <EmptyHeader>
          <EmptyTitle>{t("adminVotes.list.emptyTitle")}</EmptyTitle>
          <EmptyDescription>{t("adminVotes.list.emptyDescription")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="primary">
            <AppLink href="/admin/votes/new">
              <Plus className="h-4 w-4" />
              {t("adminVotes.list.createButton")}
            </AppLink>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col">
      {items.map((item, idx) => (
        <div key={item.id}>
          {idx !== 0 && <hr className="border-muted" />}
          <VoteListItem
            item={item}
            onEdit={() => handleEdit(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
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
