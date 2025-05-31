import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import clientLogger from "@/lib/logging/client";

export const useInitialLiffRedirect = () => {
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || hasRedirected.current) return;

    const searchParams = new URLSearchParams(window.location.search);
    const initial = searchParams.get("initial");

    if (initial && initial.startsWith("/") && initial !== window.location.pathname) {
      hasRedirected.current = true;
      clientLogger.debug("Redirecting to initial path", {
        initialPath: initial,
        component: "useInitialLiffRedirect"
      });
      router.replace(initial); // または window.location.replace(initial)
    }
  }, [router]);
};
