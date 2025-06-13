# civicship-portal

## Install

```shell
pnpm install
```

## Start development

Before starting up the server, make sure you have a connection with the `civicship-api` server running on `localhost:3000`.

```shell
# Start up server
pnpm dev:https
```

## Apply GraphQL queries and mutations

```shell
# Generate type definitions
pnpm gql:generate
```

## 新しいコミュニティの追加方法

新しいコミュニティを追加する場合は、以下の手順に従ってください。

### 1. コミュニティ設定の追加

`src/lib/communities/metadata.ts`の`COMMUNITY_BASE_CONFIG`に新しいコミュニティの設定を追加します。

```typescript
const COMMUNITY_BASE_CONFIG: Record<string, CommunityBaseConfig> = {
  // 新しいコミュニティを追加
  newcommunity: {
    domain: "https://www.newcommunity.app",
    title: "新しいコミュニティ名",
    faviconPath: "/community/newcommunity/favicon.ico",
    ogImagePath:
      "https://storage.googleapis.com/prod-civicship-storage-public/asset/newcommunity/ogp.jpg",
  },
};
```

### 2. コミュニティコンテンツの追加

`src/lib/communities/content.ts`の`COMMUNITY_CONTENT`に新しいコミュニティのコンテンツを追加します。

```typescript
const COMMUNITY_CONTENT: Record<string, CommunityContent> = {
  // 新しいコミュニティを追加
  newcommunity: {
    termsContent: `
## 1．事前予約
...
    `,
  },
  default: {
    // デフォルトコンテンツ
  },
};
```

### 3. 静的ファイルの追加

新しいコミュニティ用の静的ファイル（ファビコン、OGP画像など）を追加します。

```
/public/community/newcommunity/
  ├── favicon.ico
  ├── ogp.jpg
  └── ...
```

### 4. 環境変数の設定

#### ローカル開発環境

`.env`ファイルの`NEXT_PUBLIC_COMMUNITY_ID`を新しいコミュニティIDに設定します。

```
NEXT_PUBLIC_COMMUNITY_ID=newcommunity
```

#### デプロイ環境

GitHub Actionsのシークレットに新しいコミュニティIDを設定します。

1. GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」に移動
2. `NEXT_PUBLIC_COMMUNITY_ID`シークレットを追加または更新
3. 該当のブランチ（`develop`、`master`など）にデプロイする際に、このシークレットが使用されます

### 5. コミュニティ固有の機能制御

コミュニティによって機能を制御する場合は、以下のようにコードを記述します。

```typescript
import { COMMUNITY_ID } from "@/lib/communities/metadata";

// コミュニティ固有の機能制御
if (COMMUNITY_ID === "neo88") {
  // neo88コミュニティ専用の機能
} else {
  // その他のコミュニティ向けの機能
}
```

### 6. 動作確認

各コミュニティIDでアプリケーションが正しく動作することを確認してください。特に以下の点に注意してください。

- メタデータ（タイトル、OGP画像など）が正しく表示されるか
- コミュニティ固有の機能が適切に制御されているか
- 利用規約などのコンテンツが正しく表示されるか

### 注意事項

- コミュニティIDは一意であり、小文字のアルファベットと数字のみを使用してください
- 新しいコミュニティを追加する際は、既存の機能に影響がないことを確認してください
- コミュニティ固有の機能を実装する場合は、条件分岐を使用して明確に区別してください
