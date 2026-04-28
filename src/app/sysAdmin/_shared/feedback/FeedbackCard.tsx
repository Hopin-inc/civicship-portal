"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { feedbackTypeLabel } from "@/app/sysAdmin/features/system/templates/shared/labels";
import type { GqlReportFeedbackFieldsFragment } from "@/types/graphql";
import { Stars } from "./Stars";

type Props = {
  feedback: GqlReportFeedbackFieldsFragment;
  /**
   * 表示文脈で「このフィードバックの元のレポート」へ飛ぶ link を出す場合に渡す。
   * Report detail 内では文脈上「現在見ているレポート」なので不要。
   * テンプレ詳細の feed では `feedback.report` から構築して渡す。
   */
  reportLink?: { href: string; label: string };
};

/**
 * shadcnblocks の Customer Reviews 風カード。
 * 上段に avatar + name + date + 星、下段に種類タイトル + comment、
 * 必要に応じて section key と report link を末尾に出す。
 *
 * 単一の card で「テンプレ詳細 (report link 付き) / Report detail (link 無し)」
 * 両方の文脈を吸収する。
 */
export function FeedbackCard({ feedback, reportLink }: Props) {
  const initial = feedback.user.name?.slice(0, 1) ?? "?";
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 p-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-body-sm font-medium">
              {feedback.user.name}
            </p>
            <p className="text-body-xs text-muted-foreground tabular-nums">
              {new Date(feedback.createdAt).toLocaleDateString("ja-JP")}
            </p>
          </div>
        </div>
        <Stars rating={feedback.rating} />
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-4 pt-0">
        {feedback.feedbackType && (
          <p className="text-body-sm font-semibold">
            {feedbackTypeLabel(feedback.feedbackType)}
          </p>
        )}
        {feedback.comment ? (
          <p className="line-clamp-3 text-body-sm leading-relaxed">
            {feedback.comment}
          </p>
        ) : (
          <p className="text-body-xs italic text-muted-foreground">
            (コメントなし)
          </p>
        )}
        {(feedback.sectionKey || reportLink) && (
          <div className="flex flex-wrap items-center gap-1 pt-1 text-body-xs text-muted-foreground">
            {feedback.sectionKey && (
              <Badge variant="outline" className="font-mono">
                {feedback.sectionKey}
              </Badge>
            )}
            {reportLink && (
              <Link
                href={reportLink.href}
                className="ml-auto inline-flex items-center gap-1 text-body-xs text-muted-foreground hover:text-foreground"
              >
                <span>{reportLink.label}</span>
                <ExternalLink className="h-3 w-3" aria-hidden />
                <span className="sr-only">レポートを開く</span>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
