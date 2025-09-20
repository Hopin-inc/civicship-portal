"use client";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useMemo } from "react";

export const Header = () => {
    const headerConfig = useMemo(
        () => ({
          title: "ポイント履歴",
          showBackButton: true,
          showLogo: false,
        }),
        [],
      );
      useHeaderConfig(headerConfig);
  return null;
};