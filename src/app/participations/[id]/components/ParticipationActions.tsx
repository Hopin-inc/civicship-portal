"use client";

import React from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ParticipationActionsProps {
  cancellationDeadline: Date | null;
  isCancellable: boolean;
  isAfterParticipation: boolean;
  onCancel?: () => void;
  isCancelling?: boolean;
}

const ParticipationActions: React.FC<ParticipationActionsProps> = ({
  cancellationDeadline,
  isCancellable,
  isAfterParticipation,
  onCancel,
  isCancelling,
}) => {
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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="shrink-0 px-6">
              申込をキャンセル
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[90vw] max-w-[400px] rounded-sm">
            <DialogHeader>
              <DialogTitle className={"text-left text-body-sm font-bold pb-2"}>
                申込をキャンセルして、案内人にお知らせしますか？
              </DialogTitle>
              <DialogDescription className={"text-left"}>
                キャンセルが完了すると、案内人に通知が送られます。この操作は元に戻せません。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2">
              <DialogClose asChild>
                <Button variant="tertiary" className="w-full py-4">
                  やめる
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={onCancel}
                disabled={isCancelling}
                className="w-full py-4"
              >
                {isCancelling ? "キャンセル中..." : "キャンセルを送信"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
