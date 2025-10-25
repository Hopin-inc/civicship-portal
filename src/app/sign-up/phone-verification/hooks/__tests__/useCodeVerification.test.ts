import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCodeVerification } from "../useCodeVerification";
import { GqlPhoneUserStatus } from "@/types/graphql";

// Mock dependencies
vi.mock("@apollo/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@apollo/client")>();
  return {
    ...actual,
    useMutation: vi.fn(),
  };
});

vi.mock("@/lib/auth/core/auth-store", () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      phoneAuth: {
        phoneUid: "mock-phone-uid-123",
      },
      setState: vi.fn(),
    })),
  },
}));

vi.mock("@/lib/auth/service/auth-redirect-service", () => ({
  AuthRedirectService: {
    getInstance: vi.fn(() => ({
      getRedirectPath: vi.fn((base, next) => {
        if (next) return `/redirect${next}`;
        return base;
      }),
    })),
  },
}));

describe.skip("useCodeVerification", () => {
  let mockPhoneAuth: any;
  let mockUpdateAuthState: any;
  let mockIdentityCheckPhoneUser: any;
  const nextParam = "?next=%2Fdashboard";

  beforeEach(() => {
    vi.clearAllMocks();

    mockPhoneAuth = {
      verifyPhoneCode: vi.fn().mockResolvedValue(true),
    };

    mockUpdateAuthState = vi.fn();

    mockIdentityCheckPhoneUser = vi.fn();

    const apolloClient = require("@apollo/client");
    apolloClient.useMutation.mockReturnValue([mockIdentityCheckPhoneUser, { loading: false }]);
  });

  describe("verify", () => {
    it("should successfully verify code for new user", async () => {
      mockIdentityCheckPhoneUser.mockResolvedValue({
        data: {
          identityCheckPhoneUser: {
            status: GqlPhoneUserStatus.NewUser,
          },
        },
      });

      const { result } = renderHook(() =>
        useCodeVerification(mockPhoneAuth, nextParam, mockUpdateAuthState)
      );

      let verifyResult: any;
      await act(async () => {
        verifyResult = await result.current.verify("123456");
      });

      expect(verifyResult.success).toBe(true);
      expect(verifyResult.message).toBe("電話番号認証が完了しました");
      expect(verifyResult.redirectPath).toBe(`/sign-up${nextParam}`);
      expect(mockPhoneAuth.verifyPhoneCode).toHaveBeenCalledWith("123456");
    });

    it("should successfully verify code for existing user in same community", async () => {
      mockIdentityCheckPhoneUser.mockResolvedValue({
        data: {
          identityCheckPhoneUser: {
            status: GqlPhoneUserStatus.ExistingSameCommunity,
          },
        },
      });

      const { result } = renderHook(() =>
        useCodeVerification(mockPhoneAuth, nextParam, mockUpdateAuthState)
      );

      let verifyResult: any;
      await act(async () => {
        verifyResult = await result.current.verify("123456");
      });

      expect(verifyResult.success).toBe(true);
      expect(verifyResult.message).toBe("ログインしました");
      expect(verifyResult.redirectPath).toContain("/redirect");
    });

    it("should successfully verify code for existing user in different community", async () => {
      mockIdentityCheckPhoneUser.mockResolvedValue({
        data: {
          identityCheckPhoneUser: {
            status: GqlPhoneUserStatus.ExistingDifferentCommunity,
          },
        },
      });

      const { result } = renderHook(() =>
        useCodeVerification(mockPhoneAuth, nextParam, mockUpdateAuthState)
      );

      let verifyResult: any;
      await act(async () => {
        verifyResult = await result.current.verify("123456");
      });

      expect(verifyResult.success).toBe(true);
      expect(verifyResult.message).toBe("メンバーシップが追加されました");
      expect(mockUpdateAuthState).toHaveBeenCalled();
    });

    it("should return error when verification fails", async () => {
      mockPhoneAuth.verifyPhoneCode.mockResolvedValue(false);

      const { result } = renderHook(() =>
        useCodeVerification(mockPhoneAuth, nextParam, mockUpdateAuthState)
      );

      let verifyResult: any;
      await act(async () => {
        verifyResult = await result.current.verify("123456");
      });

      expect(verifyResult.success).toBe(false);
      expect(verifyResult.error?.message).toBe("認証コードが無効です");
      expect(verifyResult.error?.type).toBe("invalid-code");
    });

    it("should return error when phoneUid is missing", async () => {
      const { useAuthStore } = require("@/lib/auth/core/auth-store");
      useAuthStore.getState.mockReturnValueOnce({
        phoneAuth: {
          phoneUid: null,
        },
        setState: vi.fn(),
      });

      const { result } = renderHook(() =>
        useCodeVerification(mockPhoneAuth, nextParam, mockUpdateAuthState)
      );

      let verifyResult: any;
      await act(async () => {
        verifyResult = await result.current.verify("123456");
      });

      expect(verifyResult.success).toBe(false);
      expect(verifyResult.error?.message).toBe("認証コードが無効です");
      expect(verifyResult.error?.type).toBe("invalid-code");
    });

    it("should return error when status fetch fails", async () => {
      mockIdentityCheckPhoneUser.mockResolvedValue({
        data: {
          identityCheckPhoneUser: {
            status: null,
          },
        },
      });

      const { result } = renderHook(() =>
        useCodeVerification(mockPhoneAuth, nextParam, mockUpdateAuthState)
      );

      let verifyResult: any;
      await act(async () => {
        verifyResult = await result.current.verify("123456");
      });

      expect(verifyResult.success).toBe(false);
      expect(verifyResult.error?.message).toBe("認証ステータスの取得に失敗しました。再試行してください。");
      expect(verifyResult.error?.type).toBe("status-fetch-failed");
    });

    it("should return error for unknown status", async () => {
      mockIdentityCheckPhoneUser.mockResolvedValue({
        data: {
          identityCheckPhoneUser: {
            status: "UNKNOWN_STATUS" as any,
          },
        },
      });

      const { result } = renderHook(() =>
        useCodeVerification(mockPhoneAuth, nextParam, mockUpdateAuthState)
      );

      let verifyResult: any;
      await act(async () => {
        verifyResult = await result.current.verify("123456");
      });

      expect(verifyResult.success).toBe(false);
      expect(verifyResult.error?.message).toBe("認証処理でエラーが発生しました");
      expect(verifyResult.error?.type).toBe("unknown-status");
    });

    it("should handle verification exception", async () => {
      mockPhoneAuth.verifyPhoneCode.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() =>
        useCodeVerification(mockPhoneAuth, nextParam, mockUpdateAuthState)
      );

      let verifyResult: any;
      await act(async () => {
        verifyResult = await result.current.verify("123456");
      });

      expect(verifyResult.success).toBe(false);
      expect(verifyResult.error?.message).toBe("電話番号からやり直して下さい");
      expect(verifyResult.error?.type).toBe("verification-failed");
    });

    it("should prevent double verification", async () => {
      mockIdentityCheckPhoneUser.mockResolvedValue({
        data: {
          identityCheckPhoneUser: {
            status: GqlPhoneUserStatus.NewUser,
          },
        },
      });

      const { result } = renderHook(() =>
        useCodeVerification(mockPhoneAuth, nextParam, mockUpdateAuthState)
      );

      // Start first verification
      const firstVerify = act(async () => {
        return result.current.verify("123456");
      });

      // Try second verification immediately
      let secondResult: any;
      await act(async () => {
        secondResult = await result.current.verify("123456");
      });

      expect(secondResult.success).toBe(false);
      expect(secondResult.error?.type).toBe("already-verifying");

      await firstVerify;
    });

    it("should reset isVerifying state after completion", async () => {
      mockIdentityCheckPhoneUser.mockResolvedValue({
        data: {
          identityCheckPhoneUser: {
            status: GqlPhoneUserStatus.NewUser,
          },
        },
      });

      const { result } = renderHook(() =>
        useCodeVerification(mockPhoneAuth, nextParam, mockUpdateAuthState)
      );

      expect(result.current.isVerifying).toBe(false);

      await act(async () => {
        await result.current.verify("123456");
      });

      expect(result.current.isVerifying).toBe(false);
    });

    it("should call identityCheckPhoneUser with correct phoneUid", async () => {
      mockIdentityCheckPhoneUser.mockResolvedValue({
        data: {
          identityCheckPhoneUser: {
            status: GqlPhoneUserStatus.NewUser,
          },
        },
      });

      const { result } = renderHook(() =>
        useCodeVerification(mockPhoneAuth, nextParam, mockUpdateAuthState)
      );

      await act(async () => {
        await result.current.verify("123456");
      });

      expect(mockIdentityCheckPhoneUser).toHaveBeenCalledWith({
        variables: {
          input: {
            phoneUid: "mock-phone-uid-123",
          },
        },
      });
    });
  });
});
