import {
  GqlEvaluationStatus,
  GqlParticipation,
  useEvaluationBulkCreateMutation,
} from "@/types/graphql";
import { toast } from "sonner";

type UseEvaluartionBulkCreateArgs = {
  onSuccess?: (response: any) => void;
  onError?: (e: Error) => void;
};

export const useEvaluartionBulkCreate = ({ onSuccess, onError }: UseEvaluartionBulkCreateArgs = {}) => {
  const [mutate, { loading }] = useEvaluationBulkCreateMutation();

  const save = async (
    participations: GqlParticipation[],
    communityId: string,
  ) => {

    const evaluations = participations.map((p) => {
      return {
        participationId: p.id,
        status: GqlEvaluationStatus.Passed,
      };
    });

    try {
      const response = await mutate({
        variables: {
          input: { evaluations },
          permission: { communityId },
        },
      });
      console.log("response", response);
      toast.success("出欠情報を保存しました");
      onSuccess?.(response);
    } catch (e: any) {
      toast.error(`出欠情報の保存に失敗しました: ${e.message}`);
      onError?.(e);
    }
  };

  return { save, loading };
};
