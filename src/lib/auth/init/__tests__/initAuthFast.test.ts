import { describe, expect, it, vi, beforeEach } from "vitest";
import type { User } from "firebase/auth";
import type { GqlUser } from "@/types/graphql";

// --- モジュールモック（vi.mock は巻き上げられるため最上位に置く） ---

vi.mock("@/lib/auth/init/firebase", () => ({
  initializeFirebase: vi.fn(),
}));

vi.mock("@/lib/auth/init/helper", () => ({
  finalizeAuthState: vi.fn(),
  handleUnauthenticatedBranch: vi.fn(),
  prepareInitialState: vi.fn(),
  restoreUserSession: vi.fn(),
  evaluateUserRegistrationState: vi.fn(),
  establishSessionFromFirebaseUser: vi.fn(),
}));

vi.mock("@/lib/auth/core/token-manager", () => ({
  TokenManager: {
    clearDeprecatedCookies: vi.fn(),
    savePhoneAuthFlag: vi.fn(),
    phoneVerified: vi.fn(() => false),
  },
}));

vi.mock("@/lib/auth/core/environment-detector", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/auth/core/environment-detector")>();
  return {
    ...actual,
    detectEnvironment: vi.fn(() => actual.AuthEnvironment.LIFF),
  };
});

vi.mock("@/lib/logging", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// auth-store は各テストで mockReturnValue を使って細かく制御する
vi.mock("@/lib/auth/core/auth-store", () => ({
  useAuthStore: { getState: vi.fn() },
}));

// --- モック済みモジュールのインポート ---

import { initAuth } from "@/lib/auth/init/index";
import { initializeFirebase } from "@/lib/auth/init/firebase";
import { finalizeAuthState } from "@/lib/auth/init/helper";
import { useAuthStore } from "@/lib/auth/core/auth-store";

// --- テスト用フィクスチャ ---

const mockSsrCurrentUser = { id: "user-1", name: "Test User" } as unknown as GqlUser;

const mockFirebaseUser = {
  uid: "firebase-uid-1",
  getIdToken: vi.fn().mockResolvedValue("firebase-id-token"),
  getIdTokenResult: vi.fn().mockResolvedValue({
    token: "firebase-id-token",
    expirationTime: new Date(Date.now() + 3600000).toISOString(),
  }),
} as unknown as User;

const mockAuthStateManager = {
  handleUserRegistrationStateChange: vi.fn().mockResolvedValue(undefined),
  updateState: vi.fn(),
  addStateChangeListener: vi.fn(),
  removeStateChangeListener: vi.fn(),
  getState: vi.fn(() => "loading"),
} as any;

const mockLiffService = {
  getState: vi.fn(() => ({ isInitialized: true, isLoggedIn: true, error: null })),
  initialize: vi.fn().mockResolvedValue(true),
} as any;

/** initAuthFast パスを通す最小パラメータセット */
const defaultParams = {
  communityConfig: { firebaseTenantId: "tenant-1" } as any,
  liffService: mockLiffService,
  authStateManager: mockAuthStateManager,
  ssrCurrentUser: mockSsrCurrentUser,
  ssrLineAuthenticated: true,
  ssrPhoneAuthenticated: true,
};

/** useAuthStore.getState のモック戻り値を一括設定するヘルパー */
function setupStoreMock(lineTokens: { idToken: string | null; refreshToken: string | null; expiresAt: string | null }) {
  vi.mocked(useAuthStore.getState).mockReturnValue({
    state: { isAuthInProgress: false, lineTokens },
    setState: vi.fn(),
  } as any);
}

describe("initAuthFast", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // デフォルト: トークンなし状態
    setupStoreMock({ idToken: null, refreshToken: null, expiresAt: null });
  });

  // =========================================================================
  // 問題3の核心：タイミング順序の検証
  // =========================================================================
  describe("タイミング順序（問題3）", () => {
    it("initializeFirebase が pending の間は finalizeAuthState が呼ばれない", async () => {
      let resolve!: (user: User | null) => void;
      const pending = new Promise<User | null>((r) => {
        resolve = r;
      });
      vi.mocked(initializeFirebase).mockReturnValue(pending);

      // initAuth を開始するが await しない
      const promise = initAuth(defaultParams);

      // Promise がまだ pending の時点では finalizeAuthState は未呼び出しのはず
      expect(vi.mocked(finalizeAuthState)).not.toHaveBeenCalled();

      // Firebase を解決して完了させる
      resolve(mockFirebaseUser);
      await promise;

      // 完了後は finalizeAuthState が呼ばれているはず
      expect(vi.mocked(finalizeAuthState)).toHaveBeenCalledWith(
        "user_registered",
        mockSsrCurrentUser,
        expect.any(Function),
        mockAuthStateManager,
      );
    });

    it("finalizeAuthState は initializeFirebase の解決後に1回だけ呼ばれる", async () => {
      vi.mocked(initializeFirebase).mockResolvedValue(mockFirebaseUser);

      await initAuth(defaultParams);

      expect(vi.mocked(finalizeAuthState)).toHaveBeenCalledTimes(1);
    });
  });

  // =========================================================================
  // 正常系
  // =========================================================================
  describe("正常系", () => {
    it("firebaseUser あり → setState({ firebaseUser }) を呼び finalizeAuthState('user_registered') を呼ぶ", async () => {
      const mockSetState = vi.fn();
      vi.mocked(useAuthStore.getState).mockReturnValue({
        state: { isAuthInProgress: false, lineTokens: { idToken: null, refreshToken: null, expiresAt: null } },
        setState: mockSetState,
      } as any);
      vi.mocked(initializeFirebase).mockResolvedValue(mockFirebaseUser);

      await initAuth(defaultParams);

      expect(mockSetState).toHaveBeenCalledWith({ firebaseUser: mockFirebaseUser });
      expect(vi.mocked(finalizeAuthState)).toHaveBeenCalledWith(
        "user_registered",
        mockSsrCurrentUser,
        mockSetState,
        mockAuthStateManager,
      );
    });

    it("exchange path: firebaseUser なし + lineTokens.idToken あり → finalizeAuthState('user_registered') を呼ぶ", async () => {
      vi.mocked(initializeFirebase).mockResolvedValue(null);
      setupStoreMock({ idToken: "exchange-token", refreshToken: "refresh", expiresAt: "9999999999999" });

      await initAuth(defaultParams);

      expect(vi.mocked(finalizeAuthState)).toHaveBeenCalledWith(
        "user_registered",
        mockSsrCurrentUser,
        expect.any(Function),
        mockAuthStateManager,
      );
    });

    it("ssrPhoneAuthenticated が false → finalizeAuthState('line_authenticated') を呼ぶ", async () => {
      vi.mocked(initializeFirebase).mockResolvedValue(mockFirebaseUser);

      await initAuth({ ...defaultParams, ssrPhoneAuthenticated: false });

      expect(vi.mocked(finalizeAuthState)).toHaveBeenCalledWith(
        "line_authenticated",
        mockSsrCurrentUser,
        expect.any(Function),
        mockAuthStateManager,
      );
    });

    it("initializeFirebase 完了後に handleUserRegistrationStateChange を呼ぶ", async () => {
      vi.mocked(initializeFirebase).mockResolvedValue(mockFirebaseUser);

      await initAuth(defaultParams);

      expect(mockAuthStateManager.handleUserRegistrationStateChange).toHaveBeenCalledWith(true, {
        ssrMode: true,
      });
    });
  });

  // =========================================================================
  // エラー・フォールバック系
  // =========================================================================
  describe("エラー・フォールバック", () => {
    it("firebaseUser なし + lineTokens.idToken なし → finalizeAuthState('unauthenticated') を呼ぶ", async () => {
      vi.mocked(initializeFirebase).mockResolvedValue(null);
      setupStoreMock({ idToken: null, refreshToken: null, expiresAt: null });

      await initAuth(defaultParams);

      expect(vi.mocked(finalizeAuthState)).toHaveBeenCalledWith(
        "unauthenticated",
        undefined,
        expect.any(Function),
        mockAuthStateManager,
      );
    });

    it("firebaseUser なし + lineTokens.idToken なし → handleUserRegistrationStateChange を呼ばない", async () => {
      vi.mocked(initializeFirebase).mockResolvedValue(null);
      setupStoreMock({ idToken: null, refreshToken: null, expiresAt: null });

      await initAuth(defaultParams);

      expect(mockAuthStateManager.handleUserRegistrationStateChange).not.toHaveBeenCalled();
    });

    it("initializeFirebase が例外をスロー → finalizeAuthState('unauthenticated') を呼ぶ", async () => {
      vi.mocked(initializeFirebase).mockRejectedValue(new Error("Firebase init failed"));

      await initAuth(defaultParams);

      expect(vi.mocked(finalizeAuthState)).toHaveBeenCalledWith(
        "unauthenticated",
        undefined,
        expect.any(Function),
        mockAuthStateManager,
      );
    });

    it("initializeFirebase が例外をスローしても initAuth はリジェクトしない", async () => {
      vi.mocked(initializeFirebase).mockRejectedValue(new Error("Firebase init failed"));

      await expect(initAuth(defaultParams)).resolves.not.toThrow();
    });
  });
});
