"use client";

import { useEffect, useMemo } from "react";
import { useLoading } from "@/hooks/useLoading";
import { useGetSingleMembershipQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/utils";
import { presenterBaseDetail } from "@/app/places/data/presenter/membership";
import { presenterArticleWithAuthor } from "@/app/articles/data/presenter";
import { presenterActivityCard } from "@/app/activities/data/presenter";
import type { BaseDetail } from "@/app/places/data/type";
import type { ActivityCard } from "@/app/activities/data/type";
import { TArticleWithAuthor } from "@/app/articles/data/type";

export interface UsePlaceDetailResult {
  detail: BaseDetail | null;
  opportunities: ActivityCard[];
  featuredArticle: TArticleWithAuthor | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const usePlaceDetail = ({
  placeId,
  userId,
}: {
  placeId: string;
  userId: string;
}): UsePlaceDetailResult => {
  const { data, loading, error, refetch } = useGetSingleMembershipQuery({
    variables: { communityId: COMMUNITY_ID, userId },
  });

  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  const membership = data?.membership;
  const user = membership?.user;

  const detail = useMemo(() => {
    return membership ? presenterBaseDetail(membership, placeId) : null;
  }, [membership, placeId]);

  const opportunities = useMemo(() => {
    return user?.opportunitiesCreatedByMe?.map(presenterActivityCard) || [];
  }, [user]);

  const featuredArticle = useMemo(() => {
    const article = user?.articlesAboutMe?.[0];
    return article ? presenterArticleWithAuthor(article) : null;
  }, [user]);

  return {
    detail,
    opportunities,
    featuredArticle,
    loading,
    error: error ?? null,
    refetch,
  };
};
