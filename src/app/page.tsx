"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLiff } from "@/contexts/LiffContext";
import FeaturedSectionSkeleton from "@/app/activities/components/FeaturedSection/FeaturedSectionSkeleton";
import OpportunitiesCarouselSectionSkeleton from "@/app/activities/components/CarouselSection/CarouselSectionSkeleton";
import ListSectionSkeleton from "@/app/activities/components/ListSection/ListSectionSkeleton";

const INITIAL_PATH_KEY = 'liff_initial_path';

export default function HomePage() {
  const router = useRouter();
  const { isLiffInitialized } = useLiff();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPath = sessionStorage.getItem(INITIAL_PATH_KEY);
      
      if (window.location.pathname === "/" && !savedPath) {
        if (isLiffInitialized) {
          console.log('Root page redirecting to /activities');
          router.push("/activities");
        } else {
          const timeoutId = setTimeout(() => {
            console.log('LIFF initialization timeout - redirecting to /activities anyway');
            router.push("/activities");
          }, 3000); // 3 second timeout
          
          return () => clearTimeout(timeoutId);
        }
      }
    }
  }, [router, isLiffInitialized]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen pb-16">
      <FeaturedSectionSkeleton />
      <OpportunitiesCarouselSectionSkeleton title={"もうすぐ開催予定"} />
      <ListSectionSkeleton />
    </div>
  );
}
