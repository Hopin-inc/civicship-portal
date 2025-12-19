"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
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

  const isEmpty = slots.length === 0;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* ヘッダー */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-background sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-title-md font-bold">開催枠の編集</h1>
        </div>
        <Button onClick={onClose}>完了</Button>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {isEmpty ? (
            // 初回: カレンダー選択UI（後で実装）
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">開催枠を追加してください</p>
              <Button onClick={() => setShowBatchAdder(true)}>
                <Plus className="h-4 w-4 mr-2" />
                開催枠を追加
              </Button>
            </div>
          ) : (
            // 既存スロット表示
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-title-sm">登録済み開催枠 ({slots.length}件)</h2>
                <Button
                  variant="outline"
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
                variant="ghost"
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
