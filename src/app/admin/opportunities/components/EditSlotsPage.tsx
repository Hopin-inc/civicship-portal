"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { SlotData } from "../types";
import { SlotBatchAdder } from "./SlotBatchAdder";
import { SlotPicker } from "./SlotPicker";

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
      {/* 一括追加ボタン（ヘッダー右側、slots.length >= 1の時のみ） */}
      {!isEmpty && (
        <div className="fixed top-4 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBatchAdder(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            一括追加
          </Button>
        </div>
      )}

      <main className="px-6 max-w-md mx-auto">
        <div className="space-y-6 py-4">
          {isEmpty ? (
            // 空の時: 単一開催枠追加フォーム
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">開催枠を追加してください</p>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground px-1">開始日時</label>
                  <Input
                    type="datetime-local"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground px-1">終了日時</label>
                  <Input
                    type="datetime-local"
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleAddSingleSlot}
                  disabled={!startAt || !endAt}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  追加
                </Button>
              </div>
            </div>
          ) : (
            // 既存スロット表示
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-title-sm">登録済み開催枠 ({slots.length}件)</h2>
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
              <div className="space-y-3 pt-4 border-t">
                <p className="text-sm font-medium">さらに追加</p>

                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground px-1">開始日時</label>
                  <Input
                    type="datetime-local"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground px-1">終了日時</label>
                  <Input
                    type="datetime-local"
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleAddSingleSlot}
                  disabled={!startAt || !endAt}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  追加
                </Button>
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
