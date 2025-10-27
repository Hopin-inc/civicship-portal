"use client";

import Loading from "@/components/layout/Loading";
import { Card } from "@/components/ui/card";
import { GqlEvaluationStatus, GqlVcIssuanceStatus, useGetEvaluationsQuery } from "@/types/graphql";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

function getIssuanceStats(evaluations: any[]) {
  const allRequests = evaluations.flatMap((ev) => {
    const req = ev.node?.vcIssuanceRequest;
    if (!req) return [];
    return Array.isArray(req) ? req : [req];
  });
  const denominator = allRequests.length;
  const numerator = allRequests.filter(
    (req) => req?.status === GqlVcIssuanceStatus.Completed,
  ).length;
  const hasPending = allRequests.some(
    (req) =>
      req?.status === GqlVcIssuanceStatus.Pending || req?.status === GqlVcIssuanceStatus.Processing,
  );
  const hasFailed = allRequests.some((req) => req?.status === GqlVcIssuanceStatus.Failed);
  return { denominator, numerator, hasPending, hasFailed };
}

export default function CredentialList() {
  const router = useRouter();
  const { data, loading, error } = useGetEvaluationsQuery({
    variables: { 
      filter: { communityId: COMMUNITY_ID },
      first: 100
    },
  });

  const evaluationList = useMemo(() => {
    if (!data?.evaluations.edges) return [];

    return data.evaluations.edges
      .filter((evaluation) => evaluation.node?.status === GqlEvaluationStatus.Passed)
      .sort((a, b) => {
        const aDate = a.node?.createdAt ? new Date(a.node.createdAt).getTime() : 0;
        const bDate = b.node?.createdAt ? new Date(b.node.createdAt).getTime() : 0;
        return bDate - aDate;
      });
  }, [data?.evaluations.edges]);

  const slotEvaluationsMap = useMemo(() => {
    return evaluationList.reduce(
      (acc, evaluation) => {
        const slotId = evaluation.node?.participation?.opportunitySlot?.id;
        if (!slotId) return acc;
        if (!acc[slotId]) acc[slotId] = [];
        acc[slotId].push(evaluation);
        return acc;
      },
      {} as Record<string, typeof evaluationList>,
    );
  }, [evaluationList]);

  const uniqueSlotEvaluations = useMemo(() => {
    return Object.entries(slotEvaluationsMap).map(([slotId, evaluations]) => ({
      slotId,
      evaluations,
      representative: evaluations[0],
    }));
  }, [slotEvaluationsMap]);

  if (loading || !data?.evaluations.edges) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      {uniqueSlotEvaluations.length === 0 ? (
        <div className="text-[#71717A]">証明書はまだありません</div>
      ) : (
        uniqueSlotEvaluations.map(({ evaluations, representative }) => {
          const { denominator, numerator, hasPending, hasFailed } = getIssuanceStats(evaluations);
          const evaluationData = representative.node;
          const title = evaluationData?.participation?.opportunitySlot?.opportunity?.title ?? "";
          const start = evaluationData?.participation?.opportunitySlot?.startsAt
            ? new Date(evaluationData.participation.opportunitySlot.startsAt)
            : null;
          const end = evaluationData?.participation?.opportunitySlot?.endsAt
            ? new Date(evaluationData.participation.opportunitySlot.endsAt)
            : null;
          const issuedAt = evaluationData?.createdAt
            ? new Date(evaluationData.createdAt).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })
            : "";

          return (
            <Card
              key={evaluationData?.id}
              className="rounded-xl border border-gray-200 p-4 flex flex-col cursor-pointer"
              onClick={() => router.push(`/admin/credentials/${evaluationData?.id}`)}
            >
              <div className="flex-1">
                <div className="font-bold text-lg truncate max-w-full">
                  {title}
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  {start && end
                    ? start.getFullYear() === end.getFullYear() &&
                      start.getMonth() === end.getMonth() &&
                      start.getDate() === end.getDate()
                      ? `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日 ${start.getHours()}:${String(start.getMinutes()).padStart(2, "0")}~${end.getHours()}:${String(end.getMinutes()).padStart(2, "0")}`
                      : `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日~${end.getMonth() + 1}月${end.getDate()}日`
                    : ""}
                </div>
              </div>
              <div className="flex justify-between items-end mt-4">
                <div className="text-gray-400 text-sm flex items-center">
                  <span>発行数</span>
                  {hasFailed ? (
                    <AlertTriangle className="text-red-400 w-5 h-5 mx-1" />
                  ) : (
                    hasPending && <AlertTriangle className="text-yellow-400 w-5 h-5 mx-1" />
                  )}
                  <span className="font-bold text-lg text-black mx-1">{numerator}</span>
                  <span>/</span>
                  <span>{denominator}</span>
                </div>
                <div className="text-gray-400 text-sm">{issuedAt}</div>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
