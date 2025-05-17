"use client";

import React from "react";
import { TArticleWithAuthor } from "@/app/articles/data/type";
import ArticleCard from "@/app/articles/components/Card";

interface ArticleRecommendationsProps {
  title: string;
  articles: TArticleWithAuthor[];
}

const ArticleRecommendations: React.FC<ArticleRecommendationsProps> = ({
  title,
  articles,
}) => {
  if (articles.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} showCategory />
        ))}
      </div>
    </div>
  );
};

export default ArticleRecommendations;
