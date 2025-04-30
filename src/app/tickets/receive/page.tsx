"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@apollo/client";
import { TICKET_CLAIM } from "@/graphql/mutations/ticket";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { wait } from "@/utils";
import LoginModal from "@/components/elements/LoginModal";
import { toast } from "sonner";

export default function TicketReceivePage() {
  const searchParams = useSearchParams();
  const ticketClaimLinkId = searchParams.get("token");
  if (!ticketClaimLinkId) {
    throw new Error("URLが無効か、既に使用されています。");
  }

  const { user } = useAuth();
  const [hasIssued, setHasIssued] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const [claimTickets, { data: claimResult, loading: claimInProgress, error: claimError }] =
    useMutation(TICKET_CLAIM);

  const onSubmit = async () => {
    // await claimTickets({
    //   variables: {
    //     input: { ticketClaimLinkId },
    //   },
    // });
    await wait(3); // TODO: Remove this after debug
    // if (claimResult?.ticketClaim?.tickets?.length) {
      setHasIssued(true);
      toast.success("チケットを獲得しました！");
    // }
  };

  const issuer = {
    id: 0,
    avatar: undefined,
    name: "田中花子",
  }; // TODO: Remove this after debug

  const ActionButton = () => {
    if (!user) {
      return (
        <Button size="lg" onClick={() => setIsLoginModalOpen(true)}>
          ログインして獲得する
        </Button>
      );
    } else if (claimInProgress) {
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
          href={`/search/result?type=activity&q=${issuer.name}&useTicket=true`}
          className={buttonVariants({ variant: "secondary", size: "lg" })}
        >
          体験を探す
        </Link>
      );
    }
  };

  return (
    <div className="px-6 py-12 w-full h-full bg-white">
      <Card className="h-full flex flex-col justify-center items-center gap-6 p-6">
        <div className="flex flex-col justify-center items-center gap-2">
          <p className="text-center text-lg">
            <span className="text-2xl font-bold">田中花子</span>
            さんから
            <br />
            招待チケットが届きました！
          </p>
          <Avatar key={issuer.id} className="inline-block border-2 w-[120px] h-[120px]">
            <AvatarImage src={issuer.avatar} alt={issuer.name} />
            <AvatarFallback>{issuer.name[0]}</AvatarFallback>
          </Avatar>
          <div className="m-6 flex flex-col gap-2">
            <div className="flex gap-4 align-baseline">
              <p className="text-(--caption) w-8">枚数</p>
              <p className="flex-grow">2枚</p>
            </div>
            <div className="flex gap-4 align-baseline">
              <p className="text-(--caption) w-8">用途</p>
              <p className="flex-grow">{issuer.name}さんが主催する体験に無料参加できる</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-primary-foreground">
          <p className="text-lg font-bold">お願い🙏</p>
          <ul>
            <li>ぜひ誰かを誘って参加してください！</li>
            <li>当日の様子を写真に撮って、投稿しましょう！関わりを残せます！</li>
          </ul>
        </div>
        <ActionButton />
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </Card>
    </div>
  );
}
