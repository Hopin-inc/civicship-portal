"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function OpportunityCardSkeleton() {
  return (
    <div className="w-[164px] flex-shrink-0">
      <Skeleton className="w-[164px] h-[205px] rounded-lg" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
