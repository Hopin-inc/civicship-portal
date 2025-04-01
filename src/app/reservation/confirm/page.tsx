"use client";

import { useEffect, useState } from "react";
import { useHeader } from "@/contexts/HeaderContext";
import Image from "next/image";
import Link from "next/link";
import { Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CalendarIcon = () => (
  <div className="w-9 h-9 flex-shrink-0 rounded-full bg-[#F4F4F5] flex items-center justify-center">
    <div className="w-5 h-5">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.66667 1.66666V4.16666"
          stroke="#71717A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.3333 1.66666V4.16666"
          stroke="#71717A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.91667 7.57501H17.0833"
          stroke="#71717A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.4167 3.125H4.58333C3.6129 3.125 2.83333 3.90457 2.83333 4.875V15.7083C2.83333 16.6788 3.6129 17.4583 4.58333 17.4583H15.4167C16.3871 17.4583 17.1667 16.6788 17.1667 15.7083V4.875C17.1667 3.90457 16.3871 3.125 15.4167 3.125Z"
          stroke="#71717A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
);

const ClockIcon = () => (
  <div className="w-9 h-9 flex-shrink-0 rounded-full bg-[#F4F4F5] flex items-center justify-center">
    <div className="w-5 h-5">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="10" r="7.5" stroke="#71717A" strokeWidth="1.5" />
        <path
          d="M10 5.83334V10L12.5 12.5"
          stroke="#71717A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
);

const UsersIcon = () => (
  <div className="w-9 h-9 flex-shrink-0 rounded-full bg-[#F4F4F5] flex items-center justify-center">
    <div className="w-5 h-5">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.8333 17.5V15.8333C15.8333 14.9493 15.4821 14.1014 14.8569 13.4763C14.2318 12.8512 13.3839 12.5 12.5 12.5H7.49996C6.61592 12.5 5.76807 12.8512 5.14295 13.4763C4.51782 14.1014 4.16663 14.9493 4.16663 15.8333V17.5"
          stroke="#71717A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.99996 9.16667C11.8409 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.8409 2.5 9.99996 2.5C8.15901 2.5 6.66663 3.99238 6.66663 5.83333C6.66663 7.67428 8.15901 9.16667 9.99996 9.16667Z"
          stroke="#71717A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
);

const AlertIcon = () => (
  <div className="w-9 h-9 flex-shrink-0 rounded-full bg-[#FEFCE8] flex items-center justify-center">
    <div className="w-5 h-5">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="10" r="9" stroke="#F0B03C" strokeWidth="2" />
        <path d="M10 5V11" stroke="#F0B03C" strokeWidth="2" strokeLinecap="round" />
        <circle cx="10" cy="14" r="1" fill="#F0B03C" />
      </svg>
    </div>
  </div>
);

export default function ConfirmPage() {
  const { updateConfig } = useHeader();
  const [ticketCount, setTicketCount] = useState(0);

  const incrementTicket = () => {
    setTicketCount((prev) => prev + 1);
  };

  const decrementTicket = () => {
    setTicketCount((prev) => Math.max(0, prev - 1));
  };

  useEffect(() => {
    updateConfig({
      title: "申し込み確認",
      showBackButton: true,
      showLogo: false,
    });
  }, [updateConfig]);

  return (
    <main className="pt-16 px-4 pb-8 min-h-screen">
      <div className="rounded-lg p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative w-20 h-20">
            <Image
              src="/images/activities/olive.jpg"
              alt="陶芸工房で湯呑みづくり"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-lg font-medium mb-1">陶芸工房で湯呑みづくり　最...</h2>
            <p className="text-sm text-gray-600 mb-1">1人あたり2,000円から</p>
            <div className="flex items-center text-sm text-gray-600">
              <span>観音寺市（香川県）</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium mb-4">申し込み内容</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CalendarIcon />
            <span>2025年7月25日（木）</span>
          </div>
          <div className="flex items-center gap-3">
            <ClockIcon />
            <span>13:30-15:30</span>
          </div>
          <div className="flex items-center gap-3">
            <UsersIcon />
            <span>3人</span>
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
          <span className="text-xl font-bold">6,000円</span>
          <span className="text-sm text-gray-600">（2,000円 × 3人）</span>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium mb-4">留意事項</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <AlertIcon />
            <p className="text-sm flex-1">ホストによる確認後に、予約が確定します。</p>
          </div>
          <div className="flex items-center gap-3">
            <AlertIcon />
            <p className="text-sm flex-1">
              実施確定または中止のどちらの場合でも、公式LINEから14日前までにご連絡します。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AlertIcon />
            <p className="text-sm flex-1">当日は現金をご用意下さい。</p>
          </div>
          <div className="flex items-center gap-3">
            <AlertIcon />
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
