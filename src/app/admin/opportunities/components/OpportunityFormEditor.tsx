"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { GqlOpportunityCategory, GqlPublishStatus } from "@/types/graphql";
import { useOpportunityEditor } from "../hooks/useOpportunityEditor";
import { HostOption, OpportunityFormData, PlaceOption } from "../types";
import { SlotBatchAdder } from "./SlotBatchAdder";
import { SlotPicker } from "./SlotPicker";
import { ImageUploadSection } from "./ImageUploadSection";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ========== 基本情報 ========== */}
      <div className="space-y-6">
        <div>
          <Label className="mb-2 block">カテゴリ *</Label>

          {mode === "create" ? (
            <Select
              value={editor.category}
              onValueChange={(v) => editor.setCategory(v as GqlOpportunityCategory)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GqlOpportunityCategory.Activity}>体験</SelectItem>
                <SelectItem value={GqlOpportunityCategory.Quest}>お手伝い</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
              {isActivity ? "体験" : "お手伝い"}
            </div>
          )}

          {mode === "update" && (
            <p className="text-sm text-muted-foreground mt-2">※ カテゴリは作成後に変更できません</p>
          )}
        </div>

        {/* タイトル */}
        <div>
          <Label className="mb-2 block">タイトル *</Label>
          <Input
            value={editor.title}
            onChange={(e) => editor.setTitle(e.target.value)}
            placeholder="例）春の親子料理教室"
            required
          />
        </div>

        {/* 概要 */}
        <div>
          <Label className="mb-2 block">概要 *</Label>
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
      </div>

      <Separator />

      {/* ========== 主催・場所 ========== */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">主催・場所</h2>

        {/* 主催者 */}
        <div>
          <Label className="mb-2 block">主催者 *</Label>
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
          <p className="text-sm text-muted-foreground mt-2">
            「運用担当者」の権限を持つユーザーがここに表示されます
          </p>
        </div>

        {/* 場所 */}
        <div>
          <Label className="mb-2 block">開催場所</Label>
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
          <p className="text-sm text-muted-foreground mt-2">
            開催場所を追加・編集する場合は、場所マスタ管理画面から行ってください
          </p>
        </div>

        {/* 主催者承認 */}
        <div className="flex items-center justify-between py-2">
          <div>
            <Label className="mb-1 block">主催者からの承認 *</Label>
            <p className="text-sm text-muted-foreground">
              参加には主催者の承認が必要かどうかを設定します
            </p>
          </div>
          <Switch
            checked={editor.requireHostApproval}
            onCheckedChange={editor.setRequireHostApproval}
          />
        </div>
      </div>

      <Separator />

      {/* ========== 募集条件 ========== */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">募集条件</h2>

        {/* 定員（共通） */}
        <div>
          <Label className="mb-2 block">定員 *</Label>
          <Input
            type="number"
            inputMode="numeric"
            min="1"
            value={editor.capacity}
            onChange={(e) => editor.setCapacity(Number(e.target.value))}
            required
          />
          <p className="text-sm text-muted-foreground mt-2">
            1開催枠あたりの参加人数の上限を入力してください
          </p>
        </div>

        {/* Activity専用フィールド */}
        {isActivity && (
          <>
            {/* 参加費 */}
            <div>
              <Label className="mb-2 block">参加費 *</Label>
              <Input
                type="number"
                inputMode="numeric"
                min="0"
                value={editor.feeRequired}
                onChange={(e) => editor.setFeeRequired(Number(e.target.value))}
                required
              />
              <p className="text-sm text-muted-foreground mt-2">0の場合は無料として扱われます</p>
            </div>

            {/* 必要ポイント */}
            <div>
              <Label className="mb-2 block">必要ポイント</Label>
              <Input
                type="number"
                inputMode="numeric"
                min="0"
                value={editor.pointsRequired}
                onChange={(e) => editor.setPointsRequired(Number(e.target.value))}
              />
              <p className="text-sm text-muted-foreground mt-2">
                参加に必要なポイント数（0の場合は不要）
              </p>
            </div>
          </>
        )}

        {/* Quest専用フィールド */}
        {isQuest && (
          <div>
            <Label className="mb-2 block">獲得ポイント *</Label>
            <Input
              type="number"
              inputMode="numeric"
              min="0"
              value={editor.pointsToEarn}
              onChange={(e) => editor.setPointsToEarn(Number(e.target.value))}
              required
            />
            <p className="text-sm text-muted-foreground mt-2">参加者が獲得できるポイント数</p>
          </div>
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
            <Label className="mb-3 block">登録済みの開催枠（{editor.slots.length}件）</Label>
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
      <div>
        <Label className="mb-2 block">公開状況 *</Label>
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
        <p className="text-sm text-muted-foreground mt-2">
          「下書き」の募集は公開されず、主催者と運用担当者・管理者のみが閲覧できます
        </p>
      </div>

      {/* ========== 送信ボタン ========== */}
      <div className="w-full max-w-[345px] mx-auto">
        <Button
          type="submit"
          variant="primary"
          className="w-full h-[56px]"
          disabled={editor.saving}
        >
          {editor.saving ? "保存中..." : mode === "create" ? "作成" : "更新"}
        </Button>
      </div>
    </form>
  );
};
