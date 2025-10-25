import { useRef } from "react";
import UserPortfolioList from "@/app/users/components/UserPortfolioList";

interface UserPortfolioSectionProps {
  userId: string;
  portfolios: Array<{
    id: string;
    title: string;
    coverUrl?: string;
    createdAt: string;
  }>;
  isOwner: boolean;
  activeOpportunities: Array<{
    id: string;
    title: string;
  }>;
}

export function UserPortfolioSection({
  userId,
  portfolios,
  isOwner,
  activeOpportunities,
}: UserPortfolioSectionProps) {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);

  const appPortfolios = portfolios.map((p) => ({
    id: p.id,
    title: p.title,
    image: p.coverUrl ?? null,
    date: new Date(p.createdAt).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    location: null,
    source: "OPPORTUNITY" as const,
    category: null,
    reservationStatus: null,
    evaluationStatus: null,
    participants: [],
  }));

  const activityCards = activeOpportunities.map((opp) => ({
    id: opp.id,
    title: opp.title,
    category: "ACTIVITY" as const,
    feeRequired: null,
    location: "",
    images: [],
    communityId: "",
    hasReservableTicket: false,
    pointsRequired: null,
    slots: [],
  }));

  return (
    <UserPortfolioList
      userId={userId}
      isOwner={isOwner}
      portfolios={appPortfolios}
      isLoadingMore={false}
      hasMore={false}
      lastPortfolioRef={lastPortfolioRef}
      isSysAdmin={false}
      activeOpportunities={activityCards}
    />
  );
}
