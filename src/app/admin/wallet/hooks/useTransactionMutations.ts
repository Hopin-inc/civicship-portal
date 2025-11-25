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

export const useTransactionMutations = () => {
  // Apollo Hooks
  const [issuePointMutation, { loading: loadingIssue }] = usePointIssueMutation();
  const [grantPointMutation, { loading: loadingGrant }] = usePointGrantMutation();
  const [donatePointMutation, { loading: loadingDonate }] = usePointDonateMutation();

  // firebaseUserが初期化されているかチェック
  // CSRからのミューテーションはfirebaseUserのidTokenが必要
  const checkFirebaseAuth = (): { success: false; code: GqlErrorCode } | null => {
    const { firebaseUser } = useAuthStore.getState().state;
    if (!firebaseUser) {
      logger.warn("Transaction mutation blocked: firebaseUser not initialized", {
        component: "useTransactionMutations",
        errorCategory: "auth",
      });
      return { success: false, code: GqlErrorCode.Unauthenticated };
    }
    return null;
  };

  // -----------------------
  // 明示的に定義: ポイント発行
  // -----------------------
  const issuePoint = async (
    variables: GqlMutationTransactionIssueCommunityPointArgs,
  ): Promise<Result<GqlPointIssueMutation>> => {
    // firebaseUser認証チェック
    const authError = checkFirebaseAuth();
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
    // firebaseUser認証チェック
    const authError = checkFirebaseAuth();
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
    // firebaseUser認証チェック
    const authError = checkFirebaseAuth();
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
  };
};
