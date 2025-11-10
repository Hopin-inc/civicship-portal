"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useTranslations } from "next-intl";
import type { ChangelogEntry, UpdatePageProps } from "./types";
import { CHANGELOG_ENTRIES } from "./entries";

export type { ChangelogEntry, UpdatePageProps };

const UpdatePage = ({ entries = CHANGELOG_ENTRIES }: UpdatePageProps) => {
  const t = useTranslations();

  const headerConfig = useMemo(
    () => ({
      title: t("users.settings.updatePageTitle"),
      showLogo: false,
      showBackButton: true,
    }),
    [t],
  );
  useHeaderConfig(headerConfig);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date)),
    [entries],
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
