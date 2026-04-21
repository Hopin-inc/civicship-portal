"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { AppLink } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthProvider";
import { GqlSysRole } from "@/types/graphql";

export default function SystemAdminSection() {
  const t = useTranslations();
  const { user } = useAuth();

  if (user?.sysRole !== GqlSysRole.SysAdmin) {
    return null;
  }

  return (
    <>
      <h2 className="text-sm mb-2 font-bold mt-6">
        {t("users.settings.systemAdminSectionTitle")}
      </h2>
      <AppLink
        href="/sysAdmin"
        skipPathResolution
        className="block w-full max-w-md mx-auto"
      >
        <Card className="transition-colors hover:bg-muted/50">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 py-4 px-4">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-bold text-sm">
                {t("users.settings.systemAdminLabel")}
              </span>
            </div>
          </CardContent>
        </Card>
      </AppLink>
    </>
  );
}
