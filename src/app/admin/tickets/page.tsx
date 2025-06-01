"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardWrapper } from "@/components/ui/card-wrapper";
import { toast } from "sonner";
import {
  GqlSortDirection,
  useCreateUtilityMutation,
  useGetTicketIssuersQuery,
  useGetUtilitiesQuery,
  useTicketIssueMutation,
} from "@/types/graphql";
import { COMMUNITY_ID } from "@/utils";
import Link from "next/link";

export default function TicketsPage() {
  const headerConfig = useMemo(() => ({ title: "チケット発行", showLogo: false }), []);
  useHeaderConfig(headerConfig);
  const router = useRouter();

  const [showUtilityForm, setShowUtilityForm] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);

  const [utilityName, setUtilityName] = useState("");
  const [utilityDescription, setUtilityDescription] = useState("");
  const [pointsRequired, setPointsRequired] = useState(1);
  const [selectedUtilityId, setSelectedUtilityId] = useState<string | null>(null);
  const [ticketQty, setTicketQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createUtility] = useCreateUtilityMutation();
  const [issueTicket] = useTicketIssueMutation();

  const { data: utilityData, refetch: refetchUtilities } = useGetUtilitiesQuery({
    variables: {
      filter: { communityIds: [COMMUNITY_ID] },
      sort: { createdAt: GqlSortDirection.Desc },
      first: 20,
    },
  });

  const { data: ticketData, refetch: refetchTickets } = useGetTicketIssuersQuery({
    variables: {
      sort: { createdAt: GqlSortDirection.Desc },
      first: 20,
    },
  });

  const utilityList = utilityData?.utilities?.edges?.map((e) => e?.node) ?? [];
  const ticketList = ticketData?.ticketIssuers?.edges?.map((e) => e?.node) ?? [];

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
          permission: { communityId: COMMUNITY_ID },
        },
      });
      const id = res.data?.utilityCreate?.utility?.id;
      if (id) {
        toast.success("ユーティリティを作成しました");
        setShowUtilityForm(false);
        setUtilityName("");
        setUtilityDescription("");
        setPointsRequired(1);
        await refetchUtilities();
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

      //TODO cliamLinkがnullになる、サーバー側は修正したつもり
      const ticketId = res.data?.ticketIssue?.issue.claimLink?.id;
      if (ticketId) {
        toast.success("チケットを発行しました");
        setShowIssueForm(false);
        setTicketQty(1);
        await refetchTickets();
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

  console.dir(ticketList, { depth: null });

  return (
    <div className="p-4 space-y-8 max-w-2xl mx-auto">
      {/* ユーティリティセクション */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">ユーティリティ一覧</h2>
          <Button onClick={() => setShowUtilityForm((prev) => !prev)}>
            {showUtilityForm ? "キャンセル" : "新規作成"}
          </Button>
        </div>
        {!showUtilityForm ? (
          <div className="space-y-2">
            {utilityList.length === 0 ? (
              <p className="text-muted-foreground">ユーティリティがありません</p>
            ) : (
              utilityList.map((utility) => (
                <CardWrapper key={utility?.id} className="p-4">
                  <div className="text-sm">
                    <div className="font-semibold">{utility?.name}</div>
                    <div className="text-muted-foreground">{utility?.description}</div>
                    <div>必要ポイント: {utility?.pointsRequired}</div>
                  </div>
                </CardWrapper>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>ユーティリティ名</Label>
              <Input value={utilityName} onChange={(e) => setUtilityName(e.target.value)} />
            </div>
            <div>
              <Label>説明</Label>
              <Input
                value={utilityDescription}
                onChange={(e) => setUtilityDescription(e.target.value)}
              />
            </div>
            <div>
              <Label>必要ポイント</Label>
              <Input
                type="number"
                min={0}
                value={pointsRequired}
                onChange={(e) => setPointsRequired(Number(e.target.value))}
              />
            </div>
            <Button onClick={handleCreateUtility} disabled={isSubmitting}>
              {isSubmitting ? "作成中..." : "ユーティリティ作成"}
            </Button>
          </div>
        )}
      </div>

      {/* チケット発行セクション */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">チケット一覧</h2>
          <Button onClick={() => setShowIssueForm((prev) => !prev)}>
            {showIssueForm ? "キャンセル" : "新規発行"}
          </Button>
        </div>
        {!showIssueForm ? (
          <div className="space-y-2">
            {ticketList.length === 0 ? (
              <p className="text-muted-foreground">チケットがありません</p>
            ) : (
              ticketList.map((ticket) => (
                <Link
                  key={`${ticket?.id}-${ticket?.claimLink?.id ?? "no-claimLink"}`}
                  href={`/admin/tickets/${ticket?.claimLink?.id}`}
                >
                  <CardWrapper className="p-4 cursor-pointer hover:bg-muted transition">
                    <div className="text-sm">
                      <div className="font-semibold">チケット #{ticket?.claimLink?.id ?? "?"}</div>
                      <div>
                        発行数: {ticket?.qtyToBeIssued} / ユーティリティ: {ticket?.utility?.name}
                      </div>
                    </div>
                  </CardWrapper>
                </Link>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>ユーティリティを選択</Label>
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
              {isSubmitting ? "発行中..." : "チケット発行"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
