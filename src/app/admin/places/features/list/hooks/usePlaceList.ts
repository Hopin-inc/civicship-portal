/**
 * Place一覧フック
 */

import { useMemo } from "react";
import { useGetPlacesQuery } from "@/types/graphql";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { PlaceData } from "../../shared/types/place";
import { transformPlaceFromGraphQL } from "../services/placeTransformer";

export const usePlaceList = () => {
  const { communityId } = useCommunityConfig();
  
  const { data, loading, error, refetch } = useGetPlacesQuery({
    variables: {
      filter: {
        communityId,
      },
      first: 100,
    },
    fetchPolicy: "network-only",
  });

  const places = useMemo<PlaceData[]>(() => {
    return (data?.places?.edges || [])
      .map((edge) => edge?.node)
      .filter((place) => place != null)
      .map(transformPlaceFromGraphQL);
  }, [data]);

  return {
    places,
    loading,
    error,
    refetch,
  };
};
