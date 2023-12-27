import { Link } from "react-router-dom";
import css from "../../common/common.module.css";

function HomePage() {
  return (
    <div>
      <br />
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
  );
}

export default HomePage;
