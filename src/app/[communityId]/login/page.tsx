"use client";

import { useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { decodeURIComponentWithType, EncodedURIComponent } from "@/utils/path";
import { getLiffLoginErrorMessage } from "@/app/[communityId]/login/utils/getLiffLoginErrorMessage";
import { toast } from "react-toastify";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { LoginView } from "@/app/[communityId]/login/components/LoginView";
import { PhoneInputForm } from "@/app/[communityId]/login/components/PhoneInputForm";
import { RegistrationForm, RegistrationData } from "@/app/[communityId]/login/components/RegistrationForm";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { useLogin } from "@/hooks/auth/actions/useLogin";
import { useAuthDependencies } from "@/hooks/auth/init/useAuthDependencies";

type LoginStep = "login" | "phone-input" | "registration";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const communityId = params?.communityId as string;
  const searchParams = useSearchParams();
  const nextPath = decodeURIComponentWithType(
    (searchParams.get("next") ?? "/") as EncodedURIComponent | null,
  );

  const { liffService, authStateManager } = useAuthDependencies();
  const loginWithLiff = useLogin(liffService, authStateManager);

  const { authenticationState, isAuthenticating } = useAuthStore((s) => s.state);

  const [step, setStep] = useState<LoginStep>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lineUid, setLineUid] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleLogin = async (agreedTerms: boolean, agreedPrivacy: boolean) => {
    if (!agreedTerms || !agreedPrivacy) {
      setError("すべての同意が必要です");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await loginWithLiff(nextPath ?? undefined);
      
      // Check if the result indicates UserNotFound
      if (result && typeof result === "object" && "code" in result) {
        if (result.code === "USER_NOT_FOUND") {
          if ("lineUid" in result && typeof result.lineUid === "string") {
            setLineUid(result.lineUid);
          }
          setStep("phone-input");
          return;
        }
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("USER_NOT_FOUND")) {
        setStep("phone-input");
        return;
      }
      
      const { title, description } = getLiffLoginErrorMessage(error);
      toast.error(
        <div>
          <div className="font-bold">{title}</div>
          {description && <div className="text-sm mt-1">{description}</div>}
        </div>,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (phone: string) => {
    setIsLoading(true);
    setError(null);
    setPhoneNumber(phone);

    try {
      const response = await fetch("/api/auth/link-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-community-id": communityId,
        },
        body: JSON.stringify({
          phoneNumber: phone,
          lineUid,
        }),
      });

      const result = await response.json();

      if (result.code === "USER_REGISTRATION_REQUIRED") {
        setStep("registration");
        return;
      }

      if (result.success) {
        const redirectPath = nextPath || `/${communityId}/activities`;
        router.push(redirectPath);
        return;
      }

      setError(result.message || "電話番号の確認に失敗しました");
    } catch (err) {
      setError("電話番号の確認に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistration = async (data: RegistrationData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-community-id": communityId,
        },
        body: JSON.stringify({
          name: data.name,
          phoneNumber: data.phoneNumber,
          lineUid: data.lineUid,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const redirectPath = nextPath || `/${communityId}/activities`;
        router.push(redirectPath);
        return;
      }

      setError(result.message || "登録に失敗しました");
    } catch (err) {
      setError("登録に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setError(null);
    if (step === "registration") {
      setStep("phone-input");
    } else {
      setStep("login");
    }
  };

  if (isAuthenticating || authenticationState !== "unauthenticated") {
    return <LoadingIndicator />;
  }

  switch (step) {
    case "phone-input":
      return (
        <PhoneInputForm
          isLoading={isLoading}
          error={error}
          onSubmit={handlePhoneSubmit}
          onBack={handleBack}
        />
      );
    case "registration":
      return (
        <RegistrationForm
          isLoading={isLoading}
          error={error}
          phoneNumber={phoneNumber}
          lineUid={lineUid}
          onSubmit={handleRegistration}
          onBack={handleBack}
        />
      );
    default:
      return (
        <LoginView
          isLoading={isLoading}
          isAuthenticating={isAuthenticating}
          error={error}
          onLogin={handleLogin}
        />
      );
  }
}
