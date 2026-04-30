"use server";

import { cookies } from "next/headers";
import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { ACTIVE_COMMUNITY_IDS } from "@/lib/communities/constants";
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
  /** 投稿対象の community (= URL の `/sysAdmin/{communityId}/...` および `report.community.id`) */
  targetCommunityId: string;
};

export type SubmitFeedbackActionResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * sysAdmin の feedback 投稿用 server action。
 *
 * backend の auth middleware (`firebase-auth.ts`) は `X-Community-Id` を
 * (a) Firebase tenant 解決 (b) `identities.some.{uid, communityId}` の検索キー
 * の両方に使う。sysAdmin の identity は home community ぶんしか発行されないため、
 * `X-Community-Id` を URL の対象 community に切り替えると identity が見つからず
 * `currentUser=null` になり、`IsAdmin` (sysAdmin bypass) と `IsCommunityMember`
 * の OR ルール両方が落ちて `FORBIDDEN` になる。
 *
 * よって `X-Community-Id` には HttpOnly cookie `__session_{community}` から
 * 推定した home community を入れ、対象 community は GraphQL 引数
 * `permission.communityId` で別途指定する。これは `communityCreate.ts` と同じ
 * パターン。
 */
export async function submitReportFeedbackAction(
  input: SubmitFeedbackActionInput,
): Promise<SubmitFeedbackActionResult> {
  const cookieStore = await cookies();
  // 複数 community にログイン履歴があると `__session_{id}` が複数存在し、
  // `find()` は cookie 走査順序依存で非決定的になる。`x-community-id` cookie
  // (middleware が host / 直前の `/community/{id}/...` 経由で解決した値) を
  // hint として優先し、それに対応する `__session_{id}` があれば確定で採用、
  // 無ければ ACTIVE_COMMUNITY_IDS にマッチする最初の session に fallback する。
  const sessionIds = cookieStore
    .getAll()
    .filter((c) => c.name.startsWith("__session_"))
    .map((c) => c.name.replace("__session_", ""));
  const hintedCommunityId = cookieStore.get("x-community-id")?.value;
  const homeCommunityId =
    hintedCommunityId && sessionIds.includes(hintedCommunityId)
      ? hintedCommunityId
      : sessionIds.find((id) =>
          (ACTIVE_COMMUNITY_IDS as readonly string[]).includes(id),
        );

  if (!homeCommunityId) {
    return {
      ok: false,
      error:
        "有効なセッションが見つかりません。一度ログアウトしてから再度ログインしてください",
    };
  }

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
        permission: { communityId: input.targetCommunityId },
      },
      { "X-Community-Id": homeCommunityId },
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
