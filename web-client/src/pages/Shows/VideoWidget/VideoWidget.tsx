import { useEffect, useRef, useState } from "react";
import { serverEndpoint } from "../../../config";
import {
  getActiveShowData,
  getUserId,
  resetActiveMovie,
  setActiveMovieTime,
} from "../../../util";
import vwCss from "./VideoWidget.module.css";
import { ShowSubtitleData } from "../../../types";

function VideoWidget() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const relativePath = window.location.href.replace(
    /(?=http)(.*)(?<=shows)|\?(.*)/gm,
    ""
  );
  const activeMovieData = getActiveShowData();
  const queryParameters = new URLSearchParams(window.location.search);
  const parent = queryParameters.get("parent");
  const userId = getUserId();
  const [showButton, setShowButton] = useState(true);
  const [subtitles, setSubtitles] = useState<Array<ShowSubtitleData>>([]);
  const [ticking, setTicking] = useState(true),
    [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => ticking && setCount(count + 1), 1000);
    return () => clearTimeout(timer);
  }, [count, ticking]);

  useEffect(() => {
    const elem = videoRef.current;
    if (
      elem &&
      elem.currentTime > 0 &&
      !elem.paused &&
      !elem.ended &&
      elem.readyState > 2
    ) {
      const seconds = Math.floor(elem.currentTime);
      setActiveMovieTime(seconds);
    }
  }, [count]);

  useEffect(() => {
    const endpoint = `${serverEndpoint}/api/v1/subtitles?relativePath=${relativePath}&parent=${parent}&uid=${userId}`;
    fetch(endpoint)
      .then(async (res) => {
        const textContent = await res.text();
        const subtitlePaths = JSON.parse(textContent);
        const subtitleDataArr: Array<ShowSubtitleData> = [];
        for (let subtitlePath of subtitlePaths) {
          // const label = subtitlePath.split("-").at(-1) || "";
          const label = subtitlePath.split("-")[-1] || "";
          subtitleDataArr.push({
            path: subtitlePath,
            label: label.replace(".vtt", ""),
          });
        }
        setSubtitles(subtitleDataArr);
      })
      .catch((err) => {});
  }, []);

  function getVideoUrl() {
    return `${serverEndpoint}/api/v1/video?relativePath=${relativePath}&parent=${parent}&uid=${userId}`;
  }

  function getSubtitleUrl(subtitleRelativePath: string) {
    const queryParameters = new URLSearchParams(window.location.search);
    const parent = queryParameters.get("parent");
    const userId = getUserId();
    return `${serverEndpoint}/api/v1/subtitle-file?relativePath=${subtitleRelativePath}&parent=${parent}&uid=${userId}`;
  }

  function getTimeStamp() {
    const timestamp = getActiveShowData().time;
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
      // activeMovieData.time !== 0 &&
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
              const activeMovieData = getActiveShowData();
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
        className={`${vwCss["video-player"]}`}
        onPlay={(e) => {
          const activeMovieData = getActiveShowData();
          if (activeMovieData.name !== relativePath) {
            resetActiveMovie(relativePath);
          }
          setShowButton(false);
        }}
        key={"video-widget"}
        ref={videoRef}
        width="100%"
        preload="auto"
        controls
      >
        <source src={getVideoUrl()} type="video/mp4" />
        {subtitles.map((subtitlePath) => {
          return (
            <track
              key={`subtitle-${subtitlePath.path}`}
              src={getSubtitleUrl(subtitlePath.path)}
              label={subtitlePath.label}
              kind="subtitles"
            ></track>
          );
        })}
      </video>
    </div>
  );
}

export default VideoWidget;
