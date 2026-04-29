"use client";

import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { APP_TIMEZONE } from "@/lib/constants";

dayjs.extend(utc);
dayjs.extend(timezone);

interface VoteUpcomingNoticeProps {
  startsAt: Date;
}

export function VoteUpcomingNotice({ startsAt }: VoteUpcomingNoticeProps) {
  const t = useTranslations();
  const formatted = dayjs(startsAt).tz(APP_TIMEZONE).format("M/D HH:mm");

  return (
    <Card className="text-center">
      <CardContent className="py-8 space-y-3">
        <Clock className="h-8 w-8 text-muted-foreground mx-auto" />
        <p className="text-sm font-medium">{t("votes.upcoming.message")}</p>
        <p className="text-xs text-muted-foreground">
          {t("votes.upcoming.startsAt", { date: formatted })}
        </p>
      </CardContent>
    </Card>
  );
}
