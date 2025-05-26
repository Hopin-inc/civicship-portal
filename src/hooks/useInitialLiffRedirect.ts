import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export const useInitialLiffRedirect = () => {
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || hasRedirected.current) return;

    const searchParams = new URLSearchParams(window.location.search);
    const initial = searchParams.get("initial");

    if (window.location.pathname === "/" && initial && initial.startsWith("/") && initial !== "/") {
      hasRedirected.current = true; // 🛑 二度目以降スキップ
      console.log("🚀 Redirecting to initial path:", initial);
      router.replace(initial);
    }
  }, [router]);
};
