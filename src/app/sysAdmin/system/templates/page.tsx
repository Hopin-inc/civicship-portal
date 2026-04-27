"use client";

import { useMemo } from "react";
import { Settings } from "lucide-react";
import { useAppRouter } from "@/lib/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { TemplateRow } from "@/app/sysAdmin/features/system/templates/list/components/TemplateRow";
import { useVariantSummaries } from "@/app/sysAdmin/features/system/templates/list/hooks/useVariantSummaries";
import { variantToSlug } from "@/app/sysAdmin/features/system/templates/shared/variantSlug";

export default function SysAdminSystemTemplatesPage() {
  const router = useAppRouter();
  const { summaries, loading, error } = useVariantSummaries();

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-body-sm text-muted-foreground pl-4">
          GENERATION テンプレート
        </h2>
        <Button
          onClick={() => router.push("/sysAdmin/system/templates/judge")}
          variant="tertiary"
          size="sm"
          className="gap-1"
        >
          <Settings className="h-4 w-4" />
          JUDGE 管理
        </Button>
      </div>

      {loading && summaries.every((s) => s.activeTemplateCount === 0) ? (
        <LoadingIndicator fullScreen={false} />
      ) : error ? (
        <ErrorState title="テンプレート一覧の取得に失敗しました" />
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
