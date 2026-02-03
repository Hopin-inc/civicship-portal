"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const [isCancelSheetOpen, setIsCancelSheetOpen] = useState(false);

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
        <Sheet open={isCancelSheetOpen} onOpenChange={setIsCancelSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="destructive" className="shrink-0 px-6">
              申込をキャンセル
            </Button>
          </SheetTrigger>

          <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
            <SheetHeader className="text-left pb-6">
              <SheetTitle className="text-body-sm font-bold">
                申込をキャンセルして、案内人にお知らせしますか？
              </SheetTitle>
              <SheetDescription className="text-left">
                キャンセルが完了すると、案内人に通知が送られます。この操作は元に戻せません。
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-3 mt-4">
              <Button
                variant="destructive"
                onClick={onCancel}
                disabled={isCancelling}
                className="w-full py-4"
              >
                {isCancelling ? "キャンセル中..." : "申込をキャンセル"}
              </Button>
              <Button
                variant="tertiary"
                onClick={() => setIsCancelSheetOpen(false)}
                className="w-full py-4"
              >
                やめる
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <Button variant="tertiary" className="shrink-0 px-6 text-gray-400" disabled>
        キャンセル不可
      </Button>
    );
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border max-w-mobile-l w-full h-16 flex items-center px-4 justify-between mx-auto min-h-[102px]">
      <div className="flex flex-col text-muted-foreground min-w-fit">{renderMessage()}</div>
      {renderButton()}
    </footer>
  );
};

export default ParticipationActions;
