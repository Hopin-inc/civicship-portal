"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { TArticleCard, TArticleWithAuthor } from "@/app/articles/data/type";
import { Card, CardContent } from "@/components/ui/card";
import CategoryBadge from "@/app/articles/components/CategoryBadge";

interface ArticleCardProps {
  article: TArticleWithAuthor | TArticleCard;
  showCategory?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, showCategory }) => {
  return (
    <Link href={`/articles/${article.id}`} className="block">
      <Card>
        {article.thumbnail && (
          <div className="relative w-full h-48">
            {showCategory && (
              <div className="absolute top-4 left-4 z-10">
                <CategoryBadge category={article.category} />
              </div>
            )}
            <Image src={article.thumbnail} alt={article.title} fill className="object-cover" />
          </div>
        )}
        <CardContent>
          <h3 className="text-xl font-bold mb-2">{article.title}</h3>
          {article.publishedAt && !isNaN(new Date(article.publishedAt).getTime()) && (
            <div className="text-muted-foreground text-sm mb-2">
              公開: {format(new Date(article.publishedAt), "yyyy年M月d日", { locale: ja })}
            </div>
          )}
          <p className="text-foreground text-sm line-clamp-3">{article.introduction}</p>
          { "author" in article && article.author && (
            <div className="flex items-center mt-4">
              <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                <Image
                  src={article.author.image || "/placeholder-avatar.svg"}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium">{article.author.name}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ArticleCard;
