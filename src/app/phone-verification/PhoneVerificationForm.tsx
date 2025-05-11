"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function PhoneVerificationForm() {
  const { phoneAuth } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  useEffect(() => {
    if (recaptchaContainerRef.current) {
      setIsRecaptchaReady(true);
    }
  }, [recaptchaContainerRef.current]);
  
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRecaptchaReady) {
      toast.error("reCAPTCHAの読み込みが完了していません。ページを再読み込みしてください。");
      return;
    }
    
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const success = await phoneAuth.startPhoneVerification(formattedPhone);
    if (success) {
      setStep("code");
    }
  };
  
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await phoneAuth.verifyPhoneCode(verificationCode);
    if (success) {
      router.push("/sign-up");
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
  
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          {step === "phone" ? "電話番号を入力" : "認証コードを入力"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {step === "phone" 
            ? "電話番号認証のため、あなたの電話番号を入力してください。SMSで認証コードが送信されます。" 
            : "電話番号に送信された6桁の認証コードを入力してください。"}
        </p>
      </div>
      
      {step === "phone" ? (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">電話番号</label>
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
      ) : (
        <form onSubmit={handleCodeSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium">認証コード</label>
            <input
              id="code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="123456"
              className="w-full h-12 px-3 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full h-12 bg-primary text-white rounded-md"
            disabled={phoneAuth.isVerifying}
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
