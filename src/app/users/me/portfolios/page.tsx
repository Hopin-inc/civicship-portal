"use client";
import { PortfoliosPage as PortfoliosPageComponent } from "@/app/users/features/portfolios";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export default function PortfoliosPage() {
  const headerConfig = useMemo(
    () => ({
      title: "すべての関わり",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <div>
      <PortfoliosPageComponent />
    </div>
  );
}
