"use client";

import { useAnalyticsUserBinding, useAutoPageView } from "@/lib/analytics";
import React from "react";

const AnalyticsProvider = ({ children }: React.PropsWithChildren) => {
  useAnalyticsUserBinding();
  useAutoPageView();

  return null;
};

export default AnalyticsProvider;
