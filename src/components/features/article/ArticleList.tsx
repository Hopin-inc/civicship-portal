'use client';

import React from 'react';
import { Article } from '@/hooks/features/article/useArticles';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ArticleListProps {
  articles: Article[];
}

export const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
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

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Link href={`/articles/${article.id}`} className="block">
      <div className="bg-background rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative w-full h-48">
          {article.thumbnail && (
            <Image
              src={article.thumbnail.url}
              alt={article.thumbnail.alt}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">{article.title}</h3>
          <div className="text-gray-600 text-sm mb-2">
            公開: {format(new Date(article.publishedAt), "yyyy年M月d日", { locale: ja })}
          </div>
          <p className="text-gray-700 text-sm line-clamp-3">{article.introduction}</p>
          {article.authors && article.authors.length > 0 && (
            <div className="flex items-center mt-4">
              <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                <Image
                  src={article.authors[0].image || "/placeholder-avatar.svg"}
                  alt={article.authors[0].name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium">{article.authors[0].name}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ArticleList;
