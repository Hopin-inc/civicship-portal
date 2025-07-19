import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const MockCreateUtilitySheet = ({ 
  buttonLabel = "新規作成",
  onUtilityCreated 
}: { 
  buttonLabel?: string;
  onUtilityCreated?: () => Promise<void>;
}) => {
  const [showUtilityForm, setShowUtilityForm] = React.useState(false);
  const [step, setStep] = React.useState<"opportunities" | "details">("opportunities");
  const [utilityName, setUtilityName] = React.useState("");
  const [utilityDescription, setUtilityDescription] = React.useState("");
  const [selectedOpportunityIds, setSelectedOpportunityIds] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const mockOpportunities = [
    { id: "opp1", title: "プログラミング体験会" },
    { id: "opp2", title: "デザイン思考ワークショップ" },
    { id: "opp3", title: "起業家セミナー" },
    { id: "opp4", title: "マーケティング講座" },
    { id: "opp5", title: "データサイエンス入門" },
  ];

  const allOpportunityIds = mockOpportunities.map(opp => opp.id);
  const isAllSelected = allOpportunityIds.length > 0 && allOpportunityIds.every(id => selectedOpportunityIds.includes(id));
  const isNoneSelected = selectedOpportunityIds.length === 0;
  const isPartiallySelected = !isAllSelected && !isNoneSelected;

  const handleCreateUtility = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log("Utility created:", {
        name: utilityName,
        description: utilityDescription,
        opportunities: selectedOpportunityIds,
      });
      setIsSubmitting(false);
      handleReset();
      if (onUtilityCreated) {
        onUtilityCreated();
      }
    }, 2000);
  };

  const handleReset = () => {
    setShowUtilityForm(false);
    setStep("opportunities");
    setUtilityName("");
    setUtilityDescription("");
    setSelectedOpportunityIds([]);
  };

  const handleOpportunityToggle = (opportunityId: string, checked: boolean) => {
    if (checked) {
      setSelectedOpportunityIds(prev => [...prev, opportunityId]);
    } else {
      setSelectedOpportunityIds(prev => prev.filter(id => id !== opportunityId));
    }
  };

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      setSelectedOpportunityIds([]);
    } else {
      setSelectedOpportunityIds(allOpportunityIds);
    }
  };

  return (
    <Sheet open={showUtilityForm} onOpenChange={setShowUtilityForm}>
      <SheetTrigger asChild>
        <Button>{buttonLabel}</Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
        <SheetHeader className="text-left pb-6">
          <SheetTitle>
            {step === "opportunities" && "体験を選択"}
            {step === "details" && "チケットの詳細を入力"}
          </SheetTitle>
          <SheetDescription>
            {step === "opportunities" && "このチケットで利用できるようにしたい体験を選択してください。"}
            {step === "details" && "チケットの種類の詳細を入力してください。"}
          </SheetDescription>
        </SheetHeader>

        {step === "opportunities" && (
          <div className="space-y-4">
            <div>
              <Label>体験を選択</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 pb-2 border-b">
                  <Checkbox
                    id="select-all-opportunities"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el && "indeterminate" in el) {
                        (el as any).indeterminate = isPartiallySelected;
                      }
                    }}
                    onCheckedChange={handleSelectAllToggle}
                  />
                  <Label
                    htmlFor="select-all-opportunities"
                    className="text-sm font-medium cursor-pointer"
                  >
                    すべて選択
                  </Label>
                </div>
                <ScrollArea className="max-h-80">
                  <div className="space-y-2">
                    {mockOpportunities.map((opportunity) => {
                      const isSelected = selectedOpportunityIds.includes(opportunity.id);
                      return (
                        <div
                          key={opportunity.id}
                          className={`flex items-start space-x-2 p-3 rounded-lg border-2 transition-colors ${
                            isSelected
                              ? "border-primary bg-primary-foreground"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Checkbox
                            id={`opportunity-${opportunity.id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleOpportunityToggle(opportunity.id, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`opportunity-${opportunity.id}`}
                            className="text-sm font-medium cursor-pointer flex-1"
                          >
                            {opportunity.title}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => setStep("details")}
                className="w-full"
              >
                次へ
              </Button>
              <Button
                variant="tertiary"
                onClick={handleReset}
                className="w-full"
              >
                キャンセル
              </Button>
            </div>
          </div>
        )}

        {step === "details" && (
          <div className="space-y-4">
            <div>
              <Label>チケット名 (管理用)</Label>
              <Input value={utilityName} onChange={(e) => setUtilityName(e.target.value)} />
              <p className="text-body-sm text-muted-foreground mt-1">
                チケットを贈る相手には表示されません。
              </p>
            </div>
            <div>
              <Label>コメント</Label>
              <Input
                value={utilityDescription}
                onChange={(e) => setUtilityDescription(e.target.value)}
              />
              <p className="text-body-sm text-muted-foreground mt-1">
                チケットを贈る相手に表示されるメッセージを設定できます。
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={handleCreateUtility}
                disabled={isSubmitting || !utilityName.trim()}
                className="w-full"
              >
                {isSubmitting ? "作成中..." : "チケットの種類を作成"}
              </Button>
              <Button
                variant="tertiary"
                onClick={() => setStep("opportunities")}
                className="w-full"
              >
                戻る
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

const meta: Meta<typeof MockCreateUtilitySheet> = {
  title: "App/Admin/Tickets/Utilities/CreateUtilitySheet",
  component: MockCreateUtilitySheet,
  tags: ["autodocs"],
  argTypes: {
    buttonLabel: {
      control: "text",
      description: "Button label text",
    },
  },
  parameters: {
    docs: {
      description: {
        component: "チケット種類作成シート。GraphQL依存関係をモック化してStorybook用に簡略化。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MockCreateUtilitySheet>;

export const Default: Story = {
  args: {
    buttonLabel: "新規作成",
    onUtilityCreated: async () => console.log("Utility created callback"),
  },
};

export const CustomButtonLabel: Story = {
  args: {
    buttonLabel: "チケット種類を追加",
    onUtilityCreated: async () => {
      console.log("Utility created successfully!");
      alert("チケット種類が作成されました！");
    },
  },
};
