import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { expressEndpoint } from "../../../config";
import scCss from "./ShowCard.module.css";

interface Props {
  title: string;
  parent: string;
}

function ShowCard(props: Props): JSX.Element {
  const cardElement = useRef<HTMLDivElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isReqestMade, setIsReqestMade] = useState(false);
  const isVisible = useOnScreen(cardElement);

  function isInViewport() {
    if (cardElement !== null && cardElement.current !== null) {
      const rect = cardElement.current.getBoundingClientRect();
      console.log(rect.top);
      return (
        (rect.top >= 0 && rect.bottom <= window.innerHeight) ||
        (rect.top >= 0 && rect.top <= window.innerHeight)
      );
    }
  }

  async function loadImage() {
    if (isReqestMade) return;
    const name = props.title;
    const parent = props.parent;
    const fetchEndpoint = `${expressEndpoint}/api/v1/shows-poster?name=${name}&parent=${parent}`;
    try {
      if (isInViewport()) {
        console.log(cardElement.current);
        console.log("loadImage");
        console.log(isInViewport());
        setIsReqestMade(true);
        const res = await fetch(fetchEndpoint);
        if (res.status === 200) {
          console.log(res);
          console.log(res.body);
          const readableSteam = await res.blob();
          const src = URL.createObjectURL(readableSteam);
          setImageSrc(src);
          console.log(src);
        }
      }
    } catch (err) {
      // console.log(err);
    }
  }

  useEffect(() => {
    loadImage();
  }, [isVisible]);

  // loadImage();
  return (
    <div className={`${scCss["show-card"]}`} ref={cardElement}>
      {imageSrc === null ? (
        props.title
      ) : (
        <img src={imageSrc} className={`${scCss["show-poster"]}`}></img>
      )}
    </div>
  );
}

function useOnScreen(ref: RefObject<HTMLElement>) {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting)
      ),
    [ref]
  );

  useEffect(() => {
    if (ref.current !== null) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return isIntersecting;
}

export default ShowCard;
