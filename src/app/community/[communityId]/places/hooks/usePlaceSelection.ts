import { useCallback, useState } from "react";

export const usePlaceSelection = () => {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  const onPlaceSelect = useCallback((placeId: string) => {
    setSelectedPlaceId(placeId);
  }, []);

  return { selectedPlaceId, onPlaceSelect };
};
