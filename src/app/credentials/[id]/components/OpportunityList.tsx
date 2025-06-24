import { Card, CardHeader } from "@/components/ui/card";
import { GqlGetParticipationQuery } from "@/types/graphql";
import { formatDate } from "@/utils/date";
import { Copy } from "lucide-react";

interface OpportunityListProps {
    opportunity: GqlGetParticipationQuery | undefined
}

export default function OpportunityList(props: OpportunityListProps) {
    const { opportunity } = props;
    console.log(opportunity?.participation?.opportunitySlot?.startsAt);
    console.log(opportunity?.participation?.opportunitySlot?.endsAt);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
                <CardHeader className="flex flex-row items-center justify-between p-6">
                    {/* 左側 */}
                    <div className="text-gray-400 text-base font-bold">主催者</div>
                    {/* 右側 */}
                    <div className="flex flex-col items-end">
                    <div className="text-lg font-bold text-black">{opportunity?.participation?.opportunitySlot?.opportunity?.createdByUser?.name}</div>
                        <div className="flex items-center text-gray-400 text-sm mt-1">
                            <Copy className="w-4 h-4 mr-1" />
                            <span>did:key:z6Mkfassad...WUcsa32</span>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
                <CardHeader className="flex flex-row items-center justify-between p-6">
                    <div className="text-gray-400 text-base font-bold min-w-fit whitespace-nowrap">概要</div>
                    <div className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm ml-2 flex-2">
                        {opportunity?.participation?.opportunitySlot?.opportunity?.description}
                    </div>
                </CardHeader>
            </Card>
            <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
                <CardHeader className="flex flex-row items-center justify-between p-6">
                    <div className="text-gray-400 text-base font-bold min-w-fit whitespace-nowrap">参加者</div>
                    <div className="flex flex-col items-end">
                    <div className="text-lg font-bold text-black">{opportunity?.participation?.user?.name}</div>
                        <div className="flex items-center text-gray-400 text-sm mt-1">
                            <Copy className="w-4 h-4 mr-1" />
                            <span>{opportunity?.participation?.user?.id}</span>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
                <CardHeader className="flex flex-row items-center justify-between p-6">
                    <div className="text-gray-400 text-base font-bold min-w-fit whitespace-nowrap">開始日時</div>
                    <div className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm ml-2 flex-2">
                    {formatDate(opportunity?.participation?.opportunitySlot?.startsAt ?? new Date())}
                    </div>
                </CardHeader>
            </Card>
            <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
                <CardHeader className="flex flex-row items-center justify-between p-6">
                    <div className="text-gray-400 text-base font-bold min-w-fit whitespace-nowrap">終了日時</div>
                    <div className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm ml-2 flex-2">
                        {formatDate(opportunity?.participation?.opportunitySlot?.endsAt ?? new Date())}
                    </div>
                </CardHeader>
            </Card>
        </div>
    )
}