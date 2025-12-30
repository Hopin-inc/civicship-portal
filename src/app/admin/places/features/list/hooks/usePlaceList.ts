/**
 * Place一覧フック
 */

import { useMemo } from "react";
import { useGetPlacesQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { PlaceData } from "../../shared/types/place";
import { transformPlaceFromGraphQL } from "../services/placeTransformer";

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
      .map(transformPlaceFromGraphQL);
  }, [data]);

  return {
    places,
    loading,
    error,
    refetch,
  };
};
