"use client";
import { useMemo, useRef } from "react";
import { groupByDate } from "./portfoliosList";
import { useUserProfileContext } from "@/app/users/features/shared/contexts/UserProfileContext";
import { PortfolioDateGroup } from "./PortfolioDateGroup";
import { filterPastPortfolios } from "@/app/users/features/portfolios/lib";

interface PastTabProps {
  searchQuery: string;
}

export default function PastTab({ searchQuery }: PastTabProps) {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);
  const { portfolios } = useUserProfileContext();

  const today = useMemo(() => new Date(), []);

  const filteredPortfolios = useMemo(() => {
    return filterPastPortfolios(portfolios, searchQuery, today);
  }, [portfolios, searchQuery, today]);

  const grouped = groupByDate(filteredPortfolios);

  return <PortfolioDateGroup grouped={grouped} lastPortfolioRef={lastPortfolioRef} />;
}
