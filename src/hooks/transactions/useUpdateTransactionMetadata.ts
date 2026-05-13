"use client";

import { ApolloError } from "@apollo/client";
import {
  GqlErrorCode,
  GqlImageInput,
  GqlTransactionUpdateMetadataMutation,
  useTransactionUpdateMetadataMutation,
} from "@/types/graphql";
import { logger } from "@/lib/logging";
import { useAuthStore } from "@/lib/auth/core/auth-store";

type Result<T> = { success: true; data: T } | { success: false; code: GqlErrorCode };

export type UpdatePermission = { type: "self" } | { type: "community" };

/**
 * トランザクションのメタデータ（コメント・画像）を更新する汎用 hook。
 * admin 配下の useTransactionMutations に依存せず、
 * ユーザー向けフロー（donate 等）からも安全にインポートできる。
 *
 * `permissionOverride`:
 * - `{ type: "self" }` (デフォルト): 自分の transaction を編集。
 *   `permission: { userId }` を mutation 引数に付与し、backend の IsSelf rule を通す。
 * - `{ type: "community" }`: community OWNER として community wallet 発の
 *   transaction を編集。permission 引数は付与せず、Apollo client が送る
 *   `X-Community-Id` ヘッダの community で backend が OWNER 判定する。
 *   呼び出し元は `/community/[communityId]/...` 配下にいる前提
 *   (= Apollo context の community = 対象 community)。
 */
export function useUpdateTransactionMetadata() {
  const currentUserId = useAuthStore((s) => s.state.currentUser?.id ?? null);
  const [updateMetadataMutation] = useTransactionUpdateMetadataMutation();

  const updateTransactionMetadata = async (
    transactionId: string,
    payload: { comment?: string | null; images?: File[] },
    permissionOverride?: UpdatePermission,
  ): Promise<Result<GqlTransactionUpdateMetadataMutation>> => {
    const { firebaseUser, lineTokens } = useAuthStore.getState().state;
    if (!firebaseUser && !lineTokens.idToken) {
      return { success: false, code: GqlErrorCode.Unauthenticated };
    }

    // currentUserId is only required for self-permission flows
    const isCommunityPermission = permissionOverride?.type === "community";
    if (!isCommunityPermission && !currentUserId) {
      return { success: false, code: GqlErrorCode.Unauthenticated };
    }

    const imagesInput: GqlImageInput[] | undefined = payload.images?.map((file) => ({
      file,
      alt: "",
      caption: "",
    }));

    const input = {
      ...(payload.comment !== undefined && { comment: payload.comment }),
      ...(imagesInput !== undefined && { images: imagesInput }),
    };

    try {
      const { data } = await updateMetadataMutation({
        variables: {
          id: transactionId,
          input,
          ...(!permissionOverride || permissionOverride.type === "self"
            ? { permission: { userId: currentUserId! } }
            : {}),
        },
      });

      if (data?.transactionUpdateMetadata?.__typename === "TransactionUpdateMetadataSuccess") {
        return { success: true, data };
      } else {
        return { success: false, code: GqlErrorCode.Unknown };
      }
    } catch (e) {
      if (e instanceof ApolloError) {
        const gqlError = e.graphQLErrors[0];
        const code = gqlError?.extensions?.code as GqlErrorCode | undefined;
        return { success: false, code: code ?? GqlErrorCode.Unknown };
      }
      logger.warn("Update transaction metadata failed", {
        error: e instanceof Error ? e.message : String(e),
        component: "useUpdateTransactionMetadata",
        errorCategory: "system",
      });
      return { success: false, code: GqlErrorCode.Unknown };
    }
  };

  return { updateTransactionMetadata };
}
