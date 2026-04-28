"use client";

import { useEffect } from "react";
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
  /** 過去に投稿済みの feedback (= myFeedback)。あれば「投稿済み」として下に表示する。 */
  existingFeedback?: GqlReportFeedbackFieldsFragment | null;
  saving: boolean;
  saveError: { message: string } | null;
  onSubmit: (input: FeedbackFormInput) => void;
};

/**
 * sysAdmin 代行投稿用 feedback フォーム。
 *
 * `submitReportFeedback` の input そのまま (rating + comment + feedbackType)
 * を扱う。送信は container 側で mutation + cache 更新を行うので、本コンポーネント
 * は入力 UI と onSubmit 通知だけに責務を絞る。
 *
 * 入力部品はすべて shadcn / radix primitives:
 *   - Form (react-hook-form + zod)
 *   - ToggleGroup type="single" (rating の星選択 / feedbackType の chip 選択)
 *   - Textarea (comment)
 */
export function ReportFeedbackForm({
  existingFeedback,
  saving,
  saveError,
  onSubmit,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      feedbackType: null,
      comment: "",
    },
  });

  // 投稿成功で saving が false に戻ったタイミングで form をリセットする。
  // saveError がある場合は入力を残してもう一度送れるようにしておく。
  useEffect(() => {
    if (!saving && form.formState.isSubmitSuccessful && !saveError) {
      form.reset({ rating: 0, feedbackType: null, comment: "" });
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
    <section className="space-y-3 rounded border border-border p-4">
      <h3 className="text-body-sm font-semibold">フィードバックを投稿</h3>

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
                    rows={4}
                    className="text-body-sm"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {saveError && (
            <p className="text-body-xs text-destructive">{saveError.message}</p>
          )}

          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "送信中..." : "送信"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
