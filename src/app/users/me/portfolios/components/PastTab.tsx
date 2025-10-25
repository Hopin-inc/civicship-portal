"use client";
import { useMemo, useRef } from "react";
import { groupByDate } from "./portfoliosList";
import { useUserProfileContext } from "@/app/users/contexts/UserProfileContext";
import { PortfolioDateGroup } from "./PortfolioDateGroup";

interface PastTabProps {
    searchQuery: string;
}

export default function PastTab({ searchQuery }: PastTabProps) {
    const lastPortfolioRef = useRef<HTMLDivElement>(null);
    const { portfolios } = useUserProfileContext();
    
    const today = useMemo(() => new Date(), []);
    
    const filteredPortfolios = useMemo(() => {
        return portfolios.filter((portfolio) => {
            const portfolioDate = new Date(portfolio.date);
            if (portfolioDate >= today) return false;
            
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    portfolio.title.toLowerCase().includes(query) ||
                    portfolio.location?.toLowerCase().includes(query)
                );
            }
            
            return true;
        }).sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }, [portfolios, searchQuery, today]);
    
    const grouped = groupByDate(filteredPortfolios);
    
    return (
        <PortfolioDateGroup grouped={grouped} lastPortfolioRef={lastPortfolioRef} />
    );
}
