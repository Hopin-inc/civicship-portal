"use client";
import { PortfoliosPage as PortfoliosPageComponent } from "@/app/users/features/portfolios";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useTranslations } from "next-intl";

export default function PortfoliosPage() {
  const t = useTranslations();
  const headerConfig = useMemo(
    () => ({
      title: t("users.portfolio.pageTitle"),
      showLogo: false,
      showBackButton: true,
    }),
    [t],
  );
  useHeaderConfig(headerConfig);

  return (
    <div>
      <PortfoliosPageComponent />
    </div>
  );
}
