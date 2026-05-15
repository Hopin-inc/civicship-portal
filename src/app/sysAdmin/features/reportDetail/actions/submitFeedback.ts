"use server";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { SUBMIT_REPORT_FEEDBACK_SERVER_MUTATION } from "@/graphql/account/report/server";
import type {
  GqlSubmitReportFeedbackMutation,
  GqlSubmitReportFeedbackMutationVariables,
} from "@/types/graphql";

export type SubmitFeedbackActionInput = {
  reportId: string;
  rating: number;
  feedbackType?: GqlSubmitReportFeedbackMutationVariables["input"]["feedbackType"];
  comment?: string;
  /** 投稿対象 report の community.id。X-Community-Id ヘッダに渡す */
  targetCommunityId: string;
};

export type SubmitFeedbackActionResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * sysAdmin の feedback 投稿用 server action。
 *
 * backend は `submitReportFeedback` usecase 内で
 * `ctx.communityId (= X-Community-Id) === report.communityId` を要求する
 * ので、対象 report の community をヘッダに入れる。@authz は
 * `IsCommunityMember OR IsAdmin` で、sysAdmin は `User.sysRole === SYS_ADMIN`
 * で bypass される。
 */
export async function submitReportFeedbackAction(
  input: SubmitFeedbackActionInput,
): Promise<SubmitFeedbackActionResult> {
  try {
    await executeServerGraphQLQuery<
      GqlSubmitReportFeedbackMutation,
      GqlSubmitReportFeedbackMutationVariables
    >(
      SUBMIT_REPORT_FEEDBACK_SERVER_MUTATION,
      {
        input: {
          reportId: input.reportId,
          rating: input.rating,
          feedbackType: input.feedbackType ?? undefined,
          comment: input.comment ?? undefined,
        },
      },
      { "X-Community-Id": input.targetCommunityId },
      15000,
    );
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "フィードバックの投稿に失敗しました",
    };
  }
}
