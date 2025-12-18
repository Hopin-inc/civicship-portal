"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

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
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-w-md mx-auto p-8 overflow-y-auto max-h-[70vh]"
      >
        <SheetHeader className="text-left pb-6">
          <SheetTitle className={"text-title-sm"}>詳細を編集</SheetTitle>
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
