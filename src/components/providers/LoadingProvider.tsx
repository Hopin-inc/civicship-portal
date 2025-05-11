"use client";

import React, { useState } from "react";
import { LoadingContext } from "@/contexts/LoadingContext";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

const LoadingProvider = ({ children }: React.PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading && <LoadingIndicator fullScreen={true} />}
      <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
        {children}
      </LoadingContext.Provider>
    </>
  );
};

export default LoadingProvider;
