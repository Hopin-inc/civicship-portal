"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import {
  useGetUtilitiesQuery,
  useTicketIssueMutation,
  GqlSortDirection,
} from "@/types/graphql";
import { COMMUNITY_ID } from "@/utils";
import { useAuth } from "@/contexts/AuthProvider";

interface CreateTicketSheetProps {
  onTicketCreated?: () => Promise<void>;
}

export default function CreateTicketSheet({ onTicketCreated }: CreateTicketSheetProps) {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedUtilityId, setSelectedUtilityId] = useState<string | null>(null);
  const [ticketQty, setTicketQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  const [issueTicket] = useTicketIssueMutation();

  const { data: utilityData } = useGetUtilitiesQuery({
    variables: {
      filter: { communityIds: [COMMUNITY_ID], ownerIds: user?.id ? [user.id] : undefined },
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
        handleReset();
        if (onTicketCreated) {
          await onTicketCreated();
        }
        router.push(`/admin/tickets/${ ticketId }`);
      } else {
        toast.error("チケット発行に失敗しました");
      }
    } catch {
      toast.error("チケット発行エラー");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setShowTicketForm(false);
    setSelectedUtilityId(null);
    setTicketQty(1);
  };

  return (
    <Sheet open={ showTicketForm } onOpenChange={ setShowTicketForm }>
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
            <Select value={ selectedUtilityId ?? "" } onValueChange={ setSelectedUtilityId }>
              <SelectTrigger>
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                { utilityList.map((utility) => (
                  <SelectItem key={ utility?.id } value={ utility?.id ?? "" }>
                    { utility?.name }
                  </SelectItem>
                )) }
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>発行数</Label>
            <Input
              type="number"
              min={ 1 }
              value={ ticketQty }
              onChange={ (e) => setTicketQty(Number(e.target.value)) }
            />
          </div>
          <div className="space-y-3">
            <Button
              onClick={ handleIssueTicket }
              disabled={ isSubmitting || !selectedUtilityId }
              className="w-full"
            >
              { isSubmitting ? "発行中..." : "リンクを発行" }
            </Button>
            <Button
              variant="tertiary"
              onClick={ handleReset }
              className="w-full"
            >
              キャンセル
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
