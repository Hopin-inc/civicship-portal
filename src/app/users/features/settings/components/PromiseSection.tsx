"use client";
import { Card, CardContent } from "@/components/ui/card";
import { FileIcon } from "lucide-react";
import Link from "next/link";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { useTranslations, useLocale } from "next-intl";
import { resolveLocalePath } from "@/utils/i18n";

export default function PromiseSection() {
  // Use runtime community config from context
  const communityConfig = useCommunityConfig();
  
  const defaultCommonDocuments = [
    { id: "terms", title: "users.promise.termsOfService", path: "/terms", type: "internal" as const },
    { id: "privacy", title: "users.promise.privacyPolicy", path: "/privacy", type: "internal" as const },
  ];

  const commonDocuments = defaultCommonDocuments.map((doc) => {
    const override = communityConfig?.commonDocumentOverrides?.[doc.id as "terms" | "privacy"];
    return override || doc;
  });

  const communityDocuments = communityConfig?.documents || [];

  const sortedCommunityDocuments = [...communityDocuments].sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    return orderA - orderB;
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-0">
        {/* 共通規約 */}
        {commonDocuments.map((doc) => (
          <DocumentLink key={doc.id} document={doc} />
        ))}

        {/* コミュニティ固有の文書 */}
        {sortedCommunityDocuments.map((doc) => (
          <DocumentLink key={doc.id} document={doc} />
        ))}
      </CardContent>
    </Card>
  );
}

interface DocumentLinkProps {
  document: {
    title: string;
    path: string;
    type: "internal" | "external";
  };
}

function DocumentLink({ document }: DocumentLinkProps) {
  const t = useTranslations();
  const locale = useLocale();
  const displayTitle = t(document.title);
  
  const href = document.path.includes("{locale}")
    ? resolveLocalePath(document.path, locale)
    : document.path;
  
  const content = (
    <div className="flex items-center justify-between py-4 px-4 border-b">
      <div className="flex items-center gap-2">
        <FileIcon className="w-5 h-5" />
        <span className="font-bold text-sm">{displayTitle}</span>
      </div>
    </div>
  );

  if (document.type === "internal") {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  );
}
