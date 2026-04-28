"use client";

type Props = {
  /**
   * SSR で `convertMarkdownToHtml` 済みの sanitize 済み HTML 文字列。
   * 何も無い (生成中 / skipped) 場合は null を渡し、placeholder を表示する。
   */
  bodyHtml: string | null;
  skipReason?: string | null;
};

/**
 * Report 本文の表示。markdown は SSR で sanitize 済み HTML に変換して
 * 渡される前提のため、ここでは dangerouslySetInnerHTML で挿入するだけ。
 */
export function ReportContentSection({ bodyHtml, skipReason }: Props) {
  if (skipReason) {
    return (
      <section className="rounded border border-dashed border-border p-4 text-body-sm text-muted-foreground">
        <p className="font-semibold">スキップ</p>
        <p className="mt-1">{skipReason}</p>
      </section>
    );
  }

  if (!bodyHtml) {
    return (
      <p className="py-6 text-center text-body-sm text-muted-foreground">
        本文がまだ生成されていません
      </p>
    );
  }

  return (
    <article
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
    />
  );
}
