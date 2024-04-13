import { useGetShowDetails } from "./ShowDetails.hooks";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Link } from "react-router-dom";
import ShowVideo from "./ShowVideo/ShowVideo";
import sdCss from "./ShowDetails.module.css";
import { useNavigate } from "react-router-dom";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import FolderIcon from "@mui/icons-material/Folder";
import SubdirectoryArrowLeftIcon from "@mui/icons-material/SubdirectoryArrowLeft";
import LinearProgress from "@mui/material/LinearProgress/LinearProgress";
import { getActiveShowData } from "../../../util";

function ShowDetails() {
  const navigate = useNavigate();
  const params = new URL(window.location.href).searchParams;
  const showPath = window.location.href.replace(
    /(?=http)(.*)(?<=shows\/)|\?(.*)/gm,
    ""
  );
  const parent = params.get("parent");
  const watch = params.get("watch");
  const showDetailsRequest = useGetShowDetails(showPath, parent);
  let prevIndex: number | null = null;
  let nextIndex: number | null = null;

  function getParentDir() {
    const fullPath = window.location.href;
    const basePath = fullPath
      .replace(/(?=\?)(.*)/gim, "")
      .replace(/(?<=).+?(?<=shows\/)/, "");
    // const newBasePath = basePath.split("/").slice(1).at(-1);
    const newBasePath = basePath.split("/").slice(1)[-1];
    if (newBasePath === undefined || newBasePath === "") {
      return `shows`;
    } else {
      return newBasePath;
    }
  }
  function getShowName() {
    const relativePath = window.location.href.replace(
      /(?=http)(.*)(?<=shows)|\?(.*)/gm,
      ""
    );
    const name = relativePath.split("/")[1] || "";
    return decodeURIComponent(name);
  }

  const moviePath = getActiveShowData();
  console.log("moviePath");
  console.log(moviePath);

  function goUpADirectory() {
    const fullPath = window.location.href;
    const basePath = fullPath
      .replace(/(?=\?)(.*)/gim, "")
      .replace(/(?<=).+?(?<=shows)/, "");
    const newBasePath = basePath.split("/").slice(0, -1).join("/");
    if (newBasePath === "") {
      navigate("/shows");
    } else {
      const newPath = `/shows${newBasePath}?parent=${parent}`;
      navigate(newPath);
    }
  }

  function renderChildren(): ReactJSXElement {
    try {
      const json: {
        exists: boolean;
        showPath: string;
        showName: string;
        parent: string;
        children: string[];
      } = JSON.parse(showDetailsRequest.body);
      const showIndex = json.children.indexOf(watch || "");
      prevIndex = showIndex - 1;
      nextIndex = showIndex + 1;
      return (
        <div className={`${sdCss["show-item-container"]}`}>
          <div className={`${sdCss["top-nav-container"]}`}>
            <div className={`${sdCss["return-btn"]}`} onClick={goUpADirectory}>
              <SubdirectoryArrowLeftIcon className={`${sdCss["icon"]}`} />
              {getParentDir()}
            </div>
            <div className={`${sdCss["show-name"]}`}>{getShowName()}</div>
          </div>
          <ShowVideo />
          {json.children.length > 0 && watch !== null ? (
            <div className={`${sdCss["video-nav-container"]}`}>
              <Link
                className={`${sdCss["video-nav-item"]} ${
                  json.children[prevIndex] === undefined ||
                  showIndex <= 0 ||
                  (!json.children[prevIndex].endsWith(".mp4") &&
                    !json.children[prevIndex].endsWith(".mkv"))
                    ? sdCss["hidden"]
                    : ""
                }`}
                to={`/shows/${showPath}?parent=${parent}&watch=${json.children[prevIndex]}`}
              >
                Prev
              </Link>
              <Link className={`${sdCss["video-nav-spacer"]}`} to={""}></Link>
              <Link
                className={`${sdCss["video-nav-item"]} ${
                  json.children[nextIndex] === undefined ? sdCss["hidden"] : ""
                }`}
                to={`/shows/${showPath}?parent=${parent}&watch=${json.children[nextIndex]}`}
              >
                Next
              </Link>
            </div>
          ) : (
            <></>
          )}
          {json.children.map((child) => {
            if (child.endsWith(".mp4") || child.endsWith(".mkv")) {
              return (
                <Link
                  className={`${sdCss["show-item"]}`}
                  key={`show-details-${child.toLocaleLowerCase()}`}
                  to={`/shows/${showPath}?parent=${parent}&watch=${child}`}
                >
                  <PlayCircleIcon className={`${sdCss["icon"]}`} />
                  {child}
                </Link>
              );
            } else {
              return (
                <Link
                  className={`${sdCss["show-item"]}`}
                  key={`show-details-${child.toLocaleLowerCase()}`}
                  to={`/shows/${showPath}/${child}?parent=${parent}`}
                >
                  <FolderIcon className={`${sdCss["icon"]}`} />
                  {child}
                </Link>
              );
            }
          })}
        </div>
      );
    } catch (error) {
      console.log("error");
    }
    return <div>Error</div>;
  }

  return (
    <div>
      {showDetailsRequest.status === "loading" ? (
        <LinearProgress />
      ) : (
        renderChildren()
      )}
    </div>
  );
}

export default ShowDetails;
