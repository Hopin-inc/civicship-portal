"use client";

import { useTranslations } from "next-intl";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GqlVoteTopicPhase } from "@/types/graphql";

interface AdminVoteDetailFooterProps {
  phase: GqlVoteTopicPhase;
  onEdit: () => void;
  onDelete: () => void;
}

export function AdminVoteDetailFooter({
  phase,
  onEdit,
  onDelete,
}: AdminVoteDetailFooterProps) {
  const t = useTranslations();
  const isEditable = phase === GqlVoteTopicPhase.Upcoming;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
      <div className="max-w-md mx-auto px-4 py-3 flex justify-end gap-3">
        <span
          className="inline-block"
          title={!isEditable ? t("adminVotes.detail.deleteDisabledHint") : undefined}
        >
          <Button
            variant="tertiary"
            size="sm"
            disabled={!isEditable}
            onClick={onDelete}
            className="gap-1"
          >
            <Trash2 className="h-4 w-4" />
            {t("adminVotes.detail.deleteButton")}
          </Button>
        </span>
        <span
          className="inline-block"
          title={!isEditable ? t("adminVotes.detail.editDisabledHint") : undefined}
        >
          <Button
            variant="primary"
            size="sm"
            disabled={!isEditable}
            onClick={onEdit}
            className="gap-1"
          >
            <Pencil className="h-4 w-4" />
            {t("adminVotes.detail.editButton")}
          </Button>
        </span>
      </div>
    </div>
  );
}
