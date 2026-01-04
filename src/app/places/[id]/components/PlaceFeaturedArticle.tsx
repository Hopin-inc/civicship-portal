"use client";

import React from "react";
import { TArticleWithAuthor } from "@/app/articles/data/type";
import ArticleCard from "@/app/articles/components/Card";

interface PlaceFeaturedArticleProps {
  articles: TArticleWithAuthor[] | null;
}

const PlaceFeaturedArticle: React.FC<PlaceFeaturedArticleProps> = ({ articles }) => {
  if (!articles) return null;

  return (
    <div className="px-4 pt-6 pb-8 max-w-mobile-l mx-auto space-y-4">
      <h2 className="text-display-sm mb-4">関連記事</h2>
      <div className="grid grid-cols-1 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default PlaceFeaturedArticle;
