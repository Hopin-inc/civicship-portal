"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ChoiceCardGroup } from "@/components/ui/choice-card";
import { GqlOpportunityCategory, GqlPublishStatus } from "@/types/graphql";
import { useOpportunityEditor } from "../hooks/useOpportunityEditor";
import { OpportunityFormData, HostOption, PlaceOption } from "../types";
import { SlotBatchAdder } from "./SlotBatchAdder";
import { SlotPicker } from "./SlotPicker";
import { ImageUploadSection } from "./ImageUploadSection";
import { Activity, Gift, Users, MapPin, Coins, Star, Calendar } from "lucide-react";

interface OpportunityFormEditorProps {
  mode: "create" | "update";
  opportunityId?: string;
  initialData?: Partial<OpportunityFormData>;
  hosts: HostOption[];
  places: PlaceOption[];
  onSuccess?: (id?: string) => void;
}

export const OpportunityFormEditor = ({
  mode,
  opportunityId,
  initialData,
  hosts,
  places,
  onSuccess,
}: OpportunityFormEditorProps) => {
  const editor = useOpportunityEditor({ mode, opportunityId, initialData });

  const isActivity = editor.category === GqlOpportunityCategory.Activity;
  const isQuest = editor.category === GqlOpportunityCategory.Quest;

  const handleSubmit = async (e: FormEvent) => {
    const resultId = await editor.handleSave(e);
    onSuccess?.(resultId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {/* カテゴリ */}
      <div>
        <Label className="mb-2 flex items-center gap-x-2">
          カテゴリ
          <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
            必須
          </span>
        </Label>
        {mode === "create" ? (
          <ChoiceCardGroup
            value={editor.category}
            onValueChange={(v) => editor.setCategory(v as GqlOpportunityCategory)}
            options={[
              {
                value: GqlOpportunityCategory.Activity,
                label: "アクティビティ",
                description: "参加費やポイントが必要な有料イベント",
                icon: <Activity className="h-5 w-5 text-primary" />,
              },
              {
                value: GqlOpportunityCategory.Quest,
                label: "クエスト",
                description: "参加でポイントを獲得できる活動",
                icon: <Gift className="h-5 w-5 text-primary" />,
              },
            ]}
          />
        ) : (
          <>
            <div className="flex items-center gap-3 rounded-lg border bg-muted p-3">
              {isActivity ? (
                <>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">アクティビティ</span>
                </>
              ) : (
                <>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">クエスト</span>
                </>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              ※ カテゴリは作成後に変更できません
            </span>
          </>
        )}
      </div>

      {/* タイトル */}
      <div>
        <Label className="mb-2 flex items-center gap-x-2">
          タイトル
          <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
            必須
          </span>
        </Label>
        <Input
          value={editor.title}
          onChange={(e) => editor.setTitle(e.target.value)}
          placeholder="例）春の親子料理教室"
          required
        />
      </div>

      {/* 概要 */}
      <div>
        <Label className="mb-2 flex items-center gap-x-2">
          概要
          <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
            必須
          </span>
        </Label>
        <Textarea
          value={editor.summary}
          onChange={(e) => editor.setSummary(e.target.value)}
          placeholder="例）旬の野菜を使った料理を親子で楽しく学べます"
          className="min-h-[80px]"
          required
        />
      </div>

      {/* 詳細 */}
      <div>
        <Label className="mb-2 block">詳細</Label>
        <Textarea
          value={editor.description}
          onChange={(e) => editor.setDescription(e.target.value)}
          placeholder="詳しい内容を入力してください"
          className="min-h-[120px]"
        />
      </div>

      {/* 主催者 */}
      <div>
        <Label className="mb-2 flex items-center gap-x-2">
          <Users className="h-3.5 w-3.5" />
          主催者
          <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
            必須
          </span>
        </Label>
        <Select value={editor.hostUserId} onValueChange={editor.setHostUserId}>
          <SelectTrigger>
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            {hosts.map((h) => (
              <SelectItem key={h.id} value={h.id}>
                {h.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 場所 */}
      <div>
        <Label className="mb-2 flex items-center gap-x-2">
          <MapPin className="h-3.5 w-3.5" />
          開催場所
        </Label>
        <Select value={editor.placeId ?? ""} onValueChange={(v) => editor.setPlaceId(v || null)}>
          <SelectTrigger>
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            {places.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 承認設定 */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <Label className="font-medium">主催者からの承認を必要とする</Label>
        <Switch checked={editor.requireHostApproval} onCheckedChange={editor.setRequireHostApproval} />
      </div>

      {/* 定員 */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5" />
          定員
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="numeric"
            min="1"
            value={editor.capacity}
            onChange={(e) => editor.setCapacity(Number(e.target.value))}
            required
            className="w-24"
          />
          <span className="text-sm text-muted-foreground">名</span>
        </div>
      </div>

      {/* Activity専用フィールド */}
      {isActivity && (
        <>
          {/* 参加費 */}
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Coins className="h-3.5 w-3.5" />
              参加費
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                inputMode="numeric"
                min="0"
                value={editor.feeRequired}
                onChange={(e) => editor.setFeeRequired(Number(e.target.value))}
                required
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">円</span>
            </div>
          </div>

          {/* 必要ポイント */}
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Star className="h-3.5 w-3.5" />
              必要ポイント
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                inputMode="numeric"
                min="0"
                value={editor.pointsRequired}
                onChange={(e) => editor.setPointsRequired(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">pt</span>
            </div>
          </div>
        </>
      )}

      {/* Quest専用フィールド */}
      {isQuest && (
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Gift className="h-3.5 w-3.5" />
            獲得ポイント
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              min="0"
              value={editor.pointsToEarn}
              onChange={(e) => editor.setPointsToEarn(Number(e.target.value))}
              required
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">pt</span>
          </div>
        </div>
      )}

      {/* 開催枠 */}
      <div>
        <Label className="mb-2 flex items-center gap-x-2">
          <Calendar className="h-3.5 w-3.5" />
          開催枠
          {editor.slots.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({editor.slots.length}件)
            </span>
          )}
        </Label>

        {/* 一括追加UI */}
        <SlotBatchAdder onAddSlots={editor.addSlotsBatch} />

        {/* 既存スロット一覧 */}
        {editor.slots.length > 0 && (
          <div className="mt-4 space-y-3">
            {editor.slots.map((slot, index) => (
              <SlotPicker
                key={index}
                index={index}
                slot={slot}
                onUpdate={editor.updateSlot}
                onRemove={editor.removeSlot}
              />
            ))}
          </div>
        )}

        {editor.slots.length === 0 && (
          <div className="mt-4 text-center py-8 text-muted-foreground text-sm rounded-lg border border-dashed">
            開催枠が登録されていません。
            <br />
            上のカレンダーから日付を選択して追加してください。
          </div>
        )}
      </div>

      {/* 画像 */}
      <ImageUploadSection
        images={editor.images}
        onImageSelect={editor.handleImageSelect}
        onRemoveImage={editor.removeImage}
      />

      {/* 公開設定 */}
      <div>
        <Label className="mb-2 block">公開設定</Label>
        <Select
          value={editor.publishStatus}
          onValueChange={(v) => editor.setPublishStatus(v as GqlPublishStatus)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={GqlPublishStatus.Public}>公開</SelectItem>
            <SelectItem value={GqlPublishStatus.Private}>下書き</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground mt-1 block">
          下書きは主催者と運用担当者のみ閲覧できます
        </span>
      </div>

      {/* 送信ボタン */}
      <div className="w-full max-w-[345px] mx-auto">
        <Button type="submit" variant="primary" className="w-full h-[56px]" disabled={editor.saving}>
          {editor.saving ? "保存中..." : mode === "create" ? "作成" : "更新"}
        </Button>
      </div>
    </form>
  );
};
