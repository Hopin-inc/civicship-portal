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

export type UpdatePermission =
  | { type: "self" }
  | { type: "community"; communityId: string };

/**
 * トランザクションのメタデータ（コメント・画像）を更新する汎用 hook。
 * admin 配下の useTransactionMutations に依存せず、
 * ユーザー向けフロー（donate 等）からも安全にインポートできる。
 *
 * NOTE: variables の型は codegen 再実行後に正しく更新される（permission optional 化、
 * communityPermission 追加）。それまでは any キャストで渡す。
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

    if (!currentUserId) {
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
        // codegen 再実行後に型が更新されるまで any キャスト
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        variables: {
          id: transactionId,
          input,
          ...(!permissionOverride || permissionOverride.type === "self"
            ? { permission: { userId: currentUserId } }
            : {}),
          ...(permissionOverride?.type === "community"
            ? { communityPermission: { communityId: permissionOverride.communityId } }
            : {}),
        } as any,
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
