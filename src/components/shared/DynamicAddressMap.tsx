import dynamic from "next/dynamic";
import React from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

const AddressMap = dynamic(() => import("./AddressMap"), {
  ssr: false,
  loading: () => <LoadingIndicator fullScreen />
});

export default AddressMap;
