import { signInWithCustomToken, updateProfile } from "@firebase/auth";
import { auth } from "@/lib/firebase/firebase";

// 状態管理を導入するためのカスタムフック
type AuthState = {
  isAuthenticating: boolean;
  isUpdating: boolean;
  error: string | null;
};

export const signInWithFirebase = async (
  customToken: string,
  profile: { displayName: string; pictureUrl?: string }, // pictureUrlは省略可能
  setAuthState: (state: AuthState) => void, // 状態更新関数
) => {
  setAuthState({ isAuthenticating: true, isUpdating: false, error: null }); // 認証開始

  try {
    const { user } = await signInWithCustomToken(auth, customToken);
    console.log("Firebase sign-in successful");

    const profilePictureUrl = profile.pictureUrl || "https://example.com/default-profile-pic.png"; // デフォルトURL
    const needsUpdate =
      user.displayName !== profile.displayName || user.photoURL !== profilePictureUrl;

    setAuthState({ isAuthenticating: false, isUpdating: true, error: null }); // プロファイル更新開始

    if (needsUpdate) {
      console.log("Updating user profile with new information");
      await updateProfile(user, {
        displayName: profile.displayName,
        photoURL: profilePictureUrl,
      });
      console.log("Profile updated successfully");
      setAuthState({ isAuthenticating: false, isUpdating: false, error: null }); // 更新完了
    } else {
      console.log("Profile unchanged, skipping update");
      setAuthState({ isAuthenticating: false, isUpdating: false, error: null }); // 更新不要
    }
  } catch (error) {
    setAuthState({
      isAuthenticating: false,
      isUpdating: false,
      error: "認証またはプロファイル更新に失敗しました",
    });

    if (error instanceof Error && error.message.includes("quota-exceeded")) {
      console.warn("Profile update failed due to quota exceeded");

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("auth:warning", {
            detail: {
              source: "firebase",
              warningType: "quota-exceeded",
              warningMessage:
                "プロファイル更新の制限に達しました。プロファイル情報は更新されていません。",
              originalError: error,
            },
          }),
        );
      }
    } else {
      console.error("Profile update failed:", error);
      throw error;
    }
  }

  console.log("LIFF authentication successful");
};
