"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export default function HeaderConfig() {
  const headerConfig = useMemo(
    () => ({
      showLogo: true,
      showSearchForm: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return null;
}
