"use client";

import { GqlArticle, GqlArticleCategory, GqlArticleEdge, GqlUser, Maybe } from "@/types/graphql";
import { ArticleCard, ArticleDetail, ArticleRelatedUser, ArticleWithAuthor } from "@/app/articles/data/type";

export const presenterArticleCards = (
  edges?: (GqlArticleEdge | null | undefined)[],
): ArticleCard[] => {
  return (edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is GqlArticle => !!node)
    .map(presenterArticleCard);
};

export const presenterArticleCard = (node?: GqlArticle): ArticleCard => ({
  id: node?.id || "",
  category: node?.category || GqlArticleCategory.Interview,
  title: node?.title || "",
  introduction: node?.introduction || "",
  thumbnail: node?.thumbnail || null,
  publishedAt: node?.publishedAt ? new Date(node.publishedAt).toISOString() : "",
});

export const presenterArticleWithAuthorList = (
  edges?: (GqlArticleEdge | null | undefined)[],
): ArticleWithAuthor[] => {
  return (edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is GqlArticle => !!node)
    .map(presenterArticleWithAuthor);
};

export const presenterArticleWithAuthor = (node?: GqlArticle): ArticleWithAuthor => ({
  ...presenterArticleCard(node),
  author: {
    name: node?.authors?.[0]?.name || "",
    image: node?.authors?.[0]?.image || "",
  },
});

export const presenterArticleDetail = (article: GqlArticle): ArticleDetail => {
  return {
    id: article.id,
    title: article.title,
    category: article.category,
    introduction: article.introduction || "",
    body: article.body || "",

    thumbnail: typeof article.thumbnail === "string" ? article.thumbnail : "",
    publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString() : "",

    authors: article.authors?.map(presenterUser) || [],
    relatedUsers: article.relatedUsers?.map(presenterUser) || [],

    hostedOpportunitiesByAuthors: [],
    relatedArticles: [],
  };
};

function presenterUser(host?: Maybe<GqlUser> | undefined): ArticleRelatedUser {
  return {
    id: host?.id || "",
    name: host?.name || "",
    image: host?.image || "",
    bio: host?.bio || "",
  };
}
