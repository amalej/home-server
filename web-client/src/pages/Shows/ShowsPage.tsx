import { Link } from "react-router-dom";
import css from "../../common/common.module.css";
import ShowCard from "./ShowCard/ShowCard";
import spCss from "./ShowsPage.module.css";
import { useGetShows } from "./ShowsPage.hooks";
import LinearProgress from "@mui/material/LinearProgress/LinearProgress";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { ShowData } from "../../types";

const SHOW_CARD_WIDTH = 150;

function ShowsPage() {
  const [showFilter, setShowFilter] = useState("");
  const showsResponse = useGetShows();

  function getShowsTable(): Array<Array<{ name: string; parent: string }>> {
    const showList: ShowData[] =
      showsResponse.status === "success"
        ? JSON.parse(showsResponse.body).shows
        : [];
    const wWidth = window.innerWidth;
    const showCardWidth = SHOW_CARD_WIDTH;
    const showsPerRow = Math.floor(wWidth / showCardWidth);
    const filteredPaths = showList.filter((showData) => {
      const name = showData.name;
      if (name.toLowerCase().includes(showFilter.toLowerCase())) {
        return true;
      }
      return false;
    });

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

  return (
    <div className={`${spCss["shows-page"]}`}>
      {showsResponse.status === "loading" ? (
        <LinearProgress />
      ) : (
        <div>
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
                      <td key={show.name.toLocaleLowerCase()}>
                        <Link
                          to={`./${show.name}?parent=${show.parent}`}
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
        </div>
      )}
    </div>
  );
}

export default ShowsPage;
