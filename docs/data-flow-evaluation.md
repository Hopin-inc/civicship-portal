# データ整形ロジックの健全性評価

## 現在の状態

現在のCivicship Portalリポジトリ（masterブランチ）では、データ整形ロジックの責務分離が不十分です。以下の問題点が確認されました：

### 現在のデータフロー

1. GraphQLクエリは`graphql/`ディレクトリで定義されています
2. コンポーネントが直接Apollo `useQuery`を使用してデータを取得しています
3. コンポーネントが直接データ変換を行っています
4. 一部の変換ロジックは`utils/`ディレクトリに存在しています
5. 専用の`transformers/`ディレクトリが存在しません

### 問題点

1. **責務の分離不足**:
   - データ取得、変換、表示ロジックがコンポーネント内で混在しています
   - 例: `src/app/activities/ActivityList.tsx`では、GraphQLクエリの使用、データ変換、表示が混在しています

2. **変換ロジックの分散**:
   - 変換ロジックが`utils/`ディレクトリと各コンポーネント内に分散しています
   - 例: 日付フォーマット関数が`utils/index.ts`に存在し、コンポーネントで直接使用されています

3. **型の安全性の問題**:
   - GraphQLの型とアプリケーションの型の間の変換が明示的に行われていません
   - 例: `ActivityList.tsx`では、GraphQLから取得したデータを直接使用しています

## 理想的なデータフロー

理想的なデータフローは以下のようになります：

1. **GraphQLクエリ定義**: `graphql/`ディレクトリにクエリを定義
2. **データ取得**: `hooks/features/*/use*Query.ts`でGraphQLデータを取得
3. **データ変換**: `transformers/*.ts`で純粋関数としてデータを変換
4. **ビジネスロジック**: `hooks/features/*/use*Controller.ts`で状態管理と処理を実装
5. **公開API**: `hooks/features/*/use*.ts`でコンポーネント向けの簡略化されたインターフェースを提供
6. **表示**: コンポーネントは公開APIを使用してデータを表示

## 各レイヤーの理想的な責務

- **`graphql/`**: クエリ定義のみ
- **`hooks/*Query.ts`**: データ取得のみ
- **`transformers/`**: データ変換ロジックのみ
- **`hooks/*Controller.ts`**: ビジネスロジックと状態管理
- **`hooks/*.ts`**: コンポーネント向け公開API

## 改善計画

1. **`transformers/`ディレクトリの作成と実装**:
   - ドメイン別の変換関数を実装（例: `activity.ts`, `user.ts`など）
   - `utils/`から変換ロジックを移動

2. **`hooks/`ディレクトリの構造化**:
   - 機能別のディレクトリ構造を作成（例: `hooks/features/activity/`）
   - クエリフック、コントローラーフック、公開APIフックの実装

3. **コンポーネントのリファクタリング**:
   - 直接のGraphQLクエリ使用を公開APIフックに置き換え
   - 変換ロジックをコンポーネントから削除

4. **型の安全性の向上**:
   - GraphQL型とアプリケーション型の間の明示的な変換
   - 適切なインターフェース定義

## 具体的な例

### 現在の実装（問題あり）

```tsx
// src/app/activities/ActivityList.tsx
const ActivityList: React.FC = () => {
  const { data } = useQuery(GET_ACTIVITIES, {
    variables: {
      filter: { isPublic: true },
      sort: { startsAt: SortDirection.Desc },
      first: 10,
    },
    fetchPolicy: "no-cache",
  });

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {data?.activities.edges?.map((e) => {
        const activity = e?.node;
        return (
          activity && (
            <li key={activity.id} className="list-none ml-0">
              <Card>
                <CardHeader>
                  <CardTitle>{activity.id}</CardTitle>
                  {activity.event && (
                    <CardDescription>{activity.event?.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col gap-1 text-muted-foreground">
                  <p className="flex gap-1">
                    <Clock />
                    {displayDuration(activity.startsAt, activity.endsAt)}
                  </p>
                  // ...
                </CardContent>
              </Card>
            </li>
          )
        );
      })}
    </ul>
  );
};
```

### 理想的な実装

```tsx
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
      name: `${activity.user.lastName} ${activity.user.firstName}`,
    } : null,
    organization: activity.organization ? {
      id: activity.organization.id,
      name: activity.organization.name
    } : null
  };
};

// src/hooks/features/activity/useActivitiesQuery.ts
export const useActivitiesQuery = () => {
  const { data, loading, error } = useQuery(GET_ACTIVITIES, {
    variables: {
      filter: { isPublic: true },
      sort: { startsAt: SortDirection.Desc },
      first: 10,
    },
    fetchPolicy: "no-cache",
  });
  
  return { data, loading, error };
};

// src/hooks/features/activity/useActivitiesController.ts
export const useActivitiesController = () => {
  const { data, loading, error } = useActivitiesQuery();
  
  const activities = useMemo(() => {
    if (!data?.activities.edges) return [];
    return data.activities.edges
      .filter(edge => edge?.node)
      .map(edge => transformActivity(edge!.node!));
  }, [data]);
  
  return { activities, loading, error };
};

// src/hooks/features/activity/useActivities.ts
export const useActivities = () => {
  return useActivitiesController();
};

// src/app/activities/ActivityList.tsx
const ActivityList: React.FC = () => {
  const { activities, loading, error } = useActivities();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {activities.map((activity) => (
        <li key={activity.id} className="list-none ml-0">
          <Card>
            <CardHeader>
              <CardTitle>{activity.id}</CardTitle>
              {activity.event && (
                <CardDescription>{activity.event.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-muted-foreground">
              <p className="flex gap-1">
                <Clock />
                {activity.startsAt && activity.endsAt ? 
                  displayDuration(activity.startsAt, activity.endsAt) : 
                  "日時未定"}
              </p>
              // ...
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
};
```

この改善計画を実装することで、データ整形ロジックの責務分離が明確になり、コードの保守性と拡張性が向上します。
