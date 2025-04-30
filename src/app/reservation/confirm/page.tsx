"use client";

import { useEffect, useState, useMemo } from "react";
import { useHeader } from "@/contexts/HeaderContext";
import { useOpportunity } from "@/hooks/useOpportunity";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Share, X, Calendar, Clock, Users, AlertCircle, Ticket, MapPin, Phone } from "lucide-react";
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
import LoginModal from "@/app/components/elements/LoginModal";
import { useLoading } from '@/hooks/useLoading';

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-gray-500">
    {children}
  </div>
);

const AlertIconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-[#F0B03C]">
    {children}
  </div>
);

const OpportunityInfo = ({ opportunity, pricePerPerson }: { opportunity: any; pricePerPerson: number }) => (
  <div className="px-4 mt-8 mb-8">
    <div className="flex justify-between items-start gap-4">
      <div>
        <h1 className="title-lg font-bold leading-tight mb-4">
          {opportunity.title}
        </h1>
        
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/placeholder-avatar.png"
              alt="田中 太郎"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-xl">田中 太郎</span>
        </div>
      </div>

      <div className="relative w-[108px] h-[108px] rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={opportunity.image || "/placeholder.png"}
          alt={opportunity.title}
          fill
          className="object-cover"
        />
      </div>
    </div>
  </div>
);

const ReservationDetails = ({ startDateTime, endDateTime, participantCount }: { 
  startDateTime: Date | null; 
  endDateTime: Date | null;
  participantCount: number;
}) => (
  <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-6">
    <div className="flex items-center gap-3">
      <IconWrapper>
        <Calendar size={18} strokeWidth={1.5} />
      </IconWrapper>
      <div className="flex flex-col">
        <span className="text-base">
          {formatDateTime(startDateTime, "yyyy年M月d日（E）", { locale: ja })}
        </span>
        <span className="text-base text-gray-600">
          {formatDateTime(startDateTime, "HH:mm")}-
          {formatDateTime(endDateTime, "HH:mm")}
        </span>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <IconWrapper>
        <MapPin size={18} strokeWidth={1.5} />
      </IconWrapper>
      <div className="flex flex-col">
        <span className="text-base">高松市役所</span>
        <span className="text-sm text-gray-600">香川県高松市番町1丁目8-15</span>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <IconWrapper>
        <Users size={18} strokeWidth={1.5} />
      </IconWrapper>
      <span className="text-base">{participantCount}人</span>
    </div>

    {/* <div className="flex items-center gap-3">
      <IconWrapper>
        <Phone size={18} strokeWidth={1.5} />
      </IconWrapper>
      <div className="flex flex-col">
        <span className="text-base">080-0000-0000</span>
        <span className="text-sm text-gray-600">（緊急連絡先）</span>
      </div>
    </div> */}
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
}) => {
  const handleUseTicketsChange = (value: boolean) => {
    if (maxTickets > 0) {
      setUseTickets(value);
    }
  };

  return (
    <div className="rounded-lg p-4 mb-6">
      <h3 className="text-2xl font-bold mb-6">お支払い</h3>
      
      <div className="rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Switch 
              checked={useTickets} 
              onCheckedChange={handleUseTicketsChange}
              disabled={maxTickets === 0}
              className="scale-125 data-[state=checked]:bg-[#4361EE] data-[state=checked]:hover:bg-[#4361EE]"
            />
            <div className="flex flex-col">
              <span className="text-lg">チケットを利用する</span>
              <p className="text-gray-500">保有しているチケット: {maxTickets}枚</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-center gap-8">
            <Button
              onClick={onDecrement}
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full text-2xl"
              disabled={!useTickets || ticketCount <= 1}
            >
              -
            </Button>
            <span className="text-2xl font-medium w-8 text-center">{ticketCount}</span>
            <Button
              onClick={onIncrement}
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full text-2xl"
              disabled={!useTickets || ticketCount >= maxTickets}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-3 flex justify-between items-center">
        <h4 className="text-lg font-bold">当日のお支払い</h4>
        <span className="text-lg font-bold">{(pricePerPerson * (participantCount - (useTickets ? ticketCount : 0))).toLocaleString()}円</span>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="space-y-3">
          <div className="flex justify-between text-base text-gray-600">
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
            <div className="flex justify-between text-base text-gray-600">
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
      </div>
    </div>
  );
};

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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get("id");
  const slotStartsAt = searchParams.get("starts_at");
  const participantCount = parseInt(searchParams.get("guests") || "1", 10);
  const { user: currentUser } = useAuth();
  const { setIsLoading } = useLoading();
  
  const { opportunity, loading, error } = useOpportunity(opportunityId || "");
  
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
      title: "申し込み内容の確認",
      showBackButton: true,
      showLogo: false,
    });
  }, [updateConfig]);

  const [useTickets, setUseTickets] = useState(false);

  const handleConfirmReservation = async () => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      if (!opportunityId || !slotStartsAt || !selectedSlot?.node) {
        throw new Error("必要な情報が不足しています");
      }

      let ticketIds: string[] = [];
      if (useTickets) {
        ticketIds = walletData?.user?.wallets?.edges?.[0]?.node?.tickets?.edges
          ?.filter(edge => {
            if (!opportunity?.requiredUtilities?.length) return true;
            const utilityId = edge?.node?.utility?.id;
            return utilityId && opportunity.requiredUtilities.some(u => u.id === utilityId);
          })
          ?.slice(0, ticketCount)
          ?.map(edge => edge?.node?.id)
          ?.filter((id): id is string => id !== undefined) || [];

        if (ticketIds.length < ticketCount) {
          throw new Error("必要なチケットが不足しています");
        }
      }

      const result = await createReservation({
        variables: {
          input: {
            opportunitySlotId: selectedSlot.node.id,
            totalParticipantCount: participantCount,
            paymentMethod: useTickets ? "TICKET" : "FEE",
            ticketIdsIfNeed: useTickets ? ticketIds : undefined,
          },
        },
      });

      if (result.data?.reservationCreate?.reservation) {
        toast.success("予約が完了しました");
        window.location.href = `/reservation/complete?opportunity_id=${opportunityId}`;
      }
    } catch (error) {
      console.error("Reservation error:", error);
      toast.error(error instanceof Error ? error.message : "予約に失敗しました。もう一度お試しください。");
    }
  };

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

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
    <main className="pb-8 min-h-screen">
      <Toaster />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      
      <OpportunityInfo 
        opportunity={opportunity} 
        pricePerPerson={pricePerPerson} 
      />

      <div className="px-4">
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
          className="w-full py-6 text-base rounded-lg bg-[#4361EE] hover:bg-[#3651DE]" 
          size="lg"
          onClick={handleConfirmReservation}
          disabled={creatingReservation || (useTickets && ticketCount > availableTickets)}
        >
          {creatingReservation ? "処理中..." : "申し込みを確定"}
        </Button>
      </div>
    </main>
  );
}
