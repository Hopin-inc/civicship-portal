import { useParams } from "next/navigation";
import {
  GqlOpportunity,
  GqlReservation,
  useRejectReservationMutation,
  useReservationAcceptMutation,
} from "@/types/graphql";
import { toast } from "react-toastify";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { useCommunityRouter } from "@/hooks/useCommunityRouter";

export const useReservationApproval = ({
  id,
  reservation,
  opportunity,
  refetch,
}: {
  id?: string;
  reservation?: GqlReservation | null;
  opportunity?: GqlOpportunity | null;
  refetch: () => void;
}) => {
  const track = useAnalytics();
  const router = useCommunityRouter();
  const params = useParams();
  const communityId = params.communityId as string;

  const [acceptReservation, { loading: acceptLoading }] = useReservationAcceptMutation({
    onCompleted: () => {
      toast.success("予約を承認しました");
      router.push(`/admin/reservations/${id}/?mode=cancellation`);
    },
    onError: () => {
      toast.error("承認に失敗しました");
    },
  });

  const [rejectReservation, { loading: rejectLoading }] = useRejectReservationMutation({
    onCompleted: () => {
      toast.success("応募を却下しました");
      void refetch();
    },
    onError: () => {
      toast.error("却下に失敗しました");
    },
  });

  const handleAccept = async () => {
    if (!id || !reservation || !opportunity) {
      toast.error("必要な情報が不足しています");
      return;
    }

    await acceptReservation({
      variables: {
        id,
        permission: {
          opportunityId: opportunity.id,
          communityId: opportunity.community?.id || communityId,
        },
      },
    });

    track({
      name: "accept_application",
      params: {
        reservationId: reservation.id,
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        category: opportunity.category,
        guest: reservation.participations?.length ?? 0,
        paidGuest: 0,
        feeRequired: opportunity.feeRequired ?? 0,
        totalFee: (opportunity.feeRequired ?? 0) * (reservation.participations?.length ?? 0),
        scheduledAt:
          reservation.opportunitySlot?.startsAt instanceof Date
            ? reservation.opportunitySlot.startsAt.toISOString()
            : (reservation.opportunitySlot?.startsAt ?? ""),
      },
    });
  };

  const handleReject = async (comment: string) => {
    if (!id || !reservation || !opportunity) {
      toast.error("必要な情報が不足しています");
      return;
    }

    await rejectReservation({
      variables: {
        id,
        input: { comment },
        permission: {
          opportunityId: opportunity.id,
          communityId,
        },
      },
    });

    track({
      name: "reject_application",
      params: {
        reservationId: reservation.id,
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        category: opportunity.category,
        guest: reservation.participations?.length ?? 0,
        paidGuest: 0,
        feeRequired: opportunity.feeRequired ?? 0,
        totalFee: (opportunity.feeRequired ?? 0) * (reservation.participations?.length ?? 0),
        scheduledAt:
          reservation.opportunitySlot?.startsAt instanceof Date
            ? reservation.opportunitySlot.startsAt.toISOString()
            : (reservation.opportunitySlot?.startsAt ?? ""),
      },
    });
  };

  return {
    handleAccept,
    handleReject,
    acceptLoading,
    rejectLoading,
  };
};
