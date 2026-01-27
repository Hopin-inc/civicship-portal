"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useTranslations, useLocale } from "next-intl";
import type { ChangelogEntry, UpdatePageProps } from "./types";
import { CHANGELOG_ENTRIES_JA, CHANGELOG_ENTRIES_EN } from "./entries";

export type { ChangelogEntry, UpdatePageProps };

const UpdatePage = ({ entries }: UpdatePageProps) => {
  const t = useTranslations();
  const locale = useLocale();

  const localizedEntries = useMemo(
    () => (locale.startsWith("ja") ? CHANGELOG_ENTRIES_JA : CHANGELOG_ENTRIES_EN),
    [locale],
  );

  const activeEntries = entries ?? localizedEntries;

  const title = t("users.settings.updatePageTitle");

  const headerConfig = useMemo(
    () => ({
      title,
      showLogo: false,
      showBackButton: true,
    }),
    [title],
  );
  useHeaderConfig(headerConfig);

  const sortedEntries = useMemo(
    () => [...activeEntries].sort((a, b) => b.date.localeCompare(a.date)),
    [activeEntries],
  );

  return (
    <section className="px-6 py-4 md:py-4">
      <div className="mx-auto max-w-2xl">
        <div className="space-y-6 md:space-y-10">
          {sortedEntries.map((entry, index) => (
            <article key={entry.date + index} className="space-y-4">
              {/* Header */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">{entry.date}</span>
              </div>

              {/* Title */}
              <h2 className="text-title-md font-semibold md:text-lg">{entry.title}</h2>

              {/* Description */}
              <p className="text-xs text-muted-foreground md:text-xs">{entry.description}</p>

              {/* List */}
              {entry.items && (
                <ul className="ml-4 list-disc space-y-1.5 text-xs md:text-xs text-muted-foreground">
                  {entry.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpdatePage;
