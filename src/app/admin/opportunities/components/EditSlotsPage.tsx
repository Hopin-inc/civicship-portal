"use client";

import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { SlotData } from "../types";
import { SlotPicker } from "./SlotPicker";
import { SingleSlotForm } from "./SingleSlotForm";
import dayjs from "dayjs";
import { toast } from "react-toastify";

interface EditSlotsPageProps {
  slots: SlotData[];
  onAddSlotsBatch: (slots: SlotData[]) => void;
  onUpdateSlot: (index: number, field: keyof SlotData, value: string) => void;
  onRemoveSlot: (index: number) => void;
  onClose: () => void;
}

// 月ごとにスロットをグルーピング
type GroupedSlots = Record<string, Array<{ slot: SlotData; index: number }>>;

function groupSlotsByMonth(slots: SlotData[]): GroupedSlots {
  const grouped: GroupedSlots = {};

  slots.forEach((slot, index) => {
    const monthKey = dayjs(slot.startAt).format("YYYY-MM");
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push({ slot, index });
  });

  return grouped;
}

// 月キーを表示用フォーマットに変換
function formatMonthHeader(monthKey: string, count: number): string {
  const [year, month] = monthKey.split("-");
  return `${year}年${parseInt(month)}月（${count}件）`;
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
    }),
    [onClose],
  );
  useHeaderConfig(headerConfig);

  // 月ごとにグルーピング
  const groupedSlots = useMemo(() => groupSlotsByMonth(slots), [slots]);

  // 月キーを降順（新しい月が先）にソート
  const sortedMonthKeys = useMemo(
    () => Object.keys(groupedSlots).sort((a, b) => b.localeCompare(a)),
    [groupedSlots]
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

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-md mx-auto">
        <div className="space-y-6 py-4">
          {/* ヘッダー */}
          <h2 className="text-label-sm text-muted-foreground">開催枠 {slots.length}件</h2>

          {/* スロット一覧（月ごとにグルーピング） */}
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
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}

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
        </div>
      </main>
    </div>
  );
}
