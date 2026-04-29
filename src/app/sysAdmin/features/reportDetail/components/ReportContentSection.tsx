"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
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
 */
export function ReportContentSection({ body, skipReason }: Props) {
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      toast.success("コピーしました");
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy markdown:", error);
      toast.error("コピーに失敗しました");
    }
  };

  return (
    <article className="relative">
      <div className="mb-2 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          aria-label="本文の markdown をコピー"
          className="h-8 gap-1.5 px-2 text-body-xs text-muted-foreground"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "コピー済み" : "markdown をコピー"}
        </Button>
      </div>
      <MarkdownContent>{body}</MarkdownContent>
    </article>
  );
}
