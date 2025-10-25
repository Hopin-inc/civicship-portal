"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { AppPortfolio } from "@/app/users/features/shared/types";
import { ActiveOpportunitiesSection } from "./ActiveOpportunitiesSection";
import { PortfolioGrid } from "../ui/PortfolioGrid";
import { PortfolioEmptyState } from "../ui/PortfolioEmptyState";
import { presentActiveOpportunityCards } from "../../presenters/presentActiveOpportunityCards";
import { presentPortfolioCard } from "../../presenters/presentPortfolioCard";

interface UserPortfolioSectionProps {
  userId: string;
  portfolios: AppPortfolio[];
  isOwner: boolean;
  activeOpportunities: Array<{
    id: string;
    title: string;
    images?: string[];
  }>;
}

export function UserPortfolioSection({
  userId,
  portfolios,
  isOwner,
  activeOpportunities,
}: UserPortfolioSectionProps) {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);
  const showEmptyState = portfolios.length === 0;
  const router = useRouter();

  const activeOpportunityCards = presentActiveOpportunityCards(activeOpportunities);
  const portfolioViewModels = portfolios.map(presentPortfolioCard);

  return (
    <section className="py-6 mt-0">
      <div className="space-y-4">
        {activeOpportunityCards.length > 0 && (
          <ActiveOpportunitiesSection opportunities={activeOpportunityCards} />
        )}
        <div className="flex items-center justify-between">
          <h2 className="text-display-sm font-semibold text-foreground pt-4 pb-1">
            これまでの関わり
          </h2>
          <button
            type="button"
            className="text-sm border-b-[1px] border-black cursor-pointer bg-transparent p-0"
            onClick={() => router.push("/users/me/portfolios?tab=future")}
          >
            すべて見る
          </button>
        </div>
        {showEmptyState ? (
          <PortfolioEmptyState isOwner={isOwner} />
        ) : (
          <PortfolioGrid
            viewModels={portfolioViewModels}
            isLoadingMore={false}
            hasMore={false}
            lastPortfolioRef={lastPortfolioRef}
          />
        )}
      </div>
    </section>
  );
}
