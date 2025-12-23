"use client";

import { GqlOpportunityCategory } from "@/types/graphql";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CategorySectionProps {
  mode: "create" | "update";
  category: GqlOpportunityCategory;
  onCategoryChange: (category: GqlOpportunityCategory) => void;
}

export function CategorySection({ mode, category, onCategoryChange }: CategorySectionProps) {
  const isActivity = category === GqlOpportunityCategory.Activity;

  return (
    <section className="space-y-2">
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
      <p className="text-xs text-muted-foreground text-center">
        {isActivity ? "参加費やポイントが必要な有料イベント" : "参加でポイントを獲得できる活動"}
      </p>
    </section>
  );
}
