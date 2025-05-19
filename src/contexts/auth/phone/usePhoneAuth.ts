import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import startPhoneNumberVerification from "./startPhoneNumberVerticication";
import verifyPhoneCode, { PhoneVerificationResult } from "./verifyPhoneCode";
import { setCookies } from "@/contexts/auth/shared/cookie";
import { normalizePhoneNumber } from "./utils";

/**
 * Phone authentication hook for handling phone number verification
 */
const usePhoneAuth = (initialVerified: boolean = false) => {
  const router = useRouter();
  const cookies = useCookies();

  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(initialVerified);
  const [phoneUid, setPhoneUid] = useState<string | null>(null);

  useEffect(() => {
    if (isPhoneVerified !== initialVerified) {
      console.log("Updating phone verification state from parent:", {
        local: isPhoneVerified,
        parent: initialVerified
      });
      setIsPhoneVerified(initialVerified);
    }
  }, [initialVerified]);

  /**
   * Start phone verification process with the given phone number
   */
  const startPhoneVerification = async (
    phoneNumber: string,
    uid: string | null = null,
  ): Promise<boolean> => {
    if (!uid) {
      toast.error("LINEログインが必要です", { id: "line-login-required" });
      toast.info("電話番号認証の前にLINEログインを完了してください", { id: "line-login-required-info" });
      router.push("/login"); // Redirect to login page
      return false;
    }

    setIsVerifying(true);
    try {
      const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
      const verId = await startPhoneNumberVerification(normalizedPhoneNumber, null, null);
      setVerificationId(verId);
      setPhoneNumber(normalizedPhoneNumber);
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
              id: "phone-network-error"
            },
          );
        } else if (error.message.includes("too-many-requests")) {
          toast.error("リクエストが多すぎます。しばらく待ってから再度お試しください。", {
            id: "phone-too-many-requests"
          });
        } else if (error.message.includes("captcha")) {
          toast.error("reCAPTCHA検証に失敗しました。再度お試しください。", {
            id: "phone-captcha-error"
          });
        } else {
          toast.error("電話番号認証の開始に失敗しました", {
            id: "phone-verification-start-failed"
          });
        }
      } else {
        toast.error("電話番号認証の開始に失敗しました", {
          id: "phone-verification-start-failed-unknown"
        });
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
      toast.error("認証IDがありません。もう一度電話番号を入力してください", {
        id: "phone-verification-id-missing"
      });
      return false;
    }

    setIsVerifying(true);
    try {
      const result: PhoneVerificationResult = await verifyPhoneCode(
        verificationId, 
        code, 
        null,
        phoneNumber || ""
      );

      if (result.success) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (result.phoneUid) {
          setCookies(
            cookies,
            result.authToken,
            result.refreshToken,
            result.tokenExpiresAt,
            "phone",
          );

          console.log("Phone verification successful with tokens:", {
            phoneUid: result.phoneUid,
            authToken: result.authToken ? "present" : "missing",
            refreshToken: result.refreshToken ? "present" : "missing",
            tokenExpiresAt: result.tokenExpiresAt
          });
          
          setPhoneUid(result.phoneUid);
          setIsPhoneVerified(true);
          
          toast.success("電話番号認証が完了しました", {
            id: "phone-verification-success"
          });
          
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
            id: "phone-uid-missing"
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
          id: "phone-verification-failed"
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
              id: "phone-network-error-verify"
            },
          );
        } else if (error.message.includes("code-expired")) {
          toast.error("認証コードの有効期限が切れました。新しいコードを取得してください。", {
            action: {
              label: "再送信",
              onClick: () => router.push("/sign-up/phone-verification"),
            },
            duration: 10000,
            id: "phone-code-expired"
          });
        } else if (error.message.includes("invalid-verification-code")) {
          toast.error("無効な認証コードです。正しいコードを入力してください。", {
            id: "phone-invalid-code"
          });
        } else {
          toast.error("認証コードの検証に失敗しました", {
            id: "phone-verification-failed-unknown"
          });
        }
      } else {
        toast.error("認証コードの検証に失敗しました", {
          id: "phone-verification-failed-unknown-error"
        });
      }

      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    phoneNumber,
    isVerifying,
    verificationId,
    isPhoneVerified,
    phoneUid,
    startPhoneVerification,
    verifyPhoneCode: verifyPhoneCodeLocal,
    setIsPhoneVerified,
  };
};

export default usePhoneAuth;
