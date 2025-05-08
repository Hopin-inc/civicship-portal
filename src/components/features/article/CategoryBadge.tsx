import React from 'react';
import { ArticleType } from '../../../types';

interface CategoryBadgeProps {
  type: ArticleType;
}

export const categoryLabels: Record<ArticleType, string> = {
  interview: "インタビュー",
  activity_report: "活動報告",
  column: "コラム",
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ type }) => {
  return (
    <div className="inline-block bg-[#4361EE] text-white px-4 py-1 rounded-md text-sm font-medium">
      {categoryLabels[type]}
    </div>
  );
};

export default CategoryBadge;
