"use client";
import { Card, CardHeader } from "@/components/ui/card";
import { GqlDidIssuanceRequest, GqlVcIssuanceStatus, useGetEvaluationsQuery } from "@/types/graphql";
import { formatDateTime } from "@/utils/date";
import { Copy, ExternalLink } from "lucide-react";
import { use, useEffect, useMemo, useRef } from "react";
import { renderStatusCard, statusStyle } from "./data/presenter";
import { toast } from "sonner";
import Link from "next/link";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { CredentialRole } from "./data/presenter";

// DIDを省略表示する関数
const truncateDid = (did: string | undefined | null, length: number = 20): string => {
  if (!did) return "";
  if (did.length <= length) return did;
  const start = did.substring(0, length);
  const end = did.substring(did.length - 10);
  return `${start}...${end}`;
};

// userIdからDIDを取得する関数
function getDidValueByUserId(
  didIssuanceRequests: GqlDidIssuanceRequest[] | undefined,
  userId: string | undefined | null
): string {
  if (!userId || !didIssuanceRequests) return "";
  return didIssuanceRequests.find(req => req.status === "COMPLETED")?.didValue ?? "";
}

export default function CredentialsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: evaluationsData, loading, error, refetch } = useGetEvaluationsQuery({
      variables: {
        withDidIssuanceRequests: true,
      },
    });
    const headerConfig = useMemo(
      () => ({
        title: "証明書詳細",
        showLogo: false,
        showBackButton: true,
      }),
      [],
    );
    useHeaderConfig(headerConfig);
    const matchedEvaluation = evaluationsData?.evaluations.edges.find(
      (edge) => edge.node?.id === id
    );
    const slotId = matchedEvaluation?.node?.participation?.opportunitySlot?.id;
    const sameSlotEvaluations = evaluationsData?.evaluations.edges.filter(
      (edge) => edge.node?.participation?.opportunitySlot?.id === slotId
    ) ?? [];

    const organizerId = matchedEvaluation?.node?.participation?.opportunitySlot?.opportunity?.createdByUser?.id;
    const organizerDidValue = getDidValueByUserId(matchedEvaluation?.node?.participation?.opportunitySlot?.opportunity?.createdByUser?.didIssuanceRequests ?? [], organizerId);

    const refetchRef = useRef<(() => void) | null>(null);
    useEffect(() => {
      refetchRef.current = refetch;
    }, [refetch]);

    if (loading) return <LoadingIndicator />;

    if (error) {
      return <ErrorState title="証明書詳細ページを読み込めませんでした" refetchRef={refetchRef} />;
    }

  return( 
    <div className="p-4 space-y-3 max-w-2xl mx-auto">
        {renderStatusCard(matchedEvaluation?.node?.vcIssuanceRequest?.status ?? "PENDING", CredentialRole.manager)}
        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
            <CardHeader className="flex flex-row items-center justify-between p-4 px-6">
                <div className="text-gray-400 text-base">主催者</div>
                <div className="flex flex-col items-end">
                <div className="text-sm font-bold text-black">{matchedEvaluation?.node?.participation?.opportunitySlot?.opportunity?.createdByUser?.name}</div>
                    <div className="flex items-center text-gray-400 text-sm mt-1">
                        <Copy className="w-4 h-4 mr-1 cursor-pointer" onClick={() => {
                            navigator.clipboard.writeText(organizerDidValue);
                            toast.success("コピーしました");
                        }} />
                        <span>{truncateDid(organizerDidValue)}</span>
                    </div>
                </div>
            </CardHeader>
        </Card>
        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
            <CardHeader className="flex flex-row items-center justify-between p-4 px-6">
                <div className="text-gray-400 text-base min-w-fit whitespace-nowrap">概要</div>
                <div className="flex items-center flex-1 min-w-0 ml-8">
                    <span className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm flex-1">
                        {matchedEvaluation?.node?.participation?.opportunitySlot?.opportunity?.title}
                    </span>
                    <Link
                        href={`/activities/${matchedEvaluation?.node?.participation?.opportunitySlot?.opportunity?.id}?community_id=${matchedEvaluation?.node?.participation?.opportunitySlot?.opportunity?.community?.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2"
                    >
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                    </Link>
                </div>
            </CardHeader>
        </Card>
        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
            <CardHeader className="flex flex-row items-center justify-between p-4 px-6">
                <div className="text-gray-400 text-base min-w-fit whitespace-nowrap">開始日時</div>
                <div className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm ml-2 flex-2">
                {formatDateTime(matchedEvaluation?.node?.participation?.opportunitySlot?.startsAt ?? null, "yyyy年MM月dd日 HH:mm")}
                </div>
            </CardHeader>
        </Card>
        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
            <CardHeader className="flex flex-row items-center justify-between p-4 px-6">
                <div className="text-gray-400 text-base min-w-fit whitespace-nowrap">終了日時</div>
                <div className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm ml-2 flex-2">
                    {formatDateTime(matchedEvaluation?.node?.participation?.opportunitySlot?.endsAt ?? null, "yyyy年MM月dd日 HH:mm")}
                </div>
            </CardHeader>
        </Card>
        <h1 className="text-2xl font-bold pt-6">証明書の発行先</h1>
        {sameSlotEvaluations.map((evaluation) => {
          const userId = evaluation?.node?.vcIssuanceRequest?.user?.id;
          const didValue = getDidValueByUserId(evaluation?.node?.participation?.user?.didIssuanceRequests ?? [], userId);
          const rawStatus = evaluation?.node?.vcIssuanceRequest?.status?.trim();
          const status = Object.values(GqlVcIssuanceStatus).includes(rawStatus as GqlVcIssuanceStatus)
            ? (rawStatus as GqlVcIssuanceStatus)
            : GqlVcIssuanceStatus.Pending;
          const style = statusStyle[status];

          return (
            <Card key={evaluation?.node?.id} className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none">
              <CardHeader className="flex flex-row items-center justify-between p-4 px-6">
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base font-bold">
                      {evaluation?.node?.vcIssuanceRequest?.user?.name}
                    </span>
                    {style && (
                      <span className={`text-xs font-bold rounded-full px-3 py-1 ${style.className}`}>
                        {style.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-400 text-sm mt-2">
                    <Copy
                      className="w-4 h-4 mr-1 cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(didValue);
                        toast.success("コピーしました");
                      }}
                    />
                    <span>{truncateDid(didValue,25)}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
    </div>
    );
}