"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
};

/**
 * Report 本文の markdown を 1 タップでコピーする小さい ghost icon ボタン。
 * テキストラベルなしのコンパクト版で、ヘッダー右端などにそっと並べる用途。
 */
export function CopyMarkdownButton({ text, className }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("コピーしました", { toastId: "copy-markdown" });
    } catch (error) {
      console.error("Failed to copy markdown:", error);
      toast.error("コピーに失敗しました");
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      aria-label={copied ? "コピー済み" : "markdown をコピー"}
      className={cn(
        "h-6 gap-1 px-1.5 text-[10px] leading-none text-muted-foreground",
        className,
      )}
    >
      {copied ? (
        <Check className="h-3 w-3" aria-hidden />
      ) : (
        <Copy className="h-3 w-3" aria-hidden />
      )}
      <span>md</span>
    </Button>
  );
}
