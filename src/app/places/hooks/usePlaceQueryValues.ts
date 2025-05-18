import { useSearchParams } from "next/navigation";

export function usePlaceQueryValues() {
  const searchParams = useSearchParams();
  const selectedPlaceId = searchParams.get("placeId");
  const mode = searchParams.get("mode") || "map";

  return { selectedPlaceId, mode };
}
