"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { CardWrapper } from "@/components/ui/card-wrapper";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GqlClaimLinkStatus, useTicketClaimLinkQuery } from "@/types/graphql";
import { Input } from "@/components/ui/input";
import { displayMultipleUsers } from "@/utils";
import { displayDatetime } from "@/utils/date";

const QRCode = dynamic(() => import("react-qr-code"), { ssr: false });

export default function TicketDetailPage() {
  const params = useParams();
  const id = (Array.isArray(params.id) ? params.id[0] : params.id) ?? "";

  const headerConfig = useMemo(
    () => ({
      title: `チケット`,
      showBackButton: true,
      showLogo: false,
      backTo: "/admin/tickets",
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { data, loading, error } = useTicketClaimLinkQuery({
    variables: { id },
  });

  if (loading) {
    return (
      <div className="p-4 pt-16 flex justify-center items-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pt-16">
        <ErrorState title="チケット情報の取得に失敗しました" />
      </div>
    );
  }

  const ticketClaimLink = data?.ticketClaimLink;
  if (!ticketClaimLink) {
    return (
      <div className="p-4 pt-16">
        <ErrorState title="チケットが見つかりません" />
      </div>
    );
  }

  const ticketRecipients = ticketClaimLink.tickets?.map(t => t.wallet?.user) ?? [];
  const uniqueRecipients = ticketRecipients.filter((el1, idx, self) => idx === self.findIndex(el2 => el1?.id === el2?.id));
  const uniqueRecipientNames = uniqueRecipients
    .map(el => el?.name)
    .sort()
    .map(el => el ?? "不明なユーザー");
  const qty = data?.ticketClaimLink?.issuer
    ? data?.ticketClaimLink?.issuer?.qtyToBeIssued
    : undefined;

  const qrUrl =
    typeof window !== "undefined" ? `${ window.location.origin }/tickets/receive?token=${ id }` : "";
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      toast.success("リンクをコピーしました");
    } catch (err) {
      toast.error("リンクのコピーに失敗しました");
      console.error("Clipboard copy failed:", err);
    }
  };

  return (
    <div className="p-4 pt-16">
      <CardWrapper className="p-4 mb-4">
        <div className="flex flex-col items-center gap-2 mb-4">
          <h1 className="text-title-md text-center">{ ticketClaimLink.issuer?.utility?.name ?? "チケット" }</h1>
          <Badge
            size="md"
            variant={ ticketClaimLink.status === GqlClaimLinkStatus.Issued ? "primary" : ticketClaimLink.status === GqlClaimLinkStatus.Claimed ? "secondary" : "destructive" }
          >
            { ticketClaimLink.status === GqlClaimLinkStatus.Issued ? "受取可能" : ticketClaimLink.status === GqlClaimLinkStatus.Claimed ? "受取済み" : "無効" }
          </Badge>
        </div>
        <p className="text-body-md text-muted-foreground mb-4">
          チケットを贈りたい相手にQRコードを読み取ってもらうか、リンクをコピーしてLINEなどで送ってあげましょう！
        </p>

        <div className="flex flex-col items-center mb-6 gap-2">
          <div className="bg-white p-4 rounded-lg">
            { qrUrl && <QRCode value={ qrUrl } size={ 200 } /> }
          </div>
          <div className="rounded-md gap-2 flex items-center">
            <Input readOnly value={ qrUrl } onClick={ copyLink } />
            <Button variant="secondary" size="sm" onClick={ copyLink }>
              リンクをコピー
            </Button>
          </div>
        </div>

        <div className="space-y-2 p-4 rounded-md bg-card">
          <div className="flex items-center">
            <p className="font-medium !text-tertiary-foreground">発行枚数:</p>
            <p className="ml-2">{ qty }</p>
          </div>
          <div className="flex items-center">
            <p className="font-medium !text-tertiary-foreground">発行日時:</p>
            <p className="ml-2">{ displayDatetime(ticketClaimLink.createdAt) }</p>
          </div>
          { ticketClaimLink.claimedAt && (
            <>
              <div className="flex items-center">
                <p className="font-medium !text-tertiary-foreground">受取日時:</p>
                <p className="ml-2">{ displayDatetime(ticketClaimLink.claimedAt) }</p>
              </div>
              <div className="flex items-center">
                <p className="font-medium !text-tertiary-foreground">受け取った人:</p>
                <p className="ml-2">{ displayMultipleUsers(uniqueRecipientNames, 1) }</p>
              </div>
            </>
          ) }
        </div>
      </CardWrapper>
    </div>
  );
}
