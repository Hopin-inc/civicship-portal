"use client";

import { FormEvent, useState } from "react";
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
import { ImageUploadSection } from "./ImageUploadSection";
import { Calendar, ChevronRight, Coins, Gift, MapPin, Star, Users } from "lucide-react";
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
import { EditDescriptionSheet } from "./EditDescriptionSheet";
import { EditSlotsSheet } from "./EditSlotsSheet";

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

  // Sheet open/close state
  const [descriptionSheetOpen, setDescriptionSheetOpen] = useState(false);
  const [slotsSheetOpen, setSlotsSheetOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    const resultId = await editor.handleSave(e);
    onSuccess?.(resultId);
  };

  // 詳細の要約表示（先頭2-3行）
  const getDescriptionSummary = () => {
    if (!editor.description || editor.description.trim() === "") {
      return "未入力";
    }
    const lines = editor.description.split("\n").filter((line) => line.trim() !== "");
    const preview = lines.slice(0, 3).join("\n");
    return preview.length > 100 ? preview.slice(0, 100) + "..." : preview;
  };

  // 開催枠の要約表示（件数）
  const getSlotsSummary = () => {
    if (editor.slots.length === 0) {
      return "未登録";
    }
    return `${editor.slots.length}件`;
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
      <Input
        value={editor.title}
        onChange={(e) => editor.setTitle(e.target.value)}
        placeholder="タイトル（例：春の親子料理教室）"
        required
      />

      {/* 概要 */}
      <Textarea
        value={editor.summary}
        onChange={(e) => editor.setSummary(e.target.value)}
        placeholder="概要（例：旬の野菜を使った料理を親子で楽しく学べます）"
        className="min-h-[80px]"
        required
      />

      {/* 詳細 */}
      <Item
        size="sm"
        variant="outline"
        role="button"
        tabIndex={0}
        onClick={() => setDescriptionSheetOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setDescriptionSheetOpen(true);
          }
        }}
        className="cursor-pointer"
      >
        <ItemContent>
          <ItemTitle>詳細</ItemTitle>
          <ItemDescription className="whitespace-pre-wrap">
            {getDescriptionSummary()}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </ItemActions>
      </Item>

      {/* 画像 */}
      <ImageUploadSection
        images={editor.images}
        onImageSelect={editor.handleImageSelect}
        onRemoveImage={editor.removeImage}
      />

      {/* 開催枠 */}
      <Item
        size="sm"
        variant="outline"
        role="button"
        tabIndex={0}
        onClick={() => setSlotsSheetOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setSlotsSheetOpen(true);
          }
        }}
        className="cursor-pointer"
      >
        <ItemContent>
          <ItemTitle>
            <Calendar className="h-3.5 w-3.5" />
            開催枠
          </ItemTitle>
          <ItemDescription>{getSlotsSummary()}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </ItemActions>
      </Item>

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

      {/* Sheets */}
      <EditDescriptionSheet
        open={descriptionSheetOpen}
        onOpenChange={setDescriptionSheetOpen}
        value={editor.description}
        onChange={editor.setDescription}
      />

      <EditSlotsSheet
        open={slotsSheetOpen}
        onOpenChange={setSlotsSheetOpen}
        slots={editor.slots}
        onAddSlotsBatch={editor.addSlotsBatch}
        onUpdateSlot={editor.updateSlot}
        onRemoveSlot={editor.removeSlot}
      />
    </form>
  );
};
