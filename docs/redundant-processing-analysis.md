# 冗長な処理と不要な抽象化の分析

## 現在の状態

現在のCivicship Portalリポジトリでは、データ変換ロジックに関して以下の冗長な処理や不要な抽象化が確認されました。

### 1. 同様の変換ロジックの重複

#### 日付フォーマット関数の重複

日付フォーマット関数が複数の場所で定義されています：

1. **`utils/date.ts`**:
   ```typescript
   export const formatDate = (date: string | Date): string => {
     return dayjs(date).format("YYYY/MM/DD");
   };
   
   export const formatDateTime = (date: string | Date): string => {
     return dayjs(date).format("YYYY/MM/DD HH:mm");
   };
   ```

2. **`utils/walletUtils.ts`**:
   ```typescript
   export const formatTransactionDate = (date: string): string => {
     return dayjs(date).format("YYYY/MM/DD HH:mm");
   };
   ```

3. **コンポーネント内のインライン変換**:
   ```tsx
   // src/app/components/elements/DateTimePicker.tsx
   {date ? (
     dayjs(date).format("YYYY/MM/DD HH:mm")
   ) : (
     <span>{props.placeholder ?? "日時を選択"}</span>
   )}
   ```

#### 通貨フォーマット関数の重複

通貨フォーマット関数が複数の場所で定義されています：

1. **`utils/walletUtils.ts`**:
   ```typescript
   export const formatCurrency = (amount: number): string => {
     return new Intl.NumberFormat('ja-JP').format(amount);
   };
   ```

2. **コンポーネント内のインライン変換**:
   ```tsx
   // src/app/components/features/opportunity/OpportunityCard.tsx
   <p>{new Intl.NumberFormat('ja-JP').format(price)}円</p>
   ```

### 2. 複雑な入れ子変換

以下のような複雑な入れ子変換が存在し、可読性と保守性を低下させています：

```typescript
// src/transformers/activity.ts
export const transformActivity = (activity: GqlActivity): Activity => {
  return {
    id: activity.id,
    description: activity.description,
    remark: activity.remark,
    startsAt: new Date(activity.startsAt),
    endsAt: new Date(activity.endsAt),
    isPublic: activity.isPublic,
    event: activity.event ? {
      id: activity.event.id,
      description: activity.event.description
    } : null,
    user: activity.user ? {
      id: activity.user.id,
      name: displayName(activity.user),
    } : null,
    organization: activity.organization ? {
      id: activity.organization.id,
      name: activity.organization.name
    } : null,
    displayDuration: displayDuration(activity.startsAt, activity.endsAt)
  };
};
```

この例では、複数のネストされた条件分岐と変換が一つの関数内に存在しています。

### 3. 不要な抽象化

一部の変換関数が過度に抽象化されており、具体的な用途が不明確です：

```typescript
// src/hooks/features/wallet/useTransactionHistory.ts
const formatTransactions = (data: GqlWalletTransactionsQuery) => {
  return data.walletTransactions.edges.map((edge) => {
    const node = edge.node;
    return {
      id: node.id,
      amount: node.amount,
      type: node.type,
      description: getTransactionDescription(node),
      date: formatTransactionDate(node.createdAt),
      fromUser: node.fromUser,
      toUser: node.toUser
    };
  });
};
```

この関数は単純なマッピング操作ですが、別の関数として抽象化されています。

## 改善案

### 1. 共通ユーティリティ関数の統合

日付フォーマットや通貨フォーマットなどの共通ユーティリティ関数を統合します：

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

### 2. 複雑な変換関数の分割

複雑な変換関数を小さな関数に分割し、パイプライン処理化します：

```typescript
// src/transformers/activity.ts
export const transformActivityEvent = (event: GqlEvent | null): ActivityEvent | null => {
  if (!event) return null;
  return {
    id: event.id,
    description: event.description
  };
};

export const transformActivityUser = (user: GqlUser | null): ActivityUser | null => {
  if (!user) return null;
  return {
    id: user.id,
    name: displayName(user)
  };
};

export const transformActivityOrganization = (org: GqlOrganization | null): ActivityOrganization | null => {
  if (!org) return null;
  return {
    id: org.id,
    name: org.name
  };
};

export const transformActivity = (activity: GqlActivity): Activity => {
  return {
    id: activity.id,
    description: activity.description,
    remark: activity.remark,
    startsAt: new Date(activity.startsAt),
    endsAt: new Date(activity.endsAt),
    isPublic: activity.isPublic,
    event: transformActivityEvent(activity.event),
    user: transformActivityUser(activity.user),
    organization: transformActivityOrganization(activity.organization),
    displayDuration: displayDuration(activity.startsAt, activity.endsAt)
  };
};
```

### 3. 不要な抽象化の削除

単純なマッピング操作を不要に抽象化せず、インラインで実装します：

```typescript
// src/hooks/features/wallet/useTransactionHistory.ts
export const useTransactionHistory = () => {
  const { data, loading, error } = useWalletTransactionsQuery();
  
  const transactions = useMemo(() => {
    if (!data?.walletTransactions?.edges) return [];
    
    return data.walletTransactions.edges.map((edge) => {
      const node = edge.node;
      return {
        id: node.id,
        amount: node.amount,
        type: node.type,
        description: getTransactionDescription(node),
        date: formatDateTime(node.createdAt),
        fromUser: node.fromUser,
        toUser: node.toUser
      };
    });
  }, [data]);
  
  return { transactions, loading, error };
};
```

## 具体的な実装例

### 日付フォーマット関数の統合

```typescript
// src/utils/date.ts
import dayjs from 'dayjs';

export const formatDate = (date: string | Date, format: string = "YYYY/MM/DD"): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, "YYYY/MM/DD HH:mm");
};

export const displayDuration = (startDate: string | Date, endDate: string | Date): string => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  
  if (start.format('YYYY/MM/DD') === end.format('YYYY/MM/DD')) {
    return `${start.format('YYYY/MM/DD HH:mm')} - ${end.format('HH:mm')}`;
  } else {
    return `${start.format('YYYY/MM/DD HH:mm')} - ${end.format('YYYY/MM/DD HH:mm')}`;
  }
};
```

### 通貨フォーマット関数の統合

```typescript
// src/utils/format.ts
export const formatCurrency = (amount: number, locale: string = 'ja-JP', currency?: string): string => {
  if (currency) {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  }
  return new Intl.NumberFormat(locale).format(amount);
};
```

## 結論

冗長な処理と不要な抽象化を排除するために、以下の原則を適用することが推奨されます：

1. **共通ユーティリティ関数の統合**: 日付フォーマットや通貨フォーマットなどの共通ユーティリティ関数を統合し、重複を排除
2. **複雑な変換関数の分割**: 複雑な変換関数を小さな関数に分割し、可読性と保守性を向上
3. **不要な抽象化の削除**: 単純なマッピング操作を不要に抽象化せず、インラインで実装

これらの原則に従うことで、コードの可読性、保守性、再利用性が向上します。
