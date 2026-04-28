"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  type GqlReportStatus,
  type GqlReportVariant,
} from "@/types/graphql";
import {
  statusLabel,
  variantLabel,
} from "@/app/sysAdmin/features/system/templates/shared/labels";
import { variantToSlug } from "@/app/sysAdmin/features/system/templates/shared/variantSlug";

type Props = {
  variant: GqlReportVariant;
  status: GqlReportStatus;
  periodFrom: Date;
  periodTo: Date;
  templateVersion?: number | null;
};

/**
 * Report detail page の header。
 * 期間 / variant / status を1行で出し、その下にこのレポートを生成した
 * テンプレ詳細へのリンクを置く (templateVersion が分かれば付ける)。
 */
export function ReportDetailHeader({
  variant,
  status,
  periodFrom,
  periodTo,
  templateVersion,
}: Props) {
  const slug = variantToSlug(variant);
  const templateHref = slug
    ? `/sysAdmin/system/templates/${slug}`
    : null;

  return (
    <header className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-body-sm text-muted-foreground">
        <span className="tabular-nums">
          {formatDate(periodFrom)} 〜 {formatDate(periodTo)}
        </span>
        <span className="rounded-md border border-border px-1.5 py-px text-body-xs">
          {variantLabel(variant)}
        </span>
        <span className="rounded-md border border-border px-1.5 py-px text-body-xs">
          {statusLabel(status)}
        </span>
      </div>
      {templateHref && (
        <Link
          href={templateHref}
          className="inline-flex items-center gap-1 text-body-xs text-muted-foreground hover:text-foreground"
        >
          <span>
            このレポートのテンプレートを開く
            {templateVersion != null ? ` (v${templateVersion})` : ""}
          </span>
          <ExternalLink className="h-3 w-3" aria-hidden />
        </Link>
      )}
    </header>
  );
}

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
