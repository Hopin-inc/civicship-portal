"use client";

import { Input } from "@/components/ui/input";
import { ChevronRight, MapPin, Users } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";

interface SettingsSectionProps {
  selectedHostName: string | null;
  onHostClick: () => void;
  selectedPlaceName: string | null;
  onPlaceClick: () => void;
  capacity: number;
  onCapacityChange: (value: number) => void;
}

export function SettingsSection({
  selectedHostName,
  onHostClick,
  selectedPlaceName,
  onPlaceClick,
  capacity,
  onCapacityChange,
}: SettingsSectionProps) {
  return (
    <ItemGroup className="border rounded-lg">
      {/* 主催者 */}
      <Item
        size="sm"
        role="button"
        tabIndex={0}
        onClick={onHostClick}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onHostClick();
          }
        }}
        className="cursor-pointer"
      >
        <ItemContent>
          <ItemTitle>
            <Users className="h-3.5 w-3.5" />
            主催者
            <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
              必須
            </span>
          </ItemTitle>
          <ItemDescription>{selectedHostName || "未選択"}</ItemDescription>
        </ItemContent>

        <ItemActions>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </ItemActions>
      </Item>

      <ItemSeparator />

      {/* 開催場所 */}
      <Item
        size="sm"
        role="button"
        tabIndex={0}
        onClick={onPlaceClick}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onPlaceClick();
          }
        }}
        className="cursor-pointer"
      >
        <ItemContent>
          <ItemTitle>
            <MapPin className="h-3.5 w-3.5" />
            開催場所
            <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
              必須
            </span>
          </ItemTitle>
          <ItemDescription>{selectedPlaceName || "未選択"}</ItemDescription>
        </ItemContent>

        <ItemActions>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
              value={capacity}
              onChange={(e) => onCapacityChange(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">名</span>
          </div>
        </ItemActions>
      </Item>
    </ItemGroup>
  );
}
