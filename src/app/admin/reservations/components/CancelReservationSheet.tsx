import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface CancelReservationSheetProps {
  canCancelReservation: boolean;
  isSheetOpen: boolean;
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cancelLoading: boolean;
  handleCancel: () => void;
  editable: boolean;
  setEditable: (value: boolean) => void;
  message: string;
  setMessage: (value: string) => void;
  DEFAULT_MESSAGE: string;
  cannotCancelReservation: boolean;
}

const CancelReservationSheet: React.FC<CancelReservationSheetProps> = ({
  canCancelReservation,
  isSheetOpen,
  setIsSheetOpen,
  cancelLoading,
  handleCancel,
  editable,
  setEditable,
  message,
  setMessage,
  DEFAULT_MESSAGE,
  cannotCancelReservation,
}) => {
  return (
    <>
      {canCancelReservation && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <div className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto p-4 bg-background border-t-2 border-b-card space-y-3 min-h-[140px]">
              <Button className="w-full" size="lg" variant="destructive" disabled={cancelLoading}>
                {cancelLoading ? "処理中..." : "開催中止"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                開催の24時間前まで、アプリから中止操作が可能です。
              </p>
            </div>
          </SheetTrigger>

          <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
            <SheetHeader className="text-left pb-6">
              <SheetTitle>開催を中止してよろしいですか？</SheetTitle>
              <SheetDescription>
                開催を中止すると予約者に通知され、あとから取り消すことはできません。
              </SheetDescription>
            </SheetHeader>

            <div className="flex items-center gap-2 mb-4">
              <label htmlFor="edit-message" className="text-sm">
                メッセージを編集する
              </label>
              <Switch id="edit-message" checked={editable} onCheckedChange={setEditable} />
            </div>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={DEFAULT_MESSAGE}
              disabled={!editable}
              className="min-h-[120px] mb-6"
            ></Textarea>

            <div className="space-y-3">
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={cancelLoading}
                className="w-full py-4"
              >
                {cancelLoading ? "中止中..." : "開催を中止する"}
              </Button>
              <Button
                variant="tertiary"
                onClick={() => setIsSheetOpen(false)}
                className="w-full py-4"
              >
                閉じる
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {cannotCancelReservation && (
        <div className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto p-4 bg-background border-t-2 border-b-card space-y-3 min-h-[140px]">
          <Button variant="destructive" disabled className="w-full">
            中止不可
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            開催24時間以内のため、電話番号よりご連絡下さい。
          </p>
        </div>
      )}
    </>
  );
};

export default CancelReservationSheet;
