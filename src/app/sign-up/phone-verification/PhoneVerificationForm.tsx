"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export function PhoneVerificationForm() {
  const { phoneAuth, isAuthenticated, isPhoneVerified, loading, sessionId } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        let loginWithNext = "/login";
        if (nextParam) {
          loginWithNext += `?next=${ encodeURIComponent(nextParam) }`;
        }
        router.replace(loginWithNext);
      }
    }
  }, [isAuthenticated, isPhoneVerified, loading, router]);

  useEffect(() => {
    if (recaptchaContainerRef.current) {
      setIsRecaptchaReady(true);
    }
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRecaptchaReady) {
      toast.error("reCAPTCHAの読み込みが完了していません。ページを再読み込みしてください。");
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    const verificationId = await phoneAuth.startPhoneVerification(formattedPhone, sessionId);
    if (verificationId) {
      setStep("code");
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await phoneAuth.verifyPhoneCode(verificationCode, sessionId);
    if (success) {
      toast.success("電話番号認証が完了しました");
      const nextUrl = nextParam ? `/sign-up?next=${encodeURIComponent(nextParam)}` : "/sign-up";
      router.push(nextUrl);
    } else {
      toast.error("認証コードが無効です");
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/[-\s]/g, "");

    if (cleaned.startsWith("0")) {
      return "+81" + cleaned.substring(1);
    }

    if (cleaned.startsWith("+")) {
      return cleaned;
    }

    return "+81" + cleaned;
  };

  const handleOTPChange = (value: string) => {
    setVerificationCode(value);
  };

  if (loading) {
    return <LoadingIndicator />;
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
              placeholder="090-1234-5678"
              className="w-full h-12 px-3 border rounded-md"
              required
            />
          </div>
          <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
          <button
            type="submit"
            className="w-full h-12 bg-primary text-white rounded-md"
            disabled={phoneAuth.isVerifying}
          >
            {phoneAuth.isVerifying ? "送信中..." : "認証コードを送信"}
          </button>
        </form>
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
          <button
            type="submit"
            className="w-full h-12 bg-primary text-white rounded-md"
            disabled={phoneAuth.isVerifying || verificationCode.length < 6}
          >
            {phoneAuth.isVerifying ? "検証中..." : "コードを検証"}
          </button>
          <button
            type="button"
            onClick={() => setStep("phone")}
            className="w-full h-12 border border-gray-300 rounded-md"
          >
            電話番号を再入力
          </button>
        </form>
      )}
    </div>
  );
}
