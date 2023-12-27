import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShowDirectory } from "../../types";
import { useLocation } from "react-router-dom";
import { expressEndpoint } from "../../config";
import css from "../../common/common.module.css";

function ShowsPage() {
  const location = useLocation();
  const [paths, setPaths] = useState<Array<ShowDirectory>>([]);
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    let _hasVideo = false;
    if (hasVideo) {
      window.location.reload();
    }
    const queryParameters = new URLSearchParams(window.location.search);
    let relativePath = window.location.href.replace(
      /(?=http)(.*)(?<=shows)|\?(.*)/gm,
      ""
    );
    if (
      window.location.href.includes(".mp4") ||
      window.location.href.includes(".mkv")
    ) {
      _hasVideo = true;
      // setHasVideo(_hasVideo);
      const relativePathSplit = relativePath.split("/");
      relativePathSplit.pop();
      relativePath = relativePathSplit.join("/");
    }

    console.log(relativePath);
    const parent = queryParameters.get("parent");
    const query = parent !== null ? `?parent=${parent}` : "";
    const fetchEndpoint = `${expressEndpoint}/api/v1/shows${relativePath}${query}`;
    fetch(fetchEndpoint)
      .then(async (response) => {
        const res = response;
        const textContent = await res.text();
        const _paths: Array<ShowDirectory> = JSON.parse(textContent);
        setPaths(_paths);
      })
      .catch((err) => {
        console.log(err);
      });
    setHasVideo(_hasVideo);
  }, [location]);

  function getParentPath() {
    const paths = window.location.href.split("/");
    paths.pop();
    return paths.join("/");
  }

  function addParentQuery(relativePath: string, parent: string) {
    return `${relativePath}?parent=${parent}`;
  }

  function getVideoUrl() {
    const queryParameters = new URLSearchParams(window.location.search);
    const relativePath = window.location.href.replace(
      /(?=http)(.*)(?<=shows)|\?(.*)/gm,
      ""
    );
    const parent = queryParameters.get("parent");
    return `${expressEndpoint}/video?relativePath=${relativePath}&parent=${parent}`;
  }

  function renderParentLink() {
    const relativePath = window.location.href.replace(
      /(?=http)(.*)(?<=shows)|\?(.*)/gm,
      ""
    );
    if (relativePath !== "") {
      const parentPath = getParentPath();
      const queryParameters = new URLSearchParams(window.location.search);
      const parent = queryParameters.get("parent");
      return (
        <Link
          to={`${parentPath}?parent=${parent}`}
          className={`${css["link-button"]}`}
        >
          Return
        </Link>
      );
    } else {
      return "";
    }
  }

  function isActive(linkPath: string) {
    const relativePath = window.location.href.replace(
      /(?=http)(.*)(?<=shows)|\?(.*)/gm,
      ""
    );
    const normalized = decodeURIComponent(relativePath);
    return normalized.includes(linkPath.replaceAll("\\", "/"));
  }

  return (
    <div>
      <br />
      <div>
        <Link to={"/"} className={`${css["link-button"]}`}>
          Home
        </Link>
        <Link to={"/shows"} className={`${css["link-button"]}`}>
          Shows
        </Link>
        <Link to={"/upload"} className={`${css["link-button"]}`}>
          Upload
        </Link>
      </div>
      <hr></hr>
      {renderParentLink()}
      {paths.map((path) => (
        <div key={path.relativePath}>
          <Link
            to={addParentQuery(path.relativePath, path.parent)}
            className={`${css["link-button"]} ${
              isActive(path.relativePath) ? css["link-button-active"] : ""
            }`}
          >
            {path.relativePath}
          </Link>
        </div>
      ))}
      {hasVideo ? (
        <video id="videoPlayer" width="100%" controls>
          <source src={getVideoUrl()} type="video/mp4" />
        </video>
      ) : (
        ""
      )}
    </div>
  );
}

export default ShowsPage;
