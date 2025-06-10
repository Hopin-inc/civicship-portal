"use client";

import { useEffect, useMemo, useState } from "react";
import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import { proseClassName } from "@/utils/md";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { logger } from "@/lib/logging";
import { getTermsContent } from "@/lib/community/communityContent";

// 利用規約のマークダウンを取得する関数
const getTermsMarkdown = () => {
  return getTermsContent();
};

export default function TermsPage() {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const markdownContent = useMemo(() => getTermsMarkdown(), []);

  useHeaderConfig({
    title: "利用規約",
    showBackButton: true,
  });

  useEffect(() => {
    try {
      const html = convertMarkdownToHtml(markdownContent);
      setHtmlContent(html);
    } catch (error) {
      logger.error("Error converting markdown to HTML", { error });
    }
  }, [markdownContent]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">利用規約</h1>
      <div className={proseClassName} dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
