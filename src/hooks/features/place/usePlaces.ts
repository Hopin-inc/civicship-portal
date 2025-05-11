"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "@/hooks/core/useLoading";
import { useGetMembershipListQuery } from "@/types/graphql";
import { calculateTotalBases, presenterBaseCard } from "@/presenters";

export const usePlaces = () => {
  const { data, loading, error } = useGetMembershipListQuery({
    variables: {
      filter: {
        status: "JOINED",
        role: "MANAGER",
      },
    },
  });
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedPlaceId = searchParams.get("placeId");
  const mode = searchParams.get("mode") || "map";

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  const updateParams = (updater: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);
    router.push(`/places?${params.toString()}`);
  };

  const handlePlaceSelect = (placeId: string) => updateParams((p) => p.set("placeId", placeId));
  const handleClose = () => updateParams((p) => p.delete("placeId"));

  const toggleMode = () =>
    updateParams((p) => {
      p.set("mode", mode === "map" ? "list" : "map");
      p.delete("placeId");
    });

  const memberships = useMemo(
    () => data?.memberships?.edges?.flatMap((edge) => (edge?.node ? [edge.node] : [])) ?? [],
    [data?.memberships?.edges],
  );

  const places = useMemo(() => presenterBaseCard(memberships), [memberships]);
  const totalPlaces = useMemo(() => calculateTotalBases(memberships), [memberships]);

  return {
    memberships,
    places,
    selectedPlaceId,
    mode,
    loading,
    error: error ?? null,
    handlePlaceSelect,
    handleClose,
    toggleMode,
    totalPlaces,
  };
};
