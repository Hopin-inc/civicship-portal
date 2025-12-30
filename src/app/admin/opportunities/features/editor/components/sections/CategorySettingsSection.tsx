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
import { useNumberInput } from "../../hooks/useNumberInput";

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

  // 数字入力フックの初期化
  const feeInput = useNumberInput({
    value: feeRequired,
    onChange: onFeeRequiredChange,
    min: 0,
  });

  const pointsRequiredInput = useNumberInput({
    value: pointsRequired,
    onChange: onPointsRequiredChange,
    min: 0,
  });

  const pointsToEarnInput = useNumberInput({
    value: pointsToEarn,
    onChange: onPointsToEarnChange,
    min: 0,
  });

  return (
    <ItemGroup className="border rounded-lg">
      {/* セクションタイトル */}
      <Item size="sm">
        <ItemContent>
          <ItemTitle className="font-bold">募集種別</ItemTitle>
        </ItemContent>
      </Item>

      {/* カテゴリ選択 */}
      <Item size="sm">
        <ItemContent className="space-y-2">
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

          <p className="text-xs text-muted-foreground">
            {isActivity
              ? "参加費やポイントを設定する、有料の体験イベントです"
              : "参加するとポイントがもらえる、お手伝い形式の募集です"}
          </p>
        </ItemContent>
      </Item>

      <ItemSeparator />

      {/* Activity：料金・必要pt */}
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
                  value={feeInput.displayValue}
                  onChange={feeInput.handleChange}
                  onBlur={feeInput.handleBlur}
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
                  value={pointsRequiredInput.displayValue}
                  onChange={pointsRequiredInput.handleChange}
                  onBlur={pointsRequiredInput.handleBlur}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">pt</span>
              </div>
            </ItemActions>
          </Item>
        </>
      )}

      {/* Quest：獲得pt */}
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
                value={pointsToEarnInput.displayValue}
                onChange={pointsToEarnInput.handleChange}
                onBlur={pointsToEarnInput.handleBlur}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">pt</span>
            </div>
          </ItemActions>
        </Item>
      )}
    </ItemGroup>
  );
}
