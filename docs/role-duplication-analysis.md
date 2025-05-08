# 役割の重複・混在の分析

## 現在の状態

現在のCivicship Portalリポジトリでは、transformersとhooks間で役割の重複や混在が見られます。以下に主な問題点を示します：

### 1. 型定義の重複

同じデータ構造の型定義が複数の場所に存在しています：

- `hooks/features/wallet/useTransactionHistory.ts`と`transformers/wallet.ts`で類似のトランザクション型定義
- `hooks/features/activity/useOpportunityController.ts`と`transformers/opportunity.ts`で類似の機会型定義

### 2. 変換ロジックの混在

データ変換ロジックが適切な場所に配置されていません：

- `hooks/`ディレクトリ内に変換ロジックが存在（例：`useOpportunityController.ts`内の`mapOpportunityToCardProps`）
- コンポーネント内に直接変換ロジックが記述されている（例：`ActivityList.tsx`内での日付フォーマット）
- `utils/`ディレクトリにドメイン固有の変換ロジックが存在（例：`participationUtils.ts`）

### 3. 責務の不明確な分離

- `hooks/`がデータ取得と変換の両方を担当
- `transformers/`の使用が一貫していない
- コンポーネントが直接GraphQLクエリを使用

## 改善計画

### 1. 型定義の統一

- 共通の型定義を`types/index.ts`に移動
- GraphQL型とアプリケーション型の明確な区別
- 型変換を`transformers/`で一元管理

### 2. 変換ロジックの移動

以下の変換ロジックを`transformers/`に移動：

- `hooks/features/activity/useOpportunityController.ts`から`mapOpportunityToCardProps`を`transformers/opportunity.ts`へ
- `hooks/features/wallet/useTransactionHistory.ts`から変換関数を`transformers/wallet.ts`へ
- `utils/`から全てのドメイン固有変換ロジックを対応する`transformers/`ファイルへ

### 3. 責務の明確な分離

- `hooks/`は以下の役割に集中：
  - データ取得（Query hooks）
  - ビジネスロジックと状態管理（Controller hooks）
  - コンポーネント向けAPI（Public hooks）

- `transformers/`は以下の役割に集中：
  - データ変換ロジック
  - 型変換
  - フォーマット関数

## 具体的な実装例

### 変換前：

```typescript
// hooks/features/activity/useOpportunityController.ts
const mapOpportunityToCardProps = (node: Opportunity): OpportunityCardProps => ({
  id: node.id,
  title: node.title,
  price: node.feeRequired || null,
  location: node.place?.name || '場所未定',
  imageUrl: node.images?.[0] || null,
  community: {
    id: node.community?.id || '',
  },
  isReservableWithTicket: node.isReservableWithTicket || false,
});
```

### 変換後：

```typescript
// transformers/opportunity.ts
export const mapOpportunityToCardProps = (node: Opportunity): OpportunityCardProps => ({
  id: node.id,
  title: node.title,
  price: node.feeRequired || null,
  location: node.place?.name || '場所未定',
  imageUrl: node.images?.[0] || null,
  community: {
    id: node.community?.id || '',
  },
  isReservableWithTicket: node.isReservableWithTicket || false,
});

// hooks/features/activity/useOpportunityController.ts
import { mapOpportunityToCardProps } from '@/transformers/opportunity';

export const useOpportunityController = () => {
  // ...
  const opportunityCardProps = useMemo(() => {
    return opportunity ? mapOpportunityToCardProps(opportunity) : null;
  }, [opportunity]);
  // ...
};
```

## 結論

transformersとhooks間の役割の重複・混在を解消するために、以下の原則を適用します：

1. データ変換ロジックは全て`transformers/`に配置
2. 共通の型定義は`types/index.ts`に配置
3. `hooks/`はデータ取得、ビジネスロジック、状態管理に集中
4. コンポーネントは直接GraphQLクエリを使用せず、hooksを通じてデータにアクセス

この原則に従って実装することで、コードの保守性と拡張性が向上します。
