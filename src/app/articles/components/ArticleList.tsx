"use client";

import React from "react";
import { TArticleCard, TArticleWithAuthor } from "@/app/articles/data/type";
import ArticleCard from "@/app/articles/components/Card";

interface ArticleListProps {
  articles: TArticleWithAuthor[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">記事がありません</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default ArticleList;
