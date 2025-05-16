export async function renderCircularImage(
  img: HTMLImageElement,
  radius: number,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = radius * 2;
  canvas.height = radius * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.beginPath();
  ctx.arc(radius, radius, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(img, 0, 0, radius * 2, radius * 2);
  return canvas;
}
