import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

const MockAuthProvider = ({ 
  isAuthenticated = false, 
  isPhoneVerified = false, 
  isUserRegistered = false,
  children 
}: { 
  isAuthenticated?: boolean;
  isPhoneVerified?: boolean; 
  isUserRegistered?: boolean;
  children: React.ReactNode;
}) => {
  return <div>{children}</div>;
};

const MockLoginModal = ({
  isAuthenticated = false,
  isPhoneVerified = false,
  isUserRegistered = false,
  isLoading = false,
  hasError = false,
  termsAgreed = false,
  privacyAgreed = false,
}: {
  isAuthenticated?: boolean;
  isPhoneVerified?: boolean;
  isUserRegistered?: boolean;
  isLoading?: boolean;
  hasError?: boolean;
  termsAgreed?: boolean;
  privacyAgreed?: boolean;
}) => {
  const handleLineLogin = () => {
    console.log("LINE login clicked");
  };

  const handleTermsChange = (checked: boolean) => {
    console.log("Terms agreement changed:", checked);
  };

  const handlePrivacyChange = (checked: boolean) => {
    console.log("Privacy agreement changed:", checked);
  };

  const handleUserRegistration = () => {
    console.log("User registration clicked");
  };

  if (isUserRegistered) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold mb-4 text-center">ユーザー登録</h2>
          <p className="text-gray-600 mb-6 text-center">
            アカウントが作成されました。ユーザー情報を登録してください。
          </p>
          <button
            onClick={handleUserRegistration}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            ユーザー登録を開始
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-6 text-center">ログイン</h2>
        
        <div className="space-y-4 mb-6">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => handleTermsChange(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-gray-600">
              <a href="#" className="text-blue-600 underline">利用規約</a>に同意します
            </span>
          </label>
          
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={privacyAgreed}
              onChange={(e) => handlePrivacyChange(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-gray-600">
              <a href="#" className="text-blue-600 underline">プライバシーポリシー</a>に同意します
            </span>
          </label>
        </div>

        {hasError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">
              ログインに失敗しました。もう一度お試しください。
            </p>
          </div>
        )}

        <button
          onClick={handleLineLogin}
          disabled={!termsAgreed || !privacyAgreed || isLoading}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>ログイン中...</span>
            </>
          ) : (
            <>
              <span>🟢</span>
              <span>LINEでログイン</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます。
        </p>
      </div>
    </div>
  );
};

const meta: Meta<typeof MockLoginModal> = {
  title: "App/Login/LoginModal",
  component: MockLoginModal,
  tags: ["autodocs"],
  argTypes: {
    isAuthenticated: {
      control: "boolean",
      description: "Whether user is authenticated with LINE",
    },
    isPhoneVerified: {
      control: "boolean",
      description: "Whether user has verified their phone number",
    },
    isUserRegistered: {
      control: "boolean",
      description: "Whether user has completed registration",
    },
    isLoading: {
      control: "boolean",
      description: "Whether login is in progress",
    },
    hasError: {
      control: "boolean",
      description: "Whether there is a login error",
    },
    termsAgreed: {
      control: "boolean",
      description: "Whether user has agreed to terms",
    },
    privacyAgreed: {
      control: "boolean",
      description: "Whether user has agreed to privacy policy",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story, { args }) => (
      <MockAuthProvider
        isAuthenticated={args.isAuthenticated}
        isPhoneVerified={args.isPhoneVerified}
        isUserRegistered={args.isUserRegistered}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Background Page</h1>
            <p className="text-gray-600">This is the background content behind the modal</p>
          </div>
          <Story />
        </div>
      </MockAuthProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MockLoginModal>;

export const Default: Story = {
  args: {
    isAuthenticated: false,
    isPhoneVerified: false,
    isUserRegistered: false,
    isLoading: false,
    hasError: false,
    termsAgreed: false,
    privacyAgreed: false,
  },
};

export const WithAgreements: Story = {
  args: {
    isAuthenticated: false,
    isPhoneVerified: false,
    isUserRegistered: false,
    isLoading: false,
    hasError: false,
    termsAgreed: true,
    privacyAgreed: true,
  },
};

export const Loading: Story = {
  args: {
    isAuthenticated: false,
    isPhoneVerified: false,
    isUserRegistered: false,
    isLoading: true,
    hasError: false,
    termsAgreed: true,
    privacyAgreed: true,
  },
};

export const WithError: Story = {
  args: {
    isAuthenticated: false,
    isPhoneVerified: false,
    isUserRegistered: false,
    isLoading: false,
    hasError: true,
    termsAgreed: true,
    privacyAgreed: true,
  },
};

export const UserRegistrationPrompt: Story = {
  args: {
    isAuthenticated: true,
    isPhoneVerified: true,
    isUserRegistered: true,
    isLoading: false,
    hasError: false,
    termsAgreed: true,
    privacyAgreed: true,
  },
};

export const PartialAgreement: Story = {
  args: {
    isAuthenticated: false,
    isPhoneVerified: false,
    isUserRegistered: false,
    isLoading: false,
    hasError: false,
    termsAgreed: true,
    privacyAgreed: false,
  },
};
