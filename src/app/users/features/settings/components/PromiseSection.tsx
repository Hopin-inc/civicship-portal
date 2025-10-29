"use client";
import { Card, CardContent } from "@/components/ui/card";
import { FileIcon } from "lucide-react";
import Link from "next/link";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { useTranslations } from "next-intl";

export default function PromiseSection() {
  const t = useTranslations();
  const defaultCommonDocuments = [
    { id: "terms", title: t("users.promise.termsOfService"), path: "/terms", type: "internal" as const },
    { id: "privacy", title: t("users.promise.privacyPolicy"), path: "/privacy", type: "internal" as const },
  ];

  const commonDocuments = defaultCommonDocuments.map((doc) => {
    const override = currentCommunityConfig.commonDocumentOverrides?.[doc.id as "terms" | "privacy"];
    return override || doc;
  });

  const communityDocuments = currentCommunityConfig.documents || [];

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
    titleKey?: string;
    path: string;
    type: "internal" | "external";
  };
}

function DocumentLink({ document }: DocumentLinkProps) {
  const t = useTranslations();
  const displayTitle = document.titleKey ? t(document.titleKey) : document.title;
  
  const content = (
    <div className="flex items-center justify-between py-4 px-4 border-b">
      <div className="flex items-center gap-2">
        <FileIcon className="w-5 h-5" />
        <span className="font-bold text-sm">{displayTitle}</span>
      </div>
    </div>
  );

  if (document.type === "internal") {
    return <Link href={document.path}>{content}</Link>;
  }

  return (
    <a href={document.path} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  );
}
