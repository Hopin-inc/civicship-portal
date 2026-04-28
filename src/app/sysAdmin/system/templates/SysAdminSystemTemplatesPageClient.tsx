"use client";

import { useMemo } from "react";
import { useAppRouter } from "@/lib/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { TemplateRow } from "@/app/sysAdmin/features/system/templates/list/components/TemplateRow";
import { variantToSlug } from "@/app/sysAdmin/features/system/templates/shared/variantSlug";
import type { VariantSummary } from "@/app/sysAdmin/features/system/templates/shared/aggregate";

type Props = {
  /**
   * variant 一覧は GENERATION のみ表示する。JUDGE は内部評価用で
   * variant 詳細ページの [評価用] タブから確認する想定。
   */
  summaries: VariantSummary[];
};

export function SysAdminSystemTemplatesPageClient({ summaries }: Props) {
  const router = useAppRouter();

  const headerConfig = useMemo(
    () => ({
      title: "テンプレート",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="p-4 max-w-xl mx-auto">
      {summaries.every((s) => s.activeTemplateCount === 0) ? (
        <p className="text-body-sm text-muted-foreground py-8 text-center">
          登録されているテンプレートはありません
        </p>
      ) : (
        <div className="flex flex-col">
          {summaries.map((summary, idx) => {
            const slug = variantToSlug(summary.variant);
            return (
              <div key={summary.variant}>
                {idx !== 0 && <hr className="border-muted" />}
                <TemplateRow
                  summary={summary}
                  onClick={
                    slug
                      ? () => router.push(`/sysAdmin/system/templates/${slug}`)
                      : undefined
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
