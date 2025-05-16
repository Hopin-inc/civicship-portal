"use client";

import { GqlArticle, GqlArticleCategory, GqlArticleEdge, GqlUser, Maybe } from "@/types/graphql";
import {
  TArticleCard,
  TArticleDetail,
  TArticleRelatedUser,
  TArticleWithAuthor,
} from "@/app/articles/data/type";
import { presenterActivityCard } from "@/app/activities/data/presenter";

export const presenterArticleCards = (
  edges?: (GqlArticleEdge | null | undefined)[],
): TArticleCard[] => {
  return (edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is GqlArticle => !!node)
    .map(presenterArticleCard);
};

export const presenterArticleCard = (node?: GqlArticle): TArticleCard => ({
  id: node?.id || "",
  category: node?.category || GqlArticleCategory.Interview,
  title: node?.title || "",
  // TODO FEでintroが入ったら修正
  introduction: node?.body || "",
  thumbnail: node?.thumbnail || null,
  publishedAt: node?.publishedAt ? new Date(node.publishedAt).toISOString() : "",
});

export const presenterArticleWithAuthorList = (
  edges?: (GqlArticleEdge | null | undefined)[],
): TArticleWithAuthor[] => {
  return (edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is GqlArticle => !!node)
    .map(presenterArticleWithAuthor);
};

export const presenterArticleWithAuthor = (node?: GqlArticle): TArticleWithAuthor => ({
  ...presenterArticleCard(node),
  author: {
    name: node?.authors?.[0]?.name || "",
    image: node?.authors?.[0]?.image || "",
  },
});

export const presenterArticleDetail = (article: GqlArticle): TArticleDetail => {
  return {
    id: article.id,
    title: article.title,
    category: article.category,
    // TODO FEでintroが入ったら修正
    introduction: article.body || "",
    body: article.body || "",

    thumbnail: typeof article.thumbnail === "string" ? article.thumbnail : "",
    publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString() : "",

    authors: article.authors?.map(presenterUser) || [],
    relatedUsers: article.relatedUsers?.map(presenterUser) || [],

    hostedOpportunitiesByAuthors:
      article.authors?.flatMap(
        (author) => author.opportunitiesCreatedByMe?.map(presenterActivityCard) ?? [],
      ) ?? [],
    relatedArticles: [],
  };
};

function presenterUser(host?: Maybe<GqlUser> | undefined): TArticleRelatedUser {
  return {
    id: host?.id || "",
    name: host?.name || "",
    image: host?.image || "",
    bio: host?.bio || "",
  };
}
