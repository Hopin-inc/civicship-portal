import { getCommunityIdFromEnv } from "./metadata";

// コミュニティごとのコンテンツ設定
interface CommunityContent {
  termsContent: string;
  // 将来的に他のコンテンツタイプを追加可能
}

// コミュニティごとのコンテンツ設定
const COMMUNITY_CONTENT: Record<string, CommunityContent> = {
  neo88: {
    termsContent: `
## 1．事前予約

- 参加には、事前の予約が必要です。
- 応募締切日前に定員に達したプログラムについては、応募を締め切らせていただきます。
- web会員でキャンセル待ち登録をされた方は、キャンセルをお知らせするメールの受信が可能です。

## 2．自己責任

- 参加者は、自己の責任でNEO四国88祭にご参加ください。
- NEO四国88祭実行委員会は、各プログラムにおける怪我や病気、事故などについて一切の責任を負いません。

## 3．プログラム主催者の指示など

- プログラム主催者及びNEO四国88祭実行委員会の指示・注意事項は、必ず守ってください。
- 指示・注意事項を守っていただけない場合は、プログラムの途中であっても参加をご遠慮いただくことがあります。

## 4．法令の遵守

- 国の定める法律を遵守してください。
  - 屋外を歩くプログラムについては、道路交通法・交通ルール・マナーを守ってください。
  - 未成年者の飲酒を伴うプログラムへの参加はご遠慮ください。
  - 飲酒運転は法律で禁じられています。

## 5．料金及び参加制限

- プログラムによっては、大人料金と子ども料金、組料金の設定があります。
- 中学生以上は大人料金、小学生以下は子ども料金です。
- 子ども料金の設定がない場合は、一律料金です。
- 小学生以下の方は必ず保護者同伴でご参加ください。

## 6．プログラムの中止及びコースの変更

- 天候の悪化によりプログラムの開催を中止、又は内容を変更する場合があります。
  - プログラムを中止するときは、主催者より参加者にご連絡します。

## 7．服装、持ち物

- 各プログラムに適した服装でお越しください。
  - 屋外を歩くプログラムについては、スニーカーやトレッキングシューズなど歩きやすいお履物でご参加ください。
  - 屋外のプログラムについては、防寒具や雨具をご持参ください。
  - 万一に備えて、健康保険証のコピーをご用意ください。

## 8．飲食

- 食材アレルギーがある方は、予約時及び当日スタッフにお申し出ください。

## 9．キャンセル

- やむを得ずキャンセルする場合は、必ず前日までに各プログラム主催者へご連絡ください。

## 10．web会員

- NEO四国88祭のプログラムにwebサイトからご予約いただくには、web会員に登録する必要があります。
- webサイトで会員登録を行うことで、webからの予約が可能になります。

## 11．その他

- 次に該当する場合には、NEO四国88祭実行委員会の判断により、参加をお断りすることがあります。
- 他の参加者、案内人、又は会場近隣住民などに対する迷惑行為があった場合。
- NEO四国88祭への参加が不適切であると認められた場合。
`,
  },
  default: {
    termsContent: `
## 1．事前予約

- 参加には、事前の予約が必要です。
- 応募締切日前に定員に達したプログラムについては、応募を締め切らせていただきます。
- web会員でキャンセル待ち登録をされた方は、キャンセルをお知らせするメールの受信が可能です。

## 2．自己責任

- 参加者は、自己の責任でご参加ください。
- 実行委員会は、各プログラムにおける怪我や病気、事故などについて一切の責任を負いません。

## 3．プログラム主催者の指示など

- プログラム主催者及び実行委員会の指示・注意事項は、必ず守ってください。
- 指示・注意事項を守っていただけない場合は、プログラムの途中であっても参加をご遠慮いただくことがあります。

## 4．法令の遵守

- 国の定める法律を遵守してください。
  - 屋外を歩くプログラムについては、道路交通法・交通ルール・マナーを守ってください。
  - 未成年者の飲酒を伴うプログラムへの参加はご遠慮ください。
  - 飲酒運転は法律で禁じられています。

## 5．料金及び参加制限

- プログラムによっては、大人料金と子ども料金、組料金の設定があります。
- 中学生以上は大人料金、小学生以下は子ども料金です。
- 子ども料金の設定がない場合は、一律料金です。
- 小学生以下の方は必ず保護者同伴でご参加ください。

## 6．プログラムの中止及びコースの変更

- 天候の悪化によりプログラムの開催を中止、又は内容を変更する場合があります。
  - プログラムを中止するときは、主催者より参加者にご連絡します。

## 7．服装、持ち物

- 各プログラムに適した服装でお越しください。
  - 屋外を歩くプログラムについては、スニーカーやトレッキングシューズなど歩きやすいお履物でご参加ください。
  - 屋外のプログラムについては、防寒具や雨具をご持参ください。
  - 万一に備えて、健康保険証のコピーをご用意ください。

## 8．飲食

- 食材アレルギーがある方は、予約時及び当日スタッフにお申し出ください。

## 9．キャンセル

- やむを得ずキャンセルする場合は、必ず前日までに各プログラム主催者へご連絡ください。

## 10．web会員

- プログラムにwebサイトからご予約いただくには、web会員に登録する必要があります。
- webサイトで会員登録を行うことで、webからの予約が可能になります。

## 11．その他

- 次に該当する場合には、実行委員会の判断により、参加をお断りすることがあります。
- 他の参加者、案内人、又は会場近隣住民などに対する迷惑行為があった場合。
- 参加が不適切であると認められた場合。
`,
  },
};

// 現在のコミュニティの利用規約を取得する関数
export function getTermsContent(): string {
  const communityId = getCommunityIdFromEnv();
  const content = COMMUNITY_CONTENT[communityId];

  if (!content || !content.termsContent) {
    console.warn(
      `Terms content for community "${communityId}" is not configured. Using default terms.`,
    );
    return COMMUNITY_CONTENT.default.termsContent;
  }

  return content.termsContent;
}
