export const PHONE_VERIFICATION_CONSTANTS = {
  // 再送信ボタンが有効になるまでのカウントダウン秒数
  RESEND_COUNTDOWN_SECONDS: 60,
  // レート制限時の待機時間（ミリ秒）
  RATE_LIMIT_DURATION_MS: 60 * 1000,
  // LIFF環境でのreCAPTCHA再描画待機時間（ミリ秒）
  RECAPTCHA_WAIT_TIME_LIFF: 1000,
  // 通常ブラウザでのreCAPTCHA再描画待機時間（ミリ秒）
  RECAPTCHA_WAIT_TIME_BROWSER: 500,
  // 電話番号の桁数（国コード含む）: +81XXXXXXXXXX
  PHONE_NUMBER_LENGTH: 12,
  // 認証コードの桁数
  VERIFICATION_CODE_LENGTH: 6,
  // フロー再開時のリロード遅延（ミリ秒）
  RELOAD_DELAY_MS: 1000,
  // リロードボタン押下時の初期遅延（ミリ秒）
  RELOAD_INITIAL_DELAY_MS: 300,
  // タイマーのインターバル（ミリ秒）
  INTERVAL_MS: 1000,
} as const;
