import { LiffError } from "@liff/util";
import {
  CREATE_SUBWINDOW_FAILED,
  EXCEPTION_IN_SUBWINDOW,
  FORBIDDEN,
  INIT_FAILED,
  INVALID_ARGUMENT,
  INVALID_CONFIG,
  INVALID_ID_TOKEN,
  UNAUTHORIZED,
} from "@liff/consts";

export const getLiffLoginErrorMessage = (
  error: unknown,
): {
  title: string;
  description: string;
} => {
  let title = "ログインに失敗しました";
  let description = "もう一度お試しください。";

  if (error instanceof LiffError) {
    switch (error.code) {
      case INIT_FAILED:
        title = "アプリを起動できませんでした";
        description = "ページを更新して、もう一度お試しください。";
        break;
      case INVALID_ARGUMENT:
        title = "内部で問題が発生しました";
        description = "もう一度だけ操作を試してみてください。";
        break;
      case UNAUTHORIZED:
        title = "ログイン状態が確認できません";
        description = "お手数ですが、再度ログインをお願いします。";
        break;
      case FORBIDDEN:
        title = "この画面はご利用いただけません";
        description = "LINEアプリ内から開いてご利用ください。";
        break;
      case INVALID_CONFIG:
        title = "設定の確認が必要です";
        description = "恐れ入りますが、サポートまでご連絡ください。";
        break;
      case INVALID_ID_TOKEN:
        title = "ログインの期限が切れています";
        description = "再度ログインしてからお進みください。";
        break;
      case EXCEPTION_IN_SUBWINDOW:
        title = "しばらく操作がなかったようです";
        description = "もう一度初めからやり直してください。";
        break;
      case CREATE_SUBWINDOW_FAILED:
        title = "ウィンドウを開けませんでした";
        description = "ブラウザのポップアップ設定をご確認ください。";
        break;
      default:
        title = "予期しないエラーが発生しました";
        description = "時間をおいてもう一度お試しください。";
        break;
    }
  } else if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("network") || msg.includes("failed to fetch")) {
      title = "通信エラーが発生しました";
      description = "インターネット接続をご確認ください。";
    } else if (msg.includes("timeout")) {
      title = "通信がタイムアウトしました";
      description = "少し時間をおいて、もう一度お試しください。";
    } else if (msg.includes("access denied") || msg.includes("cancelled")) {
      title = "ログインがキャンセルされました";
      description = "お手数ですが、もう一度お試しください。";
    } else if (msg.includes("expired")) {
      title = "セッションの有効期限が切れています";
      description = "再度ログインをお願いいたします。";
    }
  }

  return { title, description };
};
