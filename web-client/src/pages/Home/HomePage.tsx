import TopNav from "../../components/TopNav/TopNav";
import hpCss from "./HomePage.module.css";

function HomePage() {
  return (
    <div>
      <TopNav />
      <div className={`${hpCss["message"]}`}>
        This is the Home page. There is nothing here....yet
      </div>
    </div>
  );
}

export default HomePage;
