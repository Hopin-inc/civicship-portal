"use client";

import dynamic from "next/dynamic";
import React from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

const ImagesCarousel = dynamic(() => import("./images-carousel"), {
  ssr: false,
  loading: () => <LoadingIndicator fullScreen />
});

export default ImagesCarousel;
