"use client";

import { useLocale } from "next-intl";
import { useCommunityRouter } from "@/hooks/useCommunityRouter";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { localeNames, locales } from "@/lib/i18n/config";
import { useMutation } from "@apollo/client";
import { UPDATE_MY_PROFILE } from "@/graphql/account/user/mutation";
import { useAuth } from "@/contexts/AuthProvider";
import { logger } from "@/lib/logging";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useCommunityRouter();
  const [isPending, startTransition] = useTransition();
  const { user: currentUser } = useAuth();
  const [updateMyProfile] = useMutation(UPDATE_MY_PROFILE);

  const handleLocaleChange = async (newLocale: string) => {
    if (newLocale === locale) return;

    document.cookie = `language=${newLocale}; path=/; max-age=31536000`;

    if (currentUser) {
      try {
        await updateMyProfile({
          variables: {
            input: {
              name: currentUser.name,
              slug: currentUser.name,
              preferredLanguage: newLocale.toUpperCase(),
            },
            permission: { userId: currentUser.id },
          },
        });
      } catch (error) {
        logger.error("Failed to update language preference:");
      }
    }

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Select value={locale} onValueChange={handleLocaleChange} disabled={isPending}>
      <SelectTrigger className="w-[120px]" aria-label="Language selector">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {localeNames[loc]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
