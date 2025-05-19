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
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border max-w-mobile-l w-full h-16 flex items-center px-4 justify-between mx-auto">
      <div className="flex flex-col text-muted-foreground min-w-fit">
        <span className="text-sm">キャンセル期限:</span>
        <span className="text-sm font-bold">
          {cancellationDeadline ? format(cancellationDeadline, "M/d(E)", { locale: ja }) : "未定"}
        </span>
      </div>
      {isCancellable ? (
        <Button variant="destructive" className="shrink-0 px-6" onClick={onCancel}>
          予約をキャンセル
        </Button>
      ) : (
        <Button variant="tertiary" className="shrink-0 px-6 text-gray-400" disabled>
          キャンセル不可
        </Button>
      )}
    </footer>
  );
};

export default ParticipationActions;
