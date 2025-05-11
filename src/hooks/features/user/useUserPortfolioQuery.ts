'use client';

import { useGetUserWithDetailsAndPortfoliosQuery } from "@/types/graphql";

export interface Portfolio {
  id: string;
  title: string;
  category: string;
  date: string;
  thumbnailUrl: string | null;
  source?: string;
  reservationStatus?: string | null;
  place?: {
    name: string;
  } | null;
  participants: Array<{
    id: string;
    name: string;
    image: string | null;
  }>;
}

export const useUserPortfolioQuery = (userId: string) => {
  return useGetUserWithDetailsAndPortfoliosQuery({
    variables: { 
      id: userId,
    },
    fetchPolicy: "network-only",
    skip: !userId
  });
};
