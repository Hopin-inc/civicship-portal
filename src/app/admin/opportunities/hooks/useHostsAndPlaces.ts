"use client";

import { useMemo } from "react";
import {
  GqlMembershipStatus,
  useGetMembershipListQuery,
  useGetPlacesQuery,
} from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { HostOption, PlaceOption } from "../types";

export const useHostsAndPlaces = () => {
  // メンバー一覧取得
  const { data: membersData, loading: membersLoading } = useGetMembershipListQuery({
    variables: {
      filter: {
        communityId: COMMUNITY_ID,
        status: GqlMembershipStatus.Joined,
      },
      first: 100,
    },
    fetchPolicy: "cache-first",
  });

  // 場所一覧取得
  const { data: placesData, loading: placesLoading } = useGetPlacesQuery({
    variables: {
      filter: {
        communityId: COMMUNITY_ID,
      },
      first: 100,
    },
    fetchPolicy: "cache-first",
  });

  // データ変換
  const hosts = useMemo<HostOption[]>(() => {
    return (membersData?.memberships?.edges || [])
      .map((edge) => edge?.node?.user)
      .filter((user): user is NonNullable<typeof user> => user != null)
      .map((user) => ({
        id: user.id,
        name: user.name || "名前なし",
      }));
  }, [membersData]);

  const places = useMemo<PlaceOption[]>(() => {
    return (placesData?.places?.edges || [])
      .map((edge) => edge?.node)
      .filter((place): place is NonNullable<typeof place> => place != null)
      .map((place) => ({
        id: place.id,
        label: place.name,
      }));
  }, [placesData]);

  return {
    hosts,
    places,
    loading: membersLoading || placesLoading,
  };
};
