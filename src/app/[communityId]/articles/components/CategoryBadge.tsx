import React from "react";
import { GqlArticleCategory } from "@/types/graphql";

interface CategoryBadgeProps {
  category: GqlArticleCategory;
}

const categoryLabels: Record<GqlArticleCategory, string> = {
  INTERVIEW: "インタビュー",
  ACTIVITY_REPORT: "活動報告",
};

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  return (
    <div className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-xl text-label-sm font-bold">
      {categoryLabels[category]}
    </div>
  );
};

export default CategoryBadge;
