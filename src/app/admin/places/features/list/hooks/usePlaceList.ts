import { useMemo } from "react";
import { useGetPlacesQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { PlaceData } from "../../shared/types/place";

export const usePlaceList = () => {
  const { data, loading, error, refetch } = useGetPlacesQuery({
    variables: {
      filter: {
        communityId: COMMUNITY_ID,
      },
      first: 100,
    },
    fetchPolicy: "network-only",
  });

  const places = useMemo<PlaceData[]>(() => {
    return (data?.places?.edges || [])
      .map((edge) => edge?.node)
      .filter((place) => place != null)
      .map((place) => ({
        id: place!.id,
        name: place!.name,
        address: place!.address,
        latitude: Number(place!.latitude),
        longitude: Number(place!.longitude),
        cityCode: place!.city?.code || "",
        cityName: place!.city?.name,
        googlePlaceId: place!.googlePlaceId || undefined,
        isManual: place!.isManual || false,
        mapLocation: place!.mapLocation,
        image: place!.image || undefined,
        opportunityCount: place!.currentPublicOpportunityCount || 0,
      }));
  }, [data]);

  return {
    places,
    loading,
    error,
    refetch,
  };
};
