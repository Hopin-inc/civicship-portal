"use client";

import { useState, useCallback } from "react";

type VerifyState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; botName: string }
  | { status: "error"; message: string };

export function useLineVerify() {
  const [state, setState] = useState<VerifyState>({ status: "idle" });

  const verify = useCallback(async (accessToken: string) => {
    if (!accessToken.trim()) {
      setState({ status: "error", message: "Access Token を入力してください" });
      return;
    }

    setState({ status: "loading" });

    try {
      const res = await fetch("/api/line/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });

      const data = await res.json();

      if (data.ok) {
        setState({ status: "success", botName: data.botName });
      } else {
        setState({ status: "error", message: data.error ?? "接続に失敗しました" });
      }
    } catch {
      setState({ status: "error", message: "ネットワークエラーが発生しました" });
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, verify, reset };
}
