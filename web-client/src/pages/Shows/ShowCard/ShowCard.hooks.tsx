import { RefObject, useEffect, useMemo, useState } from "react";
import { getPoster as getPosterAPI } from "../../../api/poster.api";

export function useGetShowPoster(
  parent: string,
  showPath: string,
  ref: RefObject<HTMLElement>
) {
  const [poster, setPoster] = useState<any | null>(null);
  const isOnScreen = useIsOnScreen(ref);
  async function getPoster() {
    const res = await getPosterAPI(parent, showPath);
    const contentLen = parseInt(res.headers.get("Content-Length") || "0");
    if (contentLen !== 0) {
      const readableSteam = await res.blob();
      const src = URL.createObjectURL(readableSteam);
      setPoster(src);
    }
  }

  useEffect(() => {
    if (isOnScreen && poster === null) {
      console.log(showPath);
      getPoster();
    }
  }, [isOnScreen]); // eslint-disable-line react-hooks/exhaustive-deps

  return poster;
}

export function useIsOnScreen(ref: RefObject<HTMLElement>) {
  const [isOnScreen, setIsOnScreen] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) => {
        if (ref !== null && ref.current !== null) {
          const rect = ref.current.getBoundingClientRect();
          const _isOnScreen =
            (rect.top >= 0 && rect.bottom <= window.innerHeight) ||
            (rect.top >= 0 && rect.top <= window.innerHeight);
          if (_isOnScreen) {
            setIsOnScreen(_isOnScreen);
          }
        }
      }),
    [ref]
  );

  useEffect(() => {
    if (ref.current !== null) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []); 

  return isOnScreen;
}
