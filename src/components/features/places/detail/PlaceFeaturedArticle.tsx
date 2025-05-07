'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface PlaceFeaturedArticleProps {
  article: {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    url: string;
    publishedAt?: string;
    type?: string;
  } | null;
}

const PlaceFeaturedArticle: React.FC<PlaceFeaturedArticleProps> = ({ article }) => {
  if (!article) return null;

  return (
    <div className="px-4 mb-8">
      <h2 className="text-xl font-bold mb-4">関連記事</h2>
      <Link href={article.url} className="block">
        <div className="bg-background rounded-xl border hover:shadow-md transition-shadow duration-200">
          <div className="relative w-full h-[200px]">
            {article.thumbnail ? (
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                className="object-cover rounded-t-xl"
              />
            ) : (
              <div className="w-full h-full bg-muted rounded-t-xl flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-center mb-2">
              {article.type && (
                <span className="bg-primary-foreground text-primary text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                  {article.type}
                </span>
              )}
              {article.publishedAt && (
                <span className="text-sm text-gray-500">
                  {new Date(article.publishedAt).toLocaleDateString("ja-JP")}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold mb-2 line-clamp-2">{article.title}</h3>
            {article.description && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {article.description}
              </p>
            )}
            <div className="flex justify-end">
              <Button variant="secondary" size="sm">
                記事を読む
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PlaceFeaturedArticle;
