"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { locales, localeNames } from "@/lib/i18n/config";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const handleLocaleChange = (newLocale: string) => {
    document.cookie = `language=${newLocale}; path=/; max-age=31536000`;
    
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      {locales.map((loc) => (
        <Button
          key={loc}
          variant={locale === loc ? "default" : "outline"}
          size="sm"
          onClick={() => handleLocaleChange(loc)}
        >
          {localeNames[loc]}
        </Button>
      ))}
    </div>
  );
}
