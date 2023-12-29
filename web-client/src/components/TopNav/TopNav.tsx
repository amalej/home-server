import { Link } from "react-router-dom";
import cmnCss from "../../common/common.module.css";
import tnCss from "./TopNav.module.css";

function TopNav() {
  const getActiveLink = (): string => {
    return window.location.pathname.split("/")[1];
  };

  return (
    <div className={`${tnCss["top-nav"]}`}>
      <Link
        to={"/"}
        className={`${cmnCss["link-button"]} ${tnCss["links"]} ${
          getActiveLink() === "" ? tnCss["active"] : ""
        }`}
      >
        Home
      </Link>
      <Link
        to={"/shows"}
        className={`${cmnCss["link-button"]} ${tnCss["links"]} ${
          getActiveLink() === "shows" ? tnCss["active"] : ""
        }`}
      >
        Shows
      </Link>
      <Link
        to={"/upload"}
        className={`${cmnCss["link-button"]} ${tnCss["links"]} ${
          getActiveLink() === "upload" ? tnCss["active"] : ""
        }`}
      >
        Upload
      </Link>
    </div>
  );
}

export default TopNav;
