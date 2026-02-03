import { useSearchParams } from "next/navigation";
import { useAppRouter } from "@/lib/navigation";

export function usePlaceQueryActions() {
  const searchParams = useSearchParams();
  const router = useAppRouter();

  const updateParams = (updater: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);
    router.push(`/places?${params.toString()}`);
  };

  const handlePlaceSelect = (placeId: string | null) => {
    if (placeId) {
      updateParams((p) => p.set("placeId", placeId));
    } else {
      updateParams((p) => p.delete("placeId"));
    }
  };

  const toggleMode = () =>
    updateParams((p) => {
      const mode = searchParams.get("mode") || "map";
      p.set("mode", mode === "map" ? "list" : "map");
      p.delete("placeId");
    });

  return { handlePlaceSelect, toggleMode };
}
