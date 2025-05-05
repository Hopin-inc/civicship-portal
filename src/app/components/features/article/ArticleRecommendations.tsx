import React from 'react';
import { Article } from '../../../../types';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CategoryBadge } from './CategoryBadge';

interface ArticleRecommendationsProps {
  title: string;
  articles: Article[];
}

export const ArticleRecommendations: React.FC<ArticleRecommendationsProps> = ({ 
  title, 
  articles 
}) => {
  if (articles.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 gap-6">
        {articles.map((article) => (
          <ArticleRecommendationCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

interface ArticleRecommendationCardProps {
  article: Article;
}

const ArticleRecommendationCard: React.FC<ArticleRecommendationCardProps> = ({ article }) => {
  return (
    <Link href={`/articles/${article.id}`} className="block">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative w-full h-48">
          <Image
            src={article.thumbnail || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <CategoryBadge type={article.type} />
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">{article.title}</h3>
          <div className="text-gray-600 text-sm mb-2">
            公開: {format(new Date(article.publishedAt), "yyyy年M月d日", { locale: ja })}
          </div>
          <p className="text-gray-700 text-sm line-clamp-3">{article.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ArticleRecommendations;
