"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { TArticleCard, TArticleWithAuthor } from "@/app/articles/data/type";
import { Card } from "@/components/ui/card";
import CategoryBadge from "@/app/articles/components/CategoryBadge";
import { Calendar } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface ArticleCardProps {
  article: TArticleWithAuthor | TArticleCard;
  showCategory?: boolean;
  showUser?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, showCategory, showUser }) => {
  console.debug({ article });
  return (
    <Link href={`/articles/${article.id}`} className="block">
      <Card className="bg-white">
        {article.thumbnail && (
          <div className="relative w-full h-48">
            {showCategory && (
              <div className="absolute top-4 left-4 z-10">
                <CategoryBadge category={article.category} />
              </div>
            )}
            <Image
              src={article.thumbnail || PLACEHOLDER_IMAGE}
              alt={article.title}
              fill
              placeholder={`blur`}
              blurDataURL={PLACEHOLDER_IMAGE}
              className="object-cover rounded-t-lg"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = PLACEHOLDER_IMAGE;
              }}
            />
          </div>
        )}
        {/* #NOTE: CardContent の padding では上部がなく、かつ余白も大きかったので、他 component への影響を踏まえて、自前で設定 */}
        <div className="p-4">
          <h3 className="text-title-md line-clamp-2 mb-2">{article.title}</h3>
          <p className="text-body-sm text-caption line-clamp-2">{article.introduction}</p>
          {showUser && "author" in article && (
            <div className="flex justify-between mt-4">
              <div className="flex items-center gap-x-1">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={article.author?.image || PLACEHOLDER_IMAGE}
                    alt={article.author?.name || "作者"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-body-md font-bold">{article.author?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-x-1">
                <Calendar className="h-4 w-4 text-caption flex-shrink-0" />
                <p className="text-body-sm text-caption">
                  {format(new Date(article.publishedAt), "yyyy/M/d", { locale: ja })}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default ArticleCard;
