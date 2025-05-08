'use client';

import { useMemo } from 'react';
import { useArticleQuery } from './useArticleQuery';
import { formatArticleDate, extractArticleCategories } from '@/presenters/article';
import type { Article, ArticleType } from "@/types";
import { ErrorWithMessage, formatError } from '../wallet/useWalletController';
import { toast } from 'sonner';

/**
 * Maps GraphQL category to article type
 */
function mapCategoryToArticleType(category: string | null | undefined): ArticleType {
  if (!category) return "column"; // デフォルト値
  
  const categoryLower = category.toLowerCase();
  
  if (categoryLower === "activity_report") return "activity_report";
  if (categoryLower === "interview") return "interview";
  
  return "column"; // デフォルト値
}

/**
 * Controller hook for article 
 * Handles business logic and state management
 */
export const useArticleController = (articleId: string) => {
  const { data, loading, error } = useArticleQuery(articleId);
  
  const article = useMemo(() => {
    if (!data?.article) return null;
    
    const transformed = {
      id: data.article.id,
      title: data.article.title,
      description: data.article.introduction,
      introduction: data.article.introduction,
      content: data.article.body ?? '',
      type: mapCategoryToArticleType(data.article.category),
      thumbnail: data.article.thumbnail,
      publishedAt: data.article.publishedAt,
      author: data.article.authors?.[0] ? {
        name: data.article.authors[0].name,
        image: data.article.authors[0].image ?? '/images/default-author.jpg',
        bio: data.article.authors[0].bio ?? ''
      } : {
        name: 'Unknown Author',
        image: '/images/default-author.jpg',
        bio: ''
      },
      createdAt: data.article.createdAt,
      updatedAt: data.article.updatedAt ?? null,
      formattedDate: formatArticleDate(data.article.publishedAt),
      categories: extractArticleCategories(data.article)
    };
    
    return transformed;
  }, [data]);
  
  const recommendedArticles = useMemo(() => {
    if (!data?.articles?.edges) return [];
    
    return data.articles.edges
      ?.filter((edge: any) => edge !== null)
      .map((edge: any) => edge.node)
      .filter((node: any) => node !== null)
      .filter((node: any) => node.id !== article?.id)
      .map((node: any) => ({
        id: node.id,
        title: node.title,
        description: node.introduction,
        introduction: node.introduction,
        content: node.body ?? '',
        type: mapCategoryToArticleType(node.category),
        thumbnail: node.thumbnail,
        publishedAt: node.publishedAt,
        author: node.authors?.[0] ? {
          name: node.authors[0].name,
          image: node.authors[0].image ?? '/images/default-author.jpg',
          bio: node.authors[0].bio ?? ''
        } : {
          name: 'Unknown Author',
          image: '/images/default-author.jpg',
          bio: ''
        },
        createdAt: node.createdAt,
        updatedAt: node.updatedAt ?? null,
        formattedDate: formatArticleDate(node.publishedAt),
        categories: extractArticleCategories(node)
      }));
  }, [data, article]);
  
  const formattedError = useMemo(() => {
    if (error) {
      console.error('Error fetching article data:', error);
      toast.error('記事データの取得に失敗しました');
      return formatError(error);
    }
    return null;
  }, [error]);
  
  return {
    article,
    recommendedArticles,
    loading,
    error: formattedError
  };
};
