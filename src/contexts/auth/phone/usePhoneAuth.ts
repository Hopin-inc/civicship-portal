import { useState } from "react";
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
export const usePhoneAuth = () => {
  const router = useRouter();
  const cookies = useCookies();
  
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  /**
   * Start phone verification process with the given phone number
   */
  const startPhoneVerification = async (phoneNumber: string): Promise<boolean> => {
    setIsVerifying(true);
    try {
      const verId = await startPhoneNumberVerification(phoneNumber, null, null);
      setVerificationId(verId);
      setPhoneNumber(phoneNumber);
      return true;
    } catch (error) {
      console.error("Failed to start phone verification:", error);
      toast.error("電話番号認証の開始に失敗しました");
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
        await new Promise(resolve => setTimeout(resolve, 500));

        if (phoneVerificationState.phoneUid) {
          setCookies(
            cookies,
            phoneVerificationState.authToken,
            phoneVerificationState.refreshToken,
            phoneVerificationState.tokenExpiresAt,
            "phone"
          );

          console.log("Phone verification successful with tokens:", {
            phoneUid: phoneVerificationState.phoneUid,
            authToken: phoneVerificationState.authToken ? "present" : "missing",
            refreshToken: phoneVerificationState.refreshToken ? "present" : "missing",
            tokenExpiresAt: phoneVerificationState.tokenExpiresAt
          });

          setIsPhoneVerified(true);
          toast.success("電話番号認証が完了しました");
          router.push("/sign-up");
          return true;
        } else {
          toast.error("電話番号認証IDが取得できませんでした");
          return false;
        }
      } else {
        toast.error("認証コードの検証に失敗しました");
        return false;
      }
    } catch (error) {
      console.error("Failed to verify phone code:", error);
      toast.error("認証コードの検証に失敗しました");
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
    phoneUid: phoneVerificationState.phoneUid,
    startPhoneVerification,
    verifyPhoneCode: verifyPhoneCodeLocal,
    setIsPhoneVerified,
  };
};

export default usePhoneAuth;
