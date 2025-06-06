"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useCreateUtilityMutation } from "@/types/graphql";
import { COMMUNITY_ID } from "@/utils";

interface CreateUtilitySheetProps {
  onUtilityCreated: () => Promise<void>;
}

export default function CreateUtilitySheet({ onUtilityCreated }: CreateUtilitySheetProps) {
  const [showUtilityForm, setShowUtilityForm] = useState(false);
  const [utilityName, setUtilityName] = useState("");
  const [utilityDescription, setUtilityDescription] = useState("");
  const [pointsRequired, setPointsRequired] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createUtility] = useCreateUtilityMutation();

  const handleCreateUtility = async () => {
    setIsSubmitting(true);
    try {
      const res = await createUtility({
        variables: {
          input: {
            name: utilityName,
            description: utilityDescription || undefined,
            pointsRequired,
            images: [],
          },
          permission: { communityId: COMMUNITY_ID },
        },
      });
      const id = res.data?.utilityCreate?.utility?.id;
      if (id) {
        toast.success("ユーティリティを作成しました");
        setShowUtilityForm(false);
        setUtilityName("");
        setUtilityDescription("");
        setPointsRequired(1);
        await onUtilityCreated();
      } else {
        toast.error("ユーティリティ作成に失敗しました");
      }
    } catch {
      toast.error("ユーティリティ作成エラー");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={showUtilityForm} onOpenChange={setShowUtilityForm}>
      <SheetTrigger asChild>
        <Button>新規追加</Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
        <SheetHeader className="text-left pb-6">
          <SheetTitle>新しいチケットの種類を追加</SheetTitle>
          <SheetDescription>
            チケットの種類の詳細を入力してください。
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4">
          <div>
            <Label>チケット名</Label>
            <Input value={utilityName} onChange={(e) => setUtilityName(e.target.value)} />
          </div>
          <div>
            <Label>説明</Label>
            <Input
              value={utilityDescription}
              onChange={(e) => setUtilityDescription(e.target.value)}
            />
          </div>
          <div>
            <Label>交換ポイント</Label>
            <Input
              type="number"
              min={0}
              value={pointsRequired}
              onChange={(e) => setPointsRequired(Number(e.target.value))}
            />
          </div>
          <div className="space-y-3">
            <Button onClick={handleCreateUtility} disabled={isSubmitting} className="w-full">
              {isSubmitting ? "作成中..." : "チケットの種類を作成"}
            </Button>
            <Button
              variant="tertiary"
              onClick={() => setShowUtilityForm(false)}
              className="w-full"
            >
              キャンセル
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
