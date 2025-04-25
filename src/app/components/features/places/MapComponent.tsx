import { useCallback, useMemo, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import PlaceCardsSheet from './PlaceCardsSheet';
import { ContentType } from "@/types";

const containerStyle = {
  width: '100%',
  height: '100%'
};

interface Geo {
  latitude: string;
  longitude: string;
  placeId: string;
  placeImage: string;
  placeName: string;
}

interface MarkerData {
  position: {
    lat: number;
    lng: number;
  };
  id: string;
  placeImage: string;
  userImage: string;
  contentType: ContentType;
  name: string;
  placeId: string;
  participantCount: number;
}

interface MembershipNode {
  node: {
    user: {
      id: string;
      image: string;
      name: string;
      opportunitiesCreatedByMe?: {
        edges: Array<{
          node: {
            id: string;
            publishStatus: string;
          };
        }>;
      };
    };
    headline?: string;
    bio?: string;
    participationView: {
      participated: {
        geo: Geo[];
        totalParticipatedCount: number;
      };
      hosted: {
        geo: Geo[];
        totalParticipantCount: number;
      };
    };
  };
}

interface MarkerType {
  position: google.maps.LatLngLiteral;
  id: string;
  icon: {
    url: string;
    scaledSize: google.maps.Size;
    anchor: google.maps.Point;
  };
  contentType: ContentType;
}

// デフォルトの画像URL（CORS対応のサービスを使用）
const defaultImageUrl = "https://via.placeholder.com/200";

const drawCircleWithImage = async (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  radius: number,
  isMainImage: boolean
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const loadImage = (src: string) => {
      img.crossOrigin = "anonymous";
      img.src = src;
    };

    img.onload = () => {
      try {
        // 外側の円（グラデーション）
        const gradient = ctx.createRadialGradient(
          cx,
          cy,
          radius - 2,
          cx,
          cy,
          radius + 2
        );
        gradient.addColorStop(0, "#FFFFFF");
        gradient.addColorStop(1, "#EEEEEE");

        // 円を描画
        ctx.beginPath();
        ctx.arc(cx, cy, radius + 2, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();

        // 画像用のクリッピング
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.clip();

        // 画像を描画
        const imgSize = radius * 2;
        const imgAspect = img.width / img.height;
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;

        if (imgAspect > 1) {
          sourceWidth = sourceHeight;
          sourceX = (img.width - sourceWidth) / 2;
        } else if (imgAspect < 1) {
          sourceHeight = sourceWidth;
          sourceY = (img.height - sourceHeight) / 2;
        }

        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          cx - imgSize / 2,
          cy - imgSize / 2,
          imgSize,
          imgSize
        );

        ctx.restore();
        resolve();
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      // エラー時はデフォルト画像を試す
      if (img.src !== defaultImageUrl) {
        loadImage(defaultImageUrl);
      } else {
        // デフォルト画像も読み込めない場合は、グレーの円を描画
        try {
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
          ctx.fillStyle = isMainImage ? "#F0F0F0" : "#E0E0E0";
          ctx.fill();
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    };

    // 最初の画像読み込みを開始
    loadImage(img.src);
  });
};

// カスタムマーカーSVGを生成する関数
const createCustomMarkerIcon = async (placeImage: string, userImage: string, isSelected: boolean = false): Promise<google.maps.Icon | null> => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;

  // サイズ設定
  const displaySize = isSelected ? 80 : 56;  // 選択時は80px、非選択時は56px
  const scale = 2;        // 高解像度用のスケール

  const canvasWidth = displaySize * scale;
  const canvasHeight = displaySize * scale;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.width = `${displaySize}px`;
  canvas.style.height = `${displaySize}px`;

  context.scale(scale, scale);

  try {
    const centerX = displaySize / 2;
    const centerY = displaySize / 2;
    const mainRadius = displaySize / 2 - 2;
    const smallRadius = mainRadius * 0.4;
    const smallX = centerX + mainRadius * 0.5;
    const smallY = centerY + mainRadius * 0.5;

    // メイン画像の描画
    const mainImg = document.createElement("img");
    mainImg.src = placeImage || defaultImageUrl;
    await drawCircleWithImage(context, mainImg, centerX, centerY, mainRadius, true);

    // ユーザー画像の描画
    const userImg = document.createElement("img");
    userImg.src = userImage || defaultImageUrl;
    await drawCircleWithImage(context, userImg, smallX, smallY, smallRadius, false);

    return {
      url: canvas.toDataURL("image/png", 1.0),
      scaledSize: new google.maps.Size(displaySize, displaySize),
      anchor: new google.maps.Point(displaySize / 2, displaySize / 2),
    };

  } catch (error) {
    console.warn("Failed to create marker icon:", error);
    const centerX = displaySize / 2;
    const centerY = displaySize / 2;

    context.beginPath();
    context.arc(centerX, centerY, displaySize / 2 - 4, 0, 2 * Math.PI);
    context.fillStyle = "#F0F0F0";
    context.fill();
    context.strokeStyle = "#E0E0E0";
    context.lineWidth = 2;
    context.stroke();

    return {
      url: canvas.toDataURL("image/png", 1.0),
      scaledSize: new google.maps.Size(displaySize, displaySize),
      anchor: new google.maps.Point(displaySize / 2, displaySize / 2),
    };
  }
};

// カスタムマーカーコンポーネント
const CustomMarker: React.FC<{
  data: MarkerData;
  onClick: () => void;
  isSelected: boolean;
}> = ({ data, onClick, isSelected }) => {
  const [icon, setIcon] = useState<google.maps.Icon | null>(null);
  const [currentSize, setCurrentSize] = useState<number>(56);

  useEffect(() => {
    if (isSelected && currentSize !== 80) {
      setCurrentSize(80);
    } else if (!isSelected && currentSize !== 56) {
      // 選択が解除された時のみサイズを小さくする
      setCurrentSize(56);
    }
  }, [isSelected]);

  useEffect(() => {
    const loadIcon = async () => {
      const displaySize = currentSize;
      const scale = 2;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return;

      const canvasWidth = displaySize * scale;
      const canvasHeight = displaySize * scale;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.width = `${displaySize}px`;
      canvas.style.height = `${displaySize}px`;

      context.scale(scale, scale);

      try {
        const centerX = displaySize / 2;
        const centerY = displaySize / 2;
        const mainRadius = displaySize / 2 - 2;
        const smallRadius = mainRadius * 0.4;
        const smallX = centerX + mainRadius * 0.5;
        const smallY = centerY + mainRadius * 0.5;

        // メイン画像の描画
        const mainImg = document.createElement("img");
        mainImg.src = data.placeImage || defaultImageUrl;
        await drawCircleWithImage(context, mainImg, centerX, centerY, mainRadius, true);

        // ユーザー画像の描画
        const userImg = document.createElement("img");
        userImg.src = data.userImage || defaultImageUrl;
        await drawCircleWithImage(context, userImg, smallX, smallY, smallRadius, false);

        setIcon({
          url: canvas.toDataURL("image/png", 1.0),
          scaledSize: new google.maps.Size(displaySize, displaySize),
          anchor: new google.maps.Point(displaySize / 2, displaySize / 2),
        });
      } catch (error) {
        console.warn("Failed to create marker icon:", error);
        // フォールバック処理
        context.beginPath();
        context.arc(displaySize / 2, displaySize / 2, displaySize / 2 - 4, 0, 2 * Math.PI);
        context.fillStyle = "#F0F0F0";
        context.fill();
        context.strokeStyle = "#E0E0E0";
        context.lineWidth = 2;
        context.stroke();

        setIcon({
          url: canvas.toDataURL("image/png", 1.0),
          scaledSize: new google.maps.Size(displaySize, displaySize),
          anchor: new google.maps.Point(displaySize / 2, displaySize / 2),
        });
      }
    };

    loadIcon();
  }, [currentSize, data.placeImage, data.userImage]);

  if (!icon) return null;

  return (
    <Marker
      position={data.position}
      icon={icon}
      onClick={onClick}
      zIndex={isSelected ? 2 : 1} // 選択されたマーカーを前面に表示
    />
  );
};

interface Props {
  memberships: MembershipNode[];
  selectedPlaceId?: string | null;
  onPlaceSelect?: (placeId: string) => void;
}

export default function MapComponent({ memberships, selectedPlaceId, onPlaceSelect }: Props) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 33.75,  // 四国のおおよその中心緯度
    lng: 133.5,  // 四国のおおよその中心経度
  });

  // 選択された場所にズームする
  useEffect(() => {
    if (map && selectedPlaceId) {
      const selectedMarker = markers.find(marker => marker.placeId === selectedPlaceId);
      if (selectedMarker) {
        // シートの高さを計算（画面の45%）
        const sheetHeight = window.innerHeight * 0.45;
        
        // マップのコンテナの高さを取得
        const mapDiv = map.getDiv();
        const mapHeight = mapDiv.clientHeight;
        
        // マーカーの位置を取得
        const markerLatLng = new google.maps.LatLng(
          selectedMarker.position.lat,
          selectedMarker.position.lng
        );
        
        // よりズームした状態で表示
        map.setZoom(17);
        
        // マーカーの位置から、シートの高さの25%分下にオフセットした位置を計算
        // これにより、マーカーは見える部分の地図のちょうど中央に表示される
        const offsetRatio = (sheetHeight * 0.25) / mapHeight;
        const bounds = map.getBounds();
        if (bounds) {
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          const latSpan = ne.lat() - sw.lat();
          const latOffset = latSpan * offsetRatio;
          
          // 新しい中心位置を計算（オフセットを負の値にして下方向に移動）
          const newCenter = new google.maps.LatLng(
            selectedMarker.position.lat - latOffset,
            selectedMarker.position.lng
          );
          
          // 地図の中心を移動
          map.panTo(newCenter);
        }
      }
    }
  }, [selectedPlaceId, markers, map]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  useEffect(() => {
    const loadMarkers = async () => {
      const allMarkers: MarkerData[] = [];
      const allPlaces: Array<{
        placeId: string;
        title: string;
        address: string;
        participantCount: number;
        description: string;
        image: string;
        bio: string;
        userId: string;
        activeOpportunityCount: number;
      }> = [];

      memberships.forEach(({ node }) => {
        // アクティブな募集数を計算
        const activeOpportunityCount = node.user.opportunitiesCreatedByMe?.edges
          .filter(edge => edge.node.publishStatus === 'PUBLIC')
          .length || 0;

        // 参加したイベントのマーカー
        node.participationView.participated.geo.forEach(location => {
          const marker: MarkerData = {
            position: {
              lat: parseFloat(location.latitude),
              lng: parseFloat(location.longitude),
            },
            id: `${node.user.name}-${location.placeId}-participated`,
            placeImage: location.placeImage,
            userImage: node.user.image,
            contentType: "EXPERIENCE" as ContentType,
            name: node.headline || node.user.name,
            placeId: location.placeId,
            participantCount: node.participationView.participated.totalParticipatedCount,
          };
          
          allMarkers.push(marker);
          allPlaces.push({
            placeId: location.placeId,
            title: node.headline || node.user.name,
            address: node.participationView.participated.geo[0].placeName,
            participantCount: node.participationView.participated.totalParticipatedCount,
            description: "イベントの説明",
            image: location.placeImage,
            bio: node.bio || "",
            userId: node.user.id,
            activeOpportunityCount
          });
        });

        // 主催したイベントのマーカー
        node.participationView.hosted.geo.forEach(location => {
          const marker: MarkerData = {
            position: {
              lat: parseFloat(location.latitude),
              lng: parseFloat(location.longitude),
            },
            id: `${node.user.name}-${location.placeId}-hosted`,
            placeImage: location.placeImage,
            userImage: node.user.image,
            contentType: "EXPERIENCE" as ContentType,
            name: node.headline || node.user.name,
            placeId: location.placeId,
            participantCount: node.participationView.hosted.totalParticipantCount,
          };
          
          allMarkers.push(marker);
          allPlaces.push({
            placeId: location.placeId,
            title: node.headline || node.user.name,
            address: node.participationView.participated.geo[0].placeName,
            participantCount: node.participationView.hosted.totalParticipantCount,
            description: "イベントの説明",
            image: location.placeImage,
            bio: node.bio || "",
            userId: node.user.id,
            activeOpportunityCount
          });
        });
      });

      setMarkers(allMarkers);
      setPlaces(allPlaces);
    };

    loadMarkers();
  }, [memberships]);

  // places stateを追加
  const [places, setPlaces] = useState<Array<{
    placeId: string;
    title: string;
    address: string;
    participantCount: number;
    description: string;
    image: string;
    bio: string;
    userId: string;
    activeOpportunityCount: number;
  }>>([]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={9}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      }}
    >
      {markers.map((marker) => (
        <CustomMarker
          key={marker.id}
          data={marker}
          onClick={() => onPlaceSelect?.(marker.placeId)}
          isSelected={marker.placeId === selectedPlaceId}
        />
      ))}
    </GoogleMap>
  ) : <></>;
} 