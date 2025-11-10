"use client";
import {
  AccountSection,
  DangerSection,
  PromiseSection,
  SettingSection,
} from "@/app/users/features/settings";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useTranslations } from "next-intl";
import UpdateSection from "@/app/users/features/settings/components/UpdateSection";

export default function SettingPage() {
  const t = useTranslations();
  const headerConfig = useMemo(
    () => ({
      title: t("users.settings.pageTitle"),
      showLogo: false,
      showBackButton: true,
    }),
    [t],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="container mx-auto px-6 pt-6">
      <h2 className="text-sm mb-2 font-bold">{t("users.settings.accountSectionTitle")}</h2>
      <AccountSection />
      <h2 className="text-sm mb-2 font-bold mt-6">{t("users.settings.settingsSectionTitle")}</h2>
      <SettingSection />
      {/* TODO : 表示可能になるまでコメントアウト */}
      {/* <h2 className="text-sm mb-2 font-bold mt-6">ヘルプ</h2>
      <HelpSection /> */}
      <h2 className="text-sm mb-2 font-bold mt-6">{t("users.settings.promiseSectionTitle")}</h2>
      <PromiseSection />
      <h2 className="text-sm mb-2 font-bold mt-6">{t("users.settings.dangerSectionTitle")}</h2>
      <DangerSection />
      <h2 className="text-sm mb-2 font-bold mt-6">{t("users.settings.dangerSectionTitle")}</h2>
      <UpdateSection />
    </div>
  );
}
