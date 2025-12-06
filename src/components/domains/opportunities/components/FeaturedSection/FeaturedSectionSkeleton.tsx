"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedSectionSkeleton() {
  return (
    <section className="w-full">
      <div className="relative h-[50vh] w-full overflow-hidden">
        <Skeleton className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      </div>
      <div className="px-4 -mt-16 relative z-10">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex overflow-hidden rounded-xl bg-background shadow-lg">
              <Skeleton className="h-[108px] w-[88px] flex-shrink-0 rounded-lg" />
              <div className="flex-1 px-4 py-3 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
