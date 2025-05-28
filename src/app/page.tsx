"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";
import FeaturedSectionSkeleton from "@/app/activities/components/FeaturedSection/FeaturedSectionSkeleton";
import OpportunitiesCarouselSectionSkeleton from "@/app/activities/components/CarouselSection/CarouselSectionSkeleton";
import ListSectionSkeleton from "@/app/activities/components/ListSection/ListSectionSkeleton";
import { extractSearchParamFromRelativePath } from "@/utils/path";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isAuthenticating, authenticationState, loading: authLoading } = useAuth();
  const { data: userData, loading: userLoading } = useQuery(GET_CURRENT_USER, {
    skip: !isAuthenticated,
  });
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  const authRedirectService = useMemo(() => {
    const AuthRedirectService = require("@/lib/auth/auth-redirect-service").AuthRedirectService;
    return AuthRedirectService.getInstance();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const liffState = searchParams.get("liff.state");

    if (liffState) {
      console.log("🚀 Detected return from LINE authentication, liff.state:", liffState);

      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

      if (isAuthenticating || authLoading || userLoading) {
        console.log("🚀 Auth state loading, waiting before redirect");
        return; // Wait for auth state to stabilize
      } else if (isAuthenticated) {
        const redirectPath = authRedirectService.getPostLineAuthRedirectPath(liffState);
        console.log("🚀 Authenticated, redirecting to:", redirectPath);
        router.replace(redirectPath);
        return;
      } else if (!isAuthenticating) {
        console.log("🚀 Not authenticated after processing, redirecting to login");
        const next = extractSearchParamFromRelativePath(liffState, "next");
        const redirectPath = next && next.startsWith("/") ? `/login?next=${next}` : "/login";
        router.replace(redirectPath);
        return;
      }
    }

    if (window.location.pathname === "/" &&
        !window.location.href.includes("liff.state") &&
        !window.location.href.includes("login")) {
      router.replace("/activities");
    }
  }, [router, isAuthenticated, authenticationState, userData, authLoading, userLoading, isAuthenticating, authRedirectService]);

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
