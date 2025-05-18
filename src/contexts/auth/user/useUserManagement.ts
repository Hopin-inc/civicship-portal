import { useState } from "react";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { auth, phoneVerificationState } from "@/lib/firebase/firebase";
import { GqlCurrentPrefecture, GqlUser } from "@/types/graphql";
import { Required } from "utility-types";
import { COMMUNITY_ID } from "@/utils";
import { removeCookies } from "@/contexts/auth/cookie";
import { getVerifiedPhoneNumber } from "@/contexts/auth/phone/utils";

/**
 * User management hook for handling user creation and logout
 */
export const useUserManagement = (
  userSignUpMutation: any,
  setUser: (user: any) => void,
  setUid: (uid: string | null) => void,
  liffLogout: () => void,
) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const cookies = useCookies();

  /**
   * Create a new user with the given details
   */
  const createUser = async (
    name: string,
    currentPrefecture: GqlCurrentPrefecture,
    phoneUid?: string | null,
    uid?: string | null,
  ): Promise<Required<Partial<GqlUser>, "id" | "name"> | null> => {
    try {
      if (!uid) {
        toast.error("LINEログインが必要です");
        toast.info("ユーザー登録の前にLINEログインを完了してください");
        return null;
      }

      const effectivePhoneUid = phoneUid || phoneVerificationState.phoneUid || undefined;
      const phoneNumber = getVerifiedPhoneNumber();
      console.log("Creating user with phone UID:", effectivePhoneUid);

      if (!phoneNumber) {
        throw new Error("No verified phone number found.");
      }

      const { data } = await userSignUpMutation({
        variables: {
          input: {
            name,
            currentPrefecture: currentPrefecture as any,
            communityId: COMMUNITY_ID,
            phoneUid: effectivePhoneUid,
            phoneNumber,
          },
        },
      });

      return data?.userSignUp?.user ?? null;
    } catch (error) {
      console.error("Failed to create user:", error);

      if (error instanceof Error && error.message.includes("Authentication required")) {
        toast.error("認証が不足しています。再度LINEログインを行ってください");
      } else {
        toast.error("ユーザー作成に失敗しました");
      }

      return null;
    }
  };

  /**
   * Logout the current user
   */
  const logout = async (): Promise<void> => {
    setIsAuthenticating(true);

    try {
      await auth.signOut();

      liffLogout();

      const response = await fetch("/api/logout", { method: "POST" });
      if (!response.ok) {
        console.warn("Backend logout failed:", response.status);
      }

      removeCookies(cookies);
      removeCookies(cookies, "phone");

      setUser(null);
      setUid(null);

      toast.success("ログアウトしました");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("ログアウトに失敗しました");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return {
    createUser,
    logout,
    isAuthenticating,
  };
};

export default useUserManagement;
