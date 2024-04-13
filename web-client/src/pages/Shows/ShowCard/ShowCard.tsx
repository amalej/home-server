import scCss from "./ShowCard.module.css";
import { useGetShowPoster } from "./ShowCard.hooks";
import { useRef } from "react";

interface Props {
  title: string;
  parent: string;
}

function ShowCard(props: Props): JSX.Element {
  const cardElement = useRef<HTMLDivElement>(null);
  const imageSrc = useGetShowPoster(props.parent, props.title, cardElement);

  return (
    <div className={`${scCss["show-card"]}`} ref={cardElement}>
      {imageSrc === null ? (
        props.title
      ) : (
        <img src={imageSrc} className={`${scCss["show-poster"]}`} alt={props.title}></img>
      )}
    </div>
  );
}

export default ShowCard;
