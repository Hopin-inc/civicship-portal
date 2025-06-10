"use client";
// This component is to initialize Firebase Analytics (in a client component).
// It is supposed to be used in src/app/layout.tsx.
// Note: analytics is only initialized lazily inside useAnalyticsView()

import { useAnalyticsView } from "@/hooks/analytics/useAnalyticsView";

const FirebaseAnalytics = () => {
  useAnalyticsView();
  return null;
};

export default FirebaseAnalytics;
