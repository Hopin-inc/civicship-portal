"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function usePlaceQueryParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedPlaceId = searchParams.get("placeId");
  const mode = searchParams.get("mode") || "map";

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

  return {
    selectedPlaceId,
    mode,
    handlePlaceSelect,
    handleClose,
    toggleMode,
  };
}
