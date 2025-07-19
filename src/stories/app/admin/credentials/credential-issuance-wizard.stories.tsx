import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Button } from "@/components/ui/button";

const MockCredentialIssuanceWizard = ({ 
  currentStep = 1,
  onStepChange 
}: { 
  currentStep?: number;
  onStepChange?: (step: number) => void;
}) => {
  const [step, setStep] = React.useState(currentStep);

  const handleStepChange = (newStep: number) => {
    setStep(newStep);
    onStepChange?.(newStep);
  };

  const steps = [
    { number: 1, title: "募集を選ぶ", description: "証明書を発行する募集を選択" },
    { number: 2, title: "開催日を選ぶ", description: "対象となる開催日を選択" },
    { number: 3, title: "発行先を選ぶ", description: "証明書の発行先ユーザーを選択" },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">証明書発行</h1>
        <p className="text-gray-600">3つのステップで証明書を発行します</p>
      </div>

      <div className="flex items-center justify-between mb-8">
        {steps.map((stepInfo, index) => (
          <React.Fragment key={stepInfo.number}>
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  step >= stepInfo.number 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stepInfo.number}
              </div>
              <div className="mt-2 text-center">
                <div className={`font-medium text-sm ${
                  step >= stepInfo.number ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {stepInfo.title}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {stepInfo.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                step > stepInfo.number ? 'bg-blue-500' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">
          ステップ {step}: {steps[step - 1]?.title}
        </h2>
        <p className="text-gray-600 mb-4">
          {steps[step - 1]?.description}
        </p>
        
        {step === 1 && (
          <div className="space-y-2">
            <div className="p-3 bg-white rounded border">
              <div className="font-medium">地域清掃ボランティア</div>
              <div className="text-sm text-gray-500">2024年1月20日 開催</div>
            </div>
            <div className="p-3 bg-white rounded border">
              <div className="font-medium">環境保護セミナー</div>
              <div className="text-sm text-gray-500">2024年1月25日 開催</div>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-2">
            <div className="p-3 bg-white rounded border">
              <div className="font-medium">2024年1月20日 14:00-16:00</div>
              <div className="text-sm text-gray-500">参加者: 12名</div>
            </div>
            <div className="p-3 bg-white rounded border">
              <div className="font-medium">2024年1月20日 16:30-18:30</div>
              <div className="text-sm text-gray-500">参加者: 8名</div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-2">
            <div className="p-3 bg-white rounded border flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div>
                <div className="font-medium">田中太郎</div>
                <div className="text-sm text-gray-500">did:example:123...</div>
              </div>
            </div>
            <div className="p-3 bg-white rounded border flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div>
                <div className="font-medium">佐藤花子</div>
                <div className="text-sm text-gray-500">did:example:456...</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => handleStepChange(Math.max(1, step - 1))}
          disabled={step === 1}
          className="flex-1"
        >
          戻る
        </Button>
        <Button 
          onClick={() => {
            if (step < 3) {
              handleStepChange(step + 1);
            } else {
              console.log("Issue credentials");
            }
          }}
          className="flex-1"
        >
          {step < 3 ? '次へ' : '発行する'}
        </Button>
      </div>
    </div>
  );
};

const meta: Meta<typeof MockCredentialIssuanceWizard> = {
  title: "App/Admin/Credentials/CredentialIssuanceWizard",
  component: MockCredentialIssuanceWizard,
  tags: ["autodocs"],
  argTypes: {
    currentStep: {
      control: { type: "select" },
      options: [1, 2, 3],
      description: "Current step in the wizard",
    },
  },
  parameters: {
    docs: {
      description: {
        component: "3ステップの証明書発行ウィザード。募集選択→開催日選択→発行先選択の流れ。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MockCredentialIssuanceWizard>;

export const Step1: Story = {
  args: {
    currentStep: 1,
    onStepChange: (step: number) => console.log("Step changed to:", step),
  },
};

export const Step2: Story = {
  args: {
    currentStep: 2,
    onStepChange: (step: number) => console.log("Step changed to:", step),
  },
};

export const Step3: Story = {
  args: {
    currentStep: 3,
    onStepChange: (step: number) => console.log("Step changed to:", step),
  },
};

export const Interactive: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = React.useState(1);
    return (
      <MockCredentialIssuanceWizard 
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />
    );
  },
};
