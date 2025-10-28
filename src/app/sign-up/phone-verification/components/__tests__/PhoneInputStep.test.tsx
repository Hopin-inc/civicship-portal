import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PhoneInputStep } from "../PhoneInputStep";
import React from "react";

describe("PhoneInputStep", () => {
  const defaultProps = {
    phoneNumber: "",
    onPhoneNumberChange: vi.fn(),
    onSubmit: vi.fn(),
    isSubmitting: false,
    isRateLimited: false,
    isPhoneValid: false,
    isVerifying: false,
    recaptchaContainerRef: React.createRef<HTMLDivElement>(),
  };

  it("should render phone input form", () => {
    render(<PhoneInputStep {...defaultProps} />);

    // Now uses InternationalPhoneField instead of basic input
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByLabelText("Select country")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("例）09012345678")).toBeInTheDocument();
  });

  it("should display phone number value", () => {
    render(<PhoneInputStep {...defaultProps} phoneNumber="+819012345678" />);

    const input = screen.getByRole("textbox") as HTMLInputElement;
    // InternationalPhoneField formats with country code
    expect(input.value).toBe("+81 90 1234 5678");
  });

  it("should call onPhoneNumberChange when input changes", () => {
    const onPhoneNumberChange = vi.fn();
    render(<PhoneInputStep {...defaultProps} onPhoneNumberChange={onPhoneNumberChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "9012345678" } });

    // InternationalPhoneField handles the onChange
    expect(onPhoneNumberChange).toHaveBeenCalled();
  });

  it("should call onSubmit when form is submitted", () => {
    const onSubmit = vi.fn((e) => e.preventDefault());
    render(<PhoneInputStep {...defaultProps} onSubmit={onSubmit} isPhoneValid={true} />);

    const form = screen.getByRole("button", { name: /認証コードを送信/ }).closest("form");
    fireEvent.submit(form!);

    expect(onSubmit).toHaveBeenCalled();
  });

  it("should disable submit button when phone is invalid", () => {
    render(<PhoneInputStep {...defaultProps} isPhoneValid={false} />);

    const button = screen.getByRole("button", { name: /認証コードを送信/ });
    expect(button).toBeDisabled();
  });

  it("should disable submit button when submitting", () => {
    render(<PhoneInputStep {...defaultProps} isSubmitting={true} isPhoneValid={true} />);

    const button = screen.getByRole("button", { name: /送信中.../ });
    expect(button).toBeDisabled();
  });

  it("should disable submit button when verifying", () => {
    render(<PhoneInputStep {...defaultProps} isVerifying={true} isPhoneValid={true} />);

    const button = screen.getByRole("button", { name: /送信中.../ });
    expect(button).toBeDisabled();
  });

  it("should disable submit button when rate limited", () => {
    render(<PhoneInputStep {...defaultProps} isRateLimited={true} isPhoneValid={true} />);

    const button = screen.getByRole("button", { name: /制限中.../ });
    expect(button).toBeDisabled();
  });

  it("should show correct button text when submitting", () => {
    render(<PhoneInputStep {...defaultProps} isSubmitting={true} />);

    expect(screen.getByText("送信中...")).toBeInTheDocument();
  });

  it("should show correct button text when rate limited", () => {
    render(<PhoneInputStep {...defaultProps} isRateLimited={true} />);

    expect(screen.getByText("制限中...")).toBeInTheDocument();
  });

  it("should enable submit button when phone is valid and not submitting", () => {
    render(<PhoneInputStep {...defaultProps} isPhoneValid={true} />);

    const button = screen.getByRole("button", { name: /認証コードを送信/ });
    expect(button).not.toBeDisabled();
  });

  it("should render reload button", () => {
    render(<PhoneInputStep {...defaultProps} />);

    expect(screen.getByText("切り替わらない際は再読み込み")).toBeInTheDocument();
  });

  it("should reload page when reload button is clicked", () => {
    vi.useFakeTimers();
    const reloadMock = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadMock },
      writable: true,
    });

    render(<PhoneInputStep {...defaultProps} />);

    const reloadButton = screen.getByText("切り替わらない際は再読み込み");
    fireEvent.click(reloadButton);

    vi.advanceTimersByTime(300);

    expect(reloadMock).toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it("should render recaptcha container", () => {
    const { container } = render(<PhoneInputStep {...defaultProps} />);

    const recaptchaContainer = container.querySelector("#recaptcha-container");
    expect(recaptchaContainer).toBeInTheDocument();
  });

  it("should display descriptive text", () => {
    render(<PhoneInputStep {...defaultProps} />);

    expect(
      screen.getByText(
        "電話番号認証のため、あなたの電話番号を入力してください。SMSで認証コードが送信されます。"
      )
    ).toBeInTheDocument();
  });
});
