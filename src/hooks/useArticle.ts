import { useQuery } from "@apollo/client";
import { GET_ARTICLE } from "@/graphql/queries/article";
import type { Article, ArticleType } from "@/types";
import type { ArticleCategory } from "@/gql/graphql";

interface UseArticleResult {
  article: Article | null;
  recommendedArticles: Article[];
  loading: boolean;
  error: Error | null;
}

function mapCategoryToArticleType(category: string | null | undefined): ArticleType {
  if (!category) return "column"; // デフォルト値
  
  const categoryLower = category.toLowerCase();
  
  if (categoryLower === "activity_report") return "activity_report";
  if (categoryLower === "interview") return "interview";
  
  return "column"; // デフォルト値
}

function transformGraphQLArticleToArticle(graphqlArticle: any): Article {
  // Extract thumbnail data
  const thumbnailData = graphqlArticle.thumbnail;
  const thumbnail = thumbnailData && Array.isArray(thumbnailData) && thumbnailData.length > 0 
    ? {
        url: thumbnailData[0].url,
        alt: thumbnailData[0].alt || graphqlArticle.title
      }
    : null;

  return {
    id: graphqlArticle.id,
    title: graphqlArticle.title,
    description: graphqlArticle.introduction,
    content: graphqlArticle.body ?? '',
    type: mapCategoryToArticleType(graphqlArticle.category),
    thumbnail: thumbnail,
    publishedAt: graphqlArticle.publishedAt,
    author: graphqlArticle.authors?.[0] ? {
      name: graphqlArticle.authors[0].name,
      image: graphqlArticle.authors[0].image ?? '/images/default-author.jpg',
      bio: graphqlArticle.authors[0].bio ?? ''
    } : {
      name: 'Unknown Author',
      image: '/images/default-author.jpg',
      bio: ''
    },
    createdAt: graphqlArticle.createdAt,
    updatedAt: graphqlArticle.updatedAt ?? null
  };
}

export const useArticle = (id: string, communityId: string): UseArticleResult => {
  const { data, loading, error } = useQuery(GET_ARTICLE, {
    variables: {
      id,
      permission: {
        communityId
      }
    },
    skip: !id || !communityId,
    onError: (error) => {
      console.error('Article query error:', error);
    },
  });

  if (!data) {
    return {
      article: null,
      recommendedArticles: [],
      loading,
      error: error || null,
    };
  }

  const article = data.article ? transformGraphQLArticleToArticle(data.article) : null;
  
  const recommendedArticles = data.articles?.edges
    ?.filter((edge: any) => edge !== null)
    .map((edge: any) => edge.node)
    .filter((node: any) => node !== null)
    .filter((node: any) => node.id !== article?.id)
    .map((node: any) => transformGraphQLArticleToArticle(node)) || [];

  return {
    article,
    recommendedArticles,
    loading,
    error: error || null,
  };
}; 