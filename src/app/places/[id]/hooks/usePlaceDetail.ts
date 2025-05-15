import { usePlaceMembership } from "@/app/places/[id]/hooks/usePlaceMembership";
import { useLoading } from "@/hooks/useLoading";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BaseDetail } from "@/app/places/data/type";
import { COMMUNITY_ID } from "@/utils";
import { presenterBaseDetail } from "@/app/places/data/presenter/membership";

export const usePlaceDetail = ({
  placeId,
  userId,
}: {
  placeId: string;
  userId: string;
}): UsePlaceDetailResult => {
  const { membership, loading, error } = usePlaceMembership(COMMUNITY_ID, userId);
  const { setIsLoading } = useLoading();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  const detail = useMemo(() => {
    return membership ? presenterBaseDetail(membership, placeId) : null;
  }, [membership, placeId]);

  const imagesForSlider = useMemo(
    () =>
      detail?.images.map((url) => ({
        url,
        alt: detail.name,
      })) || [],
    [detail],
  );

  const nextImage = useCallback(() => {
    if (imagesForSlider.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % imagesForSlider.length);
    }
  }, [imagesForSlider.length]);

  const prevImage = useCallback(() => {
    if (imagesForSlider.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + imagesForSlider.length) % imagesForSlider.length);
    }
  }, [imagesForSlider.length]);

  const imagesForGrid = imagesForSlider.slice(0, 3);
  const remainingCount = Math.max(0, imagesForSlider.length - 3);
  const hasImages = imagesForSlider.length > 0;

  return {
    detail,
    loading,
    error: error || null,
    currentImageIndex,
    imagesForSlider,
    imagesForGrid,
    remainingCount,
    nextImage,
    prevImage,
    hasImages,
  };
};

interface UsePlaceDetailResult {
  detail: BaseDetail | null;
  loading: boolean;
  error: Error | null;
  currentImageIndex: number;
  imagesForSlider: Array<{ url: string; alt: string }>;
  imagesForGrid: Array<{ url: string; alt: string }>;
  remainingCount: number;
  nextImage: () => void;
  prevImage: () => void;
  hasImages: boolean;
}
