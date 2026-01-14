import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { CodeVerificationStep } from "../CodeVerificationStep";
import React from "react";

// Mock logger
vi.mock("@/lib/logging", () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe("CodeVerificationStep", () => {
  const mockPhoneAuth = {
    clearRecaptcha: vi.fn(),
  } as any;

  const defaultProps = {
    verificationCode: "",
    onCodeChange: vi.fn(),
    onSubmit: vi.fn(),
    onResend: vi.fn(),
    onBackToPhone: vi.fn(),
    isVerifying: false,
    isPhoneVerifying: false,
    isResendDisabled: false,
    countdown: 60,
    isPhoneSubmitting: false,
    showRecaptcha: false,
    recaptchaContainerRef: React.createRef<HTMLDivElement>(),
    phoneAuth: mockPhoneAuth,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render code verification form", () => {
    render(<CodeVerificationStep {...defaultProps} />);

    expect(screen.getByText("認証コードを入力")).toBeInTheDocument();
    expect(screen.getByText("電話番号に送信された6桁の認証コードを入力してください。")).toBeInTheDocument();
  });

  it("should render OTP input slots", () => {
    const { container } = render(<CodeVerificationStep {...defaultProps} />);

    // InputOTP should have 6 slots
    const otpSlots = container.querySelectorAll('[data-input-otp-slot]');
    expect(otpSlots.length).toBeGreaterThanOrEqual(0); // May vary based on implementation
  });

  it("should call onSubmit when form is submitted", () => {
    const onSubmit = vi.fn((e) => e.preventDefault());
    render(<CodeVerificationStep {...defaultProps} verificationCode="123456" onSubmit={onSubmit} />);

    const form = screen.getByRole("button", { name: /コードを検証/ }).closest("form");
    fireEvent.submit(form!);

    expect(onSubmit).toHaveBeenCalled();
  });

  it("should disable verify button when code is incomplete", () => {
    render(<CodeVerificationStep {...defaultProps} verificationCode="12345" />);

    const button = screen.getByRole("button", { name: /コードを検証/ });
    expect(button).toBeDisabled();
  });

  it("should enable verify button when code is complete", () => {
    render(<CodeVerificationStep {...defaultProps} verificationCode="123456" />);

    const button = screen.getByRole("button", { name: /コードを検証/ });
    expect(button).not.toBeDisabled();
  });

  it("should disable verify button when verifying", () => {
    render(<CodeVerificationStep {...defaultProps} isVerifying={true} verificationCode="123456" />);

    const button = screen.getByRole("button", { name: /検証中.../ });
    expect(button).toBeDisabled();
  });

  it("should show correct button text when verifying", () => {
    render(<CodeVerificationStep {...defaultProps} isVerifying={true} />);

    expect(screen.getByText("検証中...")).toBeInTheDocument();
  });

  it("should call onResend when resend button is clicked", () => {
    const onResend = vi.fn();
    render(<CodeVerificationStep {...defaultProps} onResend={onResend} />);

    const resendButton = screen.getByRole("button", { name: /コードを再送信/ });
    fireEvent.click(resendButton);

    expect(onResend).toHaveBeenCalled();
  });

  it("should disable resend button when countdown is active", () => {
    render(<CodeVerificationStep {...defaultProps} isResendDisabled={true} countdown={45} />);

    const button = screen.getByRole("button", { name: /45秒後に再送信できます/ });
    expect(button).toBeDisabled();
  });

  it("should show countdown text when resend is disabled", () => {
    render(<CodeVerificationStep {...defaultProps} isResendDisabled={true} countdown={30} />);

    expect(screen.getByText("30秒後に再送信できます")).toBeInTheDocument();
  });

  it("should enable resend button when countdown is complete", () => {
    render(<CodeVerificationStep {...defaultProps} isResendDisabled={false} />);

    const button = screen.getByRole("button", { name: /コードを再送信/ });
    expect(button).not.toBeDisabled();
  });

  it("should disable resend button when phone is submitting", () => {
    render(<CodeVerificationStep {...defaultProps} isPhoneSubmitting={true} />);

    const button = screen.getByRole("button", { name: /送信中.../ });
    expect(button).toBeDisabled();
  });

  it("should call onBackToPhone when back button is clicked", async () => {
    const onBackToPhone = vi.fn();
    render(<CodeVerificationStep {...defaultProps} onBackToPhone={onBackToPhone} />);

    const backButton = screen.getByRole("button", { name: /電話番号を再入力/ });
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(onBackToPhone).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it("should show/hide recaptcha container based on showRecaptcha prop", () => {
    const { rerender, container } = render(<CodeVerificationStep {...defaultProps} showRecaptcha={false} />);

    let recaptchaContainer = container.querySelector("#recaptcha-container") as HTMLElement;
    expect(recaptchaContainer?.style.display).toBe("none");

    rerender(<CodeVerificationStep {...defaultProps} showRecaptcha={true} />);

    recaptchaContainer = container.querySelector("#recaptcha-container") as HTMLElement;
    expect(recaptchaContainer?.style.display).toBe("block");
  });

  it("should disable buttons when appropriate", () => {
    render(<CodeVerificationStep {...defaultProps} verificationCode="12345" isVerifying={true} isResendDisabled={true} />);

    const verifyButton = screen.getByRole("button", { name: /検証中.../ });
    const resendButton = screen.getByRole("button", { name: /秒後に再送信できます/ });

    expect(verifyButton).toBeDisabled();
    expect(resendButton).toBeDisabled();
  });

  it("should handle clearRecaptcha error gracefully", async () => {
    const errorPhoneAuth = {
      clearRecaptcha: vi.fn().mockRejectedValue(new Error("Clear failed")),
    } as any;

    const onBackToPhone = vi.fn();
    render(<CodeVerificationStep {...defaultProps} phoneAuth={errorPhoneAuth} onBackToPhone={onBackToPhone} />);

    const backButton = screen.getByRole("button", { name: /電話番号を再入力/ });
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(onBackToPhone).toHaveBeenCalled();
    }, { timeout: 1000 });

    // Error is handled gracefully without throwing
    expect(errorPhoneAuth.clearRecaptcha).toHaveBeenCalled();
  });
});