"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  GqlReportFeedbackType,
  type GqlReportFeedbackFieldsFragment,
} from "@/types/graphql";
import {
  feedbackTypeLabel,
  FEEDBACK_TYPE_LABELS,
} from "@/app/sysAdmin/features/system/templates/shared/labels";

export type FeedbackFormInput = {
  rating: number;
  feedbackType: GqlReportFeedbackType | null;
  sectionKey: string | null;
  comment: string | null;
};

type Props = {
  /** 過去に投稿済みの feedback (= myFeedback)。あれば「投稿済み」として下に表示する。 */
  existingFeedback?: GqlReportFeedbackFieldsFragment | null;
  saving: boolean;
  saveError: { message: string } | null;
  onSubmit: (input: FeedbackFormInput) => void;
};

const FEEDBACK_TYPES = Object.keys(FEEDBACK_TYPE_LABELS) as GqlReportFeedbackType[];

/**
 * sysAdmin 代行投稿用 feedback フォーム。
 *
 * `submitReportFeedback` の input そのまま (rating + comment + feedbackType +
 * sectionKey) を扱う。送信は container 側で mutation + cache 更新を行うので
 * 本コンポーネントは入力 UI と onSubmit 通知だけに責務を絞る。
 */
export function ReportFeedbackForm({
  existingFeedback,
  saving,
  saveError,
  onSubmit,
}: Props) {
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] =
    useState<GqlReportFeedbackType | null>(null);
  const [sectionKey, setSectionKey] = useState("");
  const [comment, setComment] = useState("");

  const canSubmit = rating > 0 && !saving;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      rating,
      feedbackType,
      sectionKey: sectionKey.trim() === "" ? null : sectionKey.trim(),
      comment: comment.trim() === "" ? null : comment.trim(),
    });
  };

  return (
    <section className="space-y-3 rounded border border-border p-4">
      <h3 className="text-body-sm font-semibold">フィードバックを投稿</h3>

      {existingFeedback && (
        <p className="text-body-xs text-muted-foreground">
          自分の最新投稿: {existingFeedback.rating} / 5
          {existingFeedback.comment ? ` · ${existingFeedback.comment}` : ""}
        </p>
      )}

      <div className="space-y-1">
        <Label className="text-body-xs">評価</Label>
        <RatingPicker value={rating} onChange={setRating} />
      </div>

      <div className="space-y-1">
        <Label className="text-body-xs">種類 (任意)</Label>
        <div className="flex flex-wrap gap-1">
          {FEEDBACK_TYPES.map((t) => {
            const selected = feedbackType === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setFeedbackType(selected ? null : t)}
                className={cn(
                  "rounded-md border px-2 py-px text-body-xs",
                  selected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {feedbackTypeLabel(t)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="sectionKey" className="text-body-xs">
          セクションキー (任意)
        </Label>
        <Input
          id="sectionKey"
          value={sectionKey}
          onChange={(e) => setSectionKey(e.target.value)}
          placeholder="intro / highlight など"
          className="text-body-sm font-mono"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="comment" className="text-body-xs">
          コメント (任意)
        </Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="text-body-sm"
        />
      </div>

      {saveError && (
        <p className="text-body-xs text-destructive">{saveError.message}</p>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          size="sm"
        >
          {saving ? "送信中..." : "送信"}
        </Button>
      </div>
    </section>
  );
}

function RatingPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(value === n ? 0 : n)}
          className="rounded p-0.5 hover:bg-muted/40"
          aria-label={`${n} / 5`}
        >
          <Star
            className={cn(
              "h-5 w-5",
              n <= value ? "fill-amber-400 text-amber-400" : "text-muted",
            )}
          />
        </button>
      ))}
    </div>
  );
}
