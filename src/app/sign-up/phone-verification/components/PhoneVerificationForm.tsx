"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPhoneNumber } from "@/app/sign-up/phone-verification/utils";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";
import { useMutation } from "@apollo/client";
import { IDENTITY_CHECK_PHONE_USER } from "@/graphql/account/identity/mutation";
import {
  GqlIdentityCheckPhoneUserPayload,
  GqlMutationIdentityCheckPhoneUserArgs,
  GqlPhoneUserStatus,
} from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { RawURIComponent } from "@/utils/path";
import { categorizeFirebaseError } from "@/lib/auth/firebase-config";

export function PhoneVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const nextParam = next ? `?next=${encodeURIComponent(next)}` : "";

  // ==================================
  const { phoneAuth, isAuthenticated, loading, authenticationState, updateAuthState } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");

  const [identityCheckPhoneUser] = useMutation<
    { identityCheckPhoneUser: GqlIdentityCheckPhoneUserPayload },
    GqlMutationIdentityCheckPhoneUserArgs
  >(IDENTITY_CHECK_PHONE_USER);

  const authRedirectService = AuthRedirectService.getInstance();

  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // ==================================
  const [isReloading, setIsReloading] = useState(false);
  const [isPhoneSubmitting, setIsSubmitting] = useState(false);
  const [isCodeVerifying, setIsCodeVerifying] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  // ==================================

  const formattedPhone = formatPhoneNumber(phoneNumber);
  const digitsOnly = formattedPhone.replace(/\D/g, "");
  const isPhoneValid = digitsOnly.startsWith("81") && digitsOnly.length === 12;

  useEffect(() => {
    if (recaptchaContainerRef.current) {
      setIsRecaptchaReady(true);
    }
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isRecaptchaReady) {
      toast.error("認証コード送信を準備中です");
      return;
    }

    if (isPhoneSubmitting || isRateLimited) return;
    setIsSubmitting(true);

    try {
      const verificationId = await phoneAuth.startPhoneVerification(formattedPhone);

      if (verificationId) {
        setStep("code");
      }
    } catch (error) {
      const categorized = categorizeFirebaseError(error);
      toast.error(categorized.message);

      if (categorized.type === "rate-limit") {
        setIsRateLimited(true);
        setTimeout(() => setIsRateLimited(false), 60 * 1000); // 60秒後に解除
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCodeVerifying) return; // 二重送信防止
    setIsCodeVerifying(true);

    try {
      const success = await phoneAuth.verifyPhoneCode(verificationCode);
      if (success) {
        const { data } = await identityCheckPhoneUser({
          variables: {
            input: {
              communityId: COMMUNITY_ID,
            },
          },
        });

        const status = data?.identityCheckPhoneUser?.status;

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
            router.push(homeRedirectPath || "/");
            break;

          case GqlPhoneUserStatus.ExistingDifferentCommunity:
            toast.success("メンバーシップが追加されました");
            updateAuthState();
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
      console.log(error);
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
                placeholder="09012345678"
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
                  }, 300);
                }}
              >
                切り替わらない際は再読み込み
              </Button>
            </div>
          </form>
          <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
        </>
      )}
      {step === "code" && (
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
              className="w-full h-12 bg-primary text-white rounded-md"
              disabled={
                isCodeVerifying ||
                phoneAuth.isVerifying ||
                verificationCode.length < 6 ||
                isReloading
              }
            >
              {isCodeVerifying ? "検証中..." : "コードを検証"}
            </Button>
            <Button
              type="button"
              variant={"text"}
              disabled={isReloading}
              onClick={() => {
                phoneAuth.clearRecaptcha?.();
                setIsReloading(true);
                setStep("phone");
                setTimeout(() => {
                  window.location.reload();
                }, 300);
                setPhoneNumber("");
                setVerificationCode("");
              }}
            >
              電話番号を再入力
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
