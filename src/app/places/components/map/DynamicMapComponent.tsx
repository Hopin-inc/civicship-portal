import dynamic from "next/dynamic";
import React from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <LoadingIndicator fullScreen />
});

export default MapComponent;
