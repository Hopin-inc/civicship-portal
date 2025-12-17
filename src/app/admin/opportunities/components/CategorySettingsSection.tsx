"use client";

import { Input } from "@/components/ui/input";
import { Coins, Gift, Star } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { GqlOpportunityCategory } from "@/types/graphql";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CategorySettingsSectionProps {
  mode: "create" | "update";
  category: GqlOpportunityCategory;
  onCategoryChange: (category: GqlOpportunityCategory) => void;
  feeRequired: number;
  onFeeRequiredChange: (value: number) => void;
  pointsRequired: number;
  onPointsRequiredChange: (value: number) => void;
  pointsToEarn: number;
  onPointsToEarnChange: (value: number) => void;
}

export function CategorySettingsSection({
  mode,
  category,
  onCategoryChange,
  feeRequired,
  onFeeRequiredChange,
  pointsRequired,
  onPointsRequiredChange,
  pointsToEarn,
  onPointsToEarnChange,
}: CategorySettingsSectionProps) {
  const isActivity = category === GqlOpportunityCategory.Activity;
  const isQuest = category === GqlOpportunityCategory.Quest;

  return (
    <div className="space-y-2">
      {/* カテゴリタブ */}
      {mode === "create" ? (
        <ToggleGroup
          type="single"
          value={category}
          onValueChange={(v) => {
            if (v) onCategoryChange(v as GqlOpportunityCategory);
          }}
          className="grid grid-cols-2 w-full"
        >
          <ToggleGroupItem value={GqlOpportunityCategory.Activity}>体験</ToggleGroupItem>
          <ToggleGroupItem value={GqlOpportunityCategory.Quest}>お手伝い</ToggleGroupItem>
        </ToggleGroup>
      ) : (
        <div className="text-center text-sm font-medium py-2 border rounded-lg">
          {isActivity ? "体験" : "お手伝い"}
        </div>
      )}

      {/* カテゴリ依存設定 */}
      <ItemGroup className="border rounded-lg">
        {isActivity && (
          <>
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

        {isQuest && (
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
        )}
      </ItemGroup>
    </div>
  );
}
