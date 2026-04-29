"use client";

import { MarkdownContent } from "@/components/shared/MarkdownContent";

type Props = {
  /**
   * Report 本文の markdown 文字列。生成中 / skipped の場合は null。
   */
  body: string | null;
  skipReason?: string | null;
};

/**
 * Report 本文の表示。markdown は client 側で `react-markdown` がパースし、
 * shadcn ベースのコンポーネントへマッピングして描画する。
 *
 * markdown コピーボタンは header 側 (ReportDetailHeader) に併設しているので、
 * ここでは本文だけを描画する。
 */
export function ReportContentSection({ body, skipReason }: Props) {
  if (skipReason) {
    return (
      <section className="rounded border border-dashed border-border p-4 text-body-sm text-muted-foreground">
        <p className="font-semibold">スキップ</p>
        <p className="mt-1">{skipReason}</p>
      </section>
    );
  }

  if (!body) {
    return (
      <p className="py-6 text-center text-body-sm text-muted-foreground">
        本文がまだ生成されていません
      </p>
    );
  }

  return (
    <article>
      <MarkdownContent>{body}</MarkdownContent>
    </article>
  );
}
