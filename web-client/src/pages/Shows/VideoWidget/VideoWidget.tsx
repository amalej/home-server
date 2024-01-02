import { useRef, useState } from "react";
import { expressEndpoint } from "../../../config";
import {
  getActiveMovieData,
  getUserId,
  resetActiveMovie,
  setActiveMovieTime,
} from "../../../util";
import vwCss from "./VideoWidget.module.css";

function VideoWidget() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const relativePath = window.location.href.replace(
    /(?=http)(.*)(?<=shows)|\?(.*)/gm,
    ""
  );
  const [showButton, setShowButton] = useState(true);
  const activeMovieData = getActiveMovieData();

  function getVideoUrl() {
    const queryParameters = new URLSearchParams(window.location.search);
    const parent = queryParameters.get("parent");
    const userId = getUserId();
    return `${expressEndpoint}/api/v1/video?relativePath=${relativePath}&parent=${parent}&uid=${userId}`;
  }

  function getTimeStamp() {
    const timestamp = getActiveMovieData().time;
    const hours = Math.floor(timestamp / 3600);
    const minutes = Math.floor((timestamp - hours * 3600) / 60);
    const seconds = Math.floor(timestamp - hours * 3600 - minutes * 60);

    const hoursStr = hours.toString().length === 1 ? `0${hours}` : hours;
    const minutesStr =
      minutes.toString().length === 1 ? `0${minutes}` : minutes;
    const secondsStr =
      seconds.toString().length === 1 ? `0${seconds}` : seconds;
    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  }

  return (
    <div>
      {activeMovieData.name === relativePath &&
      activeMovieData.time !== 0 &&
      showButton ? (
        <div
          className={`${vwCss["continue-playing-video-container"]}`}
          onClick={() => {
            setShowButton(false);
          }}
        >
          <button
            className={`${vwCss["continue-playing-video"]}`}
            onClick={() => {
              const elem = videoRef.current;
              const activeMovieData = getActiveMovieData();
              if (elem) {
                setShowButton(false);
                elem.currentTime = activeMovieData.time;
                elem.play();
              }
            }}
          >
            Continue watching at {getTimeStamp()}?
          </button>
        </div>
      ) : (
        ""
      )}
      <video
        onPlay={(e) => {
          const activeMovieData = getActiveMovieData();
          if (activeMovieData.name !== relativePath) {
            resetActiveMovie(relativePath);
          }
        }}
        onTimeUpdate={(e) => {
          const elem = videoRef.current;
          if (elem) {
            const seconds = Math.floor(elem.currentTime);
            setActiveMovieTime(seconds);
          }
        }}
        ref={videoRef}
        width="100%"
        controls
      >
        <source src={getVideoUrl()} type="video/mp4" />
      </video>
    </div>
  );
}

export default VideoWidget;
