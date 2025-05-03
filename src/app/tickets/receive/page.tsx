"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { TICKET_CLAIM } from "@/graphql/mutations/ticket";
import { VIEW_TICKET_CLAIM } from "@/graphql/queries/ticket";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import LoginModal from "@/components/elements/LoginModal";
import { toast } from "sonner";
import { ClaimLinkStatus } from "@/gql/graphql";

export default function TicketReceivePage() {
  const searchParams = useSearchParams();
  const ticketClaimLinkId = searchParams.get("token");
  if (!ticketClaimLinkId) {
    throw new Error("URLが無効か、既に使用されています。");
  }

  const { user } = useAuth();
  const [hasIssued, setHasIssued] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const {
    data: viewData,
    loading: viewLoading,
    error: viewError,
  } = useQuery(VIEW_TICKET_CLAIM, {
    variables: { id: ticketClaimLinkId },
  });

  const [claimTickets, { data: claimData, loading: claimLoading, error: claimError }] =
    useMutation(TICKET_CLAIM);

  useEffect(() => {
    if (viewData?.ticketClaimLink == null) return;
    setHasIssued(viewData.ticketClaimLink.status !== ClaimLinkStatus.Issued);
  }, [viewData]);

  useEffect(() => {
    if (claimData?.ticketClaim?.tickets?.length) {
      setHasIssued(true);
      toast.success("チケットを獲得しました！");
    }
  }, [claimData]);

  useEffect(() => {
    if (claimError) {
      toast.error("チケット発行中にエラーが発生しました: " + claimError.message);
    }
  }, [claimError]);

  const onSubmit = async () => {
    await claimTickets({ variables: { input: { ticketClaimLinkId } } });
  };

  if (viewLoading) {
    return <div className="container mx-auto px-4 py-6">Loading...</div>;
  }
  if (viewError) {
    return (
      <div className="container mx-auto px-4 py-6 text-red-600">
        エラーが発生しました: {viewError.message}
      </div>
    );
  }

  const claimLink = viewData!.ticketClaimLink!;
  const { qty, issuer } = claimLink;
  const { owner } = issuer;

  const ActionButton = () => {
    if (!user) {
      return (
        <Button size="lg" onClick={() => setIsLoginModalOpen(true)}>
          ログインして獲得する
        </Button>
      );
    } else if (claimLoading) {
      return (
        <Button size="lg" disabled>
          <Loader2 className="animate-spin" />
          チケット発行中
        </Button>
      );
    } else if (!hasIssued) {
      return (
        <Button size="lg" onClick={onSubmit}>
          チケットを獲得する
        </Button>
      );
    } else {
      return (
        <Link
          href={`/search/result?type=activity&q=${encodeURIComponent(owner.name)}&useTicket=true`}
          className={buttonVariants({ variant: "secondary", size: "lg" })}
        >
          体験を探す
        </Link>
      );
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 px-6 py-12 justify-center overflow-y-auto">
      <Card className="flex-1 min-h-0 grid content-center gap-6 p-6 w-full">
        <div className="flex flex-col justify-center items-center gap-2">
          <p className="text-center text-body-md">
            <span className="text-display-sm">{owner.name}</span>
            さんから
            <br />
            招待チケットが届きました！
          </p>
          <Avatar className="inline-block border-2 w-[120px] h-[120px]">
            {owner.image ? (
              <AvatarImage src={owner.image} alt={owner.name} />
            ) : (
              <AvatarFallback className="text-4xl">{owner.name.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          <div className="m-6 flex flex-col gap-2">
            <div className="flex gap-4 items-baseline">
              <p className="text-caption text-body-sm w-8 min-w-8">枚数</p>
              <p className="text-body-sm flex-grow">{qty} 枚</p>
            </div>
            <div className="flex gap-4 items-baseline">
              <p className="text-caption text-body-sm w-8 min-w-8">用途</p>
              <p className="text-body-sm flex-grow">{owner.name}さんが主催する体験に無料参加できます</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-primary-foreground">
          <p className="text-title-sm font-bold">お願い🙏</p>
          <ul className="text-body-sm list-disc">
            <li>ぜひ誰かを誘って参加してください！</li>
            <li>当日の様子を写真に撮って、投稿しましょう！関わりを残せます！</li>
          </ul>
        </div>
        <ActionButton />
      </Card>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
