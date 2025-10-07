// "use client";
//
// import { useEffect, useRef } from "react";
// import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
// import { AuthStateManager } from "@/lib/auth/auth-state-manager";
// import { logger } from "@/lib/logging";
// import { useAuthStore } from "@/hooks/auth/auth-store";
//
// interface UsePhoneAuthStateProps {
//   authStateManager: AuthStateManager | null;
//   phoneAuthService: PhoneAuthService;
// }
//
// export const usePhoneAuthState = ({
//   authStateManager,
//   phoneAuthService,
// }: UsePhoneAuthStateProps) => {
//   const setState = useAuthStore((s) => s.setState);
//   const state = useAuthStore((s) => s.state);
//   const phoneAuth = useAuthStore((s) => s.phoneAuth);
//
//   const authStateManagerRef = useRef(authStateManager);
//   const phoneAuthServiceRef = useRef(phoneAuthService);
//
//   authStateManagerRef.current = authStateManager;
//   phoneAuthServiceRef.current = phoneAuthService;
//
//   useEffect(() => {
//     const currentAuthStateManager = authStateManagerRef.current;
//
//     if (!currentAuthStateManager) return;
//
//     const isVerified = phoneAuth.isVerified;
//
//     if (isVerified) {
//       const updatePhoneAuthState = async () => {
//         try {
//           await currentAuthStateManager.handlePhoneAuthStateChange(true);
//         } catch (error) {
//           logger.error("Failed to update AuthStateManager phone state in useEffect", {
//             error: error instanceof Error ? error.message : String(error),
//             component: "usePhoneAuthState",
//           });
//         }
//       };
//
//       updatePhoneAuthState();
//     }
//
//     if (isVerified) {
//       if (state.authenticationState === "line_authenticated") {
//         setState({ authenticationState: "phone_authenticated" });
//       }
//     }
//   }, [setState, state.authenticationState, phoneAuth.isVerified]);
// };
