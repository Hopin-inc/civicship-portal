"use client";

import { useEffect, useState } from "react";
import { useHeader } from "@/contexts/HeaderContext";
import { useOpportunity } from "@/hooks/useOpportunity";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Share, X, Calendar, Clock, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FormatOptions, Locale } from "date-fns";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

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

export default function ConfirmPage() {
  const { updateConfig } = useHeader();
  const [ticketCount, setTicketCount] = useState(1);
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get("opportunity_id");
  const slotStartsAt = searchParams.get("slot_starts_at");
  
  const parseDateTime = (dateTimeStr: string | null | undefined): Date | null => {
    if (!dateTimeStr) return null;
    try {
      const isoDateTimePart = dateTimeStr.split(' ')[0];
      return new Date(isoDateTimePart);
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  };

  const formatDateTime = (date: Date | null, formatStr: string, options?: { locale: Locale }) => {
    if (!date) return '';
    // Convert to ISO string first, then parse it back to ensure compatibility
    const dateStr = date.toISOString();
    return format(new Date(dateStr), formatStr, options);
  };

  const { opportunity, loading, error } = useOpportunity(opportunityId || "", "cm8qzi9z80000sbtm8z42st8e");

  console.log('opportunity slots:', opportunity?.slots?.edges?.map(edge => ({
    startsAt: edge?.node?.startsAt,
    parsedStartsAt: edge?.node?.startsAt ? parseDateTime(edge.node.startsAt)?.toISOString() : null
  })));

  const selectedSlot = opportunity?.slots?.edges?.find(
    edge => {
      if (!edge?.node?.startsAt || !slotStartsAt) return false;
      
      const slotDateTime = parseDateTime(edge.node.startsAt);
      const paramDateTime = parseDateTime(decodeURIComponent(slotStartsAt));
      
      if (!slotDateTime || !paramDateTime) return false;
      
      console.log('Comparing dates:', {
        slot: slotDateTime.toISOString(),
        param: paramDateTime.toISOString(),
        isMatch: slotDateTime.getTime() === paramDateTime.getTime()
      });
      
      return slotDateTime.getTime() === paramDateTime.getTime();
    }
  );

  const incrementTicket = () => {
    setTicketCount((prev) => prev + 1);
  };

  const decrementTicket = () => {
    setTicketCount((prev) => Math.max(1, prev - 1));
  };

  useEffect(() => {
    updateConfig({
      title: "申し込み確認",
      showBackButton: true,
      showLogo: false,
    });
  }, [updateConfig]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!opportunity) return <div>No opportunity found</div>;
  if (!selectedSlot?.node) return <div>Selected time slot not found</div>;

  const startDateTime = parseDateTime(selectedSlot.node.startsAt);
  const endDateTime = parseDateTime(selectedSlot.node.endsAt);
  
  if (!startDateTime || !endDateTime) {
    return <div>Invalid date format in time slot</div>;
  }

  const pricePerPerson = opportunity.feeRequired || 0;

  return (
    <main className="pt-16 px-4 pb-8 min-h-screen">
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
            <span>{ticketCount}人</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium mb-4">利用するチケット</h3>
        <div className="flex items-center justify-between border rounded-lg p-3">
          <Button
            onClick={decrementTicket}
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-full"
          >
            -
          </Button>
          <span className="text-xl font-medium">{ticketCount}</span>
          <Button
            onClick={incrementTicket}
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-full"
          >
            +
          </Button>
        </div>
      </div>

      {/* Price Details */}
      <div className="rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium mb-2">料金詳細</h3>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">{(pricePerPerson * ticketCount).toLocaleString()}円</span>
          <span className="text-sm text-gray-600">（{pricePerPerson.toLocaleString()}円 × {ticketCount}人）</span>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium mb-4">留意事項</h3>
        <div className="space-y-4">
          {opportunity.requireApproval && (
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

      <Link href="/reservation/complete">
        <Button className="w-full py-6 text-base rounded-lg" size="lg">
          申し込みを確定
        </Button>
      </Link>
    </main>
  );
}
