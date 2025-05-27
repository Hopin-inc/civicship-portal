"use client";

import React from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function LineAuthLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadingIndicator />
      <p className="mt-4 text-center text-muted-foreground">
        認証情報を確認しています...
      </p>
    </div>
  );
}
