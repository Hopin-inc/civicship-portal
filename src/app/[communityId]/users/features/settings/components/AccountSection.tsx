"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, FileKey, Info, LinkIcon, PhoneIcon, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthProvider";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { useUserProfileContext } from "@/app/[communityId]/users/features/shared/contexts/UserProfileContext";
import { GqlDidIssuanceStatus } from "@/types/graphql";
import { useTranslations } from "next-intl";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const truncateDid = (did: string | undefined | null, length: number = 20): string => {
  if (!did) return "";
  if (did.length <= length) return did;
  const start = did.substring(0, length);
  const end = did.substring(did.length - 5);
  return `${start}...${end}`;
};

export default function AccountSection() {
  const t = useTranslations();
  const { isAuthenticated, isPhoneVerified, isAuthenticating } = useAuth();
  const { gqlUser } = useUserProfileContext();
  const communityConfig = useCommunityConfig();

  const completedRequest = gqlUser?.didIssuanceRequests?.find(
    (req) => req?.status === GqlDidIssuanceStatus.Completed,
  );
  const didValue = completedRequest?.didValue;

  // Find the latest DID issuance request to check for failed state
  // NOTE: Assumes didIssuanceRequests is sorted by createdAt in descending order
  const latestRequest = gqlUser?.didIssuanceRequests?.[0];
  const isTargetForReverify =
    !didValue &&
    latestRequest?.createdAt &&
    Date.now() - new Date(latestRequest.createdAt).getTime() >= SEVEN_DAYS_MS;

  const isNftWalletLinked = !!gqlUser?.nftWallet?.id;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-0">
        {/* 共創ID */}
        <div className="flex items-center justify-between py-4 px-4 border-b">
          <div className="flex items-center gap-2">
            <FileKey className="w-5 h-5" />
            <span className="font-bold text-sm flex items-center gap-2">{t("users.account.coCreationId")}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>
              {didValue ? (
                truncateDid(didValue, 16)
              ) : isTargetForReverify ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-label-sm text-red-500">{t("users.account.didFailed")}</span>
                  </div>
                  <Button variant="outline" size="sm" asChild className="h-6 px-2 text-xs">
                    <Link href="/users/me/reverify-phone">{t("users.account.reverifyPhone")}</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Info className="w-4 h-4 text-[#EAB308]" />
                  <span className="text-label-sm">{t("users.account.didPreparation")}</span>
                </div>
              )}
            </span>
            {didValue && (
              <Copy
                className="w-4 h-4 cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(didValue);
                  toast.success(t("users.account.copied"));
                }}
              />
            )}
          </div>
        </div>
        {/* LINEアカウント */}
        <div className="flex items-center justify-between py-4 px-4 border-b">
          <div className="flex items-center gap-2">
            <Image src="/images/line-icon.png" alt="LINE" width={20} height={20} />
            <span className="font-bold text-sm">{t("users.account.lineAccount")}</span>
          </div>
          <span className="text-gray-400">
            {isAuthenticated ? t("users.account.connected") : isAuthenticating ? t("users.account.loading") : t("users.account.notConnected")}
          </span>
        </div>
        {/* 電話番号 */}
        <div className="flex items-center justify-between py-4 px-4 border-b">
          <div className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4" />
            <span className="font-bold text-sm">{t("users.account.phoneNumber")}</span>
          </div>
          <span className="text-gray-400">
            {isPhoneVerified ? t("users.account.connected") : isAuthenticating ? t("users.account.loading") : t("users.account.notConnected")}
          </span>
        </div>
        {/* JUST DAO IT */}
        {communityConfig?.enableFeatures?.includes("justDaoIt") && (
          <div className="flex items-center justify-between py-4 px-4">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              <span className="font-bold text-sm flex items-center">
                JUST DAO IT
                <span className="ml-1">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M14 3h7v7m0-7L10 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 12v7a2 2 0 002 2h7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </div>
            <span className="text-gray-400">{isNftWalletLinked ? t("users.account.connected") : t("users.account.notConnected")}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
