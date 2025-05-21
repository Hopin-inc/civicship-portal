"use client";

import { useCallback, useEffect, useReducer } from "react";
import { BasePin } from "@/app/places/data/type";

/* --------------------------------------------
 * Reducer + 型定義
 * ------------------------------------------ */

interface MapState {
  markers: BasePin[];
  places: BasePin[];
  center: google.maps.LatLngLiteral;
  map: google.maps.Map | null;
  isLoaded: boolean;
  error: string | null;
}

type MapAction =
  | { type: "SET_MARKERS"; payload: { markers: BasePin[]; places: BasePin[] } }
  | { type: "SET_CENTER"; payload: google.maps.LatLngLiteral }
  | { type: "SET_MAP"; payload: google.maps.Map | null }
  | { type: "SET_LOADED"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: MapState = {
  markers: [],
  places: [],
  center: { lat: 33.75, lng: 133.5 },
  map: null,
  isLoaded: false,
  error: null,
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
    default:
      return state;
  }
};

/* --------------------------------------------
 * 外部 API 型
 * ------------------------------------------ */

interface MapComponentProps {
  placePins: BasePin[];
  selectedPlaceId: string | null;
}

/* --------------------------------------------
 * 分離された副作用関数
 * ------------------------------------------ */

const initializeMarkers = (places: BasePin[], dispatch: React.Dispatch<MapAction>) => {
  try {
    dispatch({ type: "SET_MARKERS", payload: { markers: places, places } });
  } catch (error) {
    console.error("Error processing map data:", error);
    dispatch({ type: "SET_ERROR", payload: "マップデータの処理中にエラーが発生しました" });
  }
};

const panToSelectedMarker = (
  selectedPlaceId: string | null,
  map: google.maps.Map | null,
  markers: BasePin[],
) => {
  if (!map || !selectedPlaceId) return;

  const marker = markers.find((m) => m.id === selectedPlaceId);
  if (!marker) return;

  // カードシートの高さを考慮して、マーカーが画面の上半分に表示されるように調整
  // これにより、マーカーとカードの両方が同時に見えるようになる
  const sheetHeight = window.innerHeight * 0.45;
  const mapDiv = map.getDiv();
  const mapHeight = mapDiv.clientHeight;

  // マップの高さに対するオフセット比率を計算
  const offsetRatio = (sheetHeight * 0.3) / mapHeight;
  const bounds = map.getBounds();
  const markerLatLng = new google.maps.LatLng(marker.latitude, marker.longitude);

  map.setZoom(17);

  if (bounds) {
    const latSpan = bounds.getNorthEast().lat() - bounds.getSouthWest().lat();
    const latOffset = latSpan * offsetRatio;

    // マーカーの位置から少し上にずらした新しい中心位置を設定
    const newCenter = new google.maps.LatLng(marker.latitude - latOffset, marker.longitude);
    map.panTo(newCenter);
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
    panToSelectedMarker(selectedPlaceId, state.map, state.markers);
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

  return {
    ...state,
    onLoad,
    onUnmount,
    setLoaded,
  };
};
