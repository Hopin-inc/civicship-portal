"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Coins, Gift, MapPin, Star, Users } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { GqlOpportunityCategory } from "@/types/graphql";
import { HostOption, PlaceOption } from "../types";

interface SettingsSectionProps {
  category: GqlOpportunityCategory;
  hostUserId: string;
  onHostUserIdChange: (value: string) => void;
  hosts: HostOption[];
  placeId: string | null;
  onPlaceIdChange: (value: string | null) => void;
  places: PlaceOption[];
  capacity: number;
  onCapacityChange: (value: number) => void;
  feeRequired: number;
  onFeeRequiredChange: (value: number) => void;
  pointsRequired: number;
  onPointsRequiredChange: (value: number) => void;
  pointsToEarn: number;
  onPointsToEarnChange: (value: number) => void;
}

export function SettingsSection({
  category,
  hostUserId,
  onHostUserIdChange,
  hosts,
  placeId,
  onPlaceIdChange,
  places,
  capacity,
  onCapacityChange,
  feeRequired,
  onFeeRequiredChange,
  pointsRequired,
  onPointsRequiredChange,
  pointsToEarn,
  onPointsToEarnChange,
}: SettingsSectionProps) {
  const isActivity = category === GqlOpportunityCategory.Activity;
  const isQuest = category === GqlOpportunityCategory.Quest;

  return (
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
          <Select value={hostUserId} onValueChange={onHostUserIdChange}>
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
          <Select value={placeId ?? ""} onValueChange={(v) => onPlaceIdChange(v || null)}>
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
              value={capacity}
              onChange={(e) => onCapacityChange(Number(e.target.value))}
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
                  value={feeRequired}
                  onChange={(e) => onFeeRequiredChange(Number(e.target.value))}
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
                  value={pointsRequired}
                  onChange={(e) => onPointsRequiredChange(Number(e.target.value))}
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
                  value={pointsToEarn}
                  onChange={(e) => onPointsToEarnChange(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">pt</span>
              </div>
            </ItemActions>
          </Item>
        </>
      )}
    </ItemGroup>
  );
}
