import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MockCreateTicketSheet = ({ onTicketCreated }: { onTicketCreated?: () => Promise<void> }) => {
  const [showTicketForm, setShowTicketForm] = React.useState(false);
  const [selectedUtilityId, setSelectedUtilityId] = React.useState<string | null>(null);
  const [ticketQty, setTicketQty] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const mockUtilities = [
    { id: "util1", name: "体験チケット" },
    { id: "util2", name: "プレミアムチケット" },
    { id: "util3", name: "グループチケット" },
  ];

  const handleIssueTicket = async () => {
    if (!selectedUtilityId) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log("Ticket issued:", { utilityId: selectedUtilityId, qty: ticketQty });
      setIsSubmitting(false);
      setShowTicketForm(false);
      setSelectedUtilityId(null);
      setTicketQty(1);
      if (onTicketCreated) {
        onTicketCreated();
      }
    }, 2000);
  };

  const handleReset = () => {
    setShowTicketForm(false);
    setSelectedUtilityId(null);
    setTicketQty(1);
  };

  return (
    <Sheet open={showTicketForm} onOpenChange={setShowTicketForm}>
      <SheetTrigger asChild>
        <Button>新規発行</Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
        <SheetHeader className="text-left pb-6">
          <SheetTitle>チケットリンク新規発行</SheetTitle>
          <SheetDescription>
            チケットの種類と発行数を選択してください。
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          <div>
            <Label>チケットの種類を選択</Label>
            <Select value={selectedUtilityId ?? ""} onValueChange={setSelectedUtilityId}>
              <SelectTrigger>
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                {mockUtilities.map((utility) => (
                  <SelectItem key={utility.id} value={utility.id}>
                    {utility.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>発行数</Label>
            <Input
              type="number"
              min={1}
              value={ticketQty}
              onChange={(e) => setTicketQty(Number(e.target.value))}
            />
          </div>
          <div className="space-y-3">
            <Button
              onClick={handleIssueTicket}
              disabled={isSubmitting || !selectedUtilityId}
              className="w-full"
            >
              {isSubmitting ? "発行中..." : "リンクを発行"}
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
      </SheetContent>
    </Sheet>
  );
};

const meta: Meta<typeof MockCreateTicketSheet> = {
  title: "App/Admin/Tickets/CreateTicketSheet",
  component: MockCreateTicketSheet,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "チケット発行シート。GraphQL依存関係をモック化してStorybook用に簡略化。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MockCreateTicketSheet>;

export const Default: Story = {
  args: {
    onTicketCreated: async () => console.log("Ticket created callback"),
  },
};

export const InteractiveDemo: Story = {
  args: {
    onTicketCreated: async () => {
      console.log("Ticket created successfully!");
      alert("チケットが発行されました！");
    },
  },
};
