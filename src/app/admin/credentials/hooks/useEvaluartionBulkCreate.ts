import {
  GqlEvaluationStatus,
  GqlParticipation,
  useEvaluationBulkCreateMutation,
} from "@/types/graphql";

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
      onSuccess?.(response);
    } catch (e: any) {
      onError?.(e);
    }
  };

  return { save, loading };
};
