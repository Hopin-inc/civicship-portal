"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

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
      toast.success("コピーしました", { toastId: "copy-markdown" });
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
          className="h-8 gap-1.5 px-2 text-body-xs text-muted-foreground"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden />
          )}
          {copied ? "コピー済み" : "mdコピー"}
        </Button>
      </div>
      <MarkdownContent>{body}</MarkdownContent>
    </article>
  );
}
