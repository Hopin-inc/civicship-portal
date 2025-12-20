"use client";

import { useMemo, useState } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { SlotData } from "../types";
import { SlotPicker } from "./SlotPicker";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { SingleSlotForm } from "@/app/admin/opportunities/components/SingleSlotForm";

interface EditSlotsPageProps {
  slots: SlotData[];
  onAddSlotsBatch: (slots: SlotData[]) => void;
  onUpdateSlot: (index: number, field: keyof SlotData, value: string) => void;
  onRemoveSlot: (index: number) => void;
  onClose: () => void;
}

export function EditSlotsPage({
  slots,
  onAddSlotsBatch,
  onUpdateSlot,
  onRemoveSlot,
  onClose,
}: EditSlotsPageProps) {
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  // ヘッダー設定
  const headerConfig = useMemo(
    () => ({
      title: "開催枠編集",
      showLogo: false,
      showBackButton: true,
      onBackClick: onClose,
      hideFooter: true,
    }),
    [onClose],
  );
  useHeaderConfig(headerConfig);

  const handleAddSingleSlot = () => {
    if (!startAt || !endAt) return;

    const isValid = dayjs(endAt).isAfter(dayjs(startAt));
    if (!isValid) {
      toast.error("終了日時は開始日時より後を指定してください");
      return;
    }

    onAddSlotsBatch([{ startAt, endAt }]);
    setStartAt("");
    setEndAt("");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-md mx-auto">
        <div className="space-y-6 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-label-sm text-muted-foreground">開催枠一覧 ({slots.length}件)</h2>
          </div>

          <SingleSlotForm
            startAt={startAt}
            endAt={endAt}
            onStartAtChange={setStartAt}
            onEndAtChange={setEndAt}
            onAdd={handleAddSingleSlot}
            onAddSlotsBatch={onAddSlotsBatch}
            variant="secondary"
          />

          {/* スロット一覧 */}
          {slots.length > 0 && (
            <div className="space-y-3">
              {slots.map((slot, index) => (
                <SlotPicker
                  key={index}
                  index={index}
                  slot={slot}
                  onUpdate={onUpdateSlot}
                  onRemove={onRemoveSlot}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
