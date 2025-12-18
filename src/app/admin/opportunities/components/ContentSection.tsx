"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, ChevronRight } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { ImageUploadSection } from "./ImageUploadSection";
import { SlotData } from "../types";

interface ContentSectionProps {
  title: string;
  onTitleChange: (value: string) => void;
  summary: string;
  onSummaryChange: (value: string) => void;
  description: string;
  onDescriptionClick: () => void;
  images: Array<{ file?: File; url: string }>;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  slots: SlotData[];
  onSlotsClick: () => void;
}

export function ContentSection({
  title,
  onTitleChange,
  summary,
  onSummaryChange,
  description,
  onDescriptionClick,
  images,
  onImageSelect,
  onRemoveImage,
  slots,
  onSlotsClick,
}: ContentSectionProps) {
  // 詳細の要約表示（先頭2-3行）
  const getDescriptionSummary = () => {
    if (!description || description.trim() === "") {
      return "未入力";
    }
    const lines = description.split("\n").filter((line) => line.trim() !== "");
    const preview = lines.slice(0, 3).join("\n");
    return preview.length > 100 ? preview.slice(0, 100) + "..." : preview;
  };

  // 開催枠の要約表示（件数）
  const getSlotsSummary = () => {
    if (slots.length === 0) {
      return "未登録";
    }
    return `${slots.length}件`;
  };

  return (
    <section className="space-y-2">
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="募集タイトルを入力"
        className="placeholder:text-sm"
        required
      />

      <Textarea
        value={summary}
        onChange={(e) => onSummaryChange(e.target.value)}
        placeholder="概要（50字程度）を入力"
        className="min-h-[80px] placeholder:text-sm"
        required
      />

      <Item
        size="sm"
        variant={"outline"}
        role="button"
        tabIndex={0}
        onClick={onDescriptionClick}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onDescriptionClick();
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

      <ImageUploadSection
        images={images}
        onImageSelect={onImageSelect}
        onRemoveImage={onRemoveImage}
      />

      <Item
        size="sm"
        variant={"outline"}
        role="button"
        tabIndex={0}
        onClick={onSlotsClick}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSlotsClick();
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
    </section>
  );
}
