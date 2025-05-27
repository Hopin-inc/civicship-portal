"use client";

import { tokenService, TokenSet, PhoneTokenSet } from './TokenService';
import { 
  auth, 
  phoneAuth, 
  phoneVerificationState,
  clearRecaptcha as clearRecaptchaFn
} from '../lib/firebase';
import { 
  User as FirebaseUser,
  signInWithCustomToken,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential
} from '@firebase/auth';
import { isRunningInLiff } from '@/utils/liff';

/**
 * 認証状態を表す列挙型
 */
export enum AuthState {
  UNAUTHENTICATED = 'unauthenticated',
  AUTHENTICATING = 'authenticating',
  VERIFYING = 'verifying',
  LOADING_USER = 'loading_user',
  AUTHENTICATED = 'authenticated',
  ERROR = 'error',
}

/**
 * 認証プロバイダーの種類
 */
export enum AuthProvider {
  LIFF = 'liff',
  PHONE = 'phone',
}

/**
 * 認証エラーの種類
 */
export enum AuthErrorType {
  AUTHENTICATION_FAILED = 'authentication_failed',
  TOKEN_EXPIRED = 'token_expired',
  NETWORK_ERROR = 'network_error',
  USER_NOT_FOUND = 'user_not_found',
  PERMISSION_DENIED = 'permission_denied',
  UNKNOWN = 'unknown',
}

/**
 * 認証エラーのインターフェース
 */
export interface AuthError {
  type: AuthErrorType;
  message: string;
  originalError?: unknown;
}

/**
 * ユーザー情報のインターフェース
 */
export interface AuthUser {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
  graphqlUser?: any;
}

/**
 * 認証状態のインターフェース
 */
export interface AuthStateInfo {
  state: AuthState;
  user: AuthUser | null;
  error: AuthError | null;
  provider: AuthProvider | null;
  isPhoneVerified: boolean;
}

/**
 * 認証サービスのインターフェース
 */
export interface IAuthService {
  getAuthState(): AuthStateInfo;
  
  subscribeToAuthChanges(callback: (state: AuthStateInfo) => void): () => void;
  
  authenticate(provider: AuthProvider, params?: any): Promise<void>;
  
  logout(): Promise<void>;
  
  startPhoneVerification(phoneNumber: string): Promise<boolean>;
  verifyPhoneCode(code: string): Promise<boolean>;
  
  createUser(userData: any): Promise<void>;
  
  refreshTokens(): Promise<boolean>;
}

/**
 * 認証サービスの実装
 */
export class AuthService implements IAuthService {
  private currentState: AuthStateInfo = {
    state: AuthState.UNAUTHENTICATED,
    user: null,
    error: null,
    provider: null,
    isPhoneVerified: false,
  };
  
  private listeners: ((state: AuthStateInfo) => void)[] = [];
  private firebaseUnsubscribe: (() => void) | null = null;
  
  private verificationId: string | null = null;
  private phoneNumber: string | null = null;
  private phoneUid: string | null = null;
  private recaptchaVerifier: any = null;
  
  constructor() {
    this.initAuthStateListener();
    this.initTokenExpirationListener();
  }
  
  /**
   * 現在の認証状態を取得
   */
  getAuthState(): AuthStateInfo {
    return { ...this.currentState };
  }
  
  /**
   * 認証状態の変更を監視
   */
  subscribeToAuthChanges(callback: (state: AuthStateInfo) => void): () => void {
    this.listeners.push(callback);
    
    callback(this.getAuthState());
    
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  /**
   * 認証処理
   */
  async authenticate(provider: AuthProvider, params?: any): Promise<void> {
    try {
      this.updateState({
        state: AuthState.AUTHENTICATING,
        provider,
        error: null,
      });
      
      switch (provider) {
        case AuthProvider.LIFF:
          await this.authenticateWithLiff(params);
          break;
        case AuthProvider.PHONE:
          throw new Error('Phone authentication should use startPhoneVerification and verifyPhoneCode');
        default:
          throw new Error(`Unsupported authentication provider: ${provider}`);
      }
    } catch (error) {
      this.handleAuthError(error);
    }
  }
  
  /**
   * ログアウト
   */
  async logout(): Promise<void> {
    try {
      await auth.signOut();
      
      tokenService.clearTokens();
      tokenService.clearPhoneTokens();
      
      this.updateState({
        state: AuthState.UNAUTHENTICATED,
        user: null,
        error: null,
        provider: null,
        isPhoneVerified: false,
      });
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    } catch (error) {
      this.handleAuthError(error);
    }
  }
  
  /**
   * 電話番号認証を開始
   */
  async startPhoneVerification(phoneNumber: string): Promise<boolean> {
    try {
      this.updateState({
        state: AuthState.AUTHENTICATING,
        provider: AuthProvider.PHONE,
        error: null,
      });
      
      const success = await this.startPhoneNumberVerification(phoneNumber);
      return success;
    } catch (error) {
      this.handleAuthError(error);
      return false;
    }
  }
  
  /**
   * 電話認証コードを検証
   */
  async verifyPhoneCode(code: string): Promise<boolean> {
    try {
      this.updateState({
        state: AuthState.VERIFYING,
        error: null,
      });
      
      const success = await this.verifyPhoneVerificationCode(code);
      
      if (success) {
        this.updateState({
          isPhoneVerified: true,
        });
      }
      
      return success;
    } catch (error) {
      this.handleAuthError(error);
      return false;
    }
  }
  
  /**
   * ユーザー作成
   */
  async createUser(userData: any): Promise<void> {
    try {
      this.updateState({
        state: AuthState.LOADING_USER,
        error: null,
      });
      
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to create a user profile');
      }
      
      if (!this.currentState.isPhoneVerified) {
        throw new Error('Phone verification is required to create a user profile');
      }
      
      
      this.updateState({
        state: AuthState.AUTHENTICATED,
      });
    } catch (error) {
      this.handleAuthError(error);
    }
  }
  
  /**
   * トークンリフレッシュ
   */
  async refreshTokens(): Promise<boolean> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return false;
      }
      
      const idToken = await currentUser.getIdToken(true);
      
      const expiresAt = Date.now() + 60 * 60 * 1000;
      
      tokenService.setTokens({
        accessToken: idToken,
        expiresAt,
      });
      
      return true;
    } catch (error) {
      this.handleAuthError(error);
      return false;
    }
  }
  
  /**
   * Firebase認証状態リスナーを初期化
   */
  private initAuthStateListener(): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    this.firebaseUnsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        await this.handleUserAuthenticated(firebaseUser);
      } else {
        this.updateState({
          state: AuthState.UNAUTHENTICATED,
          user: null,
        });
      }
    });
  }
  
  /**
   * トークン期限切れリスナーを初期化
   */
  private initTokenExpirationListener(): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    window.addEventListener('auth:token-expired', async (event) => {
      const customEvent = event as CustomEvent;
      console.log('Token expired event received:', customEvent.detail);
      
      const success = await this.refreshTokens();
      
      if (!success) {
        this.updateState({
          state: AuthState.ERROR,
          error: {
            type: AuthErrorType.TOKEN_EXPIRED,
            message: 'Authentication token expired and refresh failed',
          },
        });
        
        await this.logout();
      }
    });
  }
  
  /**
   * LIFFでの認証処理
   */
  private async authenticateWithLiff(params?: any): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('LIFF authentication is only available in browser environment');
    }
    
    try {
      const liffAccessToken = params?.accessToken;
      
      if (!liffAccessToken) {
        throw new Error('LIFF access token is required for authentication');
      }
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}/line/liff-login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: liffAccessToken }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`LIFF authentication failed: ${response.status}`);
      }
      
      const { customToken, profile } = await response.json();
      
      const { user } = await signInWithCustomToken(auth, customToken);
      
      if (user) {
        await updateProfile(user, {
          displayName: profile.displayName,
          photoURL: profile.pictureUrl,
        });
      }
      
      this.updateState({
        state: AuthState.VERIFYING,
      });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * 電話番号認証を開始（Firebase側の処理）
   */
  private async startPhoneNumberVerification(phoneNumber: string): Promise<boolean> {
    if (typeof window === 'undefined') {
      throw new Error('Phone verification is only available in browser environment');
    }
    
    try {
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        throw new Error('reCAPTCHA container element not found');
      }
      
      await this.clearRecaptcha();
      
      const isLiffEnvironment = isRunningInLiff();
      
      this.recaptchaVerifier = new RecaptchaVerifier(phoneAuth, 'recaptcha-container', {
        size: isLiffEnvironment ? 'normal' : 'invisible',
        callback: () => {},
        'expired-callback': () => {
          this.clearRecaptcha();
        },
      });
      
      await this.recaptchaVerifier.render();
      
      const confirmationResult = await signInWithPhoneNumber(
        phoneAuth,
        phoneNumber,
        this.recaptchaVerifier
      );
      
      this.verificationId = confirmationResult.verificationId;
      this.phoneNumber = phoneNumber;
      
      return true;
    } catch (error) {
      console.error('Phone verification failed:', error);
      throw error;
    }
  }
  
  /**
   * reCAPTCHAをクリア
   */
  private async clearRecaptcha(): Promise<void> {
    clearRecaptchaFn();
    this.recaptchaVerifier = null;
  }
  
  /**
   * 電話認証コードを検証（Firebase側の処理）
   */
  private async verifyPhoneVerificationCode(code: string): Promise<boolean> {
    try {
      if (!this.verificationId || !code) {
        console.error('Missing verificationId or code');
        return false;
      }
      
      const credential = PhoneAuthProvider.credential(this.verificationId, code);
      
      try {
        const userCredential = await signInWithCredential(phoneAuth, credential);
        
        if (userCredential.user) {
          this.phoneUid = userCredential.user.uid;
          
          const idToken = await userCredential.user.getIdToken();
          const refreshToken = userCredential.user.refreshToken;
          
          const tokenResult = await userCredential.user.getIdTokenResult();
          const expiresAt = new Date(tokenResult.expirationTime).getTime();
          
          tokenService.setPhoneTokens({
            accessToken: idToken,
            refreshToken,
            expiresAt,
          });
          
          await phoneAuth.signOut();
          
          return true;
        } else {
          console.error('No user returned from signInWithCredential');
          return false;
        }
      } catch (signInError) {
        console.warn('Could not sign in with phone credential:', signInError);
        
        try {
          if (this.phoneNumber) {
            const result = await signInWithPhoneNumber(
              phoneAuth,
              this.phoneNumber || "",
              this.recaptchaVerifier!
            );
            
            if (phoneAuth.currentUser) {
              this.phoneUid = phoneAuth.currentUser.uid;
              
              const idToken = await phoneAuth.currentUser.getIdToken();
              const refreshToken = phoneAuth.currentUser.refreshToken;
              
              const tokenResult = await phoneAuth.currentUser.getIdTokenResult();
              const expiresAt = new Date(tokenResult.expirationTime).getTime();
              
              tokenService.setPhoneTokens({
                accessToken: idToken,
                refreshToken,
                expiresAt,
              });
              
              await phoneAuth.signOut();
              return true;
            }
          }
          
          return false;
        } catch (fallbackError) {
          console.error('Fallback authentication also failed:', fallbackError);
          return false;
        }
      }
    } catch (error) {
      console.error('Code verification failed:', error);
      return false;
    }
  }
  
  /**
   * ユーザー認証成功時の処理
   */
  private async handleUserAuthenticated(firebaseUser: FirebaseUser): Promise<void> {
    try {
      this.updateState({
        state: AuthState.LOADING_USER,
      });
      
      const idToken = await firebaseUser.getIdToken();
      
      const refreshToken = firebaseUser.refreshToken;
      
      const expiresAt = Date.now() + 60 * 60 * 1000;
      
      tokenService.setTokens({
        accessToken: idToken,
        refreshToken,
        expiresAt,
      });
      
      const user: AuthUser = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        phoneNumber: firebaseUser.phoneNumber,
        photoURL: firebaseUser.photoURL,
      };
      
      
      this.updateState({
        state: AuthState.AUTHENTICATED,
        user,
      });
    } catch (error) {
      this.handleAuthError(error);
    }
  }
  
  /**
   * 認証エラーの処理
   */
  private handleAuthError(error: unknown): void {
    console.error('Authentication error:', error);
    
    let authError: AuthError = {
      type: AuthErrorType.UNKNOWN,
      message: 'An unknown error occurred during authentication',
      originalError: error,
    };
    
    if (error && typeof error === 'object' && 'code' in error) {
      const code = error.code as string;
      
      if (code === 'auth/network-request-failed') {
        authError = {
          type: AuthErrorType.NETWORK_ERROR,
          message: 'ネットワーク接続に問題が発生しました。インターネット接続を確認してください。',
          originalError: error,
        };
      } else if (code === 'auth/user-token-expired' || code === 'auth/id-token-expired') {
        authError = {
          type: AuthErrorType.TOKEN_EXPIRED,
          message: '認証の有効期限が切れました。再認証が必要です。',
          originalError: error,
        };
      } else if (code === 'auth/invalid-credential' || code === 'auth/user-disabled') {
        authError = {
          type: AuthErrorType.AUTHENTICATION_FAILED,
          message: '認証情報が無効です。再ログインしてください。',
          originalError: error,
        };
      } else if (code === 'auth/requires-recent-login') {
        authError = {
          type: AuthErrorType.TOKEN_EXPIRED,
          message: 'セキュリティのため再認証が必要です。',
          originalError: error,
        };
      } else if (code === 'auth/user-not-found') {
        authError = {
          type: AuthErrorType.USER_NOT_FOUND,
          message: 'ユーザーが見つかりません。アカウントを作成してください。',
          originalError: error,
        };
      } else if (code === 'auth/invalid-verification-code') {
        authError = {
          type: AuthErrorType.AUTHENTICATION_FAILED,
          message: '認証コードが無効です。正しいコードを入力してください。',
          originalError: error,
        };
      }
    } else if (error instanceof Error) {
      if (error.message.includes('network')) {
        authError.type = AuthErrorType.NETWORK_ERROR;
        authError.message = 'ネットワークエラーが発生しました。接続を確認して再試行してください。';
      } else if (error.message.includes('token') && error.message.includes('expired')) {
        authError.type = AuthErrorType.TOKEN_EXPIRED;
        authError.message = '認証セッションの有効期限が切れました。再ログインしてください。';
      } else if (error.message.includes('permission') || error.message.includes('not allowed')) {
        authError.type = AuthErrorType.PERMISSION_DENIED;
        authError.message = 'この操作を実行する権限がありません。';
      } else if (error.message.includes('user') && error.message.includes('not found')) {
        authError.type = AuthErrorType.USER_NOT_FOUND;
        authError.message = 'ユーザーアカウントが見つかりません。認証情報を確認するか、新しいアカウントを作成してください。';
      } else if (error.message.includes('LIFF authentication failed')) {
        authError.type = AuthErrorType.AUTHENTICATION_FAILED;
        authError.message = 'LINE認証サービスとの通信に失敗しました。';
      } else {
        authError.type = AuthErrorType.AUTHENTICATION_FAILED;
        authError.message = `認証に失敗しました: ${error.message}`;
      }
    }
    
    this.updateState({
      state: AuthState.ERROR,
      error: authError,
    });
  }
  
  /**
   * 状態を更新し、リスナーに通知
   */
  private updateState(partialState: Partial<AuthStateInfo>): void {
    this.currentState = {
      ...this.currentState,
      ...partialState,
    };
    
    this.listeners.forEach(listener => {
      listener(this.getAuthState());
    });
  }
}

export const authService = new AuthService();
