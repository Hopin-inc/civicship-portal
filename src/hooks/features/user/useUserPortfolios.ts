'use client';

import {  useEffect, useMemo } from "react";
import { useLoading } from '@/hooks/core/useLoading';
import { useUserPortfolioQuery } from './useUserPortfolioQuery';
import { useUserOpportunities } from './useUserOpportunities';
import { Portfolio, PortfolioCategory, ReservationStatus } from "@/presenters/portfolio";
import { GqlReservationStatus } from "@/types/graphql";

export const useUserPortfolios = (userId: string) => {
  const { setIsLoading } = useLoading();
  console.log(userId);
  const { data, loading, error } = useUserPortfolioQuery(userId);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  const activeOpportunities = useUserOpportunities(data);

  const mapReservationStatus = (status: GqlReservationStatus | null | undefined): ReservationStatus | null => {
    if (!status) return null;
    return status.toLowerCase() as ReservationStatus;
  };

  const portfolios: Portfolio[] = useMemo(() => {
    if (!data?.user?.portfolios) return [];

    return data.user.portfolios.map((p): Portfolio => ({
      id: p.id,
      title: p.title,
      date: new Date(p.date).toISOString(),
      category: p.category as PortfolioCategory,
      type:
        p.source === "OPPORTUNITY"
          ? "opportunity"
          : p.source === "ARTICLE"
            ? "activity_report"
            : "quest",
      location: p.place?.name ?? null,
      image: p.thumbnailUrl ?? null,
      reservationStatus: mapReservationStatus(p.reservationStatus),
      participants: (p.participants ?? []).map((participant) => ({
        id: participant.id,
        name: participant.name,
        image: participant.image ?? null,
      }))
    }));
  }, [data]);


  return {
    portfolios,
    isLoading: loading,
    error,
    activeOpportunities,
    userData: data?.user
  };
};


export default useUserPortfolios;
