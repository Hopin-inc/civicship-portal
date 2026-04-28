"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  systemPrompt: z.string().min(1, "system prompt は必須です"),
  userPromptTemplate: z.string().min(1, "user prompt template は必須です"),
});

export type PromptFormValues = z.infer<typeof formSchema>;

type Props = {
  initialSystemPrompt: string;
  initialUserPromptTemplate: string;
  saving: boolean;
  saveError?: { message: string } | null;
  onSubmit: (values: PromptFormValues) => void;
};

/**
 * Prompt 編集の主役 UI。shadcn `Form` (react-hook-form + zod) ベース。
 *
 * version / model / experimentKey 等のメタデータは ExperimentSection の
 * table と重複するため、ここでは表示しない (= 親 View が MetadataChips
 * で集約表示する)。
 *
 * `initial*` prop が変わったとき (例: 親で `router.refresh()` 後に
 * SSR data が再投入されたとき) は内部 form を `form.reset` で同期する。
 */
export function PromptEditor({
  initialSystemPrompt,
  initialUserPromptTemplate,
  saving,
  saveError,
  onSubmit,
}: Props) {
  const form = useForm<PromptFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      systemPrompt: initialSystemPrompt,
      userPromptTemplate: initialUserPromptTemplate,
    },
  });

  useEffect(() => {
    form.reset({
      systemPrompt: initialSystemPrompt,
      userPromptTemplate: initialUserPromptTemplate,
    });
  }, [initialSystemPrompt, initialUserPromptTemplate, form]);

  const isDirty = form.formState.isDirty;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="systemPrompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-body-sm font-semibold">
                system prompt
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={saving}
                  className="min-h-[240px] font-mono text-body-xs"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userPromptTemplate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-body-sm font-semibold">
                user prompt template
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={saving}
                  className="min-h-[240px] font-mono text-body-xs"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {saveError && (
          <p className="text-body-sm text-destructive">
            保存に失敗しました: {saveError.message}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!isDirty || saving}
          >
            {saving ? "保存中..." : isDirty ? "保存" : "変更なし"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
