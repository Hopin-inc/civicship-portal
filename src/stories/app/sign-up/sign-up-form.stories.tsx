import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { GqlCurrentPrefecture } from "@/types/graphql";

const MockSignUpForm = ({ 
  mockAuthState = "phone_authenticated",
  mockLoading = false 
}: { 
  mockAuthState?: "unauthenticated" | "line_authenticated" | "phone_authenticated";
  mockLoading?: boolean;
}) => {
  const [name, setName] = React.useState("");
  const [prefecture, setPrefecture] = React.useState<GqlCurrentPrefecture | "">("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !prefecture) return;
    
    setIsSubmitting(true);
    console.log("Mock createUser called:", { name, prefecture });
    setTimeout(() => {
      setIsSubmitting(false);
      console.log("Success toast: ユーザー登録が完了しました");
      console.log("Navigate to: /");
    }, 1000);
  };

  if (mockLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (mockAuthState === "unauthenticated") {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">ログインが必要です</p>
      </div>
    );
  }

  if (mockAuthState === "line_authenticated") {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">電話番号認証が必要です</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ユーザー登録</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            お名前 *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="山田太郎"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            居住地 *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(GqlCurrentPrefecture).map((pref) => (
              <button
                key={pref}
                type="button"
                onClick={() => setPrefecture(pref)}
                className={`px-3 py-2 text-sm border rounded-md ${
                  prefecture === pref
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pref === GqlCurrentPrefecture.Kagawa && "香川県"}
                {pref === GqlCurrentPrefecture.Tokushima && "徳島県"}
                {pref === GqlCurrentPrefecture.Ehime && "愛媛県"}
                {pref === GqlCurrentPrefecture.Kochi && "高知県"}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!name || !prefecture || isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "登録中..." : "登録する"}
        </button>
      </form>
    </div>
  );
};

const meta: Meta<typeof MockSignUpForm> = {
  title: "App/SignUp/SignUpForm",
  component: MockSignUpForm,
  tags: ["autodocs"],
  argTypes: {
    mockAuthState: {
      control: "select",
      options: ["unauthenticated", "line_authenticated", "phone_authenticated"],
      description: "Mock authentication state",
    },
    mockLoading: {
      control: "boolean",
      description: "Mock loading state",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-screen-xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MockSignUpForm>;

export const Default: Story = {
  args: {
    mockAuthState: "phone_authenticated",
    mockLoading: false,
  },
};

export const Loading: Story = {
  args: {
    mockAuthState: "phone_authenticated",
    mockLoading: true,
  },
};

export const NotAuthenticated: Story = {
  args: {
    mockAuthState: "unauthenticated",
    mockLoading: false,
  },
};

export const NotPhoneVerified: Story = {
  args: {
    mockAuthState: "line_authenticated",
    mockLoading: false,
  },
};

export const Interactive: Story = {
  args: {
    mockAuthState: "phone_authenticated",
    mockLoading: false,
  },
};
