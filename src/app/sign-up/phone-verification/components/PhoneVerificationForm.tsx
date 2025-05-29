"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPhoneNumber } from "@/app/sign-up/phone-verification/utils";
import { Button } from "@/components/ui/button";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export function PhoneVerificationForm() {
  const { phoneAuth, isAuthenticated, isPhoneVerified, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") ?? searchParams.get("liff.state");

  const headerConfig = useMemo(
    () => ({
      title: "電話番号認証",
      showBackButton: false,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");

  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  const [isReloading, setIsReloading] = useState(false);
  const [isPhoneSubmitting, setIsSubmitting] = useState(false);
  const [isCodeVerifying, setIsCodeVerifying] = useState(false);

  const formattedPhone = formatPhoneNumber(phoneNumber);
  const digitsOnly = formattedPhone.replace(/\D/g, "");
  const isPhoneValid = digitsOnly.startsWith("81") && digitsOnly.length === 12;

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      let loginWithNext = "/login";
      if (nextParam) {
        loginWithNext += `?next=${nextParam}`;
      }
      router.replace(loginWithNext);
    }
  }, [isAuthenticated, isPhoneVerified, loading, router, nextParam]);

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
    if (isPhoneSubmitting) return;
    setIsSubmitting(true);

    try {
      const verificationId = await phoneAuth.startPhoneVerification(formattedPhone);

      if (verificationId) {
        setStep("code");
      }
    } catch (error) {
      toast.error("認証コードの送信に失敗しました");
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
        toast.success("電話番号認証が完了しました");
        const nextUrl = nextParam ? `/sign-up?next=${nextParam}` : "/sign-up";
        router.push(nextUrl);
      } else {
        toast.error("認証コードが無効です");
      }
    } catch (error) {
      toast.error("電話番号からやり直して下さい");
    } finally {
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
                  isPhoneSubmitting || phoneAuth.isVerifying || !isPhoneValid || isReloading
                }
              >
                {isPhoneSubmitting || phoneAuth.isVerifying ? "送信中..." : "認証コードを送信"}
              </Button>
              <Button
                type="button"
                className="px-4"
                size="sm"
                variant="text"
                disabled={isPhoneSubmitting}
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
              disabled={isCodeVerifying || phoneAuth.isVerifying || isReloading}
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
