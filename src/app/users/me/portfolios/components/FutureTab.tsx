"use client";
import { groupByDate } from "./portfoliosList";
import { useMemo, useRef } from "react";
import { useUserProfileContext } from "@/app/users/contexts/UserProfileContext";
import { PortfolioDateGroup } from "./PortfolioDateGroup";
import { filterFuturePortfolios } from "@/app/users/lib/portfolioHelpers";

interface FutureTabProps {
    searchQuery: string;
}

export default function FutureTab({ searchQuery }: FutureTabProps) {
    const lastPortfolioRef = useRef<HTMLDivElement>(null);
    const { portfolios } = useUserProfileContext();
    
    const today = useMemo(() => new Date(), []);
    
    const filteredPortfolios = useMemo(() => {
        return filterFuturePortfolios(portfolios, searchQuery, today);
    }, [portfolios, searchQuery, today]);
    
    const grouped = groupByDate(filteredPortfolios);
    
    return (
        <PortfolioDateGroup grouped={grouped} lastPortfolioRef={lastPortfolioRef} />
    );
}
