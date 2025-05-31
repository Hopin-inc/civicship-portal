# `src/app/` と `src/components/` の useEffect 分析

## 1. ページ初期化・設定フック

### `useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [])`
**依存変数**: `[]` (空配列)
**トリガー**: コンポーネントマウント時のみ
**実行内容**: ページトップへのスムーススクロール
**場所**: `/src/app/page.tsx`, `/src/app/activities/page.tsx`

### `useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, [])`
**依存変数**: `[]` (空配列)
**トリガー**: コンポーネントマウント時のみ
**実行内容**: ボディのスクロール無効化とクリーンアップ
**場所**: `/src/app/login/page.tsx`, `/src/components/shared/LoadingIndicator.tsx`, `/src/components/shared/EmptyState.tsx`, `/src/components/shared/ErrorState.tsx`

## 2. 認証・リダイレクト管理フック

### `useEffect(() => { /* 複雑なLINE認証リターン処理 */ }, [authLoading, authRedirectService, authenticationState, isAuthenticated, isAuthenticating, router, searchParams, userLoading])`
**依存変数**: 8つの認証・ナビゲーション関連変数
**トリガー**: 認証状態、ローディング状態、検索パラメータの変更時
**実行内容**: LINE認証からの戻り処理、リダイレクトパス管理、sessionStorage操作
**場所**: `/src/app/page.tsx`

### `useEffect(() => { if (!isAuthenticating && authenticationState === "line_authenticated") { router.replace(redirectPath); } }, [authenticationState, router, nextPath, authRedirectService, isAuthenticating])`
**依存変数**: `[authenticationState, router, nextPath, authRedirectService, isAuthenticating]`
**トリガー**: 認証状態変更時
**実行内容**: LINE認証完了後のリダイレクト処理
**場所**: `/src/app/login/page.tsx`

### `useEffect(() => { /* 管理者権限チェック */ }, [loading, data, router, authRedirectService])`
**依存変数**: `[loading, data, router, authRedirectService]`
**トリガー**: ローディング状態、ユーザーデータ変更時
**実行内容**: 管理者権限の確認とリダイレクト処理
**場所**: `/src/components/auth/AdminGuard.tsx`

### `useEffect(() => { /* ルート保護処理 */ }, [loading, userLoading, isAuthenticated, authenticationState, pathname, router, authRedirectService])`
**依存変数**: 7つの認証・ナビゲーション関連変数
**トリガー**: 認証状態、パス、ローディング状態の変更時
**実行内容**: 認証が必要なルートの保護とリダイレクト
**場所**: `/src/components/auth/RouteGuard.tsx`

## 3. データ取得・状態管理フック

### `useEffect(() => { refetchRef.current = refetch; }, [refetch])`
**依存変数**: `[refetch]`
**トリガー**: Apollo Clientのrefetch関数変更時
**実行内容**: refetch関数をrefに保存（手動リフレッシュ用）
**場所**: `/src/app/tickets/page.tsx`, `/src/app/users/[id]/page.tsx`, `/src/app/users/me/page.tsx`, `/src/app/search/result/page.tsx`, `/src/app/reservation/complete/page.tsx`, `/src/app/admin/wallet/grant/page.tsx`

### `useEffect(() => { void fetchMembershipList({ variables: { first: 50 } }); }, [fetchMembershipList])`
**依存変数**: `[fetchMembershipList]`
**トリガー**: GraphQL fetch関数変更時
**実行内容**: 初期データの取得（メンバーシップリスト）
**場所**: `/src/app/admin/members/page.tsx`

### `useEffect(() => { setIsLoading(loading && !data); }, [loading, data, setIsLoading])`
**依存変数**: `[loading, data, setIsLoading]`
**トリガー**: Apollo Clientのローディング状態、データ変更時
**実行内容**: ローディング状態の更新
**場所**: `/src/app/articles/hooks/useArticles.ts`

### `useEffect(() => { if (data?.user) { setProfile(presenterUserProfile(data.user)); } }, [data])`
**依存変数**: `[data]`
**トリガー**: GraphQLユーザーデータ変更時
**実行内容**: プロフィールデータの初期化
**場所**: `/src/app/users/me/edit/hooks/useProfileEdit.ts`

## 4. UI状態・ナビゲーション管理フック

### `useEffect(() => { const pageType = getPageType(pathname); if (currentLastUrl !== pathname) { addToHistory(pageType, pathname); } }, [pathname, getPageType, addToHistory])`
**依存変数**: `[pathname, getPageType, addToHistory]`
**トリガー**: パス変更時
**実行内容**: ナビゲーション履歴の追跡と更新
**場所**: `/src/components/providers/HeaderProvider.tsx`

### `useEffect(() => { const pageType = getPageType(pathname); addToHistory(pageType, pathname); }, [pathname, addToHistory, getPageType])`
**依存変数**: `[pathname, addToHistory, getPageType]`
**トリガー**: パス変更時
**実行内容**: ページタイプの判定と履歴追加
**場所**: `/src/components/providers/NavigationTracker.tsx`

### `useEffect(() => { if (previousSearchParams === null || /* 検索パラメータ比較 */) { updateConfig({ title: generateTitle(searchParams) }); setPreviousSearchParams(searchParams); } }, [searchParams, updateConfig, previousSearchParams])`
**依存変数**: `[searchParams, updateConfig, previousSearchParams]`
**トリガー**: 検索パラメータ変更時
**実行内容**: ヘッダー設定の動的更新
**場所**: `/src/app/search/result/components/SearchResultHeader.tsx`

### `useEffect(() => { if (!emblaApi) return; emblaApi.on("select", onSelect); emblaApi.on("reInit", onSelect); }, [emblaApi, onSelect])`
**依存変数**: `[emblaApi, onSelect]`
**トリガー**: Embla Carouselインスタンス変更時
**実行内容**: カルーセルイベントリスナーの登録
**場所**: `/src/components/ui/images-carousel.tsx`

## 5. イベント処理・クリーンアップフック

### `useEffect(() => { return () => { if (profile.imagePreviewUrl && profile.imagePreviewUrl.startsWith('blob:')) { URL.revokeObjectURL(profile.imagePreviewUrl); } }; }, [])`
**依存変数**: `[]` (空配列)
**トリガー**: コンポーネントアンマウント時のみ
**実行内容**: Blob URLのメモリリークを防ぐクリーンアップ
**場所**: `/src/app/users/me/edit/hooks/useProfileEdit.ts`

### `useEffect(() => { if (!hasNextPage || !onLoadMore) return; const observer = new IntersectionObserver(/* ... */); }, [hasNextPage, onLoadMore])`
**依存変数**: `[hasNextPage, onLoadMore]`
**トリガー**: ページネーション状態変更時
**実行内容**: Intersection Observerによる無限スクロール実装
**場所**: `/src/app/admin/wallet/grant/components/UserSelectStep.tsx`

## 6. エラーハンドリング・通知フック

### `useEffect(() => { if (error) { console.error("Error fetching search results:", error); toast.error("検索結果の取得に失敗しました"); } }, [error])`
**依存変数**: `[error]`
**トリガー**: GraphQLエラー発生時
**実行内容**: エラーログ出力とトースト通知表示
**場所**: `/src/app/search/result/hooks/useSearchResults.ts`

### `useEffect(() => { if (error) { console.error("Error fetching article data:", error); toast.error("記事データの取得に失敗しました"); } }, [error])`
**依存変数**: `[error]`
**トリガー**: 記事取得エラー発生時
**実行内容**: エラーログとユーザー通知
**場所**: `/src/app/articles/hooks/useArticle.ts`

### `useEffect(() => { if (claim.error) { toast.error("チケット発行中にエラーが発生しました: " + claim.error.message); } }, [claim.error])`
**依存変数**: `[claim.error]`
**トリガー**: チケット発行エラー発生時
**実行内容**: エラーメッセージのトースト表示
**場所**: `/src/app/tickets/receive/hooks/useTicketClaimController.ts`

## 7. チケット・状態管理フック

### `useEffect(() => { const raw = view.data?.ticketClaimLink; if (raw) { setHasIssued(raw.status !== GqlClaimLinkStatus.Issued); } }, [view.data])`
**依存変数**: `[view.data]`
**トリガー**: チケット表示データ変更時
**実行内容**: チケット発行状態の更新
**場所**: `/src/app/tickets/receive/hooks/useTicketClaimController.ts`

### `useEffect(() => { if (claim.data?.ticketClaim?.tickets?.length) { setHasIssued(true); toast.success("チケットを獲得しました！"); } }, [claim.data])`
**依存変数**: `[claim.data]`
**トリガー**: チケット発行データ変更時
**実行内容**: 発行状態更新と成功通知
**場所**: `/src/app/tickets/receive/hooks/useTicketClaimController.ts`

## 8. アナリティクス・トラッキングフック

### `useEffect(() => { if (reservationData && opportunityData && !hasTracked.current) { track("reservation_completed", { /* アナリティクスデータ */ }); hasTracked.current = true; } }, [reservationData, opportunityData, track])`
**依存変数**: `[reservationData, opportunityData, track]`
**トリガー**: 予約・機会データ変更時
**実行内容**: 予約完了イベントの一回限りトラッキング
**場所**: `/src/app/reservation/complete/page.tsx`

## 9. 出席・評価管理フック

### `useEffect(() => { const vals = Object.values(attendanceData); setAllEvaluated(vals.length > 0 && vals.every((s) => s !== GqlEvaluationStatus.Pending)); }, [attendanceData])`
**依存変数**: `[attendanceData]`
**トリガー**: 出席データ変更時
**実行内容**: 全員評価完了状態の判定
**場所**: `/src/app/admin/reservations/hooks/attendance/useAttendanceState.ts`

### `useEffect(() => { if (participations.length === 0) return; /* 初期化処理 */ }, [participations])`
**依存変数**: `[participations]`
**トリガー**: 参加者データ変更時
**実行内容**: 出席状態の初期化
**場所**: `/src/app/admin/reservations/hooks/attendance/useAttendanceState.ts`

## 10. 環境・リダイレクト検出フック

### `useEffect(() => { if (hasRedirected.current) return; const env = detectEnvironment(); if (env === AuthEnvironment.LINE_BROWSER) { /* リダイレクト処理 */ } }, [router, nextParam])`
**依存変数**: `[router, nextParam]`
**トリガー**: ルーター、パラメータ変更時
**実行内容**: LINEブラウザ環境の検出とリダイレクト
**場所**: `/src/app/sign-up/phone-verification/page.tsx`

### `useEffect(() => { if (recaptchaContainerRef.current) { setIsRecaptchaReady(true); } }, [recaptchaContainerRef])`
**依存変数**: `[recaptchaContainerRef]`
**トリガー**: reCAPTCHAコンテナref変更時
**実行内容**: reCAPTCHA準備状態の設定
**場所**: `/src/app/sign-up/phone-verification/components/PhoneVerificationForm.tsx`

## 依存パターンの分類

### 1. マウント時のみ実行 (`[]`)
- ページスクロール制御
- ボディオーバーフロー制御
- Blobクリーンアップ

### 2. 認証状態依存
- `[authenticationState, isAuthenticated, loading]`
- 複雑な依存配列（8つの変数）
- 認証フローの制御

### 3. データ取得依存
- `[refetch]` - Apollo Client関数
- `[loading, data]` - GraphQL状態
- `[error]` - エラーハンドリング

### 4. UI状態依存
- `[pathname]` - ルート変更
- `[searchParams]` - 検索パラメータ
- `[emblaApi]` - サードパーティライブラリ

### 5. 複合依存
- 認証 + ナビゲーション（7-8変数）
- データ + UI状態（3-4変数）

## 最適化実装済み

### 認証フック最適化手法
1. **useRef活用**: 頻繁に変更される状態を`useRef`で管理し、依存配列から除去
2. **依存配列最小化**: 必要最小限の依存関係のみを保持
3. **間隔実行**: 状態チェックを定期的に実行し、状態変更による再実行を削減
4. **処理済みフラグ**: 重複実行を防ぐためのフラグ管理
5. **状態キャッシュ**: 前回の状態と比較して不要な処理をスキップ

### 最適化されたフック一覧
- `useTokenExpirationHandler`: 依存配列を`[setState, logout]`に最小化、stateRefで状態アクセス
- `useFirebaseAuthState`: 依存配列を`[setState]`に最小化、authStateManagerRefで参照管理
- `useLineAuthRedirectDetection`: 間隔チェック（2秒）で状態依存を削除、状態キャッシュで重複チェック防止
- `useLineAuthProcessing`: 処理済みフラグで重複実行を防止、refで関数参照管理
- `useAutoLogin`: 間隔チェック（3秒）と試行フラグで最適化、環境依存のみ
- `useUserRegistrationState`: ユーザーID重複チェックで不要な実行を防止
- `usePhoneAuthState`: 依存配列を`[setState]`に最小化、サービス参照をrefで管理

### 最適化効果
- **実行頻度削減**: 状態変更による連鎖的な再実行を大幅に削減
- **パフォーマンス向上**: 不要な依存関係を除去し、必要な時のみ実行
- **安定性向上**: 重複実行や無限ループのリスクを排除

## 潜在的な最適化機会

1. **refetch関数の保存**: 多くのページで同じパターンが繰り返されている
2. **エラーハンドリング**: 類似のエラー処理ロジックが分散している
3. **ナビゲーション追跡**: 複数のプロバイダーで類似の処理

## 認証フックとの比較

認証フック最適化により、以下の改善を実現：
- 状態変更による連鎖的な再実行の削減（3回→1回）
- 依存変数の最小化による頻繁な更新の抑制
- 類似の責務を持つフックの効率化

特に認証・リダイレクト管理フックは、認証フックと同じ最適化手法を適用可能。
