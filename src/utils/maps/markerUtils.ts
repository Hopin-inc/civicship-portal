import { BasePin, BaseCardInfo } from "@/app/places/data/type";

export const defaultImageUrl = "https://via.placeholder.com/200";

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

export const processMapData = (places: BaseCardInfo[]): {
  markers: BasePin[];
  places: BasePin[];
} => {
  return { markers: places, places };
};
