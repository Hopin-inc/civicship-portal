"use client";
import { Card, CardHeader } from "@/components/ui/card";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useGetDidIssuanceRequestsQuery, useGetEvaluationQuery } from "@/types/graphql";
import { formatDate } from "@/utils/date";
import { Copy, AlertCircle } from "lucide-react";
import { use, useMemo } from "react";

const statusMap = {
    "PENDING": "発行中",
    "ISSUED": "発行済み",
    "FAILED": "発行失敗",
    "COMPLETED": "発行完了",
    "PROCESSING": "発行中",
}

const text = (status: string) => {
    switch (status) {
        case "PENDING":
            return <PendingCard/>;
        case "FAILED":
            return <ErrorCard/>;
        default:
            return <div></div>;
    }
}

const PendingCard = () => (
    <div className="border border-[#EAB308] bg-[#FEFCE8] rounded-2xl p-6 flex flex-col gap-2">
      <div className="flex items-center mb-2">
        <AlertCircle className="text-[#EAB308] w-5 h-5 mr-2" />
        <span className="text-lg font-bold">証明書発行準備中</span>
      </div>
      <div className="text-gray-400 text-base font-normal">
      ただいま、証明書を発行中です。準備が整うまで、少しお時間をあけてからもう一度アクセスしてみてください。
      </div>
    </div>
  );

const ErrorCard = () => (
  <div className="border border-[#F87171] bg-[#FEF2F2] rounded-2xl p-6 flex flex-col gap-2">
    <div className="flex items-center mb-2">
      <AlertCircle className="text-[#F87171] w-5 h-5 mr-2" />
      <span className="text-lg font-bold">証明書発行失敗</span>
    </div>
    <div className="text-gray-400 text-base font-normal">
      指定されたユーザーに証明書を発行できませんでした。お手数ですが再度ユーザーを確認・選択のうえ、発行をお試しください。
    </div>
  </div>
);

export default function CredentialsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const headerConfig = useMemo(
        () => ({
          title: "証明書の確認",
          showLogo: false,
          showBackButton: true,
        }),
        [],
      );
      useHeaderConfig(headerConfig);
    const { id } = use(params);
    const { data } = useGetEvaluationQuery({
        variables: {
            id
        },
    });
    const { data: didIssuanceRequestsData } = useGetDidIssuanceRequestsQuery({
        variables: {
          userId: data?.evaluation?.participation?.opportunitySlot?.opportunity?.createdByUser?.id ?? "",
        },
      });

  return( 
    <div className="p-4 space-y-3 max-w-2xl mx-auto">
        {text(data?.evaluation?.vcIssuanceRequest?.status ?? "PENDING")}
        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
            <CardHeader className="flex flex-row items-center justify-between p-6">
                <div className="text-gray-400 text-base font-bold">主催者</div>
                <div className="flex flex-col items-end">
                <div className="text-lg font-bold text-black">{data?.evaluation?.participation?.opportunitySlot?.opportunity?.createdByUser?.name}</div>
                    <div className="flex items-center text-gray-400 text-sm mt-1">
                        <Copy className="w-4 h-4 mr-1" />
                        <span>did:key:{didIssuanceRequestsData?.user?.didIssuanceRequests?.[0]?.id}</span>
                    </div>
                </div>
            </CardHeader>
        </Card>
        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
            <CardHeader className="flex flex-row items-center justify-between p-6">
                <div className="text-gray-400 text-base font-bold min-w-fit whitespace-nowrap">概要</div>
                <div className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm ml-2 flex-2">
                    {data?.evaluation?.participation?.opportunitySlot?.opportunity?.description}
                </div>
            </CardHeader>
        </Card>
        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
            <CardHeader className="flex flex-row items-center justify-between p-6">
                <div className="text-gray-400 text-base font-bold min-w-fit whitespace-nowrap">開始日時</div>
                <div className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm ml-2 flex-2">
                {formatDate(data?.evaluation?.participation?.opportunitySlot?.startsAt ?? new Date())}
                </div>
            </CardHeader>
        </Card>
        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
            <CardHeader className="flex flex-row items-center justify-between p-6">
                <div className="text-gray-400 text-base font-bold min-w-fit whitespace-nowrap">終了日時</div>
                <div className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm ml-2 flex-2">
                    {formatDate(data?.evaluation?.participation?.opportunitySlot?.endsAt ?? new Date())}
                </div>
            </CardHeader>
        </Card>
        <h1 className="text-2xl font-bold">証明書の発行先</h1>
        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
            <CardHeader className="flex flex-row items-center justify-between p-6">
                <div className="text-gray-400 text-base font-bold">{data?.evaluation?.vcIssuanceRequest?.user?.name}</div>
                <div className="flex flex-col items-end">
                <div className="text-lg font-bold text-black">{statusMap[data?.evaluation?.vcIssuanceRequest?.status ?? "PENDING"]}</div>
                    <div className="flex items-center text-gray-400 text-sm mt-1">
                        <Copy className="w-4 h-4 mr-1" />
                        <span>did:key:{didIssuanceRequestsData?.user?.didIssuanceRequests?.[0]?.id}</span>
                    </div>
                </div>
            </CardHeader>
        </Card>
    </div>
    );
}