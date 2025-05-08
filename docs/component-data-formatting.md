# コンポーネントデータ整形の最適化分析

## 現在の状態

現在のCivicship Portalリポジトリでは、コンポーネントが必要とするデータ形式への整形に関して、以下の状況が確認されました。

### コンポーネントのデータ要件

コンポーネントは主に以下の方法でデータを取得しています：

1. **直接GraphQLクエリを使用**:
   ```tsx
   // src/app/activities/ActivityList.tsx
   const { data } = useQuery(GET_ACTIVITIES, {
     variables: {
       filter: { isPublic: true },
       sort: { startsAt: SortDirection.Desc },
       first: 10,
     },
     fetchPolicy: "no-cache",
   });
   ```

2. **ユーティリティ関数を使用したインラインの変換**:
   ```tsx
   // src/app/activities/ActivityList.tsx
   <p className="flex gap-1">
     <Clock />
     {displayDuration(activity.startsAt, activity.endsAt)}
   </p>
   <p className="flex gap-1">
     <User />
     {activity.user ? displayName(activity.user) : "ユーザー未設定"}
   </p>
   ```

3. **hooksを通じたデータ取得**:
   ```tsx
   // src/app/components/elements/CurrentUserInfo.tsx
   const { currentUser } = useFirebaseAuth();
   ```

### データ整形の効率性

#### 良い例

1. **OpportunityCardProps変換**:
   ```typescript
   // src/transformers/opportunity.ts
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
   ```

   この例では、コンポーネントが必要とする正確なデータのみを抽出し、適切なデフォルト値を設定しています。

2. **ユーザープロフィールデータの変換**:
   ```typescript
   // src/transformers/user.ts
   export const formatSimpleUserProfileData = (userData: any) => {
     if (!userData?.user) return null;
     
     const { user } = userData;
     return {
       id: user.id,
       name: user.name,
       image: user.image,
       bio: user.bio || '',
       currentPrefecture: user.currentPrefecture,
       socialLinks: [
         { type: 'facebook', url: user.urlFacebook || null },
         { type: 'instagram', url: user.urlInstagram || null },
         { type: 'x', url: user.urlX || null },
         { type: 'youtube', url: user.urlYoutube || null },
         { type: 'website', url: user.urlWebsite || null }
       ]
     };
   };
   ```

   この例では、複雑なユーザーデータを、UIコンポーネントが必要とするシンプルな形式に変換しています。

#### 問題のある例

1. **不要なデータの受け渡し**:
   ```tsx
   // src/app/activities/ActivityList.tsx
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
             // ...
           </Card>
         </li>
       )
     );
   })}
   ```

   この例では、GraphQLから取得した生のデータをそのままコンポーネントに渡しており、コンポーネントが実際に使用しないフィールドも含まれています。

2. **コンポーネント内での変換ロジック**:
   ```tsx
   // src/app/components/elements/DateTimePicker.tsx
   {date ? (
     dayjs(date).format("YYYY/MM/DD HH:mm")
   ) : (
     <span>{props.placeholder ?? "日時を選択"}</span>
   )}
   ```

   この例では、日付フォーマット変換がコンポーネント内で直接行われており、再利用性が低下しています。

## 改善案

### 1. コンポーネント専用の変換関数の作成

各コンポーネントが必要とするデータ形式に特化した変換関数を`transformers/`ディレクトリに作成します：

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

### 2. hooksを通じたデータ提供

コンポーネントがGraphQLクエリを直接使用するのではなく、hooksを通じて整形済みのデータを取得するようにします：

```tsx
// src/app/activities/ActivityList.tsx
const ActivityList: React.FC = () => {
  const { activities, loading, error } = useActivities();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {activities.map((activity) => (
        <ActivityCard key={activity.id} {...activity} />
      ))}
    </ul>
  );
};
```

### 3. 共通の表示用ユーティリティの集約

日付フォーマットなどの共通表示ロジックを`utils/`ディレクトリに集約し、コンポーネント間で再利用します：

```typescript
// src/utils/date.ts
export const formatDateTime = (date: Date | string, format: string = "YYYY/MM/DD HH:mm"): string => {
  return dayjs(date).format(format);
};
```

## 結論

コンポーネントデータ整形の最適化には、以下の原則を適用することが推奨されます：

1. **コンポーネント専用の変換関数**: 各コンポーネントが必要とする正確なデータ形式に変換する関数を`transformers/`に実装
2. **hooksを通じたデータ提供**: コンポーネントは直接GraphQLクエリを使用せず、hooksを通じて整形済みのデータを取得
3. **不要なデータの排除**: コンポーネントが使用しないフィールドは変換時に除外
4. **共通表示ロジックの集約**: 日付フォーマットなどの共通表示ロジックを`utils/`に集約

これらの原則に従うことで、コンポーネントのデータ要件が明確になり、パフォーマンスと保守性が向上します。
