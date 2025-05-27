"use client";

import { useAuth } from "@/contexts/AuthContext";
import { GqlRole } from "@/types/graphql";

/**
 * 権限チェックの結果インターフェース
 */
export interface PermissionCheckResult {
  hasPermission: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * コミュニティ権限チェックのパラメータ
 */
export interface CommunityPermissionParams {
  communityId: string;
  requiredRoles?: GqlRole[];
}

/**
 * 機会権限チェックのパラメータ
 */
export interface OpportunityPermissionParams {
  opportunityId: string;
  requiredRoles?: GqlRole[];
}

/**
 * 自分自身の操作権限チェックのパラメータ
 */
export interface SelfPermissionParams {
  userId: string;
}

/**
 * 権限チェックのためのカスタムフック
 */
export function usePermission() {
  const { user, loading } = useAuth();

  /**
   * ユーザーが認証済みかどうかをチェック
   */
  const checkAuthenticated = (): PermissionCheckResult => {
    return {
      hasPermission: !!user,
      isLoading: loading,
      error: !user && !loading ? "認証が必要です" : null,
    };
  };

  /**
   * コミュニティに対する権限をチェック
   */
  const checkCommunityPermission = (
    params: CommunityPermissionParams
  ): PermissionCheckResult => {
    const { communityId, requiredRoles = [GqlRole.Owner, GqlRole.Manager] } = params;
    const authenticated = checkAuthenticated();

    if (authenticated.isLoading || !authenticated.hasPermission) {
      return authenticated;
    }

    const membership = user?.memberships?.find(
      (m) => m.community.id === communityId
    );

    if (!membership) {
      return {
        hasPermission: false,
        isLoading: false,
        error: "このコミュニティのメンバーではありません",
      };
    }

    const hasRequiredRole = requiredRoles.includes(membership.role);

    return {
      hasPermission: hasRequiredRole,
      isLoading: false,
      error: !hasRequiredRole ? "必要な権限がありません" : null,
    };
  };

  /**
   * 機会に対する権限をチェック
   */
  const checkOpportunityPermission = (
    params: OpportunityPermissionParams
  ): PermissionCheckResult => {
    const { opportunityId, requiredRoles = [GqlRole.Owner, GqlRole.Manager] } = params;
    const authenticated = checkAuthenticated();

    if (authenticated.isLoading || !authenticated.hasPermission) {
      return authenticated;
    }


    return {
      hasPermission: false,
      isLoading: false,
      error: "機会に対する権限チェックは未実装です",
    };
  };

  /**
   * 自分自身の操作権限をチェック
   */
  const checkSelfPermission = (
    params: SelfPermissionParams
  ): PermissionCheckResult => {
    const { userId } = params;
    const authenticated = checkAuthenticated();

    if (authenticated.isLoading || !authenticated.hasPermission) {
      return authenticated;
    }

    const isSelf = user?.id === userId;

    return {
      hasPermission: isSelf,
      isLoading: false,
      error: !isSelf ? "自分自身のリソースのみ操作できます" : null,
    };
  };

  /**
   * 管理者権限をチェック
   */
  const checkAdminPermission = (): PermissionCheckResult => {
    const authenticated = checkAuthenticated();

    if (authenticated.isLoading || !authenticated.hasPermission) {
      return authenticated;
    }

    const isAdmin = user?.memberships?.some((m) =>
      [GqlRole.Owner, GqlRole.Manager].includes(m.role)
    );

    return {
      hasPermission: !!isAdmin,
      isLoading: false,
      error: !isAdmin ? "管理者権限がありません" : null,
    };
  };

  return {
    checkAuthenticated,
    checkCommunityPermission,
    checkOpportunityPermission,
    checkSelfPermission,
    checkAdminPermission,
  };
}
