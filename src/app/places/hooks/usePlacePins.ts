"use client";

import usePlacesData from "./usePlacesData";

export default function usePlacePins() {
  const { pins, loading, error, refetch } = usePlacesData();

  return {
    placePins: pins,
    loading,
    error,
    refetch,
  };
}
