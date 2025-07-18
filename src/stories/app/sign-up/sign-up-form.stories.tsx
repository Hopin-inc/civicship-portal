import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";

const GqlCurrentPrefecture = {
  Ehime: "EHIME",
  Kagawa: "KAGAWA",
  Kochi: "KOCHI",
  OutsideShikoku: "OUTSIDE_SHIKOKU",
  Tokushima: "TOKUSHIMA",
  Unknown: "UNKNOWN",
} as const;

type GqlCurrentPrefecture = (typeof GqlCurrentPrefecture)[keyof typeof GqlCurrentPrefecture];

const prefectureLabels: Record<GqlCurrentPrefecture, string> = {
  [GqlCurrentPrefecture.Kagawa]: "香川県",
  [GqlCurrentPrefecture.Tokushima]: "徳島県",
  [GqlCurrentPrefecture.Kochi]: "高知県",
  [GqlCurrentPrefecture.Ehime]: "愛媛県",
  [GqlCurrentPrefecture.OutsideShikoku]: "四国以外",
  [GqlCurrentPrefecture.Unknown]: "不明",
};

const MockSignUpForm = ({
  isLoading = false,
  hasError = false,
  errorMessage = "",
  enabledFeatures = ["opportunities", "places"],
}: {
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  enabledFeatures?: string[];
}) => {
  const [name, setName] = useState("");
  const [prefecture, setPrefecture] = useState<GqlCurrentPrefecture | undefined>(undefined);
  const [nameError, setNameError] = useState("");
  const [prefectureError, setPrefectureError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setNameError("");
    setPrefectureError("");

    if (!name.trim()) {
      setNameError("名前を入力してください");
      return;
    }

    if (!prefecture) {
      setPrefectureError("居住地を選択してください");
      return;
    }

    console.log("Sign up submitted:", { name, prefecture });
  };

  const prefectureOptions = [
    GqlCurrentPrefecture.Kagawa,
    GqlCurrentPrefecture.Tokushima,
    GqlCurrentPrefecture.Kochi,
    GqlCurrentPrefecture.Ehime,
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">ユーザー登録</h1>
        
        {hasError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">
              {errorMessage || "登録に失敗しました。もう一度お試しください。"}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              お名前 *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田太郎"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                nameError ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {nameError && (
              <p className="text-red-500 text-xs mt-1">{nameError}</p>
            )}
          </div>

          <div>
            <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 mb-1">
              居住地 *
            </label>
            <select
              id="prefecture"
              value={prefecture || ""}
              onChange={(e) => setPrefecture(e.target.value as GqlCurrentPrefecture)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                prefectureError ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            >
              <option value="">選択してください</option>
              {prefectureOptions.map((pref) => (
                <option key={pref} value={pref}>
                  {prefectureLabels[pref]}
                </option>
              ))}
            </select>
            {prefectureError && (
              <p className="text-red-500 text-xs mt-1">{prefectureError}</p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  登録中...
                </>
              ) : (
                "登録する"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">利用可能な機能:</h3>
          <div className="flex flex-wrap gap-2">
            {enabledFeatures.includes("opportunities") && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                アクティビティ検索
              </span>
            )}
            {enabledFeatures.includes("places") && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                拠点情報
              </span>
            )}
            {enabledFeatures.includes("points") && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                ポイント機能
              </span>
            )}
            {enabledFeatures.includes("tickets") && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                チケット機能
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof MockSignUpForm> = {
  title: "App/SignUp/SignUpForm",
  component: MockSignUpForm,
  tags: ["autodocs"],
  argTypes: {
    isLoading: {
      control: "boolean",
      description: "Whether form submission is in progress",
    },
    hasError: {
      control: "boolean",
      description: "Whether there is a submission error",
    },
    errorMessage: {
      control: "text",
      description: "Custom error message to display",
    },
    enabledFeatures: {
      control: "check",
      options: ["opportunities", "places", "points", "tickets"],
      description: "Enabled community features",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof MockSignUpForm>;

export const Default: Story = {
  args: {
    isLoading: false,
    hasError: false,
    errorMessage: "",
    enabledFeatures: ["opportunities", "places"],
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    hasError: false,
    errorMessage: "",
    enabledFeatures: ["opportunities", "places"],
  },
};

export const WithError: Story = {
  args: {
    isLoading: false,
    hasError: true,
    errorMessage: "ネットワークエラーが発生しました",
    enabledFeatures: ["opportunities", "places"],
  },
};

export const ValidationError: Story = {
  args: {
    isLoading: false,
    hasError: true,
    errorMessage: "入力内容に不備があります",
    enabledFeatures: ["opportunities", "places"],
  },
};

export const AllFeatures: Story = {
  args: {
    isLoading: false,
    hasError: false,
    errorMessage: "",
    enabledFeatures: ["opportunities", "places", "points", "tickets"],
  },
};

export const MinimalFeatures: Story = {
  args: {
    isLoading: false,
    hasError: false,
    errorMessage: "",
    enabledFeatures: ["opportunities"],
  },
};

export const Interactive: Story = {
  render: () => {
    const [formState, setFormState] = useState({
      isLoading: false,
      hasError: false,
      errorMessage: "",
    });

    const simulateSubmission = () => {
      setFormState({ isLoading: true, hasError: false, errorMessage: "" });
      
      setTimeout(() => {
        const success = Math.random() > 0.3;
        if (success) {
          setFormState({ isLoading: false, hasError: false, errorMessage: "" });
          alert("登録が完了しました！");
        } else {
          setFormState({ 
            isLoading: false, 
            hasError: true, 
            errorMessage: "サーバーエラーが発生しました" 
          });
        }
      }, 2000);
    };

    return (
      <div>
        <MockSignUpForm
          isLoading={formState.isLoading}
          hasError={formState.hasError}
          errorMessage={formState.errorMessage}
          enabledFeatures={["opportunities", "places", "points"]}
        />
        <div className="fixed bottom-4 right-4">
          <button
            onClick={simulateSubmission}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm"
          >
            Simulate Submission
          </button>
        </div>
      </div>
    );
  },
};
