import {
  DEFAULT_OPEN_GRAPH_IMAGE as COMMUNITY_DEFAULT_OPEN_GRAPH_IMAGE,
  DEFAULT_OPEN_GRAPH as COMMUNITY_DEFAULT_OPEN_GRAPH,
} from "./communityMetadata";

// 互換性のために既存の定数をエクスポート
// ＃NOTE: 内部では communityMetadata.ts の値を使用
// #TODO: こちらのファイルを削除して、communityMetadata.ts を直接使用するように変更する

// communityMetadata.ts からインポートした値を使用
export const DEFAULT_OPEN_GRAPH_IMAGE = COMMUNITY_DEFAULT_OPEN_GRAPH_IMAGE;

// communityMetadata.ts からインポートした値を使用
export const DEFAULT_OPEN_GRAPH = COMMUNITY_DEFAULT_OPEN_GRAPH;
