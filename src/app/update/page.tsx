"use client";

import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useTranslations } from "next-intl";

export type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  description: string;
  items?: string[];
  image?: string;
  button?: {
    url: string;
    text: string;
  };
};

export interface UpdatePageProps {
  title?: string;
  description?: string;
  entries?: ChangelogEntry[];
  className?: string;
}

const defaultEntries: ChangelogEntry[] = [
  {
    version: "Version 1.3.0",
    date: "15 November 2024",
    title: "Enhanced Analytics Dashboard",
    description:
      "We've completely redesigned our analytics dashboard to provide deeper insights and improved visualizations of your data.",
    items: [
      "Interactive data visualizations with real-time updates",
      "Customizable dashboard widgets",
      "Export analytics in multiple formats (CSV, PDF, Excel)",
      "New reporting templates for common use cases",
      "Improved data filtering and segmentation options",
    ],
  },
  {
    version: "Version 1.2.5",
    date: "7 October 2024",
    title: "Mobile App Launch",
    description:
      "We're excited to announce the launch of our mobile application, available now on iOS and Android platforms.",
    items: [
      "Native mobile experience for on-the-go productivity",
      "Offline mode support for working without internet connection",
      "Push notifications for important updates",
      "Biometric authentication for enhanced security",
    ],
  },
  {
    version: "Version 1.2.1",
    date: "23 September 2024",
    title: "New features and improvements",
    description:
      "Here are the latest updates and improvements to our platform. We are always working to improve our platform and your experience.",
    items: [
      "Added new feature to export data",
      "Improved performance and speed",
      "Fixed minor bugs and issues",
      "Added new feature to import data",
    ],
  },
  {
    version: "Version 1.0.0",
    date: "31 August 2024",
    title: "First version of our platform",
    description:
      "Introducing a new platform to help you manage your projects and tasks. We are excited to launch our platform and help you get started. We are always working to improve our platform and your experience.",
  },
];

const UpdatePage = ({ entries = defaultEntries }: UpdatePageProps) => {
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
    <section className="px-6 py-4 md:py-4">
      <div className="mx-auto max-w-2xl">
        <div className="space-y-12 md:space-y-16">
          {entries.map((entry) => (
            <article key={entry.version} className="space-y-4">
              {/* Header */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {entry.version}
                </Badge>
                <span className="text-xs text-muted-foreground">{entry.date}</span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-semibold md:text-2xl">{entry.title}</h2>

              {/* Description */}
              <p className="text-sm text-muted-foreground md:text-base">{entry.description}</p>

              {/* List */}
              {entry.items && (
                <ul className="ml-4 list-disc space-y-1.5 text-sm md:text-base text-muted-foreground">
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
