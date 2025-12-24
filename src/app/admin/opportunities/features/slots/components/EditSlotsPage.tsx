"use client";

import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { SlotData } from "../../../types";
import { SlotPicker } from "./forms/SlotPicker";
import { SingleSlotForm } from "./forms/SingleSlotForm";
import { CancelSlotSheet } from "./sheets/CancelSlotSheet";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { groupSlotsByMonth, formatMonthHeader } from "../../../utils/slotGrouping";
import { useCancelSlotState } from "../hooks/useCancelSlotState";
import { useSlotReservations } from "../hooks/useSlotReservations";

interface EditSlotsPageProps {
  slots: SlotData[];
  onAddSlotsBatch: (slots: SlotData[]) => void;
  onUpdateSlot: <K extends keyof SlotData>(index: number, field: K, value: SlotData[K]) => void;
  onRemoveSlot: (index: number) => void;
  onCancelSlot: (index: number, message?: string) => void;
  onClose: () => void;
}

export function EditSlotsPage({
  slots,
  onAddSlotsBatch,
  onUpdateSlot,
  onRemoveSlot,
  onCancelSlot,
  onClose,
}: EditSlotsPageProps) {
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  // 開催中止シートの状態管理
  const cancelState = useCancelSlotState();
  const { reservationCount, loading: reservationsLoading } = useSlotReservations(
    cancelState.selectedSlot?.slot.id
  );

  // ヘッダー設定
  const headerConfig = useMemo(
    () => ({
      title: "開催枠編集",
      showLogo: false,
      showBackButton: true,
      onBackClick: onClose,
    }),
    [onClose],
  );
  useHeaderConfig(headerConfig);

  // 月ごとにグルーピング
  const groupedSlots = useMemo(() => groupSlotsByMonth(slots), [slots]);

  // 月キーを降順（新しい月が先）にソート
  const sortedMonthKeys = useMemo(
    () => Object.keys(groupedSlots).sort((a, b) => b.localeCompare(a)),
    [groupedSlots],
  );

  // 直近月（デフォルトで開く月）
  const latestMonth = sortedMonthKeys[0];

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

  const handleCancelSlot = async (message?: string) => {
    if (!cancelState.selectedSlot) return;

    await onCancelSlot(cancelState.selectedSlot.index, message);
    cancelState.closeCancelSheet();
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-md mx-auto">
        <div className="space-y-6 py-4">
          {/* 開催枠追加フォーム */}
          <SingleSlotForm
            startAt={startAt}
            endAt={endAt}
            onStartAtChange={setStartAt}
            onEndAtChange={setEndAt}
            onAdd={handleAddSingleSlot}
            onAddSlotsBatch={onAddSlotsBatch}
            variant="ghost"
          />

          {/* 開催枠ブロック */}
          <div>
            <h2 className="text-label-sm text-muted-foreground">開催枠 {slots.length}件</h2>

            {slots.length > 0 && (
              <Accordion type="multiple" defaultValue={latestMonth ? [latestMonth] : []}>
                {sortedMonthKeys.map((monthKey) => {
                  const monthSlots = groupedSlots[monthKey];

                  return (
                    <AccordionItem key={monthKey} value={monthKey}>
                      <AccordionTrigger>
                        {formatMonthHeader(monthKey, monthSlots.length)}
                      </AccordionTrigger>

                      <AccordionContent>
                        <div className="space-y-3">
                          {monthSlots.map(({ slot, index }) => (
                            <SlotPicker
                              key={index}
                              index={index}
                              slot={slot}
                              onUpdate={onUpdateSlot}
                              onRemove={onRemoveSlot}
                              onCancel={() => cancelState.openCancelSheet(slot, index)}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </div>
        </div>
      </main>

      {/* 開催中止確認シート */}
      {cancelState.selectedSlot && (
        <CancelSlotSheet
          open={cancelState.isSheetOpen}
          onOpenChange={cancelState.closeCancelSheet}
          slot={cancelState.selectedSlot.slot}
          reservationCount={reservationCount}
          onConfirm={handleCancelSlot}
          loading={reservationsLoading}
        />
      )}
    </div>
  );
}
