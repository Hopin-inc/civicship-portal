"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { TArticleCard, TArticleWithAuthor } from "@/app/articles/data/type";
import { Card } from "@/components/ui/card";
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
            <Image src={article.thumbnail} alt={article.title} fill className="object-cover rounded-t-lg" />
          </div>
        )}
        {/* #NOTE: CardContent の padding では上部がなく、かつ余白も大きかったので、他 component への影響を踏まえて、自前で設定 */}
        <div className="p-4">
          <h3 className="text-title-md line-clamp-2 mb-2">{article.title}</h3>
          <p className="text-body-sm text-caption line-clamp-2">{article.introduction}</p>
        </div>
      </Card>
    </Link>
  );
};

export default ArticleCard;
