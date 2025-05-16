"use client";

import React from "react";
import { useAnalyticsUserBinding, useAutoPageView } from "@/lib/analytics";

const AnalyticsProvider = ({ children }: React.PropsWithChildren) => {
  useAnalyticsUserBinding();
  useAutoPageView();

  return <>{children}</>;
};

export default AnalyticsProvider;
