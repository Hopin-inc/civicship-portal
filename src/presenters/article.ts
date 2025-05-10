'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { GqlArticle, GqlArticleCategory } from "@/types/graphql";
import { ArticleCard } from "@/types/article";

export interface GetArticlesData {
  articles: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    edges: Array<{
      node: {
        id: string;
        title: string;
        introduction: string;
        thumbnail: string;
        publishedAt: string;
        authors: Array<{
          id: string;
          name: string;
          image: string;
        }>;
      };
    }>;
  };
}

export interface Article {
  id: string;
  title: string;
  introduction: string;
  thumbnail: {
    url: string;
    alt: string;
  } | null;
  publishedAt: string;
  authors: Array<{
    id: string;
    name: string;
    image: string;
  }>;
}

/**
 * Transform GraphQL article data to application format
 */
export const transformArticles = (data: GetArticlesData | undefined): Article[] => {
  if (!data) return [];
  
  return data.articles.edges.map((edge) => {
    const node = edge.node;
    return {
      ...node,
      thumbnail: node.thumbnail ? {
        url: node.thumbnail,
        alt: node.title
      } : null,
    };
  });
};

export const presenterArticleCard = (node?: GqlArticle): ArticleCard => ({
  id: node?.id || "",
  category: node?.category || GqlArticleCategory.Interview,
  title: node?.title || "",
  introduction: node?.introduction || "",
  thumbnail: node?.thumbnail || null,
  publishedAt: node?.publishedAt
    ? new Date(node.publishedAt).toISOString()
    : "",
});

/**
 * Format article date for display
 */
export const formatArticleDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'yyyy年M月d日', { locale: ja });
};

/**
 * Extract article categories from GraphQL data
 */
export interface ArticleWithCategories {
  categories?: {
    edges?: Array<{
      node?: {
        name: string;
      } | null;
    } | null>;
  } | null;
}

export const extractArticleCategories = (article: ArticleWithCategories): string[] => {
  if (!article?.categories?.edges) return [];
  
  return article.categories.edges
    .filter((edge): edge is NonNullable<typeof edge> => edge !== null && edge?.node !== null && edge?.node !== undefined)
    .map((edge) => edge.node!.name);
};
