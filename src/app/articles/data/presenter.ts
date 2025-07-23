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
  introduction: node?.introduction || "",
  thumbnail: node?.thumbnail || "",
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
  //TODO 型そのものを直した方が良いが応急処置、authorは執筆者なので間違い。阪田の英語間違い。
  author: {
    name: node?.relatedUsers?.[0]?.name || "",
    image: node?.relatedUsers?.[0]?.image || "",
  },
});

export const presenterArticleDetail = (article: GqlArticle): TArticleDetail => {
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

    hostedOpportunitiesByAuthors:
      article.relatedUsers?.flatMap(
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
