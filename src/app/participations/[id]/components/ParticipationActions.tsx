"use client";

import React from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ParticipationUIStatus } from "@/app/participations/[id]/page";
import { ImagePlus } from "lucide-react";

interface ParticipationActionsProps {
  status: ParticipationUIStatus;
  cancellationDeadline: Date | null;
  isCancellable: boolean;
  isAfterParticipation: boolean;
  onCancel?: () => void;
}

const ParticipationActions: React.FC<ParticipationActionsProps> = ({
  status,
  cancellationDeadline,
  isCancellable,
  isAfterParticipation,
  onCancel,
}) => {
  if (status === "cancelled") {
    return null;
  }

  const renderMessage = () => {
    if (isAfterParticipation) {
      return (
        <span className="text-sm max-w-40 text-wrap">
          当日の様子を投稿してポイントを獲得できます
        </span>
      );
    }

    return (
      <>
        <span className="text-sm">キャンセル期限:</span>
        <span className="text-sm font-bold">
          {cancellationDeadline ? format(cancellationDeadline, "M/d(E)", { locale: ja }) : "未定"}
        </span>
      </>
    );
  };

  const renderButton = () => {
    if (isAfterParticipation) {
      return (
        <Button variant="primary" className="shrink-0 px-6 flex items-center gap-x-2">
          <ImagePlus className="w-5 h-5 text-primary-foreground" />
          投稿する
        </Button>
      );
    }

    if (isCancellable) {
      return (
        <Button variant="destructive" className="shrink-0 px-6" onClick={onCancel}>
          予約をキャンセル
        </Button>
      );
    }

    return (
      <Button variant="tertiary" className="shrink-0 px-6 text-gray-400" disabled>
        キャンセル不可
      </Button>
    );
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border max-w-mobile-l w-full h-16 flex items-center px-4 justify-between mx-auto">
      <div className="flex flex-col text-muted-foreground min-w-fit">{renderMessage()}</div>
      {renderButton()}
    </footer>
  );
};

export default ParticipationActions;
