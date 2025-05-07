# データ整形ロジックの健全性チェック：調査結果と改善提案

## 調査概要

Civicship Portalリポジトリの`transformers/`、`hooks/`、`graphql/`ディレクトリに含まれるデータ整形ロジックの健全性を調査しました。以下の観点から分析を行い、問題点と改善案をまとめています。

1. データ取得・変換処理における責務の分離
2. transformersとhooks間の役割の重複・混在
3. GraphQLクエリやスキーマとtransformers/hooks側との整合性
4. コンポーネント側で必要なデータ形式への整形の適切性
5. 冗長な処理や不要な抽象化の有無
6. 型の安全性（TypeScript）の確保

## 1. データ取得・変換処理における責務の分離

### 現状と問題点

現在のコードベースでは、データ取得と変換処理の責務分離が不十分です：

- コンポーネントが直接GraphQLクエリを使用してデータを取得している
- 変換ロジックがコンポーネント内に直接記述されている
- `utils/`ディレクトリにドメイン固有のロジックが混在している
- 専用の`transformers/`ディレクトリが十分に活用されていない

### 改善案

以下の階層構造による明確な責務分離を提案します：

1. **GraphQLクエリ定義**: `graphql/`ディレクトリにクエリを定義
2. **データ取得**: `hooks/features/*/use*Query.ts`でGraphQLデータを取得
3. **データ変換**: `transformers/*.ts`で純粋関数としてデータを変換
4. **ビジネスロジック**: `hooks/features/*/use*Controller.ts`で状態管理と処理を実装
5. **公開API**: `hooks/features/*/use*.ts`でコンポーネント向けの簡略化されたインターフェースを提供
6. **表示**: コンポーネントは公開APIを使用してデータを表示

## 2. transformersとhooks間の役割の重複・混在

### 現状と問題点

transformersとhooks間で役割の重複や混在が見られます：

- 同じデータ構造の型定義が複数の場所に存在している
- 変換ロジックが`hooks/`ディレクトリ内にも存在している
- `utils/`ディレクトリにドメイン固有の変換ロジックが存在している

### 改善案

以下の原則に従って役割を明確に分離することを提案します：

- **transformers/**: データ変換ロジックのみを担当
  - 入力と出力が明確な純粋関数として実装
  - ドメイン別にファイルを分割（例：`activity.ts`, `user.ts`）

- **hooks/**: データ取得、状態管理、ビジネスロジックを担当
  - クエリフック：データ取得のみ
  - コントローラーフック：ビジネスロジックと状態管理
  - 公開APIフック：コンポーネント向けインターフェース

- **utils/**: 汎用的なユーティリティ関数のみを担当
  - ドメイン非依存の関数のみを配置
  - 日付変換、配列操作、型ガードなど

## 3. GraphQLクエリやスキーマとtransformers/hooks側との整合性

### 現状と問題点

GraphQLスキーマとtransformers/hooks間の整合性に関して以下の問題が確認されました：

- 型の一貫性が保たれていない箇所がある
- GraphQLの`Maybe<T>`とアプリケーション型の`T | null`の変換が明示的でない
- GraphQLフラグメントが活用されていない

### 改善案

以下の改善を提案します：

- **型の一貫性の確保**:
  - GraphQL型とアプリケーション型の間の明示的な変換関数の実装
  - 共通の型定義を`types/`ディレクトリに集約

- **GraphQLフラグメントの活用**:
  - 共通のフィールドに対してGraphQLフラグメントを定義
  - クエリ間でフラグメントを再利用

```typescript
const ACTIVITY_FRAGMENT = gql`
  fragment ActivityFields on Activity {
    id
    description
    remark
    startsAt
    endsAt
    isPublic
    event {
      id
      description
    }
    user {
      id
      firstName
      middleName
      lastName
    }
    organization {
      id
      name
    }
  }
`;
```

## 4. コンポーネント側で必要なデータ形式への整形の適切性

### 現状と問題点

コンポーネントが必要とするデータ形式への整形に関して以下の問題が確認されました：

- 不要なデータがコンポーネントに渡されている
- コンポーネント内で変換ロジックが直接実装されている
- 再利用可能な変換関数が不足している

### 改善案

以下の改善を提案します：

- **コンポーネント専用の変換関数の作成**:
  - 各コンポーネントが必要とするデータ形式に特化した変換関数を実装
  - 不要なフィールドを除外し、必要なフィールドのみを含む

```typescript
// src/transformers/activity.ts
export interface ActivityCardProps {
  id: string;
  title: string;
  duration: string;
  userName: string;
  organizationName: string;
}

export const mapActivityToCardProps = (activity: Activity): ActivityCardProps => ({
  id: activity.id,
  title: activity.description || '',
  duration: displayDuration(activity.startsAt, activity.endsAt),
  userName: activity.user ? displayName(activity.user) : "ユーザー未設定",
  organizationName: activity.organization ? activity.organization.name : "団体未設定",
});
```

- **hooksを通じたデータ提供**:
  - コンポーネントはhooksを通じて整形済みのデータを取得
  - コンポーネント内での変換ロジックを排除

## 5. 冗長な処理や不要な抽象化の有無

### 現状と問題点

以下の冗長な処理や不要な抽象化が確認されました：

- 日付フォーマット関数や通貨フォーマット関数の重複
- 複雑な入れ子変換関数
- 単純なマッピング操作の不要な抽象化

### 改善案

以下の改善を提案します：

- **共通ユーティリティ関数の統合**:
  - 日付フォーマットや通貨フォーマットなどの共通ユーティリティ関数を統合
  - 重複を排除し、再利用性を向上

```typescript
// src/utils/format.ts
export const formatDate = (date: string | Date, format: string = "YYYY/MM/DD"): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, "YYYY/MM/DD HH:mm");
};

export const formatCurrency = (amount: number, locale: string = 'ja-JP'): string => {
  return new Intl.NumberFormat(locale).format(amount);
};
```

- **複雑な変換関数の分割**:
  - 複雑な変換関数を小さな関数に分割
  - 可読性と保守性を向上

## 6. 型の安全性（TypeScript）の確保

### 現状と問題点

型の安全性に関して以下の問題が確認されました：

- `any`型の使用
- 明示的な戻り値の型アノテーションの不足
- 型アサーションの過剰な使用
- オプショナルチェーンの不足

### 改善案

以下の改善を提案します：

- **`any`型の排除**:
  - 具体的な型を定義し、`any`型を排除

```typescript
// 改善前
.filter((edge: any) => edge?.node)
.map((edge: any) => transformActivity(edge.node));

// 改善後
interface ActivityEdge {
  node: GqlActivity;
}

.filter((edge: ActivityEdge) => edge?.node)
.map((edge: ActivityEdge) => transformActivity(edge.node));
```

- **明示的な戻り値の型アノテーションの追加**:
  - すべての関数に明示的な戻り値の型アノテーションを追加

```typescript
// 改善前
export const useActivities = (options = {}) => {
  return useActivitiesController(options);
};

// 改善後
export interface UseActivitiesResult {
  activities: Activity[];
  loading: boolean;
  error: Error | undefined;
}

export const useActivities = (options = {}): UseActivitiesResult => {
  return useActivitiesController(options);
};
```

## 優先度付け改善提案

以下の優先順位で改善を進めることを提案します：

### 1. 型の安全性の向上（最優先）
- `any`型の排除
- 明示的な戻り値の型アノテーションの追加
- オプショナルチェーンの適切な使用

### 2. 責務分離の明確化（高優先）
- `transformers/`ディレクトリの整備と活用
- `hooks/`の階層構造の整理
- `utils/`からドメイン固有ロジックの移動

### 3. 冗長な処理の排除（中優先）
- 共通ユーティリティ関数の統合
- 複雑な変換関数の分割

### 4. コンポーネントデータ整形の最適化（中優先）
- コンポーネント専用の変換関数の作成
- hooksを通じたデータ提供

### 5. GraphQLスキーマとの整合性向上（低優先）
- 型の一貫性の確保
- GraphQLフラグメントの活用

## 実装計画

以下のステップで実装を進めることを提案します：

1. **型の安全性の向上**:
   - `any`型の排除と適切なインターフェース定義
   - 明示的な戻り値の型アノテーションの追加

2. **責務分離の明確化**:
   - `transformers/`ディレクトリの整備
   - `utils/`からドメイン固有ロジックの移動
   - `hooks/`の階層構造の整理

3. **冗長な処理の排除**:
   - 共通ユーティリティ関数の統合
   - 複雑な変換関数の分割

4. **コンポーネントデータ整形の最適化**:
   - コンポーネント専用の変換関数の作成
   - コンポーネントのリファクタリング

5. **GraphQLスキーマとの整合性向上**:
   - GraphQLフラグメントの定義と活用
   - 型の一貫性の確保

## まとめ

Civicship Portalリポジトリのデータ整形ロジックには、型の安全性、責務分離、冗長な処理、コンポーネントデータ整形、GraphQLスキーマとの整合性に関する課題が確認されました。

これらの課題に対して、明確な責務分離、型の安全性の向上、冗長な処理の排除、コンポーネントデータ整形の最適化、GraphQLスキーマとの整合性向上を提案します。

優先度に従って段階的に実装を進めることで、コードの保守性、拡張性、可読性が向上し、バグの発生リスクが低減されます。
