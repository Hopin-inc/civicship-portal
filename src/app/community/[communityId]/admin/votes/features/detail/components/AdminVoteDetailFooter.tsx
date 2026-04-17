"use client";

import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GqlVoteTopicPhase } from "@/types/graphql";

interface AdminVoteDetailFooterProps {
  phase: GqlVoteTopicPhase;
  onDelete: () => void;
}

export function AdminVoteDetailFooter({
  phase,
  onDelete,
}: AdminVoteDetailFooterProps) {
  const t = useTranslations();
  const isEditable = phase === GqlVoteTopicPhase.Upcoming;

  if (!isEditable) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
      <div className="max-w-md mx-auto px-4 py-3 flex justify-end gap-3">
        <Button
          variant="tertiary"
          size="sm"
          onClick={onDelete}
          className="gap-1"
        >
          <Trash2 className="h-4 w-4" />
          {t("adminVotes.detail.deleteButton")}
        </Button>
      </div>
    </div>
  );
}
