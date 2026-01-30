"use client";

import { ChevronRight } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { SheetType } from "../../types/settings";

interface BasicInfoSectionProps {
  title: string;
  description: string;
  onItemClick: (sheet: SheetType) => void;
}

export function BasicInfoSection({
  title,
  description,
  onItemClick,
}: BasicInfoSectionProps) {
  return (
    <>
      {/* 名前 */}
      <Item
        size="sm"
        variant="outline"
        role="button"
        tabIndex={0}
        className="cursor-pointer"
        onClick={() => onItemClick("title")}
      >
        <ItemContent>
          <ItemTitle className="font-bold">名前</ItemTitle>
          <ItemDescription className="whitespace-pre-wrap">{title}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </ItemActions>
      </Item>

      {/* 概要 */}
      <Item
        size="sm"
        variant="outline"
        role="button"
        tabIndex={0}
        className="cursor-pointer"
        onClick={() => onItemClick("description")}
      >
        <ItemContent>
          <ItemTitle className="font-bold">概要</ItemTitle>
          <ItemDescription className="whitespace-pre-wrap line-clamp-2">
            {description}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </ItemActions>
      </Item>
    </>
  );
}
