"use client";

import { useEffect } from "react";
import { app } from "@/lib/firebase";
import { getAnalytics } from "firebase/analytics";

const FirebaseAnalyticsProvider = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const analytics = getAnalytics(app);
        console.log("[Analytics] Firebase Analytics initialized successfully");
      } catch (error) {
        console.error("[Analytics] Failed to initialize Firebase Analytics:", error);
      }
    }
  }, []);

  return null;
};

export default FirebaseAnalyticsProvider;
