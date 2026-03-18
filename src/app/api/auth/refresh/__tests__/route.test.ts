import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import type { NextRequest } from "next/server";

vi.mock("@/lib/logging", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { POST } from "@/app/api/auth/refresh/route";

// ────────────────────────────────────────────────────────────────────────────
// 共通ヘルパー
// ────────────────────────────────────────────────────────────────────────────

/**
 * NextRequest の mock を生成する。
 *
 * `origin` は Fetch API の forbidden header のため new NextRequest() では設定できない。
 * mock オブジェクトを使うことでテスト側から自由にヘッダーを制御する。
 *
 * - デフォルトで origin: "http://localhost"（request.url と同一ホスト）を設定し
 *   CSRF チェックを通過させる。
 * - 特定のヘッダーを除外したい場合は headerOverrides でそのキーを undefined にする。
 */
function makeRequest(
  body: Record<string, unknown>,
  headerOverrides: Record<string, string | undefined> = {},
): NextRequest {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "origin": "http://localhost",
  };

  for (const [key, value] of Object.entries(headerOverrides)) {
    if (value === undefined) {
      delete headers[key.toLowerCase()];
    } else {
      headers[key.toLowerCase()] = value;
    }
  }

  return {
    url: "http://localhost/api/auth/refresh",
    headers: { get: (name: string) => headers[name.toLowerCase()] ?? null },
    json: () => Promise.resolve(body),
    cookies: { get: () => undefined },
  } as unknown as NextRequest;
}

/**
 * global.fetch を2回分セットアップするヘルパー:
 *   1回目 → securetoken.googleapis.com への呼び出し（Firebase トークン取得）
 *   2回目 → /sessionLogin への呼び出し（セッション Cookie 更新）
 */
function mockFetchSequence(
  tokenResponse: { ok: boolean; status?: number; data?: object },
  sessionResponse: { ok: boolean; status?: number; setCookies?: string[] },
) {
  const tokenFetch = tokenResponse.ok
    ? {
        ok: true,
        json: () =>
          Promise.resolve(
            tokenResponse.data ?? {
              id_token: "new-id-token",
              refresh_token: "new-refresh-token",
              expires_in: "3600",
            },
          ),
      }
    : { ok: false, status: tokenResponse.status ?? 400, text: () => Promise.resolve("error") };

  const sessionFetch = sessionResponse.ok
    ? {
        ok: true,
        headers: {
          getSetCookie: () => sessionResponse.setCookies ?? ["session=abc; HttpOnly; Path=/"],
        },
      }
    : { ok: false, status: sessionResponse.status ?? 502 };

  vi.stubGlobal(
    "fetch",
    vi.fn()
      .mockResolvedValueOnce(tokenFetch as any)
      .mockResolvedValueOnce(sessionFetch as any),
  );
}

// ────────────────────────────────────────────────────────────────────────────
// テスト
// ────────────────────────────────────────────────────────────────────────────

describe("POST /api/auth/refresh", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "test-firebase-key";
    process.env.NEXT_PUBLIC_API_ENDPOINT = "http://test-api/graphql";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_API_ENDPOINT;
  });

  // =========================================================================
  // CSRF 保護
  // =========================================================================
  it("Origin ヘッダなし → 403 を返す", async () => {
    const req = makeRequest({ refreshToken: "r-token" }, { "origin": undefined });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("Origin と Host が不一致 → 403 を返す", async () => {
    const req = makeRequest(
      { refreshToken: "r-token" },
      { "origin": "http://evil.example.com" }, // URL の host は "localhost" と不一致
    );
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("Origin と Host が一致 → CSRF チェックを通過する", async () => {
    mockFetchSequence({ ok: true }, { ok: true });
    const req = makeRequest({ refreshToken: "r-token" }); // origin: "http://localhost"
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  // =========================================================================
  // バリデーション
  // =========================================================================
  it("refreshToken なし → 400 を返す", async () => {
    const req = makeRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("NEXT_PUBLIC_FIREBASE_API_KEY 未設定 → 500 を返す", async () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const req = makeRequest({ refreshToken: "r-token" });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it("NEXT_PUBLIC_API_ENDPOINT 未設定 → 500 を返す", async () => {
    delete process.env.NEXT_PUBLIC_API_ENDPOINT;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id_token: "new-id-token",
            refresh_token: "new-refresh-token",
            expires_in: "3600",
          }),
      } as any),
    );
    const req = makeRequest({ refreshToken: "r-token" });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  // =========================================================================
  // Firebase API エラー
  // =========================================================================
  it("securetoken API が失敗 → そのステータスをそのまま返す", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: () => Promise.resolve("TOKEN_EXPIRED"),
      } as any),
    );
    const req = makeRequest({ refreshToken: "expired-refresh" });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("securetoken API のレスポンスに id_token がない → 500 を返す", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      } as any),
    );
    const req = makeRequest({ refreshToken: "r-token" });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  // =========================================================================
  // sessionLogin エラー
  // =========================================================================
  it("sessionLogin が失敗 → 502 を返す", async () => {
    mockFetchSequence({ ok: true }, { ok: false, status: 503 });
    const req = makeRequest({ refreshToken: "r-token" });
    const res = await POST(req);
    expect(res.status).toBe(502);
  });

  // =========================================================================
  // 正常系
  // =========================================================================
  it("正常系 → { idToken, refreshToken, expiresAt } を返す", async () => {
    mockFetchSequence(
      {
        ok: true,
        data: { id_token: "returned-id-token", refresh_token: "returned-refresh", expires_in: "3600" },
      },
      { ok: true },
    );

    const req = makeRequest({ refreshToken: "valid-refresh-token" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toMatchObject({
      idToken: "returned-id-token",
      refreshToken: "returned-refresh",
      expiresAt: expect.any(String),
    });
  });

  it("正常系 → Set-Cookie ヘッダが sessionLogin から転送される", async () => {
    mockFetchSequence(
      { ok: true },
      { ok: true, setCookies: ["session=xyz; HttpOnly; Path=/; SameSite=Strict"] },
    );

    const req = makeRequest({ refreshToken: "valid-refresh-token" });
    const res = await POST(req);

    expect(res.headers.get("set-cookie")).toContain("session=xyz");
  });

  it("正常系 → securetoken に refreshToken を正しく送信する", async () => {
    mockFetchSequence({ ok: true }, { ok: true });
    const mockFetch = vi.mocked(fetch);

    const req = makeRequest({ refreshToken: "my-refresh-token" });
    await POST(req);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url as string).toContain("securetoken.googleapis.com");
    expect(options?.body).toContain("my-refresh-token");
    expect(options?.body).toContain("refresh_token");
  });

  it("正常系 → expiresAt は現在時刻より未来になっている", async () => {
    const before = Date.now();
    mockFetchSequence({ ok: true }, { ok: true });

    const req = makeRequest({ refreshToken: "r-token" });
    const res = await POST(req);
    const body = await res.json();

    expect(Number(body.expiresAt)).toBeGreaterThan(before);
  });

  // =========================================================================
  // 予期しないエラー
  // =========================================================================
  it("fetch が例外をスロー → 500 を返す", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    const req = makeRequest({ refreshToken: "r-token" });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });
});
