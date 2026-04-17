# Storybook 運用ガイド

本プロジェクトの Storybook は UI コンポーネントの動作確認と、Chromatic によるビジュアル回帰テストを目的とする。

## 実行

```bash
pnpm storybook        # 開発サーバー (http://localhost:6006)
pnpm build-storybook  # 静的ビルド
pnpm chromatic        # Chromatic へ publish (要 CHROMATIC_PROJECT_TOKEN)
```

## ビルド環境の注意点

- Node 22 系を使う（Vite 7.0.5 が Node 20 系で `__dirname` 重複宣言エラーを起こすため）
- CI もワークフロー内で Node 22 を指定している（`.github/workflows/chromatic.yml`）
- `process.env.ENV` は Storybook ビルド時に `"STORYBOOK"` に置換される（`src/lib/environment.ts` の `isStorybook` 判定を通し、ロガーが実 API を叩かないようにする）

## ファイル構成

```
.storybook/
  main.ts              # Storybook 設定 (framework, addons, Vite カスタム)
  preview.ts           # 全 story 共通のパラメータ・decorator
  preview-head.html    # バンドル読込前の process polyfill
  decorators/          # 切り出した decorator 群 (下記)
  mocks/               # 手動モック (将来的に増えたらここに)
```

## Decorator

`.storybook/decorators/` 配下に decorator を切り出している。

### グローバル適用（全 story で自動適用）

`decorators/index.ts` の `globalDecorators` が `preview.ts` で適用される。
外側から順に:

1. `withI18n` — next-intl の翻訳供給 (`useTranslations()` が動く)
2. `withCommunityConfig` — `CommunityConfigProvider` にモック config を供給 (`AppLink` 等のパス解決に必要)
3. `withHeader` — `HeaderContext.Provider` に固定値を供給して `useHeader()` を動かす。
   実物の `HeaderProvider` コンポーネントは内部で `usePathname()` を参照しており、
   Chromatic の Playwright テスト環境では null が返って `normalizePathname` が
   落ちるため、副作用のない Context.Provider 直使用に留める
4. `withAuth` — **現状は no-op**。`src/contexts/AuthProvider.tsx` 内部の
   `AuthContext` が export されていないため、独自に作った context を Provider
   しても実体の `useAuth()` からは参照されない。`useAuth()` を呼ばない
   コンポーネント向けの placeholder として置いている（後述）

### オプトイン (story ごとに指定)

#### `withApollo`
GraphQL を叩くコンポーネント用。

```tsx
import { withApollo } from "../../../.storybook/decorators";
import { GetUserDocument } from "@/types/graphql";

const meta: Meta<typeof UserCard> = {
  title: "Users/UserCard",
  component: UserCard,
  decorators: [withApollo],
};

export const WithData: Story = {
  parameters: {
    apollo: {
      mocks: [
        {
          request: { query: GetUserDocument, variables: { id: "1" } },
          result: { data: { user: { __typename: "User", id: "1", name: "太郎" } } },
        },
      ],
    },
  },
};
```

## Story 命名ルール

```ts
const meta: Meta<typeof MyComponent> = {
  title: "<Domain>/<ComponentName>",   // 例: "Transactions/TransactionChainTrail"
  component: MyComponent,
  parameters: { layout: "padded" },     // or "centered" / "fullscreen"
};
```

### 推奨 story バリエーション

状態を網羅するとビジュアル回帰の価値が上がる。最低限下記を意識する:

- `Default` — 通常ケース
- `Loading` — ローディング表示
- `Error` — エラー表示
- `Empty` — データ空
- 境界値 (`LongText`, `ManyItems`, 等)

## 新しい decorator を追加したいとき

1. `decorators/withXxx.ts` を作る (既存ファイルを参考に)
2. `decorators/index.ts` で再 export
3. グローバル適用したいなら `globalDecorators` に追加
4. opt-in なら各 story の `decorators` に直接入れる

### 実装の指針

- **副作用を持つ Provider コンポーネントを直接マウントしない**
  `usePathname()` / `useRouter()` / `useEffect` で外部リソースを叩く等の副作用がある
  Provider は Chromatic の Playwright テスト環境で想定外のエラーを出しやすい。
  可能な限り `Context.Provider` に固定値を渡す形にする。
- **本物の Context を使う**
  `createContext()` で独自の context を decorator 内に作っても、コンポーネント側が
  参照する実体の context とは別物なので効果がない (withAuth 参照)。

## useAuth() を使うコンポーネントの story

現状 `src/contexts/AuthProvider.tsx` が `AuthContext` を export していないため、`useAuth()` を直接叩くコンポーネントは story を書けない (必ず throw する)。`withAuth` は将来対応の placeholder であり、この問題は解消しない。

解決するには以下のいずれかの対応が必要:

- **AuthContext を export**: `AuthProvider.tsx` から `AuthContext` を export し、decorator 内で `AuthContext.Provider` を使う
- **Vite alias mock**: `@/contexts/AuthProvider` をテスト用 mock 実装に alias する
- **props リフト**: コンポーネント側で props 経由で auth 情報を受け取る設計に変更する

新規 UI 部品を書く際は、可能なら props 経由でユーザー情報を受け取る設計にすると story が書きやすい。

## Chromatic

- PR 作成時に `.github/workflows/chromatic.yml` が走り、自動で publish される
- 差分があれば PR に UI Tests / UI Review の Check が付く
- 管理画面で Accept / Deny してベースラインを更新する
- TurboSnap は CI 10 ビルド以降で自動解放される

## トラブルシュート

### `process is not defined`
`.storybook/preview-head.html` が読まれていない可能性。`main.ts` の `staticDirs` 等の順序を変えていないか確認。

### `useAuth must be used within an AuthProvider`
`AuthProvider.tsx` 内の `AuthContext` の default 値が `undefined` のため、
Provider が無い環境で `useAuth()` を呼ぶと確実に throw する。
現状の `withAuth` はこのエラーを回避できない。対応策は「useAuth() を使うコンポーネントの story」参照。

### ChromaticでAPI呼び出しのエラー
Storybook では実 API は叩かない設計。GraphQL が必要なら `withApollo` で mocks を渡す。
