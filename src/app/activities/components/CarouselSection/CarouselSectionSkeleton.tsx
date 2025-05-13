"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface OpportunitiesCarouselSectionSkeletonProps {
  title: string;
}

export default function OpportunitiesCarouselSectionSkeleton({
  title,
}: OpportunitiesCarouselSectionSkeletonProps) {
  return (
    <section className="mt-6 px-6">
      <h2 className="text-display-md">{title}</h2>
      <div className="mt-6 flex gap-4 overflow-x-auto pb-8 scrollbar-hide">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-[164px] flex-shrink-0 space-y-2">
            <Skeleton className="w-[164px] h-[205px] rounded-lg" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </section>
  );
}
