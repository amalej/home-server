import { Link } from "react-router-dom";
import css from "../../common/common.module.css";
import ShowCard from "./ShowCard/ShowCard";
import spCss from "./ShowsPage.module.css";
import { useGetShows } from "./ShowsPage.hooks";
import LinearProgress from "@mui/material/LinearProgress/LinearProgress";

const SHOW_CARD_WIDTH = 150;

function ShowsPage() {
  const showsResponse = useGetShows();

  function getShowsTable(): Array<Array<{ name: string; parent: string }>> {
    const showList =
      showsResponse.status === "success"
        ? JSON.parse(showsResponse.body).shows
        : [];
    const wWidth = window.innerWidth;
    const showCardWidth = SHOW_CARD_WIDTH;
    const showsPerRow = Math.floor(wWidth / showCardWidth);
    const filteredPaths = showList;
    // const filteredPaths = showList.filter((path) => {
    //   const name = path.relativePath.replace(
    //     /(?=http)(.*)(?<=shows)|\?(.*)/gm,
    //     ""
    //   );
    //   if (name.toLowerCase().includes(showFilter.toLowerCase())) {
    //     return true;
    //   }
    //   return false;
    // });

    const rows = Math.ceil(filteredPaths.length / showsPerRow);
    const elemTable: Array<Array<{ name: string; parent: string }>> = [];
    for (let i = 0; i < rows; i++) {
      const itemsInRow: Array<{ name: string; parent: string }> = [];
      for (let j = 0; j < showsPerRow; j++) {
        const index = i * showsPerRow + j;
        if (index >= filteredPaths.length) break;
        itemsInRow.push(filteredPaths[index]);
      }
      elemTable.push(itemsInRow);
    }
    return elemTable;
  }

  // function renderParentLink() {
  //   const relativePath = window.location.href.replace(
  //     /(?=http)(.*)(?<=shows)|\?(.*)/gm,
  //     ""
  //   );
  //   if (relativePath.split("/").length === 2) {
  //     return (
  //       <div className={`${spCss["show-top-container"]}`}>
  //         <Link
  //           to="/shows"
  //           className={`${css["link-button"]} ${spCss["return-button"]}`}
  //         >
  //           Return
  //         </Link>
  //         <div className={`${spCss["show-name-container"]}`}>
  //           {getShowName()}
  //         </div>
  //       </div>
  //     );
  //   } else if (relativePath !== "") {
  //     const parentPath = getParentPath();
  //     const queryParameters = new URLSearchParams(window.location.search);
  //     const parent = queryParameters.get("parent");
  //     return (
  //       <div className={`${spCss["show-top-container"]}`}>
  //         <Link
  //           to={`${parentPath}?parent=${parent}`}
  //           className={`${css["link-button"]} ${spCss["return-button"]}`}
  //         >
  //           Return
  //         </Link>
  //         <div className={`${spCss["show-name-container"]}`}>
  //           {getShowName()}
  //         </div>
  //       </div>
  //     );
  //   } else {
  //     return "";
  //   }
  // }

  // function renderPrevButton() {
  //   const relativePath = decodeURIComponent(
  //     window.location.href.replace(/(?=http)(.*)(?<=shows\/)|\?(.*)/gm, "")
  //   );
  //   let pathIndex: number | null = null;
  //   for (let i = 0; i < paths.length; i++) {
  //     const path = paths[i];
  //     if (relativePath.includes(path.relativePath.replaceAll("\\", "/"))) {
  //       pathIndex = i;
  //     }
  //   }

  //   if (pathIndex !== null && pathIndex > 0) {
  //     return (
  //       <Link
  //         to={addParentQuery(
  //           paths[pathIndex - 1].relativePath,
  //           paths[pathIndex - 1].parent
  //         )}
  //         className={`${css["link-button"]} ${spCss["prev-next-nav-button"]}`}
  //       >
  //         Prev
  //       </Link>
  //     );
  //   } else {
  //     return (
  //       <div
  //         className={`${spCss["prev-next-nav-button"]} ${css["hidden"]}`}
  //       ></div>
  //     );
  //   }
  // }

  // function renderNextButton() {
  //   const relativePath = decodeURIComponent(
  //     window.location.href.replace(/(?=http)(.*)(?<=shows\/)|\?(.*)/gm, "")
  //   );
  //   let pathIndex: number | null = null;
  //   for (let i = 0; i < paths.length; i++) {
  //     const path = paths[i];
  //     if (relativePath.includes(path.relativePath.replaceAll("\\", "/"))) {
  //       pathIndex = i;
  //     }
  //   }

  //   if (pathIndex !== null && pathIndex < paths.length - 1) {
  //     return (
  //       <Link
  //         to={addParentQuery(
  //           paths[pathIndex + 1].relativePath,
  //           paths[pathIndex + 1].parent
  //         )}
  //         className={`${css["link-button"]} ${spCss["prev-next-nav-button"]}`}
  //       >
  //         Next
  //       </Link>
  //     );
  //   } else {
  //     return (
  //       <div
  //         className={`${spCss["prev-next-nav-button"]} ${css["hidden"]}`}
  //       ></div>
  //     );
  //   }
  // }

  return (
    <div className={`${spCss["shows-page"]}`}>
      {showsResponse.status === "loading" ? (
        <LinearProgress />
      ) : (
        <table className={`${spCss["table"]}`}>
          <tbody>
            {getShowsTable().map((row, i) => {
              return (
                <tr key={`table_row_${i}`}>
                  {row.map((show) => (
                    <td key={show.name.toLocaleLowerCase()}>
                      <Link
                        to={`./${show.name}?parent=${show.parent}`}
                        // to={addParentQuery(show.name, show.parent)}
                        className={`${css["link-button"]}`}
                      >
                        <ShowCard title={show.name} parent={show.parent} />
                      </Link>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {/* {renderParentLink()}
      {hasVideo ? (
        <>
          <VideoWidget />
          <div className={`${spCss["prev-next-nav"]}`}>
            {renderPrevButton()}
            {renderNextButton()}
          </div>
        </>
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
                  className={`${css["link-button"]} ${
                    spCss["season-episode"]
                  } ${isActive(_path.relativePath) ? spCss["active"] : ""} ${
                    isLastWatchedShow(_path.relativePath) && !hasVideo
                      ? spCss["last-watched"]
                      : ""
                  }`}
                >
                  {getLastPath(_path.relativePath)}
                </Link>
              </div>
            );
          })}
        </>
      )} */}
    </div>
  );
}

export default ShowsPage;
