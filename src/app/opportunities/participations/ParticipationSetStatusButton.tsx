import { toast } from "sonner";
import { MutationFunction, useMutation } from "@apollo/client";
import {
  PARTICIPATION_APPROVE_APPLICATION,
  PARTICIPATION_DENY_APPLICATION,
  PARTICIPATION_CANCEL_INVITATION,
  PARTICIPATION_APPROVE_PERFORMANCE,
  PARTICIPATION_DENY_PERFORMANCE,
} from "@/graphql/mutations/participation";

// ParticipationActions 型定義
export type ParticipationActions = {
  cancelInvitation: MutationFunction<void, { id: string }>;
  approveApplication: MutationFunction<void, { id: string }>;
  denyApplication: MutationFunction<void, { id: string }>;
  approvePerformance: MutationFunction<void, { id: string }>;
  denyPerformance: MutationFunction<void, { id: string }>;
};

// カスタムフック: useParticipationSetStatusActions
export const useParticipationSetStatusActions = (): ParticipationActions => {
  const [cancelInvitation] = useMutation<void, { id: string }>(PARTICIPATION_CANCEL_INVITATION);
  const [approveApplication] = useMutation<void, { id: string }>(PARTICIPATION_APPROVE_APPLICATION);
  const [denyApplication] = useMutation<void, { id: string }>(PARTICIPATION_DENY_APPLICATION);
  const [approvePerformance] = useMutation<void, { id: string }>(PARTICIPATION_APPROVE_PERFORMANCE);
  const [denyPerformance] = useMutation<void, { id: string }>(PARTICIPATION_DENY_PERFORMANCE);

  return { cancelInvitation, approveApplication, denyApplication, approvePerformance, denyPerformance };
};

// 汎用アクションハンドラ
export const handleAction = async (
  action: MutationFunction<void, { id: string }>,
  participationId: string
): Promise<void> => {
  try {
    await action({ variables: { id: participationId } });
    toast.success("操作が完了しました。");
  } catch (error) {
    console.error(error); // エラー詳細をログ出力
    toast.error("操作に失敗しました。");
  }
};
