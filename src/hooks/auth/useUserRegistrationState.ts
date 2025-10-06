// "use client";
//
// import { useEffect, useRef } from "react";
// import { AuthStateManager } from "@/lib/auth/auth-state-manager";
// import { GqlCurrentUserQuery } from "@/types/graphql";
// import { logger } from "@/lib/logging";
// import { useAuthStore } from "@/hooks/auth/auth-store";
//
// interface UseUserRegistrationStateProps {
//   authStateManager: AuthStateManager | null;
//   userData: GqlCurrentUserQuery | undefined;
// }
//
// export const useUserRegistrationState = ({
//   authStateManager,
//   userData,
// }: UseUserRegistrationStateProps) => {
//   const setState = useAuthStore((s) => s.setState);
//
//   const processedUserIdRef = useRef<string | null>(null);
//   const authStateManagerRef = useRef(authStateManager);
//   authStateManagerRef.current = authStateManager;
//
//   useEffect(() => {
//     if (userData?.currentUser?.user) {
//       const userId = userData.currentUser.user.id;
//
//       if (processedUserIdRef.current === userId) {
//         return;
//       }
//
//       processedUserIdRef.current = userId;
//
//       setState({
//         currentUser: userData.currentUser.user,
//         authenticationState: "user_registered",
//       });
//
//       const currentAuthStateManager = authStateManagerRef.current;
//       if (currentAuthStateManager) {
//         const updateUserRegistrationState = async () => {
//           try {
//             await currentAuthStateManager.handleUserRegistrationStateChange(true);
//           } catch (error) {
//             logger.error("Failed to update AuthStateManager user registration state", {
//               error: error instanceof Error ? error.message : String(error),
//               component: "useUserRegistrationState",
//             });
//           }
//         };
//
//         updateUserRegistrationState();
//       }
//     } else {
//       processedUserIdRef.current = null;
//     }
//   }, [userData, setState]);
// };
