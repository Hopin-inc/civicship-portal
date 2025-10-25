"use client";

import { RefObject } from "react";
import { useRouter } from "next/navigation";
import { AppPortfolio } from "@/app/users/features/shared/types";
import { ActiveOpportunitiesSection } from "./ActiveOpportunitiesSection";
import { PortfolioGrid } from "./PortfolioGrid";
import { PortfolioEmptyState } from "./PortfolioEmptyState";
import { presentActiveOpportunities } from "../presenters/presentActiveOpportunities";
import { presentPortfolioCard } from "../presenters/presentPortfolioCard";

type SlimOpportunityCard = {
  id: string;
  title: string;
  images?: string[];
};

type Props = {
  userId: string;
  isOwner: boolean;
  portfolios: AppPortfolio[];
  isLoadingMore: boolean;
  hasMore: boolean;
  lastPortfolioRef: RefObject<HTMLDivElement>;
  isSysAdmin?: boolean;
  activeOpportunities?: SlimOpportunityCard[];
};

const UserPortfolioList = ({
  isSysAdmin,
  activeOpportunities = [],
  isOwner,
  portfolios,
  isLoadingMore,
  hasMore,
  lastPortfolioRef,
}: Props) => {
  const showEmptyState = portfolios.length === 0;
  const router = useRouter();

  const activeOpportunityCards = presentActiveOpportunities(activeOpportunities);
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
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            lastPortfolioRef={lastPortfolioRef}
          />
        )}
      </div>
    </section>
  );
};

export default UserPortfolioList;
