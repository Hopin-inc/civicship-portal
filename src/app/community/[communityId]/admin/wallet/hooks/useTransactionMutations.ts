import { ApolloError } from "@apollo/client";
import {
  GqlErrorCode,
  GqlMutationTransactionDonateSelfPointArgs,
  GqlMutationTransactionGrantCommunityPointArgs,
  GqlMutationTransactionIssueCommunityPointArgs,
  GqlPointDonateMutation,
  GqlPointGrantMutation,
  GqlPointIssueMutation,
  usePointDonateMutation,
  usePointGrantMutation,
  usePointIssueMutation,
} from "@/types/graphql";
import { logger } from "@/lib/logging";
import { useAuthStore } from "@/lib/auth/core/auth-store";

interface IssuePointInput {
  communityId: string;
  amount: number;
}

interface GrantPointInput {
  communityId: string;
  userId: string;
  amount: number;
}

type Result<T> = { success: true; data: T } | { success: false; code: GqlErrorCode };

// 認証チェック: firebaseUser または exchange経由のlineTokens.idTokenが必要
// apollo.ts の requestLink と同じロジックを使用
const checkAuth = (): { success: false; code: GqlErrorCode } | null => {
  const { firebaseUser, lineTokens } = useAuthStore.getState().state;
  if (!firebaseUser && !lineTokens.idToken) {
    logger.warn("Transaction mutation blocked: not authenticated (no firebaseUser or lineTokens.idToken)", {
      component: "useTransactionMutations",
      errorCategory: "auth",
    });
    return { success: false, code: GqlErrorCode.Unauthenticated };
  }
  return null;
};

export const useTransactionMutations = () => {
  // firebaseUser または exchange経由のlineTokens.idTokenをsubscribeしてUIが反応的に更新されるようにする
  const isAuthReady = useAuthStore((s) => !!s.state.firebaseUser || !!s.state.lineTokens.idToken);

  // Apollo Hooks
  const [issuePointMutation, { loading: loadingIssue }] = usePointIssueMutation();
  const [grantPointMutation, { loading: loadingGrant }] = usePointGrantMutation();
  const [donatePointMutation, { loading: loadingDonate }] = usePointDonateMutation();

  // -----------------------
  // 明示的に定義: ポイント発行
  // -----------------------
  const issuePoint = async (
    variables: GqlMutationTransactionIssueCommunityPointArgs,
  ): Promise<Result<GqlPointIssueMutation>> => {
    // 認証チェック
    const authError = checkAuth();
    if (authError) return authError;

    // 入力バリデーション
    if (!variables.input?.transferPoints) {
      return { success: false, code: GqlErrorCode.ValidationError };
    }

    try {
      const { data } = await issuePointMutation({ variables });

      if (data != null) {
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
      logger.warn("Issue point mutation failed", {
        error: e instanceof Error ? e.message : String(e),
        component: "useTransactionMutations",
        errorCategory: "system"
      });
      return { success: false, code: GqlErrorCode.Unknown };
    }
  };

  // -----------------------
  // 明示的に定義: ポイント助成
  // -----------------------
  const grantPoint = async (
    variables: GqlMutationTransactionGrantCommunityPointArgs,
  ): Promise<Result<GqlPointGrantMutation>> => {
    // 認証チェック
    const authError = checkAuth();
    if (authError) return authError;

    if (!variables.input?.toUserId || !variables.input?.transferPoints) {
      return { success: false, code: GqlErrorCode.ValidationError };
    }

    try {
      const { data } = await grantPointMutation({ variables });

      if (data != null) {
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
      logger.warn("Grant point mutation failed", {
        error: e instanceof Error ? e.message : String(e),
        component: "useTransactionMutations",
        errorCategory: "system"
      });
      return { success: false, code: GqlErrorCode.Unknown };
    }
  };

  const donatePoint = async (
    variables: GqlMutationTransactionDonateSelfPointArgs,
  ): Promise<Result<GqlPointDonateMutation>> => {
    // 認証チェック
    const authError = checkAuth();
    if (authError) return authError;

    if (!variables.input?.toUserId || !variables.input?.transferPoints) {
      return { success: false, code: GqlErrorCode.ValidationError };
    }

    try {
      const { data } = await donatePointMutation({ variables });

      if (data != null) {
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
      logger.warn("Donate point mutation failed", {
        error: e instanceof Error ? e.message : String(e),
        component: "useTransactionMutations",
        errorCategory: "system"
      });
      return { success: false, code: GqlErrorCode.Unknown };
    }
  };

  return {
    issuePoint,
    grantPoint,
    donatePoint,
    isLoading: loadingIssue || loadingGrant || loadingDonate,
    isAuthReady,
  };
};
