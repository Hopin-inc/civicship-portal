// "use client";
//
// import { useEffect } from "react";
// import Script from "next/script";
//
// export default function GoogleAnalytics({
//   measurementId = process.env.NEXT_PUBLIC_GA_ID || "",
// }: {
//   measurementId?: string;
// }) {
//   useEffect(() => {
//     if (!measurementId) return;
//
//     // GA 初期化
//     window.dataLayer = window.dataLayer || [];
//     function gtag(p0: string, p1: Date) {
//       window.dataLayer.push(arguments);
//     }
//     gtag("js", new Date());
//     gtag("config", measurementId);
//   }, [measurementId]);
//
//   return (
//     <>
//       {/* GA スクリプトの読み込み */}
//       {measurementId && (
//         <Script
//           src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
//           strategy="afterInteractive"
//         />
//       )}
//     </>
//   );
// }
