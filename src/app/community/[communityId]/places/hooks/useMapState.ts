"use client";

import { useCallback, useEffect, useReducer } from "react";
import { IPlacePin } from "@/app/community/[communityId]/places/data/type";
import { logger } from "@/lib/logging";

const INITIAL_CENTER_COORDINATE = { lat: 33.0, lng: 133.5 };

/* --------------------------------------------
 * Reducer + 型定義
 * ------------------------------------------ */

interface MapState {
  markers: IPlacePin[];
  places: IPlacePin[];
  center: google.maps.LatLngLiteral;
  map: google.maps.Map | null;
  isLoaded: boolean;
  error: string | null;
  zoom: number;
}

type MapAction =
  | { type: "SET_MARKERS"; payload: { markers: IPlacePin[]; places: IPlacePin[] } }
  | { type: "SET_CENTER"; payload: google.maps.LatLngLiteral }
  | { type: "SET_MAP"; payload: google.maps.Map | null }
  | { type: "SET_LOADED"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ZOOM"; payload: number };

const initialState: MapState = {
  markers: [],
  places: [],
  center: INITIAL_CENTER_COORDINATE,
  map: null,
  isLoaded: false,
  error: null,
  zoom: 8,
};

const mapReducer = (state: MapState, action: MapAction): MapState => {
  switch (action.type) {
    case "SET_MARKERS":
      return { ...state, markers: action.payload.markers, places: action.payload.places };
    case "SET_CENTER":
      return { ...state, center: action.payload };
    case "SET_MAP":
      return { ...state, map: action.payload };
    case "SET_LOADED":
      return { ...state, isLoaded: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_ZOOM":
      return { ...state, zoom: action.payload };
    default:
      return state;
  }
};

/* --------------------------------------------
 * 外部 API 型
 * ------------------------------------------ */

interface MapComponentProps {
  placePins: IPlacePin[];
  selectedPlaceId: string | null;
}

/* --------------------------------------------
 * 分離された副作用関数
 * ------------------------------------------ */

const initializeMarkers = (places: IPlacePin[], dispatch: React.Dispatch<MapAction>) => {
  try {
    dispatch({ type: "SET_MARKERS", payload: { markers: places, places } });
  } catch (error) {
    logger.error("Error processing map data", {
      error: error instanceof Error ? error.message : String(error),
      component: "useMapState"
    });
    dispatch({ type: "SET_ERROR", payload: "マップデータの処理中にエラーが発生しました" });
  }
};

const panToSelectedMarker = (
  selectedPlaceId: string | null,
  map: google.maps.Map | null,
  markers: IPlacePin[],
  dispatch?: React.Dispatch<MapAction>,
) => {
  if (!map || !selectedPlaceId) return;

  const marker = markers.find((m) => m.id === selectedPlaceId);
  if (!marker) return;

  // ヘッダー・カード・下部余白を合計した分だけ地図中心を上にずらす（カード高さは固定値）
  const HEADER_HEIGHT = 64; // px
  const CARD_HEIGHT = 324; // px
  const CARD_BOTTOM_MARGIN = 32; // px
  const cardAndMarginHeight = CARD_HEIGHT + CARD_BOTTOM_MARGIN;
  const mapDiv = map.getDiv();
  const mapHeight = mapDiv.clientHeight;
  const bounds = map.getBounds();
  if (!bounds) return;
  const latSpan = bounds.getNorthEast().lat() - bounds.getSouthWest().lat();
  // 画面全体の高さに対するオフセット比率
  const offsetPx = HEADER_HEIGHT + cardAndMarginHeight / 2;
  const offsetRatio = offsetPx / mapHeight;
  const latOffset = latSpan * offsetRatio;

  if (dispatch) {
    dispatch({ type: "SET_ZOOM", payload: 10 });
  }

  // マーカーの位置からオフセット分だけ上にずらした新しい中心位置を設定
  const newCenter = new google.maps.LatLng(marker.latitude - latOffset, marker.longitude);
  map.panTo(newCenter);
  if (dispatch) {
    dispatch({ type: "SET_CENTER", payload: { lat: newCenter.lat(), lng: newCenter.lng() } });
  }
};

/* --------------------------------------------
 * メインフック
 * ------------------------------------------ */

export const useMapState = ({ placePins, selectedPlaceId }: MapComponentProps) => {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  useEffect(() => {
    initializeMarkers(placePins, dispatch);
  }, [placePins]);

  useEffect(() => {
    panToSelectedMarker(selectedPlaceId, state.map, state.markers, dispatch);
  }, [selectedPlaceId, state.map, state.markers]);

  const onLoad = useCallback((map: google.maps.Map) => {
    dispatch({ type: "SET_MAP", payload: map });
  }, []);

  const onUnmount = useCallback(() => {
    dispatch({ type: "SET_MAP", payload: null });
  }, []);

  const setLoaded = useCallback((isLoaded: boolean) => {
    dispatch({ type: "SET_LOADED", payload: isLoaded });
  }, []);

  // imperativeに中心を再調整する関数
  const recenterToSelectedMarker = () => {
    panToSelectedMarker(selectedPlaceId, state.map, state.markers, dispatch);
  };

  return {
    ...state,
    onLoad,
    onUnmount,
    setLoaded,
    recenterToSelectedMarker,
  };
};
