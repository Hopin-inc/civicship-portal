"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { ErrorState } from "@/components/shared/ErrorState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { slugToVariant } from "@/app/sysAdmin/features/system/templates/shared/variantSlug";
import { variantLabel } from "@/app/sysAdmin/features/system/templates/shared/labels";
import { GenerationTemplateContainer } from "@/app/sysAdmin/features/system/templates/editor/components/GenerationTemplateContainer";
import { JudgeTemplateContainer } from "@/app/sysAdmin/features/system/templates/editor/components/JudgeTemplateContainer";

export default function SysAdminSystemTemplateDetailPage() {
  const params = useParams<{ variant: string }>();
  const variant = slugToVariant(params.variant);

  const headerConfig = useMemo(
    () => ({
      title: variant ? variantLabel(variant) : "テンプレート詳細",
      showBackButton: true,
      showLogo: false,
    }),
    [variant],
  );
  useHeaderConfig(headerConfig);

  if (!variant) {
    return (
      <div className="max-w-xl mx-auto mt-8 px-4">
        <ErrorState title={`未対応の variant: ${params.variant}`} />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-8 px-4">
      <Tabs defaultValue="generation" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="generation">生成用</TabsTrigger>
          <TabsTrigger value="judge">評価用</TabsTrigger>
        </TabsList>
        <TabsContent value="generation">
          <GenerationTemplateContainer variant={variant} />
        </TabsContent>
        <TabsContent value="judge">
          <JudgeTemplateContainer variant={variant} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
