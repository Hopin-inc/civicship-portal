"use client";

import React from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface ParticipationActionsProps {
  cancellationDeadline: Date | null;
  isCancellable: boolean;
  onCancel?: () => void;
}

const ParticipationActions: React.FC<ParticipationActionsProps> = ({
  cancellationDeadline,
  isCancellable,
  onCancel,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col text-muted-foreground min-w-fit">
            <span className="text-sm">キャンセル期限:</span>
            <span className="text-sm font-bold">
              {cancellationDeadline
                ? format(cancellationDeadline, "M/d(E)", { locale: ja })
                : "未定"}
            </span>
          </div>
          {isCancellable ? (
            <Button variant="destructive" className="shrink-0" onClick={onCancel}>
              予約をキャンセル
            </Button>
          ) : (
            <Button variant="tertiary" className="shrink-0 text-gray-400" disabled>
              キャンセル不可
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipationActions;
