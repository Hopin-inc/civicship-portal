"use client";

import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useMemo } from "react";

export default function Header() {
  const headerConfig = useMemo(
    () => ({
      title: "設定",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return null;
}