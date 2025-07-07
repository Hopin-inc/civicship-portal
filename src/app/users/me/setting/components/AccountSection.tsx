"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, FileKey, Info, LinkIcon, PhoneIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useAccountData } from "../hooks/useAccountData";
import Loading from "@/components/layout/Loading";

const truncateDid = (did: string | undefined | null, length: number = 20): string => {
    if (!did) return "";
    if (did.length <= length) return did;
    const start = did.substring(0, length);
    const end = did.substring(did.length - 5);
    return `${start}...${end}`;
  };

export default function AccountSection() {
  const {
    isAuthenticated,
    isPhoneVerified,
    isAuthenticating,
    didValue,
    isNftWalletLinked,
    loading
  } = useAccountData();

  if (loading) {
    return <Loading />
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-0">
        {/* 共創ID */}
        <div className="flex items-center justify-between py-4 px-4 border-b">
          <div className="flex items-center gap-2">
            <FileKey className="w-5 h-5" />
            <span className="font-bold text-sm flex items-center gap-2">
              共創ID
              </span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>{
                didValue 
                    ? truncateDid(didValue,16)
                    :<div className="flex items-center gap-1">
                        <Info className="w-4 h-4 text-[#EAB308]" />
                        <span className="text-label-sm">did発行準備中</span>
                    </div>
            }</span>
            {didValue && <Copy className="w-4 h-4 cursor-pointer" onClick={() => {
              navigator.clipboard.writeText(didValue);
              toast.success("コピーしました");
            }} />}
          </div>
        </div>
        {/* LINEアカウント */}
        <div className="flex items-center justify-between py-4 px-4 border-b">
          <div className="flex items-center gap-2">
            <Image src="/images/line-icon.png" alt="LINE" width={20} height={20} />
            <span className="font-bold text-sm">LINEアカウント</span>
          </div>
          <span className="text-gray-400">{isAuthenticated ? "連携済み" : isAuthenticating ? "読込中" : "未連携"}</span>
        </div>
        {/* 電話番号 */}
        <div className="flex items-center justify-between py-4 px-4 border-b">
          <div className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4" />
            <span className="font-bold text-sm">電話番号</span>
          </div>
          <span className="text-gray-400">{isPhoneVerified ? "連携済み" : isAuthenticating ? "読込中" : "未連携"}</span>
        </div>
        {/* JUST DAO IT */}
        <div className="flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            <span className="font-bold text-sm flex items-center">
              JUST DAO IT
              <span className="ml-1">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M14 3h7v7m0-7L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 12v7a2 2 0 002 2h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </span>
          </div>
          <span className="text-gray-400">{isNftWalletLinked ? "連携済み" : "未連携"}</span>
        </div>
      </CardContent>
    </Card>
  );
}
