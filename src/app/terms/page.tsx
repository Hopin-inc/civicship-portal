"use client";

import { useEffect, useMemo, useState } from "react";
import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import { proseClassName } from "@/utils/md";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { logger } from "@/lib/logging";
import { getTermsContent } from "@/lib/communities/content";

const termsMarkdown = getTermsContent();

export default function TermsPage() {
  const headerConfig = useMemo(
    () => ({
      title: "利用規約",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const [html, setHtml] = useState("");

  useEffect(() => {
    convertMarkdownToHtml(termsMarkdown)
      .then(setHtml)
      .catch((error) => {
        logger.error("Failed to convert markdown to HTML", {
          error: error instanceof Error ? error.message : String(error),
          component: "TermsPage",
        });
      });
  }, []);

  return (
    <div className="max-w-[720px] mx-auto px-4 py-8">
      <div className={proseClassName} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
