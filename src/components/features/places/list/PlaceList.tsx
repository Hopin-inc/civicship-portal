"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PlaceMapSheet from "../map/PlaceMapSheet";
import { PlaceListSheet } from "@/components/features/places/list/PlaceListSheet";

interface PlaceListProps {
  memberships: Membership[];
  onClose?: () => void;
  isMapMode?: boolean;
  selectedPlaceId?: string | null;
}

export function PlaceList({
  memberships,
  onClose,
  isMapMode = false,
  selectedPlaceId,
}: PlaceListProps) {
  const router = useRouter();

  const handleMapClick = () => {
    router.push("/places?mode=map");
  };

  const handleListClick = () => {
    router.push("/places?mode=list");
  };

  const getAllPlaces = (membership: Membership) => {
    const participationView = membership.node.participationView;
    if (!participationView) return [];

    const activeOpportunityCount =
      membership.node.user.opportunitiesCreatedByMe?.edges.filter(
        (edge) => edge.node.publishStatus === "PUBLIC",
      ).length || 0;

    const participatedPlaces = participationView.participated.geo.map((place: any) => ({
      ...place,
      participantCount: participationView.participated.totalParticipatedCount,
      activeOpportunityCount,
    }));

    return [...participatedPlaces];
  };

  const totalPlaces = memberships.reduce(
    (total, membership) => total + getAllPlaces(membership).length,
    0,
  );

  if (isMapMode) {
    return (
      <PlaceMapSheet
        selectedPlaceId={selectedPlaceId}
        totalPlaces={totalPlaces}
        onDragUp={handleListClick}
      />
    );
  }

  return (
    <PlaceListSheet
      memberships={memberships}
      selectedPlaceId={selectedPlaceId}
      onMapClick={handleMapClick}
      getAllPlaces={getAllPlaces}
    />
  );
}
