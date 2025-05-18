import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { phoneVerificationState } from "@/lib/firebase/firebase";
import startPhoneNumberVerification from "@/contexts/auth/phone/startPhoneNumberVerticication";
import verifyPhoneCode from "@/contexts/auth/phone/verifyPhoneCode";
import { setCookies } from "@/contexts/auth/cookie";

/**
 * Phone authentication hook for handling phone number verification
 */
const usePhoneAuth = () => {
  const router = useRouter();
  const cookies = useCookies();

  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(phoneVerificationState.verified);

  useEffect(() => {
    if (isPhoneVerified !== phoneVerificationState.verified) {
      console.log("Initializing phone verification state from global state:", {
        local: isPhoneVerified,
        global: phoneVerificationState.verified,
      });
      setIsPhoneVerified(phoneVerificationState.verified);
    }
  }, []);

  /**
   * Start phone verification process with the given phone number
   */
  const startPhoneVerification = async (
    phoneNumber: string,
    uid: string | null = null,
  ): Promise<boolean> => {
    if (!uid) {
      toast.error("LINEログインが必要です");
      toast.info("電話番号認証の前にLINEログインを完了してください");
      router.push("/login"); // Redirect to login page
      return false;
    }

    setIsVerifying(true);
    try {
      const verId = await startPhoneNumberVerification(phoneNumber, null, null);
      setVerificationId(verId);
      setPhoneNumber(phoneNumber);
      return true;
    } catch (error) {
      console.error("Failed to start phone verification:", error);

      if (error instanceof Error) {
        if (error.message.includes("network")) {
          toast.error(
            "ネットワーク接続に問題が発生しました。インターネット接続を確認してください。",
            {
              action: {
                label: "再試行",
                onClick: () => window.location.reload(),
              },
              duration: 10000,
            },
          );
        } else if (error.message.includes("too-many-requests")) {
          toast.error("リクエストが多すぎます。しばらく待ってから再度お試しください。");
        } else if (error.message.includes("captcha")) {
          toast.error("reCAPTCHA検証に失敗しました。再度お試しください。");
        } else {
          toast.error("電話番号認証の開始に失敗しました");
        }
      } else {
        toast.error("電話番号認証の開始に失敗しました");
      }

      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Verify phone code entered by the user
   */
  const verifyPhoneCodeLocal = async (code: string): Promise<boolean> => {
    if (!verificationId) {
      toast.error("認証IDがありません。もう一度電話番号を入力してください");
      return false;
    }

    setIsVerifying(true);
    try {
      const success = await verifyPhoneCode(verificationId, code, null);

      if (success) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (phoneVerificationState.phoneUid) {
          setCookies(
            cookies,
            phoneVerificationState.authToken,
            phoneVerificationState.refreshToken,
            phoneVerificationState.tokenExpiresAt,
            "phone",
          );

          console.log("Phone verification successful with tokens:", {
            phoneUid: phoneVerificationState.phoneUid,
            authToken: phoneVerificationState.authToken ? "present" : "missing",
            refreshToken: phoneVerificationState.refreshToken ? "present" : "missing",
            tokenExpiresAt: phoneVerificationState.tokenExpiresAt,
            verified: phoneVerificationState.verified,
          });

          if (!phoneVerificationState.verified) {
            phoneVerificationState.verified = true;
            console.log("Updated global verification state to true");
          }

          setIsPhoneVerified(true);

          toast.success("電話番号認証が完了しました");

          setTimeout(() => {
            router.push("/sign-up");
          }, 100);

          return true;
        } else {
          toast.error("電話番号認証IDが取得できませんでした", {
            action: {
              label: "再試行",
              onClick: () => window.location.reload(),
            },
            duration: 10000,
          });
          return false;
        }
      } else {
        toast.error("認証コードの検証に失敗しました", {
          action: {
            label: "再入力",
            onClick: () => document.getElementById("verification-code")?.focus(),
          },
          duration: 10000,
        });
        return false;
      }
    } catch (error) {
      console.error("Failed to verify phone code:", error);

      if (error instanceof Error) {
        if (error.message.includes("network")) {
          toast.error(
            "ネットワーク接続に問題が発生しました。インターネット接続を確認してください。",
            {
              action: {
                label: "再試行",
                onClick: () => window.location.reload(),
              },
              duration: 10000,
            },
          );
        } else if (error.message.includes("code-expired")) {
          toast.error("認証コードの有効期限が切れました。新しいコードを取得してください。", {
            action: {
              label: "再送信",
              onClick: () => router.push("/sign-up/phone-verification"),
            },
            duration: 10000,
          });
        } else if (error.message.includes("invalid-verification-code")) {
          toast.error("無効な認証コードです。正しいコードを入力してください。");
        } else {
          toast.error("認証コードの検証に失敗しました");
        }
      } else {
        toast.error("認証コードの検証に失敗しました");
      }

      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const getIsPhoneVerified = (): boolean => {
    return isPhoneVerified;
  };

  return {
    phoneNumber,
    isVerifying,
    verificationId,
    isPhoneVerified: getIsPhoneVerified(),
    phoneUid: phoneVerificationState.phoneUid,
    startPhoneVerification,
    verifyPhoneCode: verifyPhoneCodeLocal,
    setIsPhoneVerified,
  };
};

export default usePhoneAuth;
