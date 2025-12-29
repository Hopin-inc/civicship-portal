export const defaultImageUrl = "https://via.placeholder.com/200";

// 影の設定を行う共通関数
const setShadow = (ctx: CanvasRenderingContext2D, enabled: boolean = true) => {
  if (enabled) {
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
  } else {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
};

// 円を描画する共通関数
const drawCircle = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
) => {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
};

export const drawCircleWithImage = async (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  radius: number,
  isMainImage: boolean,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const loadImage = (src: string) => {
      img.crossOrigin = "anonymous";
      img.src = src;
    };

    img.onload = () => {
      try {
        // 影付きの白い外枠を描画
        setShadow(ctx, true);
        drawCircle(ctx, cx, cy, radius + 4, "#FFFFFF");

        // 影をクリア
        setShadow(ctx, false);

        // 画像を描画
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
          imgSize,
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
          // 影付きの白い外枠を描画
          setShadow(ctx, true);
          drawCircle(ctx, cx, cy, radius + 4, "#FFFFFF");

          // 影をクリア
          setShadow(ctx, false);

          // プレースホルダー円を描画
          drawCircle(ctx, cx, cy, radius, isMainImage ? "#F0F0F0" : "#E0E0E0");
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    };

    loadImage(img.src);
  });
};
