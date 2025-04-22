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
const createCustomMarkerIcon = async (placeImage: string, userImage: string): Promise<google.maps.Icon | null> => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;

  // サイズ設定
  const displaySize = 56;  // 表示サイズ
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
    // 完全なフォールバック: シンプルな円を描画
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
}> = ({ data, onClick }) => {
  const [icon, setIcon] = useState<google.maps.Icon | null>(null);

  useEffect(() => {
    const loadIcon = async () => {
      const newIcon = await createCustomMarkerIcon(data.placeImage, data.userImage);
      if (newIcon) {
        setIcon(newIcon);
      }
    };
    loadIcon();
  }, [data.placeImage, data.userImage]);

  if (!icon) return null;

  return (
    <Marker
      position={data.position}
      icon={icon}
      onClick={onClick}
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
        map.panTo(selectedMarker.position);
        map.setZoom(15);
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
      }> = [];

      memberships.forEach(({ node }) => {
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
            userId: node.user.id
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
            userId: node.user.id
          });
        });
      });

      setMarkers(allMarkers);
    };

    loadMarkers();
  }, [memberships]);

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
        />
      ))}
    </GoogleMap>
  ) : <></>;
} 