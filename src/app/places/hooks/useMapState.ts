'use client';

import { useReducer, useCallback, useEffect } from 'react';
import { BasePin, BaseCardInfo } from '@/app/places/data/type';
import { processMapData } from '@/utils/maps/markerUtils';

interface MapState {
  markers: BasePin[];
  places: BasePin[];
  center: google.maps.LatLngLiteral;
  map: google.maps.Map | null;
  isLoaded: boolean;
  error: string | null;
}

type MapAction =
  | { type: 'SET_MARKERS'; payload: { markers: BasePin[]; places: BasePin[] } }
  | { type: 'SET_CENTER'; payload: google.maps.LatLngLiteral }
  | { type: 'SET_MAP'; payload: google.maps.Map | null }
  | { type: 'SET_LOADED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: MapState = {
  markers: [],
  places: [],
  center: {
    lat: 33.75,  // 四国のおおよその中心緯度
    lng: 133.5,  // 四国のおおよその中心経度
  },
  map: null,
  isLoaded: false,
  error: null,
};

const mapReducer = (state: MapState, action: MapAction): MapState => {
  switch (action.type) {
    case 'SET_MARKERS':
      return {
        ...state,
        markers: action.payload.markers,
        places: action.payload.places,
      };
    case 'SET_CENTER':
      return {
        ...state,
        center: action.payload,
      };
    case 'SET_MAP':
      return {
        ...state,
        map: action.payload,
      };
    case 'SET_LOADED':
      return {
        ...state,
        isLoaded: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

interface MapComponentProps {
  places: BaseCardInfo[];
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string) => void;
}

export const useMapState = (props: MapComponentProps) => {
  const { places, selectedPlaceId } = props;
  const [state, dispatch] = useReducer(mapReducer, initialState);

  useEffect(() => {
    try {
      console.log('useMapState - places:', places);
      dispatch({ type: 'SET_MARKERS', payload: { markers: places, places } });
    } catch (error) {
      console.error('Error processing map data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'マップデータの処理中にエラーが発生しました' });
    }
  }, [places]);

  useEffect(() => {
    if (state.map && selectedPlaceId) {
      const selectedMarker = state.markers.find(marker => marker.id === selectedPlaceId);
      if (selectedMarker) {
        const sheetHeight = window.innerHeight * 0.45;
        
        const mapDiv = state.map.getDiv();
        const mapHeight = mapDiv.clientHeight;
        
        const markerLatLng = new google.maps.LatLng(
          selectedMarker.latitude,
          selectedMarker.longitude
        );
        
        state.map.setZoom(17);
        
        const offsetRatio = (sheetHeight * 0.25) / mapHeight;
        const bounds = state.map.getBounds();
        if (bounds) {
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          const latSpan = ne.lat() - sw.lat();
          const latOffset = latSpan * offsetRatio;
          
          const newCenter = new google.maps.LatLng(
            selectedMarker.latitude - latOffset,
            selectedMarker.longitude
          );
          
          state.map.panTo(newCenter);
        }
      }
    }
  }, [selectedPlaceId, state.markers, state.map]);

  const onLoad = useCallback((map: google.maps.Map) => {
    dispatch({ type: 'SET_MAP', payload: map });
  }, []);

  const onUnmount = useCallback(() => {
    dispatch({ type: 'SET_MAP', payload: null });
  }, []);

  const setLoaded = useCallback((isLoaded: boolean) => {
    dispatch({ type: 'SET_LOADED', payload: isLoaded });
  }, []);

  return {
    ...state,
    onLoad,
    onUnmount,
    setLoaded,
  };
};
