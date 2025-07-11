"use client";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useMemo } from "react";

export default function Header() {
    const headerConfig = useMemo(
        () => ({
          title: "すべての関わり",
          showLogo: false,
          showBackButton: true,
        }),
        [],
      );
      useHeaderConfig(headerConfig);
      return null;
}