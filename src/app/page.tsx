"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";
import FeaturedSectionSkeleton from "@/app/activities/components/FeaturedSection/FeaturedSectionSkeleton";
import OpportunitiesCarouselSectionSkeleton from "@/app/activities/components/CarouselSection/CarouselSectionSkeleton";
import ListSectionSkeleton from "@/app/activities/components/ListSection/ListSectionSkeleton";
import { extractSearchParamFromRelativePath } from "@/utils/path";
import logger from "@/lib/logging";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isAuthenticating, loading: authLoading } = useAuth();
  const { data: userData, loading: userLoading } = useQuery(GET_CURRENT_USER, {
    skip: !isAuthenticated,
  });
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const liffState = searchParams.get("liff.state");

    if (liffState) {
      logger.info("Detected return from LINE authentication", {
        component: "HomePage",
        liffState
      });

      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

      if (isAuthenticating || authLoading || userLoading) {
        logger.debug("Auth state loading, waiting before redirect", {
          component: "HomePage",
          isAuthenticating,
          authLoading,
          userLoading
        });
        return; // Wait for auth state to stabilize
      } else if (isAuthenticated) {
        if (!userData?.currentUser) {
          logger.info("No user data, redirecting to phone verification", {
            component: "HomePage",
            isAuthenticated,
            redirectPath: "/sign-up/phone-verification"
          });
          let signUpWithNext = "/sign-up/phone-verification";
          if (nextPath) {
            signUpWithNext += `?next=${ encodeURIComponent(nextPath) }`;
          }
          router.replace(signUpWithNext);
          return;
        }

        if (liffState.startsWith("/")) {
          logger.info("Redirecting to liff.state path", {
            component: "HomePage",
            redirectPath: liffState
          });
          router.replace(liffState);
          return;
        }
      } else {
        logger.info("Not authenticated, redirecting to login", {
          component: "HomePage",
          liffState,
          hasNext: !!extractSearchParamFromRelativePath(liffState, "next")
        });
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
  }, [router, isAuthenticated, userData, authLoading, userLoading, isAuthenticating]);

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
