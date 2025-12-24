import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SlotData } from "../../types";
import { formatSlotRange } from "../../utils/dateFormat";

interface CancelSlotSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: SlotData | null;
  reservationCount: number;
  onConfirm: (message?: string) => Promise<void>;
  loading?: boolean;
}

export const CancelSlotSheet: React.FC<CancelSlotSheetProps> = ({
  open,
  onOpenChange,
  slot,
  reservationCount,
  onConfirm,
  loading = false,
}) => {
  const [message, setMessage] = useState("");
  const [editable, setEditable] = useState(false);

  if (!slot) return null;

  const { dateLabel } = formatSlotRange(slot.startAt, slot.endAt);
  const DEFAULT_MESSAGE = `${dateLabel}の開催を中止いたしました。`;

  const handleConfirm = async () => {
    await onConfirm(editable ? message : DEFAULT_MESSAGE);
    // リセット
    setMessage("");
    setEditable(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
        <SheetHeader className="text-left pb-6">
          <SheetTitle>開催を中止してよろしいですか？</SheetTitle>
          <SheetDescription>
            {reservationCount > 0 ? (
              <>
                この開催枠には <strong className="text-foreground">{reservationCount}件の予約</strong> があります。
                <br />
                開催を中止すると予約者に通知され、あとから取り消すことはできません。
              </>
            ) : (
              "開催を中止すると、あとから取り消すことはできません。"
            )}
          </SheetDescription>
        </SheetHeader>

        {reservationCount > 0 && (
          <>
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
            />
          </>
        )}

        <div className="space-y-3">
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
            className="w-full py-4"
          >
            {loading ? "中止中..." : "開催を中止する"}
          </Button>
          <Button
            variant="tertiary"
            onClick={() => onOpenChange(false)}
            className="w-full py-4"
          >
            閉じる
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
