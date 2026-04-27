"use client";

import { useMemo } from "react";
import { Settings } from "lucide-react";
import { useAppRouter } from "@/lib/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import { TemplateRow } from "@/app/sysAdmin/features/system/templates/list/components/TemplateRow";
import { MOCK_VARIANT_SUMMARIES } from "@/app/sysAdmin/features/system/templates/shared/fixtures";
import { variantToSlug } from "@/app/sysAdmin/features/system/templates/shared/variantSlug";

export default function SysAdminSystemTemplatesPage() {
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

      <p className="text-body-xs text-muted-foreground mb-4 px-1">
        ※ 一覧は mock data。backend の reportTemplateStatsBreakdown 実装後に実データに置換。
      </p>

      <div className="flex flex-col">
        {MOCK_VARIANT_SUMMARIES.map((summary, idx) => {
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
    </div>
  );
}
