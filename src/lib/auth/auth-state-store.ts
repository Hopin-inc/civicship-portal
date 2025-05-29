"use client";

/**
 * 認証状態の型定義
 */
export type AuthenticationState =
  | "unauthenticated"      // S0: 未認証
  | "line_authenticated"   // S1: LINE認証済み  
  | "line_token_expired"   // S1e: LINEトークン期限切れ
  | "phone_authenticated"  // S2: 電話番号認証済み
  | "phone_token_expired"  // S2e: 電話番号トークン期限切れ
  | "user_registered"      // S3: ユーザ情報登録済み
  | "loading";             // L0: 状態チェック中

/**
 * 状態変更リスナーの型
 */
type StateChangeListener = (state: AuthenticationState) => void;

/**
 * 認証状態ストア - 単一の状態管理源
 */
export class AuthStateStore {
  private static instance: AuthStateStore;
  private currentState: AuthenticationState = "loading";
  private stateChangeListeners: StateChangeListener[] = [];

  private constructor() {}

  /**
   * シングルトンインスタンスを取得
   */
  public static getInstance(): AuthStateStore {
    if (!AuthStateStore.instance) {
      AuthStateStore.instance = new AuthStateStore();
    }
    return AuthStateStore.instance;
  }

  /**
   * 現在の認証状態を取得
   */
  public getState(): AuthenticationState {
    return this.currentState;
  }

  /**
   * 認証状態を設定
   */
  public setState(state: AuthenticationState): void {
    if (this.currentState !== state) {
      console.log(`🔄 Auth state transition: ${this.currentState} → ${state}`);
      this.currentState = state;
      this.notifyStateChange();
    }
  }

  /**
   * 状態変更リスナーを追加
   */
  public addStateChangeListener(listener: StateChangeListener): void {
    this.stateChangeListeners.push(listener);
  }

  /**
   * 状態変更リスナーを削除
   */
  public removeStateChangeListener(listener: StateChangeListener): void {
    this.stateChangeListeners = this.stateChangeListeners.filter(l => l !== listener);
  }

  /**
   * 状態変更を通知
   */
  private notifyStateChange(): void {
    this.stateChangeListeners.forEach(listener => {
      try {
        listener(this.currentState);
      } catch (error) {
        console.error("Error in state change listener:", error);
      }
    });
  }
}
