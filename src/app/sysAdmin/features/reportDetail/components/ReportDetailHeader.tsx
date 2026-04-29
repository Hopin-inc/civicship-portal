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
import { CopyMarkdownButton } from "./CopyMarkdownButton";

type Props = {
  variant: GqlReportVariant;
  status: GqlReportStatus;
  periodFrom: Date;
  periodTo: Date;
  templateVersion?: number | null;
  /** あれば「md コピー」アクションを並べる。null/空なら出さない。 */
  body?: string | null;
};

/**
 * Report detail page の header。
 * 期間 / variant / status を inline テキストで出し、その下にこのレポートを生成した
 * テンプレ詳細へのリンクと、md コピーボタンを並べる。
 */
export function ReportDetailHeader({
  variant,
  status,
  periodFrom,
  periodTo,
  templateVersion,
  body,
}: Props) {
  const slug = variantToSlug(variant);
  const templateHref = slug
    ? `/sysAdmin/system/templates/${slug}`
    : null;

  return (
    <header className="space-y-2">
      <p className="text-body-xs text-muted-foreground">
        <span className="tabular-nums">
          {formatDate(periodFrom)} 〜 {formatDate(periodTo)}
        </span>
        <span aria-hidden className="mx-1.5">
          ・
        </span>
        <span>{variantLabel(variant)}</span>
        <span aria-hidden className="mx-1.5">
          ・
        </span>
        <span>{statusLabel(status)}</span>
      </p>
      {(templateHref || body) && (
        <div className="flex items-center gap-2">
          {templateHref && (
            <Link
              href={templateHref}
              className="inline-flex items-center gap-1 text-body-xs text-muted-foreground hover:text-foreground"
            >
              <span>
                テンプレ
                {templateVersion != null ? `(v${templateVersion})` : ""}
              </span>
              <ExternalLink className="h-3 w-3" aria-hidden />
            </Link>
          )}
          {body && <CopyMarkdownButton text={body} className="ml-auto" />}
        </div>
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
