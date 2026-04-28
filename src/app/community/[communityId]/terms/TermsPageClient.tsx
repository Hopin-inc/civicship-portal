"use client";

import { useMemo } from "react";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import useHeaderConfig from "@/hooks/useHeaderConfig";

interface TermsPageClientProps {
  body: string;
}

export default function TermsPageClient({ body }: TermsPageClientProps) {
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
      <MarkdownContent>{body}</MarkdownContent>
    </div>
  );
}
