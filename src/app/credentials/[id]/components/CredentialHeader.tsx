"use client";

import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useMemo } from "react";

export default function CredentialHeader() {
  const headerConfig = useMemo(
    () => ({
      title: "証明書の確認",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return null;
}