import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { serverEndpoint } from "../../../../config";
import { ShowSubtitleData } from "../../../../types";

export function useGetVideoProperties() {
  const location = useLocation();
  const params = new URL(window.location.href).searchParams;
  const watch = params.get("watch");
  const [videoProperties, setVideoProperties] = useState<{
    shouldRender: boolean;
    status: string;
    src: string | null;
    subtitles: ShowSubtitleData[];
  }>({
    shouldRender: watch !== null,
    status: "loading",
    src: null,
    subtitles: [],
  });

  useEffect(() => {
    async function makeRequest() {
      const params = new URL(window.location.href).searchParams;
      const watch = params.get("watch");
      if (watch) {
        const parent = params.get("parent");
        const showPath = window.location.href.replace(
          /(?=http)(.*)(?<=shows\/)|\?(.*)/gm,
          ""
        );
        const srcPath = `${serverEndpoint}/api/v1/video/${showPath}?parent=${parent}&watch=${watch}`;
        const subtitlePath = `${serverEndpoint}/api/v1/subtitles/${showPath}?parent=${parent}&watch=${watch}`;
        const subtitlesRes = await fetch(subtitlePath);
        const subtitlesResText = await subtitlesRes.text();
        const subtitlesFiles = JSON.parse(subtitlesResText)
          .files as ShowSubtitleData[];
        setVideoProperties({
          shouldRender: true,
          status: "success",
          src: srcPath,
          subtitles: subtitlesFiles,
        });
      } else {
        setVideoProperties({
          shouldRender: false,
          status: "success",
          src: null,
          subtitles: [],
        });
      }
    }
    makeRequest();
  }, [location]);
  return videoProperties;
}
