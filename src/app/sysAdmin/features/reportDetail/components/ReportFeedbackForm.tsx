"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  comment: string | null;
};

const FEEDBACK_TYPES = Object.keys(FEEDBACK_TYPE_LABELS) as GqlReportFeedbackType[];

const formSchema = z.object({
  rating: z
    .number({ required_error: "評価を選んでください" })
    .int()
    .min(1, "評価を選んでください")
    .max(5),
  feedbackType: z.nativeEnum(GqlReportFeedbackType).nullable(),
  comment: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  /** 過去に投稿済みの feedback (= myFeedback)。あれば「投稿済み」として上に表示する。 */
  existingFeedback?: GqlReportFeedbackFieldsFragment | null;
  /** comment 欄の初期値。ハイライト経由起動時の引用 prefix を流し込むのに使う。 */
  prefillComment?: string;
  saving: boolean;
  saveError: { message: string } | null;
  onSubmit: (input: FeedbackFormInput) => void;
  /** submit ボタンの右に並べる追加 action (modal の Cancel など)。 */
  trailing?: React.ReactNode;
};

/**
 * sysAdmin 代行投稿用 feedback フォーム本体。
 *
 * 自身は section / 見出しを持たず、modal でも inline でも貼り込めるよう
 * 入力フィールドと送信ボタンだけを描画する。`prefillComment` が変わったら
 * (例: 別箇所をハイライトしてモーダルを開き直したとき) form を reset する。
 */
export function ReportFeedbackForm({
  existingFeedback,
  prefillComment,
  saving,
  saveError,
  onSubmit,
  trailing,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      feedbackType: null,
      comment: prefillComment ?? "",
    },
  });

  // prefillComment の差し替えに追従する。ユーザーが入力中の場合は上書きしないよう、
  // 「空 もしくは 直前の prefill のまま (= dirty じゃない)」のときだけ書き換える。
  const prevPrefill = useRef(prefillComment ?? "");
  useEffect(() => {
    const next = prefillComment ?? "";
    if (next === prevPrefill.current) return;
    const currentComment = form.getValues("comment") ?? "";
    const oldPrefill = prevPrefill.current;
    prevPrefill.current = next;
    if (currentComment === "" || currentComment === oldPrefill) {
      form.setValue("comment", next, { shouldDirty: false });
    }
  }, [prefillComment, form]);

  // 投稿成功で saving が false に戻ったタイミングで form をリセットする。
  // saveError がある場合は入力を残してもう一度送れるようにしておく。
  useEffect(() => {
    if (!saving && form.formState.isSubmitSuccessful && !saveError) {
      form.reset({ rating: 0, feedbackType: null, comment: "" });
      prevPrefill.current = "";
    }
  }, [saving, saveError, form]);

  const handleValid = (values: FormValues) => {
    onSubmit({
      rating: values.rating,
      feedbackType: values.feedbackType,
      comment:
        values.comment != null && values.comment.trim() !== ""
          ? values.comment.trim()
          : null,
    });
  };

  return (
    <div className="space-y-3">
      {existingFeedback && (
        <p className="text-body-xs text-muted-foreground">
          自分の最新投稿: {existingFeedback.rating} / 5
          {existingFeedback.comment ? ` · ${existingFeedback.comment}` : ""}
        </p>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleValid)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-body-xs">評価</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    value={field.value > 0 ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(v ? Number(v) : 0)}
                    className="justify-start"
                    aria-label="評価"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <ToggleGroupItem
                        key={n}
                        value={String(n)}
                        aria-label={`${n} / 5`}
                        className="h-9 w-9 px-0"
                      >
                        <Star
                          className={cn(
                            "h-5 w-5",
                            n <= field.value
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground",
                          )}
                        />
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="feedbackType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-body-xs">種類 (任意)</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    value={field.value ?? ""}
                    onValueChange={(v) =>
                      field.onChange(v ? (v as GqlReportFeedbackType) : null)
                    }
                    className="flex-wrap justify-start"
                    aria-label="種類"
                  >
                    {FEEDBACK_TYPES.map((t) => (
                      <ToggleGroupItem
                        key={t}
                        value={t}
                        className="h-7 px-2 text-body-xs"
                      >
                        {feedbackTypeLabel(t)}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-body-xs">
                  コメント (任意)
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    rows={5}
                    className="text-body-sm"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {saveError && (
            <p className="text-body-xs text-destructive">{saveError.message}</p>
          )}

          <div className="flex justify-end gap-2">
            {trailing}
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "送信中..." : "送信"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
