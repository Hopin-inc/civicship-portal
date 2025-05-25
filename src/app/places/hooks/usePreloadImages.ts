import { useEffect, useState } from "react";

export function usePreloadImages(urls: string[]): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let completed = 0;
    const total = urls.length;
    if (total === 0) {
      setLoaded(true);
      return;
    }

    urls.forEach((url) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Add crossOrigin attribute
      img.onload = () => {
        completed += 1;
        if (completed === total) setLoaded(true);
      };
      img.onerror = () => {
        completed += 1;
        if (completed === total) setLoaded(true); // ignore error
      };
      img.src = url;
    });
  }, [urls]);

  return loaded;
}
