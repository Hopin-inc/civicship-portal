import {
  GqlEvaluationStatus,
  GqlParticipation,
  useEvaluationBulkCreateMutation,
} from "@/types/graphql";
import { toast } from "sonner";

type UseSaveAttendancesArgs = {
  onSuccess?: () => void;
  onError?: (e: Error) => void;
};

export const useSaveAttendances = ({ onSuccess, onError }: UseSaveAttendancesArgs = {}) => {
  const [mutate, { loading }] = useEvaluationBulkCreateMutation();

  const save = async (
    participations: GqlParticipation[],
    attendanceData: Record<string, GqlEvaluationStatus>,
    communityId: string,
  ) => {
    const evaluations = participations.map((p) => ({
      participationId: p.id,
      status: attendanceData[p.id],
    }));

    try {
      await mutate({
        variables: {
          input: { evaluations },
          permission: { communityId },
        },
      });
      toast.success("出欠情報を保存しました");
      onSuccess?.();
    } catch (e: any) {
      toast.error(`出欠情報の保存に失敗しました: ${e.message}`);
      onError?.(e);
    }
  };

  return { save, loading };
};
