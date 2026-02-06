"use client";

import { useEffect, useMemo } from "react";
import { useLoading } from "@/hooks/useLoading";
import { useGetPlaceQuery } from "@/types/graphql";
import { IPlaceDetail } from "@/app/community/[communityId]/places/data/type";
import { presenterPlaceDetail } from "@/app/community/[communityId]/places/data/presenter";

export interface UsePlaceDetailResult {
  place: IPlaceDetail | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const usePlaceDetail = (placeId: string): UsePlaceDetailResult => {
  const { data, loading, error, refetch } = useGetPlaceQuery({
    variables: { id: placeId },
  });

  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  const place = useMemo(() => {
    const place = data?.place;
    return place ? presenterPlaceDetail(place) : null;
  }, [data]);

  return {
    place,
    loading,
    error: error ?? null,
    refetch,
  };
};
