"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TArticleWithAuthor } from "@/app/articles/data/type";
import ArticleCard from "@/app/articles/components/Card";

interface PlaceFeaturedArticleProps {
  article: TArticleWithAuthor | null;
}

const PlaceFeaturedArticle: React.FC<PlaceFeaturedArticleProps> = ({ article }) => {
  if (!article) return null;

  return (
    <div className="px-4 pt-6 pb-8 max-w-mobile-l mx-auto space-y-4">
      <h2 className="text-display-sm mb-4">関連記事</h2>
      <ArticleCard article={article} showUser/>
    </div>
  );
};

export default PlaceFeaturedArticle;
