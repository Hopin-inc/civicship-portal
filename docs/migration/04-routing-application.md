# Phase 4: ルーティング適用

## 概要

ページを `[communityId]` ディレクトリに移動し、Phase 3 で準備したコードを「有効化」する。この Phase が完了すると、新しい URL 構造（`/[communityId]/...`）が有効になる。

## PR 4a: ページを `[communityId]` ディレクトリに移動

### 目的

- 全ページを `src/app/[communityId]/` ディレクトリに移動
- 既存の `Link` コンポーネントを `CommunityLink` に置き換え
- レガシー URL リダイレクトを有効化

### 変更対象ファイル

| カテゴリ | 変更内容 |
|---------|---------|
| ディレクトリ構造 | `src/app/` → `src/app/[communityId]/` |
| Link コンポーネント | `Link` → `CommunityLink` に置き換え |
| 環境変数 | `NEXT_PUBLIC_NEW_ROUTING_ENABLED=true` |

### epic/mini-appify 参照コード

#### ディレクトリ構造

```
src/app/
├── [communityId]/
│   ├── activities/
│   │   ├── [id]/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── admin/
│   │   ├── credentials/
│   │   ├── members/
│   │   ├── nfts/
│   │   ├── opportunities/
│   │   └── layout.tsx
│   ├── articles/
│   ├── places/
│   ├── search/
│   ├── tickets/
│   ├── users/
│   ├── wallets/
│   ├── layout.tsx
│   └── page.tsx
├── api/
├── layout.tsx
└── globals.css
```

参照: https://github.com/Hopin-inc/civicship-portal/tree/epic/mini-appify/src/app

#### ページコンポーネントの変更例

```typescript
// src/app/[communityId]/activities/page.tsx
import { CommunityLink } from "@/components/navigation/CommunityLink";

export default function ActivitiesPage() {
  return (
    <div>
      {/* Link を CommunityLink に置き換え */}
      <CommunityLink href="/activities/123">
        Activity Detail
      </CommunityLink>
    </div>
  );
}
```

#### useParams での communityId 取得

```typescript
// ページコンポーネント内
import { useParams } from "next/navigation";

export default function SomePage() {
  const params = useParams();
  const communityId = params?.communityId as string;
  
  // communityId を使用した処理
}
```

### 移動対象ディレクトリ一覧

| 移動元 | 移動先 |
|--------|--------|
| `src/app/activities/` | `src/app/[communityId]/activities/` |
| `src/app/admin/` | `src/app/[communityId]/admin/` |
| `src/app/articles/` | `src/app/[communityId]/articles/` |
| `src/app/places/` | `src/app/[communityId]/places/` |
| `src/app/search/` | `src/app/[communityId]/search/` |
| `src/app/tickets/` | `src/app/[communityId]/tickets/` |
| `src/app/users/` | `src/app/[communityId]/users/` |
| `src/app/wallets/` | `src/app/[communityId]/wallets/` |

### 移動しないディレクトリ

| ディレクトリ | 理由 |
|-------------|------|
| `src/app/api/` | API ルートは communityId 不要 |
| `src/app/layout.tsx` | ルートレイアウト |
| `src/app/globals.css` | グローバルスタイル |

### 実装手順

1. `src/app/[communityId]/` ディレクトリを作成
2. 各ページディレクトリを移動
3. 移動したページ内の `Link` を `CommunityLink` に置き換え
4. `useParams()` で communityId を取得するように変更
5. `NEXT_PUBLIC_NEW_ROUTING_ENABLED=true` を設定
6. レガシー URL リダイレクトを有効化

### Link → CommunityLink 置き換え対象

```bash
# 置き換えが必要なファイルを検索
grep -r "from \"next/link\"" src/app/[communityId]/ --include="*.tsx"
```

主な置き換え対象:
- ナビゲーションリンク
- カード内のリンク
- ボタンリンク
- パンくずリスト

### テスト方法

1. 新しい URL（`/neo88/activities`）でアクセスできることを確認
2. 旧 URL（`/activities`）が新 URL にリダイレクトされることを確認
3. `CommunityLink` が正しく動作することを確認
4. ナビゲーションが正常に動作することを確認
5. LINE リッチメニューからのアクセスが正常に動作することを確認

### 注意事項

- この PR は変更量が多いため、慎重にレビューする
- ディレクトリ移動は git mv を使用して履歴を保持
- 移動後に import パスが正しいことを確認
- ビルドが通ることを確認してからマージ

### ロールバック手順

1. `NEXT_PUBLIC_NEW_ROUTING_ENABLED=false` に設定
2. ディレクトリを元に戻す（git revert）
3. Phase 3 の準備コードは残っていても問題なし

### デプロイ手順

1. PR をマージ
2. 環境変数 `NEXT_PUBLIC_NEW_ROUTING_ENABLED=true` を設定
3. デプロイ
4. 動作確認
5. 問題があれば環境変数を false に戻してロールバック
