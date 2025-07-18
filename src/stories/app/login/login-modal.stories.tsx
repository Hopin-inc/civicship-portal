import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

const MockLoginModal = ({ 
  isOpen, 
  onClose, 
  nextPath,
  mockAuthState = "unauthenticated"
}: { 
  isOpen: boolean;
  onClose: () => void;
  nextPath?: string;
  mockAuthState?: "unauthenticated" | "authenticated" | "authenticating";
}) => {
  const [agreedTerms, setAgreedTerms] = React.useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = () => {
    if (!agreedTerms || !agreedPrivacy) {
      setError("すべての同意が必要です");
      return;
    }
    console.log("Mock login with LIFF called");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
      <div className="w-full max-w-mobile-l mx-auto bg-white rounded-t-2xl p-12 min-h-[240px] max-h-[90dvh] overflow-y-auto">
        <div className="text-body-md mb-6">
          <strong className="font-bold">NEO88</strong>
          {mockAuthState === "authenticated" 
            ? "を利用するにはユーザー登録してください" 
            : "を利用するにはLINEでログインして下さい"
          }
        </div>
        
        <div className="flex flex-col items-start space-y-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id="agree-terms"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-5 h-5"
                disabled={mockAuthState === "authenticating"}
              />
              <label htmlFor="agree-terms" className="text-label-md text-muted-foreground">
                <a href="/terms" className="underline">利用規約</a>
                <span className="text-label-sm">に同意する</span>
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id="agree-privacy"
                checked={agreedPrivacy}
                onChange={(e) => setAgreedPrivacy(e.target.checked)}
                className="w-5 h-5"
                disabled={mockAuthState === "authenticating"}
              />
              <label htmlFor="agree-privacy" className="text-label-md text-muted-foreground">
                <a href="/privacy" className="underline">プライバシーポリシー</a>
                <span className="text-label-sm">に同意する</span>
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}

          {mockAuthState !== "authenticated" ? (
            <button
              onClick={handleLogin}
              disabled={mockAuthState === "authenticating"}
              className="w-full bg-[#06C755] hover:bg-[#05B74B] text-white rounded-full h-14 flex items-center justify-center gap-2"
            >
              <img src="/images/line-icon.png" alt="LINE" width={24} height={24} />
              {mockAuthState === "authenticating" ? "ログイン中..." : "LINEでログイン"}
            </button>
          ) : (
            <a
              href={`/sign-up/phone-verification?next=${nextPath || ""}`}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full h-14 flex items-center justify-center"
            >
              ユーザー登録に進む
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof MockLoginModal> = {
  title: "App/Login/LoginModal",
  component: MockLoginModal,
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Whether the modal is open",
    },
    nextPath: {
      control: "text",
      description: "Path to redirect to after login",
    },
    mockAuthState: {
      control: "select",
      options: ["unauthenticated", "authenticated", "authenticating"],
      description: "Mock authentication state",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MockLoginModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
    nextPath: "/",
    mockAuthState: "unauthenticated",
  },
};

export const WithNextPath: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
    nextPath: "/activities",
    mockAuthState: "unauthenticated",
  },
};

export const AlreadyAuthenticated: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
    nextPath: "/",
    mockAuthState: "authenticated",
  },
};

export const Authenticating: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
    nextPath: "/",
    mockAuthState: "authenticating",
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log("Modal closed"),
    nextPath: "/",
    mockAuthState: "unauthenticated",
  },
};

export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          ログインモーダルを開く
        </button>
        <MockLoginModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          nextPath="/activities"
          mockAuthState="unauthenticated"
        />
      </div>
    );
  },
};
