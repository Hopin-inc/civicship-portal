"use client";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

export const Header = () => {
    const t = useTranslations();
    const headerConfig = useMemo(
        () => ({
          title: t("transactions.header.title"),
          showBackButton: true,
          showLogo: false,
        }),
        [t],
      );
      useHeaderConfig(headerConfig);
  return null;
};
