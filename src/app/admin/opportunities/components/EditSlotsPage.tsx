"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { SlotData } from "../types";
import { SlotBatchAdder } from "./SlotBatchAdder";
import { SlotPicker } from "./SlotPicker";
import { SingleSlotForm } from "./SingleSlotForm";

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
  const [showBatchAdder, setShowBatchAdder] = useState(false);
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

  const isEmpty = slots.length === 0;

  const handleAddSingleSlot = () => {
    if (!startAt || !endAt) return;
    onAddSlotsBatch([{ startAt, endAt }]);
    setStartAt("");
    setEndAt("");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 max-w-md mx-auto">
        <div className="space-y-6 py-4">
          {isEmpty ? (
            // 空の時: 単一開催枠追加フォーム
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">開催枠を追加してください</p>
              <SingleSlotForm
                startAt={startAt}
                endAt={endAt}
                onStartAtChange={setStartAt}
                onEndAtChange={setEndAt}
                onAdd={handleAddSingleSlot}
              />
            </div>
          ) : (
            // 既存スロット表示
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-title-sm">登録済み開催枠 ({slots.length}件)</h2>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowBatchAdder(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  一括追加
                </Button>
              </div>

              {/* スロット一覧 */}
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

              {/* さらに追加フォーム */}
              <div className="pt-4 border-t">
                <SingleSlotForm
                  startAt={startAt}
                  endAt={endAt}
                  onStartAtChange={setStartAt}
                  onEndAtChange={setEndAt}
                  onAdd={handleAddSingleSlot}
                  variant="secondary"
                  title="さらに追加"
                />
              </div>
            </>
          )}
        </div>
      </main>

      {/* 一括追加モーダル */}
      {showBatchAdder && (
        <div className="fixed inset-0 bg-black/50 z-20 flex items-end">
          <div className="bg-background rounded-t-3xl max-w-md mx-auto w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-sm font-bold">一括追加</h3>
              <Button
                variant="text"
                size="sm"
                onClick={() => setShowBatchAdder(false)}
              >
                閉じる
              </Button>
            </div>
            <SlotBatchAdder
              onAddSlots={(newSlots) => {
                onAddSlotsBatch(newSlots);
                setShowBatchAdder(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
