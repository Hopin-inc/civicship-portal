"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
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
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>詳細を編集</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <Label className="mb-2 block">詳細</Label>
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
