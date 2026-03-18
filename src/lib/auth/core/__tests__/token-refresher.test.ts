import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/auth/core/auth-store", () => ({
  useAuthStore: { getState: vi.fn() },
}));

vi.mock("@/lib/community/get-community-id-client", () => ({
  getCommunityIdClient: vi.fn(() => "community-1"),
}));

vi.mock("@/lib/logging", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { getValidLineIdToken } from "@/lib/auth/core/token-refresher";
import { useAuthStore } from "@/lib/auth/core/auth-store";

// ────────────────────────────────────────────────────────────────────────────
// 共通ヘルパー
// ────────────────────────────────────────────────────────────────────────────

const FIVE_MIN_MS = 5 * 60 * 1000;

function makeTokens(overrides: Partial<{
  idToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
}>) {
  return {
    idToken: "current-id-token",
    refreshToken: "current-refresh-token",
    expiresAt: String(Date.now() + 60 * 60 * 1000), // 1時間後（デフォルト）
    ...overrides,
  };
}

function setupStore(lineTokens: ReturnType<typeof makeTokens>) {
  const mockSetState = vi.fn();
  vi.mocked(useAuthStore.getState).mockReturnValue({
    state: { lineTokens },
    setState: mockSetState,
  } as any);
  return { mockSetState };
}

function mockFetchSuccess(idToken = "new-id-token", refreshToken = "new-refresh-token") {
  const mockFetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        idToken,
        refreshToken,
        expiresAt: String(Date.now() + 60 * 60 * 1000),
      }),
  });
  vi.stubGlobal("fetch", mockFetch);
  return mockFetch;
}

function mockFetchFailure(status = 500) {
  const mockFetch = vi.fn().mockResolvedValue({ ok: false, status });
  vi.stubGlobal("fetch", mockFetch);
  return mockFetch;
}

// ────────────────────────────────────────────────────────────────────────────
// テスト
// ────────────────────────────────────────────────────────────────────────────

describe("getValidLineIdToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // =========================================================================
  // idToken なし
  // =========================================================================
  it("idToken が null → null を返す", async () => {
    setupStore(makeTokens({ idToken: null }));

    const result = await getValidLineIdToken();

    expect(result).toBeNull();
  });

  // =========================================================================
  // 有効期限内（リフレッシュ不要）
  // =========================================================================
  it("expiresAt が5分超 → fetch を呼ばず既存 idToken をそのまま返す", async () => {
    const expiresAt = String(Date.now() + FIVE_MIN_MS + 10_000); // 5分 + 10秒
    setupStore(makeTokens({ expiresAt }));
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    const result = await getValidLineIdToken();

    expect(result).toBe("current-id-token");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("expiresAt が null（期限情報なし） → fetch を呼ばず既存 idToken を返す", async () => {
    setupStore(makeTokens({ expiresAt: null }));
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    const result = await getValidLineIdToken();

    expect(result).toBe("current-id-token");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  // =========================================================================
  // 期限切れ（リフレッシュ必要）
  // =========================================================================
  it("expiresAt が5分以内 + refreshToken あり → /api/auth/refresh を呼ぶ", async () => {
    const expiresAt = String(Date.now() + FIVE_MIN_MS - 10_000); // 5分 - 10秒
    setupStore(makeTokens({ expiresAt }));
    const mockFetch = mockFetchSuccess();

    await getValidLineIdToken();

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/refresh",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ refreshToken: "current-refresh-token" }),
      }),
    );
  });

  it("リフレッシュ成功 → 新しい idToken を返す", async () => {
    const expiresAt = String(Date.now() + FIVE_MIN_MS - 10_000);
    setupStore(makeTokens({ expiresAt }));
    mockFetchSuccess("fresh-id-token", "fresh-refresh-token");

    const result = await getValidLineIdToken();

    expect(result).toBe("fresh-id-token");
  });

  it("リフレッシュ成功 → store の lineTokens を新しい値で更新する", async () => {
    const expiresAt = String(Date.now() + FIVE_MIN_MS - 10_000);
    const { mockSetState } = setupStore(makeTokens({ expiresAt }));
    mockFetchSuccess("fresh-id-token", "fresh-refresh-token");

    await getValidLineIdToken();

    expect(mockSetState).toHaveBeenCalledWith(
      expect.objectContaining({
        lineTokens: expect.objectContaining({
          idToken: "fresh-id-token",
          refreshToken: "fresh-refresh-token",
        }),
      }),
    );
  });

  it("refreshToken なし・期限切れ → fetch を呼ばず既存 idToken をフォールバックで返す", async () => {
    const expiresAt = String(Date.now() + FIVE_MIN_MS - 10_000);
    setupStore(makeTokens({ expiresAt, refreshToken: null }));
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    const result = await getValidLineIdToken();

    expect(result).toBe("current-id-token");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("リフレッシュ成功 → API が refreshToken を返さない場合は既存 refreshToken を維持する", async () => {
    const expiresAt = String(Date.now() + FIVE_MIN_MS - 10_000);
    const { mockSetState } = setupStore(makeTokens({ expiresAt }));
    // API が refreshToken を返さないレスポンス
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            idToken: "new-id-token",
            // refreshToken: 意図的に省略
            expiresAt: String(Date.now() + 3_600_000),
          }),
      }),
    );

    await getValidLineIdToken();

    expect(mockSetState).toHaveBeenCalledWith(
      expect.objectContaining({
        lineTokens: expect.objectContaining({
          // 新しいトークンが来なかった場合は元の refreshToken を維持
          refreshToken: "current-refresh-token",
        }),
      }),
    );
  });

  // =========================================================================
  // リフレッシュ失敗（→ 既存トークンにフォールバック）
  // =========================================================================
  it("/api/auth/refresh が non-OK → null ではなく既存 idToken を返す", async () => {
    const expiresAt = String(Date.now() + FIVE_MIN_MS - 10_000);
    setupStore(makeTokens({ expiresAt }));
    mockFetchFailure(401);

    const result = await getValidLineIdToken();

    // Authorization ヘッダを欠落させない：既存トークンを返してサーバーに判断させる
    expect(result).toBe("current-id-token");
  });

  it("/api/auth/refresh がネットワークエラー → null ではなく既存 idToken を返す", async () => {
    const expiresAt = String(Date.now() + FIVE_MIN_MS - 10_000);
    setupStore(makeTokens({ expiresAt }));
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    const result = await getValidLineIdToken();

    expect(result).toBe("current-id-token");
  });

  // =========================================================================
  // 同時呼び出しの直列化（問題1・2 の並行リフレッシュ防止）
  // =========================================================================
  it("同時呼び出し時に /api/auth/refresh は1回だけ実行される", async () => {
    const expiresAt = String(Date.now() + FIVE_MIN_MS - 10_000);
    setupStore(makeTokens({ expiresAt }));

    // fetch の解決を遅延させることで並行呼び出しを確実に重ねる
    let resolveRefresh!: (value: Response) => void;
    const pendingRefresh = new Promise<Response>((r) => {
      resolveRefresh = r;
    });
    const mockFetch = vi.fn().mockReturnValue(pendingRefresh);
    vi.stubGlobal("fetch", mockFetch);

    // 2回同時に呼び出す
    const p1 = getValidLineIdToken();
    const p2 = getValidLineIdToken();

    // fetch をまだ1回だけ呼んでいるはず
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // リフレッシュを解決する
    resolveRefresh({
      ok: true,
      json: () =>
        Promise.resolve({
          idToken: "concurrent-new-token",
          refreshToken: "concurrent-new-refresh",
          expiresAt: String(Date.now() + 3_600_000),
        }),
    } as Response);

    const [result1, result2] = await Promise.all([p1, p2]);

    // 両方が新しいトークンを受け取る
    expect(result1).toBe("concurrent-new-token");
    expect(result2).toBe("concurrent-new-token");

    // fetch は合計1回だけ
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
