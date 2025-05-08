'use client';

import { useState, useCallback, useEffect } from 'react';
import { usePlaceMembership } from '@/hooks/features/place/usePlaceMembership';
import { useLoading } from '@/hooks/core/useLoading';
import { Opportunity, Participation } from '@/types';
import { ApolloError } from '@apollo/client';

interface UsePlaceDetailProps {
  placeId: string;
  userId: string;
}

interface UsePlaceDetailResult {
  membership: any;
  opportunities: any[];
  featuredArticle: any;
  loading: boolean;
  error: ApolloError | null;
  currentImageIndex: number;
  allImages: Array<{url: string; alt: string}>;
  displayImages: Array<{url: string; alt: string}>;
  remainingCount: number;
  nextImage: () => void;
  prevImage: () => void;
  hasParticipationImages: boolean;
}

export const usePlaceDetail = ({ placeId, userId }: UsePlaceDetailProps): UsePlaceDetailResult => {
  const { membership, opportunities, featuredArticle, loading, error } = usePlaceMembership(
    placeId,
    userId || "",
  );
  const { setIsLoading } = useLoading();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = opportunities.flatMap((opportunity: any) => 
    (opportunity.images || []).map((img: string) => ({
      url: img,
      alt: opportunity.title || "場所の写真"
    }))
  );

  const nextImage = useCallback(() => {
    if (allImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    if (allImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  }, [allImages.length]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  const participationImages = opportunities.flatMap((opportunity: any) =>
    opportunity.slots?.edges?.flatMap((edge: any) =>
      edge?.node?.participations?.edges?.flatMap((p: any) => {
        const participation = p as any;
        return (
          participation?.node?.images &&
          Array.isArray(participation.node.images) &&
          participation.node.images.map((img: any) => ({
            url: typeof img === 'string' ? img : img.url,
            alt: "参加者の写真",
          }))
        ) || [];
      }) || []
    ) || []
  );

  const hasParticipationImages = participationImages.length > 0;
  const displayImages = participationImages.slice(0, 3);
  const remainingCount = Math.max(0, participationImages.length - 3);

  return {
    membership,
    opportunities,
    featuredArticle,
    loading,
    error: error || null,
    currentImageIndex,
    allImages,
    displayImages,
    remainingCount,
    nextImage,
    prevImage,
    hasParticipationImages
  };
};
