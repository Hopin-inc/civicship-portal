"use client";

import { useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import useHeaderConfig from "@/hooks/useHeaderConfig";

interface EditDescriptionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
}

export function EditDescriptionSheet({
  open,
  onOpenChange,
  value,
  onChange,
}: EditDescriptionSheetProps) {
  const { updateConfig, resetConfig } = useHeaderConfig();

  useEffect(() => {
    if (open) {
      updateConfig({
        title: "詳細を編集",
        showBackButton: true,
      });
    } else {
      resetConfig();
    }
  }, [open, updateConfig, resetConfig]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
        <SheetHeader className="text-left pb-6">
          <SheetTitle>詳細を編集</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="詳しい内容を入力してください"
            className="min-h-[400px]"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
