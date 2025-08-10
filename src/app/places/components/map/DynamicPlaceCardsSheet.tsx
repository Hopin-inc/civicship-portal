"use client";

import dynamic from "next/dynamic";
import React from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

const PlaceCardsSheet = dynamic(() => import("./PlaceCardsSheet"), {
  ssr: false,
  loading: () => <LoadingIndicator fullScreen />
});

export default PlaceCardsSheet;
