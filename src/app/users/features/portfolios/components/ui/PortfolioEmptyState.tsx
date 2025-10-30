import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { getCurrentRegionName, currentCommunityConfig, getCurrentRegionKey } from "@/lib/communities/metadata";
import Link from "next/link";
import { useTranslations } from "next-intl";

type PortfolioEmptyStateProps = {
  isOwner: boolean;
};

export const PortfolioEmptyState = ({ isOwner }: PortfolioEmptyStateProps) => {
  const t = useTranslations();
  
  return (
    <Empty className="mt-8">
      <EmptyHeader>
        <EmptyMedia variant="gradient">
          <Search className="h-8 w-8" />
        </EmptyMedia>
        <EmptyDescription>
          {isOwner
            ? t("users.portfolio.emptyStateOwner", { regionName: t(getCurrentRegionKey()) })
            : t("users.portfolio.emptyStateNonOwner")}
        </EmptyDescription>
      </EmptyHeader>
      {isOwner && (
        <EmptyContent>
          <Button asChild variant="primary" size="lg" className="px-16">
            <Link href={currentCommunityConfig.rootPath ?? "/"}>
              {t("users.portfolio.searchEngagements")}
            </Link>
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};
