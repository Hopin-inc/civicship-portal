import { BasePin, BaseCardInfo } from "../../types/place";

/**
 * デフォルトの画像URL（CORS対応のサービスを使用）
 */
export const defaultImageUrl = "https://via.placeholder.com/200";

/**
 * 円形の画像を描画する関数
 */
export const drawCircleWithImage = async (
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

        ctx.beginPath();
        ctx.arc(cx, cy, radius + 2, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.clip();

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
      if (img.src !== defaultImageUrl) {
        loadImage(defaultImageUrl);
      } else {
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

    loadImage(img.src);
  });
};

/**
 * カスタムマーカーSVGを生成する関数
 */
export const createCustomMarkerIcon = async (
  placeImage: string, 
  userImage: string, 
  isSelected: boolean = false
): Promise<google.maps.Icon | null> => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;

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

    const mainImg = document.createElement("img");
    mainImg.src = placeImage || defaultImageUrl;
    await drawCircleWithImage(context, mainImg, centerX, centerY, mainRadius, true);

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

/**
 * 座標データを数値に変換する関数
 */
export const parseCoordinates = (
  latitude: any, // Changed from number to any to handle string inputs
  longitude: any // Changed from number to any to handle string inputs
): { lat: number; lng: number } | null => {
  const numLat = typeof latitude === 'string' ? parseFloat(latitude) : Number(latitude);
  const numLng = typeof longitude === 'string' ? parseFloat(longitude) : Number(longitude);
  
  if (isNaN(numLat) || isNaN(numLng)) {
    console.warn('Invalid coordinates:', { latitude, longitude });
    return null;
  }
  
  return {
    lat: numLat,
    lng: numLng,
  };
};

/**
 * 位置情報からマーカーデータを作成する関数
 */
export const createMarkerFromLocation = (
  location: Geo,
  node: any,
  type: 'participated' | 'hosted'
): MarkerData | null => {
  const coordinates = parseCoordinates(location.latitude, location.longitude);
  
  if (!coordinates) {
    return null;
  }
  
  return {
    position: coordinates,
    id: `${node.user.name}-${location.placeId}-${type}`,
    placeImage: location.placeImage,
    userImage: node.user.image,
    contentType: "EXPERIENCE" as ContentType,
    name: node.user.name,
    placeId: location.placeId,
    participantCount: node.participationView[type].totalParticipantCount,
  };
};

/**
 * 位置情報からプレースデータを作成する関数
 */
export const createPlaceFromLocation = (
  location: Geo,
  node: any,
  type: 'participated' | 'hosted',
  activeOpportunityCount: number
): PlaceData => {
  return {
    placeId: location.placeId,
    title: node.user.name,
    address: node.participationView[type].geo[0]?.placeName || "住所不明",
    participantCount: node.participationView[type].totalParticipantCount,
    description: "イベントの説明",
    image: location.placeImage,
    bio: node.bio || "",
    userId: node.user.id,
    activeOpportunityCount
  };
};

/**
 * 拠点データからマーカーとプレースデータを作成する関数
 */
export const processMapData = (places: BaseCardInfo[]): {
  markers: BasePin[];
  places: BasePin[];
} => {
  return { markers: places, places };
};
