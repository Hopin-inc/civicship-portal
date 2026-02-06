"use client";

import { useMemo } from "react";
import { proseClassName } from "@/utils/md";
import useHeaderConfig from "@/hooks/useHeaderConfig";

interface TermsPageClientProps {
  html: string;
}

export default function TermsPageClient({ html }: TermsPageClientProps) {
  const headerConfig = useMemo(
    () => ({
      title: "利用規約",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="max-w-[720px] mx-auto px-4 py-8">
      <div className={proseClassName} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
