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
import { GqlOpportunityCategory, GqlPublishStatus } from "@/types/graphql";
import { useOpportunityEditor } from "../hooks/useOpportunityEditor";
import { HostOption, OpportunityFormData, PlaceOption } from "../types";
import { SlotBatchAdder } from "./SlotBatchAdder";
import { SlotPicker } from "./SlotPicker";
import { ImageUploadSection } from "./ImageUploadSection";
import { Calendar, Coins, Gift, MapPin, Star, Users } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";

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
      <Item size="sm" variant={"outline"}>
        <ItemContent>
          <ItemTitle>
            カテゴリ
            <span className="ml-2 text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
              必須
            </span>
          </ItemTitle>
        </ItemContent>

        <ItemActions>
          {mode === "create" ? (
            <ToggleGroup
              type="single"
              value={editor.category}
              onValueChange={(v) => {
                if (v) editor.setCategory(v as GqlOpportunityCategory);
              }}
            >
              <ToggleGroupItem value={GqlOpportunityCategory.Activity}>体験</ToggleGroupItem>
              <ToggleGroupItem value={GqlOpportunityCategory.Quest}>お手伝い</ToggleGroupItem>
            </ToggleGroup>
          ) : (
            <span className="text-sm text-muted-foreground">
              {isActivity ? "体験" : "お手伝い"}
            </span>
          )}
        </ItemActions>
      </Item>

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

      {/* 画像 */}
      <ImageUploadSection
        images={editor.images}
        onImageSelect={editor.handleImageSelect}
        onRemoveImage={editor.removeImage}
      />

      {/* 開催枠 */}
      <div>
        <Label className="mb-2 flex items-center gap-x-2">
          <Calendar className="h-3.5 w-3.5" />
          開催枠
          {editor.slots.length > 0 && (
            <span className="text-xs text-muted-foreground">({editor.slots.length}件)</span>
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

      <ItemGroup className="border rounded-lg">
        {/* 主催者 */}
        <Item size="sm">
          <ItemContent>
            <ItemTitle>
              <Users className="h-3.5 w-3.5" />
              主催者
              <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
                必須
              </span>
            </ItemTitle>
          </ItemContent>

          <ItemActions className="min-w-[180px]">
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
          </ItemActions>
        </Item>

        <ItemSeparator />

        {/* 開催場所 */}
        <Item size="sm">
          <ItemContent>
            <ItemTitle>
              <MapPin className="h-3.5 w-3.5" />
              開催場所
            </ItemTitle>
          </ItemContent>

          <ItemActions className="min-w-[180px]">
            <Select
              value={editor.placeId ?? ""}
              onValueChange={(v) => editor.setPlaceId(v || null)}
            >
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
          </ItemActions>
        </Item>

        <ItemSeparator />

        {/* 定員 */}
        <Item size="sm">
          <ItemContent>
            <ItemTitle>
              <Users className="h-3.5 w-3.5" />
              定員
            </ItemTitle>
          </ItemContent>

          <ItemActions>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                value={editor.capacity}
                onChange={(e) => editor.setCapacity(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">名</span>
            </div>
          </ItemActions>
        </Item>

        {/* Activity */}
        {isActivity && (
          <>
            <ItemSeparator />

            <Item size="sm">
              <ItemContent>
                <ItemTitle>
                  <Coins className="h-3.5 w-3.5" />
                  1人あたりの必要料金
                </ItemTitle>
              </ItemContent>

              <ItemActions>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    value={editor.feeRequired}
                    onChange={(e) => editor.setFeeRequired(Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">円</span>
                </div>
              </ItemActions>
            </Item>

            <ItemSeparator />

            <Item size="sm">
              <ItemContent>
                <ItemTitle>
                  <Star className="h-3.5 w-3.5" />
                  1人あたりの必要pt
                </ItemTitle>
              </ItemContent>

              <ItemActions>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    value={editor.pointsRequired}
                    onChange={(e) => editor.setPointsRequired(Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">pt</span>
                </div>
              </ItemActions>
            </Item>
          </>
        )}

        {/* Quest */}
        {isQuest && (
          <>
            <ItemSeparator />

            <Item size="sm">
              <ItemContent>
                <ItemTitle>
                  <Gift className="h-3.5 w-3.5" />
                  1人あたりの獲得pt
                </ItemTitle>
              </ItemContent>

              <ItemActions>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    value={editor.pointsToEarn}
                    onChange={(e) => editor.setPointsToEarn(Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">pt</span>
                </div>
              </ItemActions>
            </Item>
          </>
        )}
      </ItemGroup>

      <ItemGroup className="border rounded-lg">
        <Item size="sm">
          <ItemContent>
            <ItemTitle className="flex items-center font-bold gap-2">運用・公開設定</ItemTitle>
          </ItemContent>
        </Item>

        {/* 承認設定 */}
        <Item size="sm">
          <ItemContent>
            <ItemTitle>承認が必要</ItemTitle>
            <ItemDescription>
              オンにすると、参加者の申込みを主催者が承認するまで確定しません
            </ItemDescription>
          </ItemContent>

          <ItemActions>
            <Switch
              checked={editor.requireHostApproval}
              onCheckedChange={editor.setRequireHostApproval}
            />
          </ItemActions>
        </Item>

        <ItemSeparator />

        {/* 公開設定 */}
        <Item size="sm">
          <ItemContent>
            <ItemTitle>公開設定</ItemTitle>
            <ItemDescription>下書きは主催者と運用担当者のみ閲覧できます</ItemDescription>
          </ItemContent>

          <ItemActions className="min-w-[140px]">
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
          </ItemActions>
        </Item>
      </ItemGroup>

      {/* 送信ボタン */}
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
