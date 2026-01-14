"use client";

import React from "react";
import { TArticleWithAuthor } from "@/app/[communityId]/articles/data/type";
import ArticleCard from "@/app/[communityId]/articles/components/Card";

interface ArticleRecommendationsProps {
  title: string;
  articles: TArticleWithAuthor[];
}

const ArticleRecommendations: React.FC<ArticleRecommendationsProps> = ({ title, articles }) => {
  if (articles.length === 0) return null;

  return (
    <section className="px-4 pt-6 mt-0">
      <h2 className="text-display-md mb-4">{title}</h2>
      <div className="grid grid-cols-1 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} showUser />
        ))}
      </div>
    </section>
  );
};

export default ArticleRecommendations;
