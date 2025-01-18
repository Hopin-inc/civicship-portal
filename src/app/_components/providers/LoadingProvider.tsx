"use client";

import { useState } from "react";
import { LoadingContext } from "@/contexts/LoadingContext";
import Loading from "@/app/_components/layout/Loading";

const LoadingProvider = ({ children }: React.PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading && <Loading />}
      <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
        {children}
      </LoadingContext.Provider>
    </>
  );
};

export default LoadingProvider;
