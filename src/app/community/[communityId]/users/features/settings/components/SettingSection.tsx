"use client";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Contact, Globe, PlusCircle } from "lucide-react";
import { AppLink } from "@/lib/navigation";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { useUserProfileContext } from "@/app/community/[communityId]/users/features/shared/contexts/UserProfileContext";
import { GqlSysRole } from "@/types/graphql";
export default function SettingSection() {
  const t = useTranslations();
  const communityConfig = useCommunityConfig();
  const { gqlUser } = useUserProfileContext();
  const isSysAdmin = gqlUser?.sysRole === GqlSysRole.SysAdmin;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-0">
        <div className="flex items-center justify-between py-4 px-4 border-b">
          <div className="flex items-center gap-2">
            <Contact className="w-5 h-5" />
            <span className="font-bold text-sm">{t("users.settings.profileLabel")}</span>
          </div>
          <AppLink
            href="/users/me/edit"
            className={cn(
              buttonVariants({ variant: "tertiary", size: "sm" }),
              "ml-auto text-black w-24",
            )}
          >
            {t("users.settings.editButton")}
          </AppLink>
        </div>

        {isSysAdmin && (
          <div className="flex items-center justify-between py-4 px-4 border-b">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              <span className="font-bold text-sm">コミュニティを作成</span>
            </div>
            <AppLink
              href="/admin/communities/create"
              className={cn(
                buttonVariants({ variant: "tertiary", size: "sm" }),
                "ml-auto text-black w-24",
              )}
            >
              作成
            </AppLink>
          </div>
        )}

        {communityConfig?.enableFeatures?.includes("languageSwitcher") && (
          <div className="flex items-center justify-between py-4 px-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span className="font-bold text-sm">{t("users.settings.languageLabel")}</span>
            </div>
            <LocaleSwitcher />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
