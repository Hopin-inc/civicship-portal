import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";

const MockPhoneVerificationForm = ({
  step = "phone",
  isLoading = false,
  hasError = false,
  errorMessage = "",
  isRateLimited = false,
  remainingTime = 0,
}: {
  step?: "phone" | "verification";
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  isRateLimited?: boolean;
  remainingTime?: number;
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [codeError, setCodeError] = useState("");

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");

    if (!phoneNumber.trim()) {
      setPhoneError("電話番号を入力してください");
      return;
    }

    if (!/^0\d{10,11}$/.test(phoneNumber.replace(/-/g, ""))) {
      setPhoneError("正しい電話番号を入力してください");
      return;
    }

    console.log("Phone number submitted:", phoneNumber);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError("");

    if (!verificationCode.trim()) {
      setCodeError("認証コードを入力してください");
      return;
    }

    if (verificationCode.length !== 6) {
      setCodeError("6桁の認証コードを入力してください");
      return;
    }

    console.log("Verification code submitted:", verificationCode);
  };

  const handleResendCode = () => {
    console.log("Resend code requested");
  };

  if (step === "verification") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-2">認証コード入力</h1>
          <p className="text-gray-600 text-center mb-6">
            {phoneNumber || "090-1234-5678"}に送信された6桁のコードを入力してください
          </p>

          {hasError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">
                {errorMessage || "認証に失敗しました。もう一度お試しください。"}
              </p>
            </div>
          )}

          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                認証コード
              </label>
              <input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                className={`w-full px-3 py-2 border rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  codeError ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading}
                maxLength={6}
              />
              {codeError && (
                <p className="text-red-500 text-xs mt-1">{codeError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  認証中...
                </>
              ) : (
                "認証する"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            {isRateLimited ? (
              <p className="text-gray-500 text-sm">
                再送信まで {remainingTime}秒お待ちください
              </p>
            ) : (
              <button
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-blue-600 text-sm hover:underline disabled:opacity-50"
              >
                認証コードを再送信
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">電話番号認証</h1>
        <p className="text-gray-600 text-center mb-6">
          SMSで認証コードを送信します
        </p>

        {hasError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">
              {errorMessage || "送信に失敗しました。もう一度お試しください。"}
            </p>
          </div>
        )}

        {isRateLimited && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-600 text-sm">
              送信回数の上限に達しました。{remainingTime}秒後に再試行できます。
            </p>
          </div>
        )}

        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              電話番号
            </label>
            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="090-1234-5678"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                phoneError ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading || isRateLimited}
            />
            {phoneError && (
              <p className="text-red-500 text-xs mt-1">{phoneError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || isRateLimited}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                送信中...
              </>
            ) : (
              "認証コードを送信"
            )}
          </button>
        </form>

        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            ※ SMS料金が発生する場合があります<br/>
            ※ 認証コードの有効期限は10分です
          </p>
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof MockPhoneVerificationForm> = {
  title: "App/SignUp/PhoneVerificationForm",
  component: MockPhoneVerificationForm,
  tags: ["autodocs"],
  argTypes: {
    step: {
      control: "select",
      options: ["phone", "verification"],
      description: "Current verification step",
    },
    isLoading: {
      control: "boolean",
      description: "Whether form submission is in progress",
    },
    hasError: {
      control: "boolean",
      description: "Whether there is an error",
    },
    errorMessage: {
      control: "text",
      description: "Custom error message to display",
    },
    isRateLimited: {
      control: "boolean",
      description: "Whether user is rate limited",
    },
    remainingTime: {
      control: "number",
      description: "Remaining time for rate limit (seconds)",
    },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof MockPhoneVerificationForm>;

export const PhoneInput: Story = {
  args: {
    step: "phone",
    isLoading: false,
    hasError: false,
    errorMessage: "",
    isRateLimited: false,
    remainingTime: 0,
  },
};

export const PhoneInputLoading: Story = {
  args: {
    step: "phone",
    isLoading: true,
    hasError: false,
    errorMessage: "",
    isRateLimited: false,
    remainingTime: 0,
  },
};

export const PhoneInputError: Story = {
  args: {
    step: "phone",
    isLoading: false,
    hasError: true,
    errorMessage: "無効な電話番号です",
    isRateLimited: false,
    remainingTime: 0,
  },
};

export const PhoneInputRateLimited: Story = {
  args: {
    step: "phone",
    isLoading: false,
    hasError: false,
    errorMessage: "",
    isRateLimited: true,
    remainingTime: 45,
  },
};

export const CodeVerification: Story = {
  args: {
    step: "verification",
    isLoading: false,
    hasError: false,
    errorMessage: "",
    isRateLimited: false,
    remainingTime: 0,
  },
};

export const CodeVerificationLoading: Story = {
  args: {
    step: "verification",
    isLoading: true,
    hasError: false,
    errorMessage: "",
    isRateLimited: false,
    remainingTime: 0,
  },
};

export const CodeVerificationError: Story = {
  args: {
    step: "verification",
    isLoading: false,
    hasError: true,
    errorMessage: "認証コードが正しくありません",
    isRateLimited: false,
    remainingTime: 0,
  },
};

export const CodeVerificationRateLimited: Story = {
  args: {
    step: "verification",
    isLoading: false,
    hasError: false,
    errorMessage: "",
    isRateLimited: true,
    remainingTime: 30,
  },
};

export const InteractiveFlow: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState<"phone" | "verification">("phone");
    const [isLoading, setIsLoading] = useState(false);

    const simulatePhoneSubmission = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep("verification");
      }, 2000);
    };

    const simulateCodeVerification = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert("認証が完了しました！");
        setCurrentStep("phone");
      }, 1500);
    };

    return (
      <div>
        <MockPhoneVerificationForm
          step={currentStep}
          isLoading={isLoading}
          hasError={false}
          errorMessage=""
          isRateLimited={false}
          remainingTime={0}
        />
        <div className="fixed bottom-4 right-4 space-x-2">
          <button
            onClick={simulatePhoneSubmission}
            disabled={currentStep !== "phone" || isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            Simulate Phone Submit
          </button>
          <button
            onClick={simulateCodeVerification}
            disabled={currentStep !== "verification" || isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            Simulate Code Submit
          </button>
        </div>
      </div>
    );
  },
};
