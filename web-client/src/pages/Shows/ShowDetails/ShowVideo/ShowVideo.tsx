import { useEffect, useRef, useState } from "react";
import { useGetVideoProperties } from "./ShowVideo.hooks";
import svCss from "./ShowVideo.module.css";
import { serverEndpoint } from "../../../../config";
import {
  getActiveShowData,
  resetActiveMovie,
  setActiveMovieTime,
} from "../../../../util";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

function ShowVideo() {
  const [showButton, setShowButton] = useState(false);
  const activeMovieData = getActiveShowData();
  const videoProperties = useGetVideoProperties();
  const videoElem = useRef<HTMLVideoElement>(null);
  const divElem = useRef<HTMLDivElement>(null);
  const moviePath =
    window.location.href.replace(/(?=http)(.*)(?<=shows)|\?(.*)/gm, "") +
    "?" +
    window.location.href.replace(/(?=http)(.*)(?=watch=)/gm, "");

  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (moviePath === activeMovieData.name) {
      setShowButton(true);
    }
    document.onfullscreenchange = (e) => {
      setIsFullScreen(!isFullScreen);
    };
  }, []);

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

  function renderVideo(): ReactJSXElement {
    return (
      <div ref={divElem} className={svCss["video-container"]}>
        <video
          ref={videoElem}
          className={svCss["video-player"]}
          preload="auto"
          controls
          crossOrigin="anonymous"
          onPlay={(e) => {
            const activeMovieData = getActiveShowData();
            if (activeMovieData.name !== moviePath) {
              resetActiveMovie(moviePath);
            }
          }}
          onTimeUpdate={(e) => {
            if (videoElem.current) {
              const time = videoElem.current?.currentTime;
              setActiveMovieTime(time);
            }
          }}
        >
          <source src={videoProperties.src || undefined}></source>
          {videoProperties.subtitles.map((subtitleData) => {
            return (
              <track
                key={`subtitle-${subtitleData.path}`}
                src={`${serverEndpoint}${subtitleData.path}`}
                label={subtitleData.label}
                kind="subtitles"
              ></track>
            );
          })}
        </video>
        {/* <div className={svCss["video-controls"]}>
      <button
        className="controls__button toggleButton"
        title="Toggle Play"
        onClick={() => {
          const el = videoElem.current;
          if (el) {
            el.play();
          }
        }}
      >
        <PlayArrowIcon />
      </button>
      <button
        className="controls__button toggleButton"
        title="Toggle Play"
        onClick={() => {
          const el = divElem.current;
          if (el) {
            if (isFullScreen) {
              document.exitFullscreen();
            } else {
              el.ariaOrientation = "horizontal";
              el.requestFullscreen();
            }
          }
        }}
      >
        {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </button>
    </div> */}
      </div>
    );
  }

  function renderContinueWatchingButton(): ReactJSXElement {
    return (
      <div
        className={`${svCss["continue-playing-video-container"]}`}
        onClick={() => {
          setShowButton(false);
        }}
      >
        <button
          className={`${svCss["continue-playing-video"]}`}
          onClick={() => {
            const elem = videoElem.current;
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
    );
  }

  return (
    <div>
      {videoProperties.shouldRender === true ? (
        <>
          {activeMovieData.name === moviePath &&
          showButton &&
          videoProperties.status === "success"
            ? renderContinueWatchingButton()
            : ""}
          {videoProperties.status === "success" ? (
            renderVideo()
          ) : videoProperties.status === "loading" ? (
            <div className={svCss["loader-container"]}>
              <CircularProgress className={svCss["loader"]} size={"10em"} />
            </div>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default ShowVideo;
