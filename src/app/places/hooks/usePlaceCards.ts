"use client";

import usePlacesData from "./usePlacesData";

export default function usePlaceCards() {
  const { cards, loading, error, refetch } = usePlacesData();

  return {
    baseCards: cards,
    loading,
    error,
    refetch,
  };
}
