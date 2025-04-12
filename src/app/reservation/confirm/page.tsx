"use client";

import { useEffect, useState, useMemo } from "react";
import { useHeader } from "@/contexts/HeaderContext";
import { useOpportunity } from "@/hooks/useOpportunity";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Share, X, Calendar, Clock, Users, AlertCircle, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ja } from "date-fns/locale";
import { Toaster } from "@/app/components/ui/sonner";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { CREATE_RESERVATION_MUTATION } from "@/graphql/mutations/reservation";
import { parseDateTime, formatDateTime } from "@/utils/date";
import { useAuth } from "@/contexts/AuthContext";
import { GetUserWalletDocument } from "@/gql/graphql";
import { Switch } from "@/components/ui/switch";

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-9 h-9 flex-shrink-0 rounded-full bg-[#F4F4F5] flex items-center justify-center">
    <div className="w-5 h-5 text-[#71717A] flex items-center justify-center">
      {children}
    </div>
  </div>
);

const AlertIconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-9 h-9 flex-shrink-0 rounded-full bg-[#FEFCE8] flex items-center justify-center">
    <div className="w-5 h-5 text-[#F0B03C] flex items-center justify-center">
      {children}
    </div>
  </div>
);

const OpportunityInfo = ({ opportunity, pricePerPerson }: { opportunity: any; pricePerPerson: number }) => (
  <div className="rounded-lg p-4 mb-6">
    <div className="flex gap-4">
      <div className="relative w-20 h-20">
        <Image
          src={opportunity.image || "/placeholder.png"}
          alt={opportunity.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div>
        <h2 className="text-lg font-medium mb-1">{opportunity.title}</h2>
        <p className="text-sm text-gray-600 mb-1">1人あたり{pricePerPerson.toLocaleString()}円から</p>
        <div className="flex items-center text-sm text-gray-600">
          <span>{opportunity.place?.name || "場所未定"}</span>
        </div>
      </div>
    </div>
  </div>
);

const ReservationDetails = ({ startDateTime, endDateTime, participantCount }: { 
  startDateTime: Date | null; 
  endDateTime: Date | null;
  participantCount: number;
}) => (
  <div className="rounded-lg p-4 mb-6">
    <h3 className="text-lg font-medium mb-4">申し込み内容</h3>
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <IconWrapper>
          <Calendar size={18} strokeWidth={1.5} />
        </IconWrapper>
        <span>{formatDateTime(startDateTime, "yyyy年M月d日（E）", { locale: ja })}</span>
      </div>
      <div className="flex items-center gap-3">
        <IconWrapper>
          <Clock size={18} strokeWidth={1.5} />
        </IconWrapper>
        <span>
          {formatDateTime(startDateTime, "HH:mm")}-
          {formatDateTime(endDateTime, "HH:mm")}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <IconWrapper>
          <Users size={18} strokeWidth={1.5} />
        </IconWrapper>
        <span>{participantCount}人</span>
      </div>
    </div>
  </div>
);

const PaymentSection = ({ 
  ticketCount, 
  onIncrement, 
  onDecrement, 
  maxTickets,
  pricePerPerson,
  participantCount,
  useTickets,
  setUseTickets,
}: { 
  ticketCount: number;
  onIncrement: () => void;
  onDecrement: () => void;
  maxTickets: number;
  pricePerPerson: number;
  participantCount: number;
  useTickets: boolean;
  setUseTickets: (value: boolean) => void;
}) => (
  <div className="rounded-lg p-4 mb-6">
    <h3 className="text-xl font-bold mb-6">お支払い</h3>
    
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Switch 
          checked={useTickets} 
          onCheckedChange={setUseTickets}
          className="scale-125"
        />
        <span className="text-lg">チケットを利用する</span>
      </div>
    </div>
    <p className="text-gray-500 mb-4">保有しているチケット: {maxTickets}枚</p>

    {useTickets && (
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={onDecrement}
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full text-2xl"
            disabled={ticketCount <= 1}
          >
            -
          </Button>
          <span className="text-2xl font-medium">{ticketCount}</span>
          <Button
            onClick={onIncrement}
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full text-2xl"
            disabled={ticketCount >= maxTickets}
          >
            +
          </Button>
        </div>
      </div>
    )}

    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-xl font-bold mb-4">当日のお支払い</h4>
      <div className="space-y-3">
        <div className="flex justify-between text-base">
          <span>通常申し込み</span>
          <div>
            <span>{pricePerPerson.toLocaleString()}円</span>
            <span className="mx-2">×</span>
            <span>{participantCount - (useTickets ? ticketCount : 0)}名</span>
            <span className="mx-2">=</span>
            <span>{(pricePerPerson * (participantCount - (useTickets ? ticketCount : 0))).toLocaleString()}円</span>
          </div>
        </div>
        {useTickets && (
          <div className="flex justify-between text-base">
            <span>チケット利用</span>
            <div>
              <span>0円</span>
              <span className="mx-2">×</span>
              <span>{ticketCount}名</span>
              <span className="mx-2">=</span>
              <span>0円</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between mt-6 text-xl font-bold">
        <span>合計</span>
        <span>{(pricePerPerson * (participantCount - (useTickets ? ticketCount : 0))).toLocaleString()}円</span>
      </div>
    </div>
  </div>
);

const Notes = ({ requireApproval = false }: { requireApproval?: boolean }) => (
  <div className="rounded-lg p-4 mb-6">
    <h3 className="text-lg font-medium mb-4">留意事項</h3>
    <div className="space-y-4">
      {requireApproval && (
        <div className="flex items-center gap-3">
          <AlertIconWrapper>
            <AlertCircle size={18} strokeWidth={1.5} />
          </AlertIconWrapper>
          <p className="text-sm flex-1">ホストによる確認後に、予約が確定します。</p>
        </div>
      )}
      <div className="flex items-center gap-3">
        <AlertIconWrapper>
          <AlertCircle size={18} strokeWidth={1.5} />
        </AlertIconWrapper>
        <p className="text-sm flex-1">
          実施確定または中止のどちらの場合でも、公式LINEから14日前までにご連絡します。
        </p>
      </div>
      <div className="flex items-center gap-3">
        <AlertIconWrapper>
          <AlertCircle size={18} strokeWidth={1.5} />
        </AlertIconWrapper>
        <p className="text-sm flex-1">当日は現金をご用意下さい。</p>
      </div>
      <div className="flex items-center gap-3">
        <AlertIconWrapper>
          <AlertCircle size={18} strokeWidth={1.5} />
        </AlertIconWrapper>
        <p className="text-sm flex-1">キャンセルは開催日の7日前まで可能です。</p>
      </div>
    </div>
  </div>
);

export default function ConfirmPage() {
  const { updateConfig } = useHeader();
  const [ticketCount, setTicketCount] = useState(1);
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get("id");
  const slotStartsAt = searchParams.get("starts_at");
  const participantCount = parseInt(searchParams.get("guests") || "1", 10);
  const communityId = searchParams.get("community_id") || "";
  const { user: currentUser } = useAuth();
  
  const { opportunity, loading, error } = useOpportunity(opportunityId || "", communityId);
  
  const { data: walletData } = useQuery(GetUserWalletDocument, {
    variables: { id: currentUser?.id || "" },
    skip: !currentUser?.id,
  });

  const availableTickets = useMemo(() => {
    if (!opportunity?.requiredUtilities?.length) {
      return walletData?.user?.wallets?.edges?.[0]?.node?.tickets?.edges?.length || 0;
    }

    const requiredUtilityIds = new Set(
      opportunity.requiredUtilities.map(u => u.id)
    );

    const availableTickets = walletData?.user?.wallets?.edges?.[0]?.node?.tickets?.edges?.filter(
      edge => {
        const utilityId = edge?.node?.utility?.id;
        return utilityId ? requiredUtilityIds.has(utilityId) : false;
      }
    ) || [];

    return availableTickets.length;
  }, [opportunity?.requiredUtilities, walletData]);

  console.log("walletData", walletData);

  const [createReservation, { loading: creatingReservation }] = useMutation(CREATE_RESERVATION_MUTATION);

  const selectedSlot = opportunity?.slots?.edges?.find(
    edge => {
      if (!edge?.node?.startsAt || !slotStartsAt) return false;
      
      const slotDateTime = parseDateTime(String(edge.node.startsAt));
      const paramDateTime = parseDateTime(decodeURIComponent(slotStartsAt));
      
      if (!slotDateTime || !paramDateTime) return false;
      
      return slotDateTime.getTime() === paramDateTime.getTime();
    }
  );

  const incrementTicket = () => {
    if (ticketCount < availableTickets) {
      setTicketCount((prev) => prev + 1);
    }
  };

  const decrementTicket = () => {
    if (ticketCount > 1) {
      setTicketCount((prev) => prev - 1);
    }
  };

  useEffect(() => {
    updateConfig({
      title: "申し込み確認",
      showBackButton: true,
      showLogo: false,
    });
  }, [updateConfig]);

  const [useTickets, setUseTickets] = useState(false);

  const handleConfirmReservation = async () => {
    try {
      if (!opportunityId || !slotStartsAt || !selectedSlot?.node) {
        throw new Error("必要な情報が不足しています");
      }

      const ticketIds = walletData?.user?.wallets?.edges?.[0]?.node?.tickets?.edges
        ?.filter(edge => {
          if (!opportunity?.requiredUtilities?.length) return true;
          const utilityId = edge?.node?.utility?.id;
          return utilityId && opportunity.requiredUtilities.some(u => u.id === utilityId);
        })
        ?.slice(0, ticketCount)
        ?.map(edge => edge?.node?.id)
        ?.filter((id): id is string => id !== undefined) || [];

      if (ticketCount > 0 && ticketIds.length < ticketCount) {
        throw new Error("必要なチケットが不足しています");
      }

      const result = await createReservation({
        variables: {
          input: {
            opportunitySlotId: selectedSlot.node.id,
            totalParticipantCount: participantCount,
            paymentMethod: ticketCount > 0 ? "TICKET" : "FEE",
            ticketIdsIfNeed: ticketCount > 0 ? ticketIds : undefined,
          },
        },
      });

      if (result.data?.reservationCreate?.reservation) {
        toast.success("予約が完了しました");
        window.location.href = `/reservation/complete?opportunity_id=${opportunityId}&community_id=${communityId}`;
      }
    } catch (error) {
      console.error("Reservation error:", error);
      toast.error(error instanceof Error ? error.message : "予約に失敗しました。もう一度お試しください。");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!opportunity) return <div>No opportunity found</div>;
  if (!selectedSlot?.node) return <div>Selected time slot not found</div>;

  const startDateTime = selectedSlot?.node?.startsAt ? parseDateTime(String(selectedSlot.node.startsAt)) : null;
  const endDateTime = selectedSlot?.node?.endsAt ? parseDateTime(String(selectedSlot.node.endsAt)) : null;
  
  if (!startDateTime || !endDateTime) {
    return <div>Invalid date format in time slot</div>;
  }

  const pricePerPerson = opportunity.feeRequired || 0;

  return (
    <main className="pt-16 px-4 pb-8 min-h-screen">
      <Toaster />
      
      <OpportunityInfo 
        opportunity={opportunity} 
        pricePerPerson={pricePerPerson} 
      />
      <ReservationDetails 
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        participantCount={participantCount}
      />

      <PaymentSection
        ticketCount={ticketCount}
        onIncrement={incrementTicket}
        onDecrement={decrementTicket}
        maxTickets={availableTickets}
        pricePerPerson={pricePerPerson}
        participantCount={participantCount}
        useTickets={useTickets}
        setUseTickets={setUseTickets}
      />

      <Notes requireApproval={opportunity.requireApproval} />

      <Button 
        className="w-full py-6 text-base rounded-lg" 
        size="lg"
        onClick={handleConfirmReservation}
        disabled={creatingReservation || (useTickets && ticketCount > availableTickets)}
      >
        {creatingReservation ? "処理中..." : "申し込みを確定"}
      </Button>
    </main>
  );
}
