import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export const useInitialLiffRedirect = () => {
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || hasRedirected.current) return;

    const searchParams = new URLSearchParams(window.location.search);
    const initial = searchParams.get("initial");

    if (initial && initial.startsWith("/") && initial !== window.location.pathname) {
      hasRedirected.current = true;
      console.log("🚀 Redirecting to initial path:", initial);
      router.replace(initial); // または window.location.replace(initial)
    }
  }, [router]);
};
