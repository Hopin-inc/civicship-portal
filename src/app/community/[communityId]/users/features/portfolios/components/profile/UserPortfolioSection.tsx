"use client";

import { useRef } from "react";
import { useAppRouter } from "@/lib/navigation";
import { AppPortfolio } from "@/app/community/[communityId]/users/features/shared/types";
import { ActiveOpportunitiesSection } from "./ActiveOpportunitiesSection";
import { PortfolioGrid } from "../ui/PortfolioGrid";
import { PortfolioEmptyState } from "../ui/PortfolioEmptyState";
import { presentActiveOpportunityCards } from "../../presenters/presentActiveOpportunityCards";
import { presentPortfolioCard } from "../../presenters/presentPortfolioCard";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();
  const lastPortfolioRef = useRef<HTMLDivElement>(null);
  const showEmptyState = portfolios.length === 0;
  const router = useAppRouter();

  const activeOpportunityCards = presentActiveOpportunityCards(activeOpportunities);
  const portfolioViewModels = portfolios.map((p) => presentPortfolioCard(p));

  return (
    <section>
      <div className="space-y-4">
        {activeOpportunityCards.length > 0 && (
          <ActiveOpportunitiesSection opportunities={activeOpportunityCards} />
        )}
        <div className="flex items-center justify-between">
          <h2 className="text-body-md font-semibold text-foreground pt-4">
            {t("users.portfolio.sectionTitle")}
          </h2>
          <button
            type="button"
            className="text-sm border-b-[1px] border-black cursor-pointer bg-transparent mt-2"
            onClick={() => router.push("/users/me/portfolios?tab=future")}
          >
            {t("users.portfolio.viewAll")}
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
