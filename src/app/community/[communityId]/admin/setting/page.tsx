"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { useCommunityProfileEditor } from "./hooks/useCommunityProfileEditor";
import { CommunitySettingForm } from "./components/CommunitySettingForm";

export default function CommunitySettingPage() {
  const t = useTranslations();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId;

  const headerConfig = useMemo(
    () => ({
      title: t("adminSetting.page.title"),
      showBackButton: true,
      backTo: "/admin",
      showLogo: false,
    }),
    [t],
  );
  useHeaderConfig(headerConfig);

  const editor = useCommunityProfileEditor(communityId);

  if (editor.queryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-muted-foreground">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <CommunitySettingForm editor={editor} onSubmit={editor.onSubmit} />
    </div>
  );
}
