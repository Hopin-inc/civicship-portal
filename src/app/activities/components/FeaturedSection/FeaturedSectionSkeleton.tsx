"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedSectionSkeleton() {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      {/* 上部見出しエリア */}
      <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/60 to-transparent py-10 px-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-10 w-48" />
      </div>

      {/* カルーセル領域 */}
      <div className="embla h-full">
        <div className="embla__container h-full">
          <div className="embla__slide relative h-full w-full flex-[0_0_100%]">
            {/* 背景画像のスケルトン */}
            <Skeleton className="absolute inset-0" />

            {/* カードのスケルトン */}
            <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-8 pt-16">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
