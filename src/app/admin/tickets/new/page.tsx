"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  useGetUtilitiesQuery,
  useTicketIssueMutation,
  GqlSortDirection,
} from "@/types/graphql";
import { COMMUNITY_ID } from "@/utils";
import { useAuth } from "@/contexts/AuthProvider";

export default function NewTicketPage() {
  const headerConfig = useMemo(
    () => ({
      title: "チケットリンク新規発行",
      showBackButton: true,
      showLogo: false,
      backTo: "/admin/tickets",
    }),
    [],
  );
  useHeaderConfig(headerConfig);
  const router = useRouter();

  const { user } = useAuth();

  const [selectedUtilityId, setSelectedUtilityId] = useState<string | null>(null);
  const [ticketQty, setTicketQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [issueTicket] = useTicketIssueMutation();

  const { data: utilityData } = useGetUtilitiesQuery({
    variables: {
      filter: { communityId: COMMUNITY_ID, createdBy: user?.id ?? "" },
      sort: { createdAt: GqlSortDirection.Desc },
      first: 20,
    },
  });

  const utilityList = utilityData?.utilities?.edges?.map((e) => e?.node) ?? [];

  const handleIssueTicket = async () => {
    if (!selectedUtilityId) return;
    setIsSubmitting(true);
    try {
      const res = await issueTicket({
        variables: {
          input: {
            utilityId: selectedUtilityId,
            qtyToBeIssued: ticketQty,
          },
          permission: { communityId: COMMUNITY_ID },
        },
      });

      const ticketId = res.data?.ticketIssue?.issue.claimLink?.id;
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
    <div className="p-4 space-y-8 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div>
          <Label>チケットの種類を選択</Label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedUtilityId ?? ""}
            onChange={(e) => setSelectedUtilityId(e.target.value)}
          >
            <option value="">選択してください</option>
            {utilityList.map((utility) => (
              <option key={utility?.id} value={utility?.id}>
                {utility?.name}
              </option>
            ))}
          </select>
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
        <Button onClick={handleIssueTicket} disabled={isSubmitting || !selectedUtilityId}>
          {isSubmitting ? "発行中..." : "リンクを発行"}
        </Button>
      </div>
    </div>
  );
}
