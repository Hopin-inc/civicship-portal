"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { AuthRedirectService } from "@/lib/auth/service/auth-redirect-service";
import { useMutation } from "@apollo/client";
import { IDENTITY_CHECK_PHONE_USER } from "@/graphql/account/identity/mutation";
import {
  GqlIdentityCheckPhoneUserPayload,
  GqlMutationIdentityCheckPhoneUserArgs,
  GqlPhoneUserStatus,
} from "@/types/graphql";
import { RawURIComponent } from "@/utils/path";
import { categorizeFirebaseError } from "@/lib/auth/core/firebase-config";
import { isRunningInLiff } from "@/lib/auth/core/environment-detector";
import { logger } from "@/lib/logging";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { VerificationStep } from "../types";
import { validatePhoneNumber } from "../utils/validation";
import { PHONE_VERIFICATION_CONSTANTS } from "../utils/phoneVerificationConstants";
import { useResendTimer } from "../hooks/useResendTimer";
import { useRecaptchaManager } from "../hooks/useRecaptchaManager";

export function PhoneVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const nextParam = next ? `?next=${encodeURIComponent(next)}` : "";
  // ==================================
  const { phoneAuth, isAuthenticated, loading, authenticationState, updateAuthState } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<VerificationStep>("phone");

  const [identityCheckPhoneUser] = useMutation<
    { identityCheckPhoneUser: GqlIdentityCheckPhoneUserPayload },
    GqlMutationIdentityCheckPhoneUserArgs
  >(IDENTITY_CHECK_PHONE_USER);

  const authRedirectService = AuthRedirectService.getInstance();

  // ==================================
  const [isReloading, setIsReloading] = useState(false);
  const [isPhoneSubmitting, setIsSubmitting] = useState(false);
  const [isCodeVerifying, setIsCodeVerifying] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  // ==================================

  const { isDisabled: isResendDisabled, countdown, start: startResendTimer } = useResendTimer();
  const recaptchaManager = useRecaptchaManager();

  const { isValid: isPhoneValid, formattedPhone } = validatePhoneNumber(phoneNumber);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recaptchaManager.isReady) {
      toast.error("認証コード送信を準備中です");
      return;
    }

    if (isPhoneSubmitting || isRateLimited) return;
    setIsSubmitting(true);

    try {
      const verificationId = await phoneAuth.startPhoneVerification(formattedPhone);

      if (verificationId) {
        setStep("code");
        startResendTimer();
      }
    } catch (error) {
      const categorized = categorizeFirebaseError(error);
      toast.error(categorized.message);

      if (categorized.type === "rate-limit") {
        setIsRateLimited(true);
        setTimeout(
          () => setIsRateLimited(false),
          PHONE_VERIFICATION_CONSTANTS.RATE_LIMIT_DURATION_MS,
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (isResendDisabled || isPhoneSubmitting) return;

    if (!recaptchaManager.isReady) {
      toast.error("認証コード送信を準備中です");
      return;
    }

    // 電話番号が空の場合はエラー
    if (!phoneNumber || !formattedPhone) {
      toast.error("電話番号が設定されていません。電話番号入力画面に戻ってください。");
      return;
    }

    // 再送信時にreCAPTCHAを表示
    recaptchaManager.show();
    setIsSubmitting(true);

    try {
      phoneAuth.clearRecaptcha?.();

      const waitTime = isRunningInLiff()
        ? PHONE_VERIFICATION_CONSTANTS.RECAPTCHA_WAIT_TIME_LIFF
        : PHONE_VERIFICATION_CONSTANTS.RECAPTCHA_WAIT_TIME_BROWSER;
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      const verificationId = await phoneAuth.startPhoneVerification(formattedPhone);

      if (verificationId) {
        toast.success("認証コードを再送信しました");
        startResendTimer();

        if (!isRunningInLiff()) {
          recaptchaManager.hide();
        }
      }
    } catch (error) {
      logger.error("再送信エラー:", { error });
      const categorized = categorizeFirebaseError(error);
      toast.error(categorized.message);

      if (categorized.type === "rate-limit") {
        setIsRateLimited(true);
        setTimeout(
          () => setIsRateLimited(false),
          PHONE_VERIFICATION_CONSTANTS.RATE_LIMIT_DURATION_MS,
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCodeVerifying) return;
    setIsCodeVerifying(true);

    try {
      const success = await phoneAuth.verifyPhoneCode(verificationCode);
      const phoneAuthState = useAuthStore.getState().phoneAuth;
      const setAuthState = useAuthStore.getState().setState;
      if (!success || !phoneAuthState.phoneUid) {
        toast.error("認証コードが無効です");
        return;
      }
      if (success) {
        const { data } = await identityCheckPhoneUser({
          variables: {
            input: {
              phoneUid: phoneAuthState.phoneUid,
            },
          },
        });

        const status = data?.identityCheckPhoneUser?.status;

        if (!status) {
          toast.error("認証ステータスの取得に失敗しました。再試行してください。");
          setIsCodeVerifying(false);
          return;
        }

        switch (status) {
          case GqlPhoneUserStatus.NewUser:
            toast.success("電話番号認証が完了しました");
            const redirectPath = `/sign-up${nextParam}`;
            router.push(redirectPath);
            break;

          case GqlPhoneUserStatus.ExistingSameCommunity:
            toast.success("ログインしました");
            const homeRedirectPath = authRedirectService.getRedirectPath(
              "/" as RawURIComponent,
              nextParam as RawURIComponent,
            );
            setAuthState({ authenticationState: "user_registered" });
            router.push(homeRedirectPath || "/");
            break;

          case GqlPhoneUserStatus.ExistingDifferentCommunity:
            toast.success("メンバーシップが追加されました");
            updateAuthState();
            setAuthState({ authenticationState: "user_registered" });
            const crossCommunityRedirectPath = authRedirectService.getRedirectPath(
              "/" as RawURIComponent,
              nextParam as RawURIComponent,
            );
            router.push(crossCommunityRedirectPath || "/");
            break;

          default:
            toast.error("認証処理でエラーが発生しました");
            setIsCodeVerifying(false);
        }
      } else {
        toast.error("認証コードが無効です");
        setIsCodeVerifying(false);
      }
    } catch (error) {
      toast.error("電話番号からやり直して下さい");
      setIsCodeVerifying(false);
    }
  };

  const handleOTPChange = (value: string) => {
    setVerificationCode(value);
  };

  if (loading) {
    return <LoadingIndicator fullScreen={true} />;
  }

  if (!isAuthenticated) {
    return null;
  }

  // If it breaks in production, revert phoneAuth.isVerifying and reCAPTCHA to the same positions as in master.

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          {step === "phone" && "電話番号を入力"}
          {step === "code" && "認証コードを入力"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {step === "phone" &&
            "電話番号認証のため、あなたの電話番号を入力してください。SMSで認証コードが送信されます。"}
          {step === "code" && "電話番号に送信された6桁の認証コードを入力してください。"}
        </p>
      </div>

      {step === "phone" && (
        <>
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                電話番号
              </label>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="例）09012345678"
                className="w-full h-12 px-3 border rounded-md"
                required
              />
            </div>
            <div className="flex flex-col items-center gap-8 w-full mx-auto">
              <Button
                type="submit"
                className="w-full h-12 bg-primary text-white rounded-md"
                disabled={
                  isPhoneSubmitting ||
                  phoneAuth.isVerifying ||
                  !isPhoneValid ||
                  isReloading ||
                  isRateLimited
                }
              >
                {isPhoneSubmitting || phoneAuth.isVerifying
                  ? "送信中..."
                  : isRateLimited
                    ? "制限中..."
                    : "認証コードを送信"}{" "}
              </Button>
              <Button
                type="button"
                className="px-4"
                size="sm"
                variant="text"
                disabled={isReloading}
                onClick={() => {
                  setIsReloading(true);
                  setTimeout(() => {
                    window.location.reload();
                  }, PHONE_VERIFICATION_CONSTANTS.RELOAD_INITIAL_DELAY_MS);
                }}
              >
                切り替わらない際は再読み込み
              </Button>
            </div>
          </form>
          <div id="recaptcha-container" ref={recaptchaManager.containerRef}></div>
        </>
      )}
      {step === "code" && (
        <>
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">
                認証コード
              </label>
              <div className="flex justify-center py-4">
                <InputOTP maxLength={6} value={verificationCode} onChange={handleOTPChange}>
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            <div className="flex flex-col items-center gap-8 w-full mx-auto">
              <Button
                type="submit"
                className="w-full h-12"
                disabled={
                  isCodeVerifying ||
                  phoneAuth.isVerifying ||
                  verificationCode.length < PHONE_VERIFICATION_CONSTANTS.VERIFICATION_CODE_LENGTH ||
                  isReloading
                }
              >
                {isCodeVerifying ? "検証中..." : "コードを検証"}
              </Button>
              <Button
                type="button"
                variant="tertiary"
                className="w-full h-12"
                disabled={isResendDisabled || isPhoneSubmitting || isReloading}
                onClick={handleResendCode}
              >
                {isResendDisabled
                  ? `${countdown}秒後に再送信できます`
                  : isPhoneSubmitting
                    ? "送信中..."
                    : "コードを再送信"}
              </Button>
              <div
                id="recaptcha-container"
                ref={recaptchaManager.containerRef}
                style={{ display: recaptchaManager.showRecaptcha ? "block" : "none" }}
              ></div>
              <Button
                type="button"
                variant={"text"}
                disabled={isReloading}
                onClick={async () => {
                  try {
                    if (phoneAuth.clearRecaptcha) {
                      await phoneAuth.clearRecaptcha();
                    }
                  } catch (error) {
                    logger.error("reCAPTCHAクリアエラー:", { error });
                  } finally {
                    setPhoneNumber("");
                    setVerificationCode("");
                    setStep("phone");

                    setTimeout(() => {
                      window.location.reload();
                    }, PHONE_VERIFICATION_CONSTANTS.RELOAD_DELAY_MS);
                  }
                }}
              >
                電話番号を再入力
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
