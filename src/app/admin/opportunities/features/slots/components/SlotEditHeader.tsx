"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface SlotEditHeaderProps {
  mode: "create" | "update";
  onClose: () => void;
  onSave: () => void;
  isDirty: boolean;
  isSubmitting: boolean;
}

export function SlotEditHeader({ mode, onClose, onSave, isDirty, isSubmitting }: SlotEditHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b z-50">
      <div className="max-w-mobile-l mx-auto px-4 h-14 flex items-center justify-between">
        {/* 左: 閉じるボタン */}
        <Button
          variant="ghost"
          size={"sm"}
          className={"w-20"}
          onClick={onClose}
          disabled={isSubmitting}
        >
          閉じる
        </Button>

        {/* 中央: タイトル */}
        <h1 className="text-body-md font-bold">開催枠編集</h1>

        {/* 右: 保存/完了ボタン */}
        <Button
          variant="primary"
          size={"sm"}
          className={"w-20"}
          onClick={onSave}
          disabled={!isDirty || isSubmitting}
        >
          {isSubmitting
            ? (mode === "create" ? "設定中..." : "保存中...")
            : (mode === "create" ? "完了" : "保存")
          }
        </Button>
      </div>
    </header>
  );
}
