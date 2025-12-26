"use client";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import Link from "next/link";
import { useTranslations } from "next-intl";

type PortfolioEmptyStateProps = {
  isOwner: boolean;
};

export const PortfolioEmptyState = ({ isOwner }: PortfolioEmptyStateProps) => {
  const t = useTranslations();
  // Use runtime community config from context
  const communityConfig = useCommunityConfig();
  const regionKey = communityConfig?.regionKey || "common.regions.default";
  
  return (
    <Empty className="mt-8">
      <EmptyHeader>
        <EmptyMedia variant="gradient">
          <Search className="h-8 w-8" />
        </EmptyMedia>
        <EmptyDescription>
          {isOwner
            ? t("users.portfolio.emptyStateOwner", { regionName: t(regionKey) })
            : t("users.portfolio.emptyStateNonOwner")}
        </EmptyDescription>
      </EmptyHeader>
      {isOwner && (
        <EmptyContent>
          <Button asChild variant="primary" size="lg" className="px-16">
            <Link href={communityConfig?.rootPath ?? "/"}>
              {t("users.portfolio.searchEngagements")}
            </Link>
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};
