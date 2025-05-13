"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function OpportunityCardHorizontalSkeleton() {
  return (
    <div className="mx-auto max-w-md">
      <div className="flex overflow-hidden rounded-xl bg-background shadow-lg">
        <Skeleton className="h-[108px] w-[88px] flex-shrink-0 rounded-lg" />
        <div className="flex-1 px-4 py-3 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    </div>
  );
}
