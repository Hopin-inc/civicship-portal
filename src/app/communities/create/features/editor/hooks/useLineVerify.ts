"use client";

import { useState, useCallback } from "react";

export type LineVerifyConfig = {
  accessToken: string;
  channelId: string;
  channelSecret: string;
  liffId: string;
  loginChannelId: string;
  loginChannelSecret: string;
};

type VerifyState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; botName: string }
  | { status: "error"; message: string; failedCheck?: string };

export function useLineVerify() {
  const [state, setState] = useState<VerifyState>({ status: "idle" });

  const verify = useCallback(async (config: LineVerifyConfig) => {
    const { accessToken, channelId, channelSecret, liffId, loginChannelId, loginChannelSecret } =
      config;

    if (!accessToken.trim()) {
      setState({ status: "error", message: "Access Token を入力してください", failedCheck: "accessToken" });
      return;
    }

    setState({ status: "loading" });

    try {
      const res = await fetch("/api/line/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: accessToken.trim(),
          channelId: channelId.trim(),
          channelSecret: channelSecret.trim(),
          liffId: liffId.trim(),
          loginChannelId: loginChannelId.trim(),
          loginChannelSecret: loginChannelSecret.trim(),
        }),
      });

      const data = await res.json();

      if (data.ok) {
        setState({ status: "success", botName: data.botName });
      } else {
        setState({ status: "error", message: data.error ?? "接続に失敗しました", failedCheck: data.failedCheck });
      }
    } catch {
      setState({ status: "error", message: "ネットワークエラーが発生しました" });
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, verify, reset };
}
