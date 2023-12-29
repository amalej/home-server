import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShowDirectory } from "../../types";
import { useLocation } from "react-router-dom";
import { expressEndpoint } from "../../config";
import css from "../../common/common.module.css";
import TopNav from "../../components/TopNav/TopNav";
import ShowCard from "./ShowCard/ShowCard";
import spCss from "./ShowsPage.module.css";
import SearchIcon from "@mui/icons-material/Search";

const SHOW_CARD_WIDTH = 150;

function ShowsPage() {
  const [showFilter, setShowFilter] = useState("");
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
    return `${expressEndpoint}/api/v1/video?relativePath=${relativePath}&parent=${parent}`;
  }

  function isActive(linkPath: string) {
    const relativePath = window.location.href.replace(
      /(?=http)(.*)(?<=shows)|\?(.*)/gm,
      ""
    );
    const normalized = decodeURIComponent(relativePath);
    return normalized.includes(linkPath.replaceAll("\\", "/"));
  }

  function getLastPath(relativePath: string): string {
    const paths = relativePath.split(/\/|\\/gm);
    const name = paths.at(-1) as string;
    return name;
  }

  function isOnShowsRoot() {
    const relativePath = window.location.href.replace(
      /(?=http)(.*)(?<=shows)|\?(.*)/gm,
      ""
    );
    return relativePath.length === 0;
  }

  function getShowName() {
    const relativePath = window.location.href.replace(
      /(?=http)(.*)(?<=shows)|\?(.*)/gm,
      ""
    );
    const name = relativePath.split("/")[1] || "";
    return decodeURIComponent(name);
  }

  function getShowsTable(): Array<Array<ShowDirectory>> {
    const wWidth = window.innerWidth;
    const showCardWidth = SHOW_CARD_WIDTH;
    const showsPerRow = Math.floor(wWidth / showCardWidth);
    const filteredPaths = paths.filter((path) => {
      const name = path.relativePath.replace(
        /(?=http)(.*)(?<=shows)|\?(.*)/gm,
        ""
      );
      if (name.toLowerCase().includes(showFilter.toLowerCase())) {
        return true;
      }
      return false;
    });

    const rows = Math.ceil(filteredPaths.length / showsPerRow);
    const elemTable: Array<Array<ShowDirectory>> = [];
    for (let i = 0; i < rows; i++) {
      const itemsInRow: Array<ShowDirectory> = [];
      for (let j = 0; j < showsPerRow; j++) {
        const index = i * showsPerRow + j;
        if (index >= filteredPaths.length) break;
        itemsInRow.push(filteredPaths[index]);
      }
      elemTable.push(itemsInRow);
    }
    return elemTable;
  }

  function renderParentLink() {
    const relativePath = window.location.href.replace(
      /(?=http)(.*)(?<=shows)|\?(.*)/gm,
      ""
    );
    if (relativePath.split("/").length === 2) {
      return (
        <div className={`${spCss["show-top-container"]}`}>
          <Link
            to="/shows"
            className={`${css["link-button"]} ${spCss["return-button"]}`}
          >
            Return
          </Link>
          <div className={`${spCss["show-name-container"]}`}>
            {getShowName()}
          </div>
        </div>
      );
    } else if (relativePath !== "") {
      const parentPath = getParentPath();
      const queryParameters = new URLSearchParams(window.location.search);
      const parent = queryParameters.get("parent");
      return (
        <div className={`${spCss["show-top-container"]}`}>
          <Link
            to={`${parentPath}?parent=${parent}`}
            className={`${css["link-button"]} ${spCss["return-button"]}`}
          >
            Return
          </Link>
          <div className={`${spCss["show-name-container"]}`}>
            {getShowName()}
          </div>
        </div>
      );
    } else {
      return "";
    }
  }

  return (
    <div className={`${spCss["shows-page"]}`}>
      <TopNav />
      {renderParentLink()}
      {hasVideo ? (
        <video id="videoPlayer" width="100%" controls>
          <source src={getVideoUrl()} type="video/mp4" />
        </video>
      ) : (
        ""
      )}
      {isOnShowsRoot() ? (
        <>
          <div className={`${spCss["show-search-bar-container"]}`}>
            <input
              type="text"
              className={`${spCss["show-search-bar"]}`}
              value={showFilter}
              onChange={(e) => {
                setShowFilter(e.target.value);
              }}
            />
            <SearchIcon className={`${spCss["show-search-bar-icon"]}`} />
          </div>
          <table className={`${spCss["table"]}`}>
            <tbody>
              {getShowsTable().map((row, i) => {
                return (
                  <tr key={`table_row_${i}`}>
                    {row.map((show) => (
                      <td key={show.relativePath.toLocaleLowerCase()}>
                        <Link
                          to={addParentQuery(show.relativePath, show.parent)}
                          className={`${css["link-button"]}`}
                        >
                          <ShowCard
                            title={getLastPath(show.relativePath)}
                            parent={show.parent}
                          />
                        </Link>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      ) : (
        <>
          {paths.map((_path) => {
            return (
              <div key={_path.relativePath}>
                <Link
                  to={addParentQuery(_path.relativePath, _path.parent)}
                  className={`${css["link-button"]} ${spCss["episode"]}`}
                >
                  {getLastPath(_path.relativePath)}
                </Link>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default ShowsPage;
