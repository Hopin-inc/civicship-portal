"use client";
import { Card, CardHeader } from "@/components/ui/card";
import { useGetDidIssuanceRequestsQuery, useGetEvaluationsQuery } from "@/types/graphql";
import { formatDateTime } from "@/utils/date";
import { Copy, ExternalLink } from "lucide-react";
import { use } from "react";
import { renderStatusCard, statusStyle } from "./data/presenter";
import { VCIssuanceStatus } from "./types";
import { toast } from "sonner";
import Link from "next/link";

export default function CredentialsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: evaluationsData } = useGetEvaluationsQuery();
    const matchedEvaluation = evaluationsData?.evaluations.edges.find(
      (edge) => edge.node?.id === id
    );
    const { data: didIssuanceRequestsData } = useGetDidIssuanceRequestsQuery({
        variables: {
          userId: matchedEvaluation?.node?.participation?.opportunitySlot?.opportunity?.createdByUser?.id ?? "",
        },
      });
    const slotId = matchedEvaluation?.node?.participation?.opportunitySlot?.id;
    const sameSlotEvaluations = evaluationsData?.evaluations.edges.filter(
      (edge) => edge.node?.participation?.opportunitySlot?.id === slotId
    ) ?? [];

  return( 
    <div className="p-4 space-y-3 max-w-2xl mx-auto">
        {renderStatusCard(matchedEvaluation?.node?.vcIssuanceRequest?.status ?? "PENDING")}
        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
            <CardHeader className="flex flex-row items-center justify-between p-4 px-6">
                <div className="text-gray-400 text-base">主催者</div>
                <div className="flex flex-col items-end">
                <div className="text-lg font-bold text-black">{matchedEvaluation?.node?.participation?.opportunitySlot?.opportunity?.createdByUser?.name}</div>
                    <div className="flex items-center text-gray-400 text-sm mt-1">
                        <Copy className="w-4 h-4 mr-1 cursor-pointer" onClick={() => {
                            const didKey = didIssuanceRequestsData?.user?.didIssuanceRequests?.[0]?.id ?? "";
                            navigator.clipboard.writeText(didKey);
                            toast.success("コピーしました");
                        }} />
                        <span>did:key:{didIssuanceRequestsData?.user?.didIssuanceRequests?.[0]?.id}</span>
                    </div>
                </div>
            </CardHeader>
        </Card>
        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
            <CardHeader className="flex flex-row items-center justify-between p-4 px-6">
                <div className="text-gray-400 text-base min-w-fit whitespace-nowrap">概要</div>
                <div className="flex items-center flex-1 min-w-0 ml-2">
                    <span className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm flex-1">
                        {matchedEvaluation?.node?.participation?.opportunitySlot?.opportunity?.description}
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
                {formatDateTime(matchedEvaluation?.node?.participation?.opportunitySlot?.startsAt ?? new Date(), "yyyy/MM/dd HH:mm")}
                </div>
            </CardHeader>
        </Card>
        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
            <CardHeader className="flex flex-row items-center justify-between p-4 px-6">
                <div className="text-gray-400 text-base min-w-fit whitespace-nowrap">終了日時</div>
                <div className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm ml-2 flex-2">
                    {formatDateTime(matchedEvaluation?.node?.participation?.opportunitySlot?.endsAt ?? new Date(), "yyyy/MM/dd HH:mm")}
                </div>
            </CardHeader>
        </Card>
        <h1 className="text-2xl font-bold">証明書の発行先</h1>
        {sameSlotEvaluations.map((evaluation) => {
          const rawStatus = evaluation?.node?.vcIssuanceRequest?.status?.trim();
          const status = Object.values(VCIssuanceStatus).includes(rawStatus as VCIssuanceStatus)
            ? (rawStatus as VCIssuanceStatus)
            : VCIssuanceStatus.PENDING;
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
                  <div className="flex items-center text-gray-400 text-sm mt-1">
                    <Copy
                      className="w-4 h-4 mr-1 cursor-pointer"
                      onClick={() => {
                        const didKey = evaluation?.node?.vcIssuanceRequest?.id ?? "";
                        navigator.clipboard.writeText(didKey);
                        toast.success("コピーしました");
                      }}
                    />
                    <span>did:key:{evaluation?.node?.vcIssuanceRequest?.id}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
    </div>
    );
}