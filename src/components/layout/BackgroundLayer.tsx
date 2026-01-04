export function BackgroundLayer() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 bg-muted">
      {/* 中央レーン */}
      <div className="absolute inset-y-0 left-1/2 w-[420px] -translate-x-1/2 bg-white" />

      {/* 左右をほんのり沈める */}
      <div className="absolute inset-0 bg-gradient-to-r from-muted via-transparent to-muted" />

      {/* ノイズ */}
      <div className="absolute inset-0 bg-[url('/noise-light.png')] opacity-[0.2]" />
    </div>
  );
}
