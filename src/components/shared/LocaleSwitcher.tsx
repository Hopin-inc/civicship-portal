"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { locales, localeNames } from "@/lib/i18n/config";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [changingTo, setChangingTo] = useState<string | null>(null);

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return;
    
    setChangingTo(newLocale);
    document.cookie = `language=${newLocale}; path=/; max-age=31536000`;
    
    startTransition(() => {
      router.refresh();
      setChangingTo(null);
    });
  };

  return (
    <div className="flex gap-2" role="group" aria-label="Language selector">
      {locales.map((loc) => {
        const isActive = locale === loc;
        const isChanging = changingTo === loc;
        
        return (
          <Button
            key={loc}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => handleLocaleChange(loc)}
            disabled={isPending}
            aria-label={`Switch to ${localeNames[loc]}`}
            aria-current={isActive ? "true" : undefined}
          >
            {isChanging ? "..." : localeNames[loc]}
          </Button>
        );
      })}
    </div>
  );
}
