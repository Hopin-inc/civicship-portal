import React from 'react';
import { GqlArticleCategory } from "@/types/graphql";

interface CategoryBadgeProps {
  category: GqlArticleCategory;
}

export const categoryLabels: Record<GqlArticleCategory, string> = {
  INTERVIEW: "インタビュー",
  ACTIVITY_REPORT: "活動報告",
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  return (
    <div className="inline-block bg-[#4361EE] text-white px-4 py-1 rounded-md text-sm font-medium">
      {categoryLabels[category]}
    </div>
  );
};

export default CategoryBadge;
