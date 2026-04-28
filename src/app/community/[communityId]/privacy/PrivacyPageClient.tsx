"use client";

import { useMemo } from "react";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import useHeaderConfig from "@/hooks/useHeaderConfig";

interface PrivacyPageClientProps {
  body: string;
}

export default function PrivacyPageClient({ body }: PrivacyPageClientProps) {
  const headerConfig = useMemo(
    () => ({
      title: "プライバシーポリシー",
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
