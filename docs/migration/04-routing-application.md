# Phase 4: ルーティング適用

## 概要

ページを `[communityId]` ディレクトリに移動し、Phase 3 で準備したコードを「有効化」する。この Phase が完了すると、新しい URL 構造（`/[communityId]/...`）が有効になる。

## PR 4a: ページを `[communityId]` ディレクトリに移動

### 目的

- 全ページを `src/app/[communityId]/` ディレクトリに移動
- レガシー URL リダイレクトを有効化

### 変更対象ファイル

| カテゴリ | 変更内容 |
|---------|---------|
| ディレクトリ構造 | `src/app/` → `src/app/[communityId]/` |

### 注意: Link → CommunityLink 置き換えについて

`Link` から `CommunityLink` への置き換えは **PR 2a（Phase 2）で完了済み**。`CommunityLink` は `communityId` がない場合は元の href をそのまま返すフォールバック動作を持つため、Phase 4 でディレクトリ移動を行う前でも既存の動作を壊さない。

この PR では純粋なディレクトリ移動のみを行う。

### 実装コード（転記用）

#### 1. ディレクトリ移動コマンド

```bash
# civicship-portal ディレクトリで実行

# [communityId] ディレクトリを作成
mkdir -p src/app/\[communityId\]

# 各ディレクトリを移動（git mv で履歴を保持）
git mv src/app/activities src/app/\[communityId\]/activities
git mv src/app/admin src/app/\[communityId\]/admin
git mv src/app/articles src/app/\[communityId\]/articles
git mv src/app/places src/app/\[communityId\]/places
git mv src/app/search src/app/\[communityId\]/search
git mv src/app/tickets src/app/\[communityId\]/tickets
git mv src/app/users src/app/\[communityId\]/users
git mv src/app/wallets src/app/\[communityId\]/wallets
git mv src/app/opportunities src/app/\[communityId\]/opportunities
git mv src/app/reservations src/app/\[communityId\]/reservations

# コミット
git add .
git commit -m "feat: move pages to [communityId] directory for multi-tenant routing"
```

#### 2. [communityId] 用 layout.tsx（新規作成）

```typescript
// src/app/[communityId]/layout.tsx
import { ReactNode } from "react";

interface CommunityLayoutProps {
  children: ReactNode;
  params: Promise<{ communityId: string }>;
}

export default async function CommunityLayout({
  children,
  params,
}: CommunityLayoutProps) {
  const { communityId } = await params;

  return (
    <div data-community-id={communityId}>
      {children}
    </div>
  );
}

// 動的ルートの設定
export function generateStaticParams() {
  // 静的生成するコミュニティIDのリスト
  // 本番環境では DB から取得するか、環境変数で設定
  return [
    { communityId: "neo88" },
    // 他のコミュニティを追加
  ];
}
```

#### 3. [communityId] 用 page.tsx（新規作成）

```typescript
// src/app/[communityId]/page.tsx
import { redirect } from "next/navigation";

interface CommunityPageProps {
  params: Promise<{ communityId: string }>;
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { communityId } = await params;
  
  // コミュニティのルートにアクセスした場合、デフォルトページにリダイレクト
  redirect(`/${communityId}/activities`);
}
```

#### 4. ディレクトリ構造（移動後）

```
src/app/
├── [communityId]/
│   ├── activities/
│   │   ├── [id]/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── admin/
│   │   ├── bonuses/
│   │   ├── credentials/
│   │   ├── members/
│   │   ├── nfts/
│   │   ├── opportunities/
│   │   └── layout.tsx
│   ├── articles/
│   │   ├── [id]/
│   │   └── page.tsx
│   ├── opportunities/
│   │   ├── [id]/
│   │   └── page.tsx
│   ├── places/
│   │   ├── [id]/
│   │   └── page.tsx
│   ├── reservations/
│   │   └── page.tsx
│   ├── search/
│   │   └── page.tsx
│   ├── tickets/
│   │   └── page.tsx
│   ├── users/
│   │   ├── [id]/
│   │   ├── me/
│   │   └── page.tsx
│   ├── wallets/
│   │   └── page.tsx
│   ├── layout.tsx      ← 新規作成
│   └── page.tsx        ← 新規作成
├── api/                ← 移動しない
│   ├── auth/
│   ├── graphql/
│   └── line/
├── layout.tsx          ← 移動しない（ルートレイアウト）
├── globals.css         ← 移動しない
└── page.tsx            ← 移動しない（ランディングページ）
```

参照: https://github.com/Hopin-inc/civicship-portal/tree/epic/mini-appify/src/app

#### 5. useParams での communityId 取得

```typescript
// クライアントコンポーネント内
"use client";

import { useParams } from "next/navigation";

export default function SomeClientComponent() {
  const params = useParams();
  const communityId = params?.communityId as string;
  
  // communityId を使用した処理
  console.log("Current community:", communityId);
  
  return <div>Community: {communityId}</div>;
}
```

```typescript
// サーバーコンポーネント内
interface PageProps {
  params: Promise<{ communityId: string }>;
}

export default async function SomeServerPage({ params }: PageProps) {
  const { communityId } = await params;
  
  // communityId を使用した処理
  return <div>Community: {communityId}</div>;
}
```

### 移動対象ディレクトリ一覧

| 移動元 | 移動先 |
|--------|--------|
| `src/app/activities/` | `src/app/[communityId]/activities/` |
| `src/app/admin/` | `src/app/[communityId]/admin/` |
| `src/app/articles/` | `src/app/[communityId]/articles/` |
| `src/app/opportunities/` | `src/app/[communityId]/opportunities/` |
| `src/app/places/` | `src/app/[communityId]/places/` |
| `src/app/reservations/` | `src/app/[communityId]/reservations/` |
| `src/app/search/` | `src/app/[communityId]/search/` |
| `src/app/tickets/` | `src/app/[communityId]/tickets/` |
| `src/app/users/` | `src/app/[communityId]/users/` |
| `src/app/wallets/` | `src/app/[communityId]/wallets/` |

### 移動しないディレクトリ

| ディレクトリ | 理由 |
|-------------|------|
| `src/app/api/` | API ルートは communityId 不要（ヘッダーで受け取る） |
| `src/app/layout.tsx` | ルートレイアウト |
| `src/app/globals.css` | グローバルスタイル |
| `src/app/page.tsx` | ランディングページ（コミュニティ選択画面など） |

### 実装手順

1. `src/app/[communityId]/` ディレクトリを作成
2. `src/app/[communityId]/layout.tsx` を作成
3. `src/app/[communityId]/page.tsx` を作成
4. 各ページディレクトリを移動（git mv を使用）
5. ビルドして import パスエラーがないことを確認
6. レガシー URL リダイレクトを有効化（PR 3c の isProduction チェックを削除）

※ Link → CommunityLink 置き換えは PR 2a で完了済み

### テスト方法

```bash
# civicship-portal ディレクトリで実行

# 型チェック
pnpm lint

# ビルド確認
pnpm build

# ローカルで動作確認
pnpm dev
```

動作確認手順:
1. `pnpm dev` でサーバーを起動
2. 新しい URL（`/neo88/activities`）でアクセスできることを確認
3. 旧 URL（`/activities`）が新 URL にリダイレクトされることを確認
4. `CommunityLink` が正しく動作することを確認（リンクをクリックして遷移）
5. ナビゲーションが正常に動作することを確認
6. LINE リッチメニューからのアクセスが正常に動作することを確認

### 参照

- epic/mini-appify app ディレクトリ: https://github.com/Hopin-inc/civicship-portal/tree/epic/mini-appify/src/app

### 注意事項

- この PR は変更量が多いため、慎重にレビューする
- ディレクトリ移動は git mv を使用して履歴を保持
- 移動後に import パスが正しいことを確認
- ビルドが通ることを確認してからマージ
- Next.js 15 では params が Promise になっているため、await が必要

### ロールバック手順

1. ディレクトリを元に戻す（git revert）
2. Phase 3 の準備コードは残っていても問題なし（フォールバック動作）

### デプロイ手順

1. PR をマージ
2. CI/CD でビルド・デプロイ
3. 動作確認（新旧両方の URL でアクセス）
4. 問題があれば git revert でロールバック

### レガシー URL リダイレクト有効化

Phase 4 デプロイ後、PR 3c で追加したリダイレクトロジックの `isProduction` チェックを削除する:

```typescript
// src/middleware.ts
// 変更前
if (!isProduction && !communityId) {
  // ...リダイレクト処理
}

// 変更後（isProduction チェックを削除）
if (!communityId) {
  // ...リダイレクト処理
}
```

これにより、本番環境でも旧 URL から新 URL へのリダイレクトが有効になる。
