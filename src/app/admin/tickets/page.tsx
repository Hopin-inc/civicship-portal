"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCreateUtilityMutation, useTicketIssueMutation } from "@/types/graphql";
import { COMMUNITY_ID } from "@/utils";

export default function TicketsPage() {
  const headerConfig = useMemo(
    () => ({
      title: "チケット発行",
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);
  const router = useRouter();

  const [step, setStep] = useState<"utility" | "issue">("utility");
  const [utilityId, setUtilityId] = useState<string | null>(null);
  const [utilityName, setUtilityName] = useState("");
  const [utilityDescription, setUtilityDescription] = useState("");
  const [pointsRequired, setPointsRequired] = useState(1);
  const [ticketQty, setTicketQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createUtility] = useCreateUtilityMutation();
  const [issueTicket] = useTicketIssueMutation();

  const handleCreateUtility = async () => {
    setIsSubmitting(true);
    try {
      const res = await createUtility({
        variables: {
          input: {
            name: utilityName,
            description: utilityDescription || undefined,
            pointsRequired,
            images: [],
          },
          permission: {
            communityId: COMMUNITY_ID,
          },
        },
      });
      const id = res.data?.utilityCreate?.utility?.id;
      if (id) {
        setUtilityId(id);
        setStep("issue");
        toast.success("ユーティリティを作成しました");
      } else {
        toast.error("ユーティリティ作成に失敗しました");
      }
    } catch {
      toast.error("ユーティリティ作成エラー");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIssueTicket = async () => {
    if (!utilityId) return;
    setIsSubmitting(true);
    try {
      const res = await issueTicket({
        variables: {
          input: {
            utilityId,
            qtyToBeIssued: ticketQty,
          },
          permission: { communityId: COMMUNITY_ID },
        },
      });
      const ticketId = res.data?.ticketIssue?.issue?.id;
      if (ticketId) {
        toast.success("チケットを発行しました");
        router.push(`/admin/tickets/${ticketId}`);
      } else {
        toast.error("チケット発行に失敗しました");
      }
    } catch {
      toast.error("チケット発行エラー");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">
        {step === "utility" ? "ユーティリティ作成" : "チケット発行"}
      </h1>

      {step === "utility" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="utility-name">ユーティリティ名</Label>
            <Input
              id="utility-name"
              value={utilityName}
              onChange={(e) => setUtilityName(e.target.value)}
              placeholder="例：参加特典ポイント"
            />
          </div>
          <Button
            onClick={handleCreateUtility}
            disabled={isSubmitting || utilityName.trim() === ""}
            className="w-full py-4"
          >
            {isSubmitting ? "作成中..." : "ユーティリティを作成"}
          </Button>
        </div>
      )}

      {step === "issue" && utilityId && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="ticket-qty">発行数</Label>
            <Input
              id="ticket-qty"
              type="number"
              min={1}
              value={ticketQty}
              onChange={(e) => setTicketQty(Number(e.target.value))}
            />
          </div>
          <Button
            onClick={handleIssueTicket}
            disabled={isSubmitting || ticketQty <= 0}
            className="w-full py-4"
          >
            {isSubmitting ? "発行中..." : "チケットを発行"}
          </Button>
        </div>
      )}
    </div>
  );
}
