import { ReactNode, useEffect } from "react";
import { FieldPath, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { createVoteTopicSchema } from "../validation/schema";
import { VoteTopicFormValues } from "../types/form";
import { makeDefaultFormValues } from "./fixtures";

interface FormErrorSpec {
  path: FieldPath<VoteTopicFormValues>;
  message: string;
}

interface VoteFormHarnessProps {
  defaultValues?: Partial<VoteTopicFormValues>;
  /** 強制的にセットしたいエラー（zod resolver を介さず UI だけ確認したいケース向け） */
  errors?: FormErrorSpec[];
  children: ReactNode;
}

/**
 * Storybook で form 配下のコンポーネントを描画するためのハーネス。
 *
 * - 実コードの `useVoteTopicEditor` と同じ zodResolver を使うので
 *   バリデーションメッセージ表示をそのまま再現できる。
 * - `errors` を渡した場合は `setError` で強制的にエラーを付与する。
 *   （ユーザー操作なしでエラー UI を確認したいとき用）
 */
export function VoteFormHarness({
  defaultValues,
  errors,
  children,
}: VoteFormHarnessProps) {
  const t = useTranslations();
  const schema = createVoteTopicSchema(t as (k: string) => string);
  const form = useForm<VoteTopicFormValues>({
    resolver: zodResolver(schema),
    defaultValues: makeDefaultFormValues(defaultValues),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!errors) return;
    for (const { path, message } of errors) {
      form.setError(path, { type: "manual", message });
    }
  }, [errors, form]);

  return <FormProvider {...form}>{children}</FormProvider>;
}

/**
 * Storybook decorator として使いやすいラッパ。各 Story に適用する。
 */
export function withVoteForm(
  options: {
    defaultValues?: Partial<VoteTopicFormValues>;
    errors?: FormErrorSpec[];
  } = {},
) {
  function VoteFormDecorator(Story: () => ReactNode) {
    return (
      <VoteFormHarness defaultValues={options.defaultValues} errors={options.errors}>
        {Story()}
      </VoteFormHarness>
    );
  }
  return VoteFormDecorator;
}
