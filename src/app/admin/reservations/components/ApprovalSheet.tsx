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

interface ApprovalSheetProps {
  isApplied: boolean;
  isAcceptSheetOpen: boolean;
  setIsAcceptSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isRejectSheetOpen: boolean;
  setIsRejectSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  acceptLoading: boolean;
  rejectLoading: boolean;
  handleAccept: () => void;
  handleReject: (message: string) => void;
  editable: boolean;
  setEditable: (value: boolean) => void;
  message: string;
  setMessage: (value: string) => void;
  DEFAULT_MESSAGE: string;
}

const ApprovalSheet: React.FC<ApprovalSheetProps> = ({
  isApplied,
  isAcceptSheetOpen,
  setIsAcceptSheetOpen,
  isRejectSheetOpen,
  setIsRejectSheetOpen,
  acceptLoading,
  rejectLoading,
  handleAccept,
  handleReject,
  editable,
  setEditable,
  message,
  setMessage,
  DEFAULT_MESSAGE,
}) => {
  if (!isApplied) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto p-6 bg-background border-t-2 border-b-card space-y-3">
      <Sheet open={isAcceptSheetOpen} onOpenChange={setIsAcceptSheetOpen}>
        <SheetTrigger asChild>
          <Button className="w-full" variant="primary" size="lg">
            申込を承認する
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
          <SheetHeader className="text-left pb-6">
            <SheetTitle>申し込みを承認してよろしいですか？</SheetTitle>
            <SheetDescription>一度承認すると、あとから取り消すことはできません。</SheetDescription>
          </SheetHeader>
          <div className="space-y-3">
            <Button onClick={handleAccept} disabled={acceptLoading} className="w-full py-4">
              {acceptLoading ? "処理中..." : "承認する"}
            </Button>
            <Button
              variant="tertiary"
              onClick={() => setIsAcceptSheetOpen(false)}
              className="w-full py-4"
            >
              閉じる
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* 拒否シート */}
      <Sheet open={isRejectSheetOpen} onOpenChange={setIsRejectSheetOpen}>
        <SheetTrigger asChild>
          <Button className="w-full !text-destructive" variant="text">
            申込をお断りする
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
          <SheetHeader className="text-left pb-6">
            <SheetTitle>申し込みをお断りしますか？</SheetTitle>
            <SheetDescription>
              申し込みをお断りすると申込者に通知され、あとから取り消すことはできません。
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
              onClick={() => handleReject(message)}
              disabled={rejectLoading}
              variant="destructive"
              className="w-full py-4"
            >
              {rejectLoading ? "送信中..." : "申込をお断りする"}
            </Button>
            <Button
              variant="tertiary"
              onClick={() => setIsRejectSheetOpen(false)}
              className="w-full py-4"
            >
              閉じる
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ApprovalSheet;
