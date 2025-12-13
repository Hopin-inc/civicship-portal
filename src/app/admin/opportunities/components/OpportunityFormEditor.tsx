"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Field, FieldLabel, FieldControl, FieldDescription, FieldRow } from "@/components/ui/field";
import { ChoiceCardGroup } from "@/components/ui/choice-card";
import { GqlOpportunityCategory, GqlPublishStatus } from "@/types/graphql";
import { useOpportunityEditor } from "../hooks/useOpportunityEditor";
import { OpportunityFormData, HostOption, PlaceOption } from "../types";
import { SlotBatchAdder } from "./SlotBatchAdder";
import { SlotPicker } from "./SlotPicker";
import { ImageUploadSection } from "./ImageUploadSection";
import { Activity, Gift } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="space-y-8 pb-24">
      {/* ========== 基本情報 ========== */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">基本情報</h2>

        {/* カテゴリ */}
        <Field>
          <FieldLabel required>カテゴリ</FieldLabel>
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
              <div className="flex items-center gap-3 rounded-lg border-2 border-muted bg-muted/50 p-4">
                {isActivity ? (
                  <>
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold text-sm">アクティビティ</div>
                      <div className="text-sm text-muted-foreground">参加費やポイントが必要な有料イベント</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Gift className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold text-sm">クエスト</div>
                      <div className="text-sm text-muted-foreground">参加でポイントを獲得できる活動</div>
                    </div>
                  </>
                )}
              </div>
              <FieldDescription>※ カテゴリは作成後に変更できません</FieldDescription>
            </>
          )}
        </Field>

        {/* タイトル */}
        <Field>
          <FieldLabel required>タイトル</FieldLabel>
          <FieldControl>
            <Input
              value={editor.title}
              onChange={(e) => editor.setTitle(e.target.value)}
              placeholder="例）春の親子料理教室"
              required
            />
          </FieldControl>
        </Field>

        {/* 概要 */}
        <Field>
          <FieldLabel required>概要</FieldLabel>
          <FieldControl>
            <Textarea
              value={editor.summary}
              onChange={(e) => editor.setSummary(e.target.value)}
              placeholder="例）旬の野菜を使った料理を親子で楽しく学べます"
              className="min-h-[80px]"
              required
            />
          </FieldControl>
        </Field>

        {/* 詳細 */}
        <Field>
          <FieldLabel>詳細</FieldLabel>
          <FieldControl>
            <Textarea
              value={editor.description}
              onChange={(e) => editor.setDescription(e.target.value)}
              placeholder="詳しい内容を入力してください"
              className="min-h-[120px]"
            />
          </FieldControl>
        </Field>
      </div>

      <Separator />

      {/* ========== 主催・場所 ========== */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">主催・場所</h2>

        {/* 主催者 */}
        <Field>
          <FieldLabel required>主催者</FieldLabel>
          <FieldControl>
            <Select value={editor.hostUserId} onValueChange={editor.setHostUserId}>
              <SelectTrigger>
                <SelectValue placeholder="未選択" />
              </SelectTrigger>
              <SelectContent>
                {hosts.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldControl>
          <FieldDescription>
            「運用担当者」の権限を持つユーザーがここに表示されます
          </FieldDescription>
        </Field>

        {/* 場所 */}
        <Field>
          <FieldLabel>開催場所</FieldLabel>
          <FieldControl>
            <Select value={editor.placeId ?? ""} onValueChange={(v) => editor.setPlaceId(v || null)}>
              <SelectTrigger>
                <SelectValue placeholder="未選択" />
              </SelectTrigger>
              <SelectContent>
                {places.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldControl>
          <FieldDescription>
            開催場所を追加・編集する場合は、場所マスタ管理画面から行ってください
          </FieldDescription>
        </Field>

        {/* 主催者承認 */}
        <Field>
          <div className="flex items-center justify-between py-2">
            <div>
              <FieldLabel required>主催者からの承認</FieldLabel>
              <FieldDescription>参加には主催者の承認が必要かどうかを設定します</FieldDescription>
            </div>
            <Switch checked={editor.requireHostApproval} onCheckedChange={editor.setRequireHostApproval} />
          </div>
        </Field>
      </div>

      <Separator />

      {/* ========== 募集条件 ========== */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">募集条件</h2>

        {/* 定員（共通） */}
        <Field>
          <FieldRow>
            <FieldLabel required>定員</FieldLabel>
            <Input
              type="number"
              inputMode="numeric"
              min="1"
              value={editor.capacity}
              onChange={(e) => editor.setCapacity(Number(e.target.value))}
              required
              className="w-32"
            />
          </FieldRow>
          <FieldDescription>
            1開催枠あたりの参加人数の上限を入力してください
          </FieldDescription>
        </Field>

        {/* Activity専用フィールド */}
        {isActivity && (
          <>
            {/* 参加費 */}
            <Field>
              <FieldRow>
                <FieldLabel required>参加費</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={editor.feeRequired}
                    onChange={(e) => editor.setFeeRequired(Number(e.target.value))}
                    required
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">円</span>
                </div>
              </FieldRow>
              <FieldDescription>0の場合は無料として扱われます</FieldDescription>
            </Field>

            {/* 必要ポイント */}
            <Field>
              <FieldRow>
                <FieldLabel>必要ポイント</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={editor.pointsRequired}
                    onChange={(e) => editor.setPointsRequired(Number(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">pt</span>
                </div>
              </FieldRow>
              <FieldDescription>
                参加に必要なポイント数（0の場合は不要）
              </FieldDescription>
            </Field>
          </>
        )}

        {/* Quest専用フィールド */}
        {isQuest && (
          <Field>
            <FieldRow>
              <FieldLabel required>獲得ポイント</FieldLabel>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={editor.pointsToEarn}
                  onChange={(e) => editor.setPointsToEarn(Number(e.target.value))}
                  required
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">pt</span>
              </div>
            </FieldRow>
            <FieldDescription>参加者が獲得できるポイント数</FieldDescription>
          </Field>
        )}
      </div>

      <Separator />

      {/* ========== 開催枠 ========== */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">開催枠</h2>

        {/* 一括追加UI */}
        <SlotBatchAdder onAddSlots={editor.addSlotsBatch} />

        {/* 既存スロット一覧 */}
        {editor.slots.length > 0 && (
          <div className="pt-4">
            <FieldLabel className="mb-3 block">登録済みの開催枠（{editor.slots.length}件）</FieldLabel>
            <div className="space-y-3">
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
          </div>
        )}

        {editor.slots.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            開催枠が登録されていません。
            <br />
            上のカレンダーから日付を選択して追加してください。
          </div>
        )}
      </div>

      <Separator />

      {/* ========== 画像 ========== */}
      <ImageUploadSection
        images={editor.images}
        onImageSelect={editor.handleImageSelect}
        onRemoveImage={editor.removeImage}
      />

      <Separator />

      {/* ========== 公開設定 ========== */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">公開設定</h2>

        <Field>
          <FieldLabel required>公開状況</FieldLabel>
          <FieldControl>
            <Select
              value={editor.publishStatus}
              onValueChange={(v) => editor.setPublishStatus(v as GqlPublishStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GqlPublishStatus.Public}>公開中</SelectItem>
                <SelectItem value={GqlPublishStatus.Private}>下書き</SelectItem>
              </SelectContent>
            </Select>
          </FieldControl>
          <FieldDescription>
            「下書き」の募集は公開されず、主催者と運用担当者・管理者のみが閲覧できます
          </FieldDescription>
        </Field>
      </div>

      <Separator />

      {/* ========== 送信ボタン ========== */}
      <div className="w-full max-w-[345px] mx-auto">
        <Button type="submit" variant="primary" className="w-full h-[56px]" disabled={editor.saving}>
          {editor.saving ? "保存中..." : mode === "create" ? "作成" : "更新"}
        </Button>
      </div>
    </form>
  );
};
