import type { ChangelogEntry } from "./types";

// Japanese entries
const CHANGELOG_ENTRIES_JA: ChangelogEntry[] = [
  {
    date: "2025-11-07",
    title: "予約データの不整合を修正（ユーザー表示の改善）",
    description: "バッチ処理で発生していた予約と参加情報の不整合を修正しました。カレンダーや参加表示の誤りが減り、表示の信頼性が向上します。ユーザー側での操作は不要です。",
  },
  {
    date: "2025-11-07",
    title: "モバイルでの通知表示位置を改善",
    description: "モバイル端末での通知メッセージの表示位置を調整し、画面下部のボタンと重ならないようにしました。",
  },
  {
    date: "2025-11-07",
    title: "日本語メッセージの表示スタイルを改善",
    description: "敬語表現の統一、文字間隔の修正、フォントサイズの最適化を行い、メッセージの読みやすさを向上させました。",
  },
  {
    date: "2025-11-06",
    title: "予約キャンセル後の表示を正しく反映",
    description: "予約キャンセル時に発生していた表示・状態の不整合を修正しました。キャンセル後の表示や集計が正しくなります。ユーザー操作は不要です。",
  },
  {
    date: "2025-11-06",
    title: "NFTのブロックチェーン検証機能を追加",
    description: "NFTの真正性をブロックチェーンで検証できる機能を追加しました。NFT詳細画面から検証状況を確認できます。",
  },
  {
    date: "2025-11-05",
    title: "NFT 画像表示の信頼性改善（画像配信方式の変更）",
    description: "NFT 画像の取り扱いを改善し、Google Cloud Storage を利用する処理を導入しました。画像が表示されない事象が減り、コンテンツが安定して見られるようになります。",
  },
  {
    date: "2025-11-03",
    title: "DID/VC 同期の信頼性を向上（表示データの安定化）",
    description: "DID / VC 同期処理のログと自動復旧を強化し、同期失敗による表示欠損を減らしました。ユーザーに見えるデータの欠落が起きにくくなります。",
  },
  {
    date: "2025-11-03",
    title: "参加／予約の評価チェック誤判定を修正",
    description: "予約と参加の検証ロジックの誤判定を修正し、誤った状態表示や処理停止を防ぎます。ユーザーへの直接操作は必要ありません。",
  },
  {
    date: "2025-10-31",
    title: "予約申込締切のデフォルトを延長（運用変更）",
    description: "予約申込のデフォルト締切を開催日の 1 日前から 2 日前へ変更しました。予約可能期間が長くなります（影響範囲は予約機能）。",
  },
  {
    date: "2025-10-31",
    title: "予約―参加の整合性チェック誤検出を修正",
    description: "データ整合性チェックの誤検出を修正しました。誤ってエラーになるケースを減らし、表示や手続きが正しく進むようになりました。",
  },
  {
    date: "2025-10-30",
    title: "DID/VC 同期バッチの復旧力を強化",
    description: "同期バッチのエラー処理とリトライを改善し、同期失敗から自動的に回復しやすくしました。表示データの安定性が向上します。",
  },
  {
    date: "2025-10-30",
    title: "同期処理の 404 対応を改善",
    description: "同期中に起きていた 404 エラーの扱いを改善し、処理の途中停止を防ぎました。結果として一部データの未表示が減ります。",
  },
  {
    date: "2025-10-30",
    title: "多言語対応を実装（日本語・英語）",
    description: "アプリケーション全体で日本語と英語の切り替えに対応しました。ユーザーの言語設定に応じて表示言語が自動的に切り替わります。",
  },
  {
    date: "2025-10-29",
    title: "ネットワークタイムアウト発生時の安定性改善",
    description: "ETIMEDOUT 発生時の無限リトライを防止し、システム全体の安定性を高めました。通常の利用者操作への影響はありませんが、サービスの信頼性が向上します。",
  },
  {
    date: "2025-10-29",
    title: "NFT メタデータ同期の失敗を減らす改善",
    description: "同期バッチに同期間隔とレート制御を導入し、外部 API 呼び出しの失敗や遅延を減らしました。NFT 表示の安定性が向上します。",
  },
  {
    date: "2025-10-29",
    title: "外部 NFT ウォレットの同期除外でノイズ削減",
    description: "外部の NFT ウォレットを同期対象から除外するフィルタを追加しました。不要な同期や誤表示が減ります。",
  },
  {
    date: "2025-10-29",
    title: "空状態表示を統一",
    description: "データがない場合の表示を統一し、わかりやすいメッセージとアイコンで表示するようにしました。",
  },
  {
    date: "2025-10-29",
    title: "認証初期化の最適化（UI表示の高速化）",
    description: "サーバーからデータがある場合の認証処理を最適化し、画面表示が速くなりました。",
  },
  {
    date: "2025-10-29",
    title: "国際電話番号認証に対応",
    description: "日本以外の電話番号でも認証できるようになりました。国際電話番号形式（+81など）に対応しています。",
  },
  {
    date: "2025-10-25",
    title: "ポイント寄付／付与時にLINE通知を送信",
    description: "ポイントの寄付や付与が発生した際にLINE通知を送る仕組みを追加しました。ユーザーに即時で通知が届き、アクションの確認がしやすくなります。",
  },
  {
    date: "2025-10-23",
    title: "LIFF環境での認証トークン送信問題を修正",
    description: "LINE LIFF環境でIDトークンが正しく送信されない問題を修正しました。認証がスムーズに完了するようになります。",
  },
  {
    date: "2025-10-23",
    title: "他コミュニティ参加時の重複エラーを修正",
    description: "ユーザーが異なるコミュニティに参加する際に発生していた重複エラーを修正しました。複数コミュニティへの参加がスムーズになります。",
  },
  {
    date: "2025-10-20",
    title: "LIFF環境での認証エラーを修正",
    description: "LINE LIFF環境で発生していた「User is not self」エラーを修正しました。認証処理が正常に動作するようになります。",
  },
  {
    date: "2025-10-17",
    title: "主催者のポイント残高不足時の表示を追加",
    description: "主催者のポイント残高が不足している場合、承認制御とガイダンスを表示するようにしました。予約時の状況がわかりやすくなります。",
  },
  {
    date: "2025-10-16",
    title: "モバイルでのポイント入力問題を修正",
    description: "モバイル端末でポイント入力時に数字が異常に増える問題を修正しました。正確な金額を入力できるようになります。",
  },
  {
    date: "2025-10-16",
    title: "ポイント決済欄の表示を改善",
    description: "ポイントが必要な場合は常にポイント決済欄を表示し、残高不足時は無効化するように改善しました。わかりやすくなります。",
  },
  {
    date: "2025-10-15",
    title: "LIFF環境での新規ユーザー認証完了問題を修正",
    description: "LIFF環境で新規ユーザーの認証が完了しない問題を修正しました。新規登録がスムーズに進むようになります。",
  },
  {
    date: "2025-10-13",
    title: "予約締切を一律1日前に統一",
    description: "予約締切時刻を開催日の1日前に統一しました。予約受付ルールが明確になります。",
  },
  {
    date: "2025-10-09",
    title: "iOS Safari/LIFF環境でのエラーを修正",
    description: "iOS SafariやLIFF環境で発生していたrequestIdleCallbackエラーを修正しました。アプリが安定して動作するようになります。",
  },
  {
    date: "2025-09-26",
    title: "管理画面のメンバー一覧で無限スクロールのバグを修正",
    description: "管理画面のメンバー一覧ページで無限スクロールが正しく動作しない問題を修正しました。",
  },
  {
    date: "2025-09-25",
    title: "ウォレット画面にユーザー画像とDID短縮表示を追加",
    description: "ウォレット画面にユーザーのプロフィール画像を表示し、DIDを短縮形式で表示するようにしました。見やすくなります。",
  },
  {
    date: "2025-09-23",
    title: "コメント機能を実装",
    description: "ポイント寄付や付与時にコメントを添えられる機能を追加しました。取引の理由や感謝のメッセージを伝えられます。",
  },
  {
    date: "2025-09-23",
    title: "トランザクションページを新規作成",
    description: "コミュニティの取引履歴を一覧表示するトランザクションページを追加しました。ポイントの流れが確認しやすくなります。",
  },
  {
    date: "2025-09-13",
    title: "ウォレットのユーザー選択ページで無限スクロールを修正",
    description: "ウォレットのユーザー選択ページで無限スクロールが無効になっていたバグを修正しました。多数のユーザーから選択しやすくなります。",
  },
  {
    date: "2025-09-12",
    title: "証明書ページのデータ取得と無限スクロールを実装",
    description: "証明書ページでより多くのデータを取得できるようにし、無限スクロールを実装しました。多数の証明書を確認しやすくなります。",
  },
  {
    date: "2025-09-05",
    title: "電話認証に再送信機能を追加",
    description: "電話認証コードの再送信機能と60秒のタイマーを追加しました。コードが届かない場合でも再送信できます。",
  },
  {
    date: "2025-08-07",
    title: "メンバー選択タブの無限スクロールを修正",
    description: "ポイント支給先・譲渡先のメンバー選択タブで無限スクロールが動作しない問題を修正しました。",
  },
  {
    date: "2025-08-04",
    title: "起動時の画面フラッシュ問題を修正",
    description: "起動時に画面がチカチカ切り替わる問題と、管理画面で無限ループに陥る問題を修正しました。スムーズに動作します。",
  },
  {
    date: "2025-08-03",
    title: "NFT機能を実装",
    description: "NFTの表示機能を実装しました。保有しているNFTを確認できるようになります。",
  },
  {
    date: "2025-07-31",
    title: "お手伝い・ポイント決済機能を追加",
    description: "お手伝い（クエスト）機能とポイントでの決済機能を追加しました。ポイントを使って体験に参加できるようになります。",
  },
  {
    date: "2025-07-29",
    title: "体験ごとに予約受付日数をカスタマイズ可能に",
    description: "任意の体験を任意の日数前まで受け付けられるようにしました。体験ごとに柔軟な予約設定ができます。",
  },
  {
    date: "2025-07-27",
    title: "予約キャンセル時のポイント返却処理を追加",
    description: "予約をキャンセルした際にポイントを正しく返却する処理を追加しました。ポイントが適切に管理されます。",
  },
  {
    date: "2025-07-15",
    title: "LIFF予約画面からの登録遷移問題を修正",
    description: "LIFFの予約画面からアカウント登録に進もうとすると画面が切り替わらない問題を修正しました。",
  },
  {
    date: "2025-07-09",
    title: "承認不要時の誤表示を修正",
    description: "主催者の承認が不要な場合でも、申込完了画面で承認が必要と表示される問題を修正しました。",
  },
  {
    date: "2025-07-08",
    title: "日を跨ぐ開催枠の表記を修正",
    description: "日を跨ぐ開催枠の日付表記が同日として表示される問題を修正しました。正しい日付範囲が表示されます。",
  },
  {
    date: "2025-07-07",
    title: "証明書ページのデザインを改善",
    description: "証明書ページのデザインを仕様通りに修正しました。見やすく使いやすいデザインになります。",
  },
  {
    date: "2025-07-07",
    title: "ユーザー設定ページを作成",
    description: "ユーザー設定ページを新規作成しました。プロフィールや各種設定を管理できるようになります。",
  },
  {
    date: "2025-07-04",
    title: "検索フォームにEnterキー検索を追加",
    description: "検索フォームでEnterキーを押すことで検索できるようになりました。検索操作が便利になります。",
  },
  {
    date: "2025-07-04",
    title: "ポイント支給先・譲渡先の選択体験を改善",
    description: "ポイント支給先・譲渡先を選ぶ際の操作性を改善しました。スムーズに選択できるようになります。",
  },
  {
    date: "2025-07-03",
    title: "記事の作成・編集機能を実装",
    description: "記事の作成、編集、画像アップロード機能を実装しました。コミュニティの情報発信がしやすくなります。",
  },
  {
    date: "2025-07-03",
    title: "都道府県・市区町村の取得機能を追加",
    description: "都道府県と市区町村のデータを取得できる機能を追加しました。地域情報の管理が便利になります。",
  },
  {
    date: "2025-06-30",
    title: "予約受付期限を7日前から1日前に変更",
    description: "予約受付期限を開催日の7日前から1日前に変更しました。直前まで予約できるようになります。",
  },
  {
    date: "2025-06-27",
    title: "チケット機能のバグを修正",
    description: "チケット機能に関する複数のバグを修正しました。チケットの表示と利用が正しく動作するようになります。",
  },
  {
    date: "2025-06-13",
    title: "チケット表示を正しく修正",
    description: "チケットの表示が正しくない問題を修正しました。保有チケット数が正確に表示されます。",
  },
  {
    date: "2025-06-13",
    title: "モバイルブラウザの互換性を改善",
    description: "モバイルブラウザでの互換性問題を修正しました。より多くのモバイル環境で安定して動作します。",
  },
  {
    date: "2025-06-12",
    title: "チケット使用時の料金表示を修正",
    description: "チケットを使って予約した際の料金表示が正しくない問題を修正しました。正確な料金が表示されます。",
  },
  {
    date: "2025-06-07",
    title: "体験一覧ページのパフォーマンスを最適化",
    description: "体験一覧ページの読み込み時間を大幅に短縮しました（約5.9秒から3秒に改善）。ページがより速く表示されます。",
  },
  {
    date: "2025-06-06",
    title: "拠点名や地名で体験を検索できるように実装",
    description: "拠点名や地名をキーワードにして体験を検索できるようになりました。地域から体験を探しやすくなります。",
  },
  {
    date: "2025-06-05",
    title: "検索UXを改善",
    description: "検索機能の使い勝手を改善し、コードをクリーンアップしました。検索がより使いやすくなります。",
  },
  {
    date: "2025-06-03",
    title: "レンダリングを最適化（遅延読み込みとキャッシュ）",
    description: "遅延読み込みとキャッシュを導入し、ページの表示速度を改善しました。スムーズに閲覧できるようになります。",
  },
  {
    date: "2025-06-03",
    title: "日程選択の体験を改善",
    description: "開催枠のフィルタリングと日程選択の操作性を改善しました。日程を選びやすくなります。",
  },
];

// English entries
const CHANGELOG_ENTRIES_EN: ChangelogEntry[] = [
  {
    date: "2025-11-07",
    title: "Fixed reservation data inconsistencies (improved user display)",
    description: "Fixed inconsistencies between reservation and participation data that occurred in batch processing. Calendar and participation displays are now more reliable. No user action required.",
  },
  {
    date: "2025-11-07",
    title: "Improved notification display position on mobile",
    description: "Adjusted notification message position on mobile devices to prevent overlap with bottom buttons.",
  },
  {
    date: "2025-11-07",
    title: "Improved Japanese message display style",
    description: "Unified honorific expressions, fixed character spacing, and optimized font sizes to improve message readability.",
  },
  {
    date: "2025-11-06",
    title: "Fixed display after reservation cancellation",
    description: "Fixed display and state inconsistencies that occurred when canceling reservations. Display and aggregation after cancellation now work correctly. No user action required.",
  },
  {
    date: "2025-11-06",
    title: "Added blockchain verification for NFTs",
    description: "Added functionality to verify NFT authenticity on the blockchain. Verification status can be checked from the NFT detail screen.",
  },
  {
    date: "2025-11-05",
    title: "Improved NFT image display reliability (changed image delivery method)",
    description: "Improved NFT image handling by introducing Google Cloud Storage. Images are now more reliably displayed and content is more stable.",
  },
  {
    date: "2025-11-03",
    title: "Improved DID/VC sync reliability (stabilized display data)",
    description: "Enhanced logging and automatic recovery for DID/VC sync processing, reducing display gaps from sync failures. Data visible to users is now more complete.",
  },
  {
    date: "2025-11-03",
    title: "Fixed false positives in participation/reservation evaluation checks",
    description: "Fixed false positives in reservation and participation validation logic to prevent incorrect status displays and processing stops. No user action required.",
  },
  {
    date: "2025-10-31",
    title: "Extended default reservation deadline (operational change)",
    description: "Changed the default reservation deadline from 1 day before to 2 days before the event date. Reservation period is now longer (affects reservation functionality).",
  },
  {
    date: "2025-10-31",
    title: "Fixed false detections in reservation-participation consistency checks",
    description: "Fixed false detections in data consistency checks. Reduced cases of erroneous errors, allowing displays and procedures to proceed correctly.",
  },
  {
    date: "2025-10-30",
    title: "Enhanced DID/VC sync batch recovery",
    description: "Improved error handling and retry logic for sync batches, making automatic recovery from sync failures easier. Display data stability has improved.",
  },
  {
    date: "2025-10-30",
    title: "Improved 404 error handling in sync processing",
    description: "Improved handling of 404 errors during sync to prevent processing interruptions. As a result, missing data displays are reduced.",
  },
  {
    date: "2025-10-30",
    title: "Implemented multilingual support (Japanese/English)",
    description: "Added support for switching between Japanese and English throughout the application. Display language automatically switches based on user language settings.",
  },
  {
    date: "2025-10-29",
    title: "Improved stability during network timeouts",
    description: "Prevented infinite retries when ETIMEDOUT occurs, improving overall system stability. No impact on normal user operations, but service reliability has improved.",
  },
  {
    date: "2025-10-29",
    title: "Reduced NFT metadata sync failures",
    description: "Introduced sync intervals and rate limiting to sync batches, reducing external API call failures and delays. NFT display stability has improved.",
  },
  {
    date: "2025-10-29",
    title: "Reduced noise by excluding external NFT wallets from sync",
    description: "Added filter to exclude external NFT wallets from sync targets. Unnecessary syncs and incorrect displays are reduced.",
  },
  {
    date: "2025-10-29",
    title: "Unified empty state displays",
    description: "Unified displays when there is no data, showing clear messages and icons.",
  },
  {
    date: "2025-10-29",
    title: "Optimized authentication initialization (faster UI display)",
    description: "Optimized authentication processing when server data is available, making screen displays faster.",
  },
  {
    date: "2025-10-29",
    title: "Added support for international phone number authentication",
    description: "Authentication now works with phone numbers outside Japan. Supports international phone number format (e.g., +81).",
  },
  {
    date: "2025-10-25",
    title: "Send LINE notifications for point donations/grants",
    description: "Added mechanism to send LINE notifications when point donations or grants occur. Users receive immediate notifications, making it easier to confirm actions.",
  },
  {
    date: "2025-10-23",
    title: "Fixed authentication token transmission issue in LIFF environment",
    description: "Fixed issue where ID tokens were not properly transmitted in LINE LIFF environment. Authentication now completes smoothly.",
  },
  {
    date: "2025-10-23",
    title: "Fixed duplicate error when joining other communities",
    description: "Fixed duplicate error that occurred when users joined different communities. Joining multiple communities is now smoother.",
  },
  {
    date: "2025-10-20",
    title: "Fixed authentication error in LIFF environment",
    description: "Fixed \"User is not self\" error that occurred in LINE LIFF environment. Authentication processing now works normally.",
  },
  {
    date: "2025-10-17",
    title: "Added display for organizer's insufficient point balance",
    description: "Added approval control and guidance display when organizer's point balance is insufficient. Reservation status is now clearer.",
  },
  {
    date: "2025-10-16",
    title: "Fixed point input issue on mobile",
    description: "Fixed issue where numbers increased abnormally when inputting points on mobile devices. Accurate amounts can now be entered.",
  },
  {
    date: "2025-10-16",
    title: "Improved point payment section display",
    description: "Improved to always show point payment section when points are required, and disable it when balance is insufficient. Now clearer.",
  },
  {
    date: "2025-10-15",
    title: "Fixed new user authentication completion issue in LIFF environment",
    description: "Fixed issue where new user authentication did not complete in LIFF environment. New registrations now proceed smoothly.",
  },
  {
    date: "2025-10-13",
    title: "Unified reservation deadline to 1 day before",
    description: "Unified reservation deadline to 1 day before event date. Reservation acceptance rules are now clearer.",
  },
  {
    date: "2025-10-09",
    title: "Fixed error in iOS Safari/LIFF environment",
    description: "Fixed requestIdleCallback error that occurred in iOS Safari and LIFF environments. App now runs stably.",
  },
  {
    date: "2025-09-26",
    title: "Fixed infinite scroll bug in admin member list",
    description: "Fixed issue where infinite scroll did not work correctly on admin member list page.",
  },
  {
    date: "2025-09-25",
    title: "Added user image and shortened DID display to wallet screen",
    description: "Added user profile image display to wallet screen and shortened DID display format. Now easier to view.",
  },
  {
    date: "2025-09-23",
    title: "Implemented comment functionality",
    description: "Added functionality to attach comments when donating or granting points. You can convey transaction reasons and thank-you messages.",
  },
  {
    date: "2025-09-23",
    title: "Created new transaction page",
    description: "Added transaction page to display community transaction history. Point flow is now easier to check.",
  },
  {
    date: "2025-09-13",
    title: "Fixed infinite scroll on wallet user selection page",
    description: "Fixed bug where infinite scroll was disabled on wallet user selection page. Now easier to select from many users.",
  },
  {
    date: "2025-09-12",
    title: "Implemented data fetching and infinite scroll on credentials page",
    description: "Enabled fetching more data on credentials page and implemented infinite scroll. Now easier to check many credentials.",
  },
  {
    date: "2025-09-05",
    title: "Added resend functionality to phone authentication",
    description: "Added resend functionality for phone authentication codes with 60-second timer. You can resend if code doesn't arrive.",
  },
  {
    date: "2025-08-07",
    title: "Fixed infinite scroll in member selection tab",
    description: "Fixed issue where infinite scroll did not work in member selection tab for point grants/transfers.",
  },
  {
    date: "2025-08-04",
    title: "Fixed screen flash issue on startup",
    description: "Fixed issue where screen flickered on startup and infinite loop issue in admin screens. Now runs smoothly.",
  },
  {
    date: "2025-08-03",
    title: "Implemented NFT functionality",
    description: "Implemented NFT display functionality. You can now check your owned NFTs.",
  },
  {
    date: "2025-07-31",
    title: "Added quest and point payment functionality",
    description: "Added quest functionality and point payment feature. You can now participate in experiences using points.",
  },
  {
    date: "2025-07-29",
    title: "Enabled customizable reservation acceptance days per experience",
    description: "Enabled accepting reservations for any experience up to any number of days before. Flexible reservation settings per experience are now possible.",
  },
  {
    date: "2025-07-27",
    title: "Added point refund processing on reservation cancellation",
    description: "Added processing to correctly refund points when reservations are canceled. Points are now properly managed.",
  },
  {
    date: "2025-07-15",
    title: "Fixed registration transition issue from LIFF reservation screen",
    description: "Fixed issue where screen did not switch when trying to proceed to account registration from LIFF reservation screen.",
  },
  {
    date: "2025-07-09",
    title: "Fixed incorrect display when approval not required",
    description: "Fixed issue where application completion screen showed approval required even when organizer approval was not needed.",
  },
  {
    date: "2025-07-08",
    title: "Fixed display of time slots spanning multiple days",
    description: "Fixed issue where time slots spanning multiple days were displayed as same day. Correct date range is now displayed.",
  },
  {
    date: "2025-07-07",
    title: "Improved credentials page design",
    description: "Fixed credentials page design according to specifications. Now has a clearer and more user-friendly design.",
  },
  {
    date: "2025-07-07",
    title: "Created user settings page",
    description: "Created new user settings page. You can now manage profile and various settings.",
  },
  {
    date: "2025-07-04",
    title: "Added Enter key search to search form",
    description: "You can now search by pressing Enter key in search form. Search operation is now more convenient.",
  },
  {
    date: "2025-07-04",
    title: "Improved point grant/transfer recipient selection experience",
    description: "Improved usability when selecting point grant/transfer recipients. Selection is now smoother.",
  },
  {
    date: "2025-07-03",
    title: "Implemented article creation and editing functionality",
    description: "Implemented article creation, editing, and image upload functionality. Community information sharing is now easier.",
  },
  {
    date: "2025-07-03",
    title: "Added prefecture and city data retrieval functionality",
    description: "Added functionality to retrieve prefecture and city data. Regional information management is now more convenient.",
  },
  {
    date: "2025-06-30",
    title: "Changed reservation deadline from 7 days to 1 day before",
    description: "Changed reservation deadline from 7 days before to 1 day before event date. You can now reserve until just before the event.",
  },
  {
    date: "2025-06-27",
    title: "Fixed ticket functionality bugs",
    description: "Fixed multiple bugs related to ticket functionality. Ticket display and usage now work correctly.",
  },
  {
    date: "2025-06-13",
    title: "Fixed correct ticket display",
    description: "Fixed issue where ticket display was incorrect. Owned ticket count is now displayed accurately.",
  },
  {
    date: "2025-06-13",
    title: "Improved mobile browser compatibility",
    description: "Fixed compatibility issues on mobile browsers. Now runs stably on more mobile environments.",
  },
  {
    date: "2025-06-12",
    title: "Fixed price display when using tickets",
    description: "Fixed issue where price display was incorrect when reserving with tickets. Accurate price is now displayed.",
  },
  {
    date: "2025-06-07",
    title: "Optimized activities page performance",
    description: "Significantly reduced loading time for activities page (improved from about 5.9s to 3s). Page now displays faster.",
  },
  {
    date: "2025-06-06",
    title: "Implemented search by location name or place name",
    description: "You can now search for experiences by location name or place name keywords. Easier to find experiences by region.",
  },
  {
    date: "2025-06-05",
    title: "Improved search UX",
    description: "Improved search functionality usability and cleaned up code. Search is now more user-friendly.",
  },
  {
    date: "2025-06-03",
    title: "Optimized rendering (lazy loading and caching)",
    description: "Introduced lazy loading and caching to improve page display speed. Browsing is now smoother.",
  },
  {
    date: "2025-06-03",
    title: "Improved date selection experience",
    description: "Improved slot filtering and date selection usability. Date selection is now easier.",
  },
];

// Export Japanese entries as default
export const CHANGELOG_ENTRIES = CHANGELOG_ENTRIES_JA;
export { CHANGELOG_ENTRIES_JA, CHANGELOG_ENTRIES_EN };
