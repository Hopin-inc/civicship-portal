"use client";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

export const Header = () => {
    const t = useTranslations();
    const headerConfig = useMemo(
        () => ({
          title: t("navigation.bottomBar.timeline"),
          showBackButton: true,
          showLogo: false,
        }),
        [t],
      );
      useHeaderConfig(headerConfig);
  return null;
};
