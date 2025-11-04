import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PhoneVerificationForm } from "../PhoneVerificationForm";
import React from "react";
import { GqlPhoneUserStatus } from "@/types/graphql";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(() => null),
  })),
}));

// Mock AuthProvider
vi.mock("@/contexts/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock Apollo Client
vi.mock("@apollo/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@apollo/client")>();
  return {
    ...actual,
    useMutation: vi.fn(),
  };
});

// Mock auth store
vi.mock("@/lib/auth/core/auth-store", () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      phoneAuth: {
        phoneUid: "mock-phone-uid",
      },
      setState: vi.fn(),
    })),
  },
}));

// Mock auth redirect service
vi.mock("@/lib/auth/service/auth-redirect-service", () => ({
  AuthRedirectService: {
    getInstance: vi.fn(() => ({
      getRedirectPath: vi.fn((base) => base),
    })),
  },
}));

// Mock logger
vi.mock("@/lib/logging", () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe.skip("PhoneVerificationForm", () => {
  let mockPhoneAuth: any;
  let mockRouter: any;
  let mockIdentityCheckPhoneUser: any;
  let mockUseAuth: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockPhoneAuth = {
      startPhoneVerification: vi.fn().mockResolvedValue("verification-id"),
      verifyPhoneCode: vi.fn().mockResolvedValue(true),
      isVerifying: false,
      clearRecaptcha: vi.fn(),
    };

    mockRouter = {
      push: vi.fn(),
    };

    mockIdentityCheckPhoneUser = vi.fn().mockResolvedValue({
      data: {
        identityCheckPhoneUser: {
          status: GqlPhoneUserStatus.NewUser,
        },
      },
    });

    // Setup mocks
    const authProvider = require("@/contexts/AuthProvider");
    mockUseAuth = authProvider.useAuth;
    mockUseAuth.mockReturnValue({
      phoneAuth: mockPhoneAuth,
      isAuthenticated: false,
      loading: false,
      authenticationState: "unauthenticated",
      updateAuthState: vi.fn(),
    });

    const navigation = require("next/navigation");
    navigation.useRouter.mockReturnValue(mockRouter);
    navigation.useSearchParams.mockReturnValue({
      get: vi.fn(() => null),
    });

    const apolloClient = require("@apollo/client");
    apolloClient.useMutation.mockReturnValue([mockIdentityCheckPhoneUser, { loading: false }]);
  });

  describe("Initial Rendering", () => {
    it("should render phone input step initially", () => {
      render(<PhoneVerificationForm />);

      expect(screen.getByText("電話番号を入力")).toBeInTheDocument();
      expect(screen.getByLabelText("電話番号")).toBeInTheDocument();
    });

    it("should show loading indicator when loading", () => {
      mockUseAuth.mockReturnValue({
        phoneAuth: mockPhoneAuth,
        isAuthenticated: false,
        loading: true,
        authenticationState: "loading",
        updateAuthState: vi.fn(),
      });

      render(<PhoneVerificationForm />);

      // LoadingIndicator should be rendered
      expect(screen.queryByText("電話番号を入力")).not.toBeInTheDocument();
    });

    it("should redirect when already authenticated", () => {
      mockUseAuth.mockReturnValue({
        phoneAuth: mockPhoneAuth,
        isAuthenticated: true,
        loading: false,
        authenticationState: "user_registered",
        updateAuthState: vi.fn(),
      });

      render(<PhoneVerificationForm />);

      // Form should not be rendered
      expect(screen.queryByText("電話番号を入力")).not.toBeInTheDocument();
    });
  });

  describe("Phone Submission Flow", () => {
    it("should submit phone number and move to code step", async () => {
      render(<PhoneVerificationForm />);

      const input = screen.getByLabelText("電話番号");
      fireEvent.change(input, { target: { value: "09012345678" } });

      const submitButton = screen.getByRole("button", { name: /認証コードを送信/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPhoneAuth.startPhoneVerification).toHaveBeenCalledWith("+8190123456 78");
      });

      await waitFor(() => {
        expect(screen.getByText("認証コードを入力")).toBeInTheDocument();
      });
    });

    it("should show error toast when phone submission fails", async () => {
      mockPhoneAuth.startPhoneVerification.mockRejectedValueOnce(new Error("Network error"));

      const toast = require("sonner").toast;

      render(<PhoneVerificationForm />);

      const input = screen.getByLabelText("電話番号");
      fireEvent.change(input, { target: { value: "09012345678" } });

      const submitButton = screen.getByRole("button", { name: /認証コードを送信/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    it("should not submit when phone number is invalid", () => {
      render(<PhoneVerificationForm />);

      const input = screen.getByLabelText("電話番号");
      fireEvent.change(input, { target: { value: "123" } });

      const submitButton = screen.getByRole("button", { name: /認証コードを送信/ });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Code Verification Flow", () => {
    beforeEach(async () => {
      // Setup: Move to code verification step
      const { rerender } = render(<PhoneVerificationForm />);

      const input = screen.getByLabelText("電話番号");
      fireEvent.change(input, { target: { value: "09012345678" } });

      const submitButton = screen.getByRole("button", { name: /認証コードを送信/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("認証コードを入力")).toBeInTheDocument();
      });
    });

    it("should verify code and redirect for new user", async () => {
      const toast = require("sonner").toast;

      // Find and interact with OTP input (simplified - actual implementation may vary)
      const verifyButton = screen.getByRole("button", { name: /コードを検証/ });

      // Note: In real test, you'd need to properly interact with InputOTP component
      // For now, we'll directly call the form submission
      const form = verifyButton.closest("form");
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockPhoneAuth.verifyPhoneCode).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("電話番号認証が完了しました");
        expect(mockRouter.push).toHaveBeenCalledWith("/sign-up");
      });
    });

    it("should show error when code is invalid", async () => {
      mockPhoneAuth.verifyPhoneCode.mockResolvedValueOnce(false);
      const toast = require("sonner").toast;

      const verifyButton = screen.getByRole("button", { name: /コードを検証/ });
      const form = verifyButton.closest("form");
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("認証コードが無効です");
      });
    });
  });

  describe("Code Resend Flow", () => {
    beforeEach(async () => {
      // Setup: Move to code verification step
      render(<PhoneVerificationForm />);

      const input = screen.getByLabelText("電話番号");
      fireEvent.change(input, { target: { value: "09012345678" } });

      const submitButton = screen.getByRole("button", { name: /認証コードを送信/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("認証コードを入力")).toBeInTheDocument();
      });
    });

    it("should resend verification code", async () => {
      vi.useFakeTimers();

      // Wait for initial countdown to complete
      vi.advanceTimersByTime(60000);

      await waitFor(() => {
        const resendButton = screen.getByRole("button", { name: /コードを再送信/ });
        expect(resendButton).not.toBeDisabled();
      });

      const resendButton = screen.getByRole("button", { name: /コードを再送信/ });
      fireEvent.click(resendButton);

      await waitFor(() => {
        expect(mockPhoneAuth.clearRecaptcha).toHaveBeenCalled();
      });

      const toast = require("sonner").toast;
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("認証コードを再送信しました");
      });

      vi.restoreAllMocks();
    });

    it("should disable resend button during countdown", async () => {
      vi.useFakeTimers();

      const resendButton = screen.getByRole("button", { name: /秒後に再送信できます/ });
      expect(resendButton).toBeDisabled();

      vi.restoreAllMocks();
    });
  });

  describe("Back to Phone Flow", () => {
    beforeEach(async () => {
      // Setup: Move to code verification step
      render(<PhoneVerificationForm />);

      const input = screen.getByLabelText("電話番号");
      fireEvent.change(input, { target: { value: "09012345678" } });

      const submitButton = screen.getByRole("button", { name: /認証コードを送信/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("認証コードを入力")).toBeInTheDocument();
      });
    });

    it("should go back to phone input step", async () => {
      vi.useFakeTimers();
      const reloadMock = vi.fn();
      Object.defineProperty(window, "location", {
        value: { reload: reloadMock },
        writable: true,
      });

      const backButton = screen.getByRole("button", { name: /電話番号を再入力/ });
      fireEvent.click(backButton);

      await waitFor(() => {
        expect(mockPhoneAuth.clearRecaptcha).toHaveBeenCalled();
      });

      vi.advanceTimersByTime(1000);

      expect(reloadMock).toHaveBeenCalled();

      vi.restoreAllMocks();
    });
  });

  describe("Different User Status Scenarios", () => {
    beforeEach(async () => {
      // Setup: Move to code verification step
      render(<PhoneVerificationForm />);

      const input = screen.getByLabelText("電話番号");
      fireEvent.change(input, { target: { value: "09012345678" } });

      const submitButton = screen.getByRole("button", { name: /認証コードを送信/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("認証コードを入力")).toBeInTheDocument();
      });
    });

    it("should handle existing user in same community", async () => {
      mockIdentityCheckPhoneUser.mockResolvedValueOnce({
        data: {
          identityCheckPhoneUser: {
            status: GqlPhoneUserStatus.ExistingSameCommunity,
          },
        },
      });

      const toast = require("sonner").toast;

      const verifyButton = screen.getByRole("button", { name: /コードを検証/ });
      const form = verifyButton.closest("form");
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("ログインしました");
        expect(mockRouter.push).toHaveBeenCalledWith("/");
      });
    });

    it("should handle existing user in different community", async () => {
      const updateAuthState = vi.fn();
      mockUseAuth.mockReturnValue({
        phoneAuth: mockPhoneAuth,
        isAuthenticated: false,
        loading: false,
        authenticationState: "unauthenticated",
        updateAuthState,
      });

      mockIdentityCheckPhoneUser.mockResolvedValueOnce({
        data: {
          identityCheckPhoneUser: {
            status: GqlPhoneUserStatus.ExistingDifferentCommunity,
          },
        },
      });

      const toast = require("sonner").toast;

      const verifyButton = screen.getByRole("button", { name: /コードを検証/ });
      const form = verifyButton.closest("form");
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("メンバーシップが追加されました");
        expect(updateAuthState).toHaveBeenCalled();
        expect(mockRouter.push).toHaveBeenCalledWith("/");
      });
    });
  });

  describe("URL Parameters", () => {
    it("should handle next parameter in URL", async () => {
      const navigation = require("next/navigation");
      navigation.useSearchParams.mockReturnValue({
        get: vi.fn((key) => (key === "next" ? "/dashboard" : null)),
      });

      render(<PhoneVerificationForm />);

      const input = screen.getByLabelText("電話番号");
      fireEvent.change(input, { target: { value: "09012345678" } });

      const submitButton = screen.getByRole("button", { name: /認証コードを送信/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("認証コードを入力")).toBeInTheDocument();
      });

      const verifyButton = screen.getByRole("button", { name: /コードを検証/ });
      const form = verifyButton.closest("form");
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining("next="));
      });
    });
  });
});
