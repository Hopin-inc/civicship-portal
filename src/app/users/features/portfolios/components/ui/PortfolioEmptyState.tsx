import EmptyStateWithSearch from "@/components/shared/EmptyStateWithSearch";
import { getCurrentRegionName } from "@/lib/communities/metadata";
import { useTranslations } from "next-intl";

type PortfolioEmptyStateProps = {
  isOwner: boolean;
};

export const PortfolioEmptyState = ({ isOwner }: PortfolioEmptyStateProps) => {
  const t = useTranslations();
  const emptyStateProps = {
    description: isOwner
      ? t("users.portfolio.emptyStateOwner", { regionName: getCurrentRegionName() })
      : t("users.portfolio.emptyStateNonOwner"),
    actionLabel: isOwner ? t("users.portfolio.searchEngagements") : undefined,
    onAction: isOwner ? () => (window.location.href = "/") : undefined,
    hideActionButton: !isOwner,
  };

  return <EmptyStateWithSearch {...emptyStateProps} />;
};
