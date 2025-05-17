import { usePlaceMembership } from "@/app/places/[id]/hooks/usePlaceMembership";
import { useLoading } from "@/hooks/useLoading";
import { useEffect, useMemo } from "react";
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

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  const detail = useMemo(() => {
    return membership ? presenterBaseDetail(membership, placeId) : null;
  }, [membership, placeId]);
  return {
    detail,
    loading,
    error: error || null,
  };
};

interface UsePlaceDetailResult {
  detail: BaseDetail | null;
  loading: boolean;
  error: Error | null;
}
