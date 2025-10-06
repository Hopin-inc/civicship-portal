// "use client";
//
// import { useEffect, useRef } from "react";
// import { toast } from "sonner";
// import { useAuthStore } from "@/hooks/auth/auth-store";
//
// interface UseTokenExpirationHandlerProps {
//   logout: () => Promise<void>;
// }
//
// export const useTokenExpirationHandler = ({ logout }: UseTokenExpirationHandlerProps) => {
//   const state = useAuthStore((s) => s.state);
//   const setState = useAuthStore((s) => s.setState);
//
//   const stateRef = useRef(state);
//   stateRef.current = state;
//
//   useEffect(() => {
//     const handleTokenExpired = (event: Event) => {
//       const customEvent = event as CustomEvent<{ source: string }>;
//       const { source } = customEvent.detail;
//
//       if (source === "graphql" || source === "network") {
//         const currentState = stateRef.current.authenticationState;
//
//         if (currentState === "line_authenticated" || currentState === "user_registered") {
//           setState({ authenticationState: "line_token_expired" });
//           if (typeof window !== "undefined") {
//             const event = new CustomEvent("auth:renew-line-token", { detail: {} });
//             window.dispatchEvent(event);
//           }
//           return;
//         }
//
//         if (currentState === "phone_authenticated") {
//           setState({ authenticationState: "phone_token_expired" });
//           if (typeof window !== "undefined") {
//             const event = new CustomEvent("auth:renew-phone-token", { detail: {} });
//             window.dispatchEvent(event);
//           }
//           return;
//         }
//
//         toast.error("認証の有効期限が切れました", {
//           description: "再度ログインしてください",
//         });
//         logout();
//       }
//     };
//
//     if (typeof window !== "undefined") {
//       window.addEventListener("auth:token-expired", handleTokenExpired);
//     }
//
//     return () => {
//       if (typeof window !== "undefined") {
//         window.removeEventListener("auth:token-expired", handleTokenExpired);
//       }
//     };
//   }, [setState, logout]);
// };
