"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FeaturedSectionSkeleton from "@/app/activities/components/FeaturedSection/FeaturedSectionSkeleton";
import OpportunitiesCarouselSectionSkeleton from "@/app/activities/components/CarouselSection/CarouselSectionSkeleton";
import ListSectionSkeleton from "@/app/activities/components/ListSection/ListSectionSkeleton";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.location.pathname === "/") {
      router.replace("/activities");
    }
  }, [router]);

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
