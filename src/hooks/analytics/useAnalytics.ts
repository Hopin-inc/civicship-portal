"use client";

import { analytics } from "@/lib/auth/firebase-config";
import { logEvent } from "firebase/analytics";
import { usePathname } from "next/navigation";
import { IEventName, IEventParamMap } from "@/types/analytics";
import logger from "@/lib/logging";

export const useAnalytics = () => {
  const pathname = usePathname();

  return <T extends IEventName>({ name, params }: { name: T; params: IEventParamMap[T] }) => {
    if (!analytics) {
      logger.warn("Analytics not initialized, skipping event", {
        component: "useAnalytics",
        eventName: name,
        path: pathname
      });
      return;
    }

    const enrichedParams = {
      ...params,
      normalized_path: pathname,
    };

    logEvent(analytics, name, enrichedParams);
  };
};
