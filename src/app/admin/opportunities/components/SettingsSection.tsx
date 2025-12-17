"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Users } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { HostOption, PlaceOption } from "../types";

interface SettingsSectionProps {
  hostUserId: string;
  onHostUserIdChange: (value: string) => void;
  hosts: HostOption[];
  placeId: string | null;
  onPlaceIdChange: (value: string | null) => void;
  places: PlaceOption[];
  capacity: number;
  onCapacityChange: (value: number) => void;
}

export function SettingsSection({
  hostUserId,
  onHostUserIdChange,
  hosts,
  placeId,
  onPlaceIdChange,
  places,
  capacity,
  onCapacityChange,
}: SettingsSectionProps) {

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
    </ItemGroup>
  );
}
