import { useEffect, useState } from "react";
import TopNav from "../../components/TopNav/TopNav";
import hpCss from "./HomePage.module.css";
import { serverEndpoint } from "../../config";
import { getUserId } from "../../util";
import { UserData } from "../../types";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function HomePage() {
  const [ticking, setTicking] = useState(true),
    [count, setCount] = useState(0);
  const [userDataMap, setUserDataMap] = useState<{ [key: string]: UserData }>(
    {}
  );

  useEffect(() => {
    const timer = setTimeout(() => ticking && setCount(count + 1), 3000);
    return () => clearTimeout(timer);
  }, [count, ticking]);

  useEffect(() => {
    const fetchEndpoint = `${serverEndpoint}/api/v1/user-data`;
    fetch(fetchEndpoint, {
      headers: {
        "x-user-id": getUserId(),
      },
    })
      .then(async (response) => {
        const res = response;
        const textContent = await res.text();
        const jsonObj = JSON.parse(textContent);
        setUserDataMap(jsonObj);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [count]);

  function deleteUserData() {
    const fetchEndpoint = `${serverEndpoint}/api/v1/user-data?uid=${getUserId()}`;
    fetch(fetchEndpoint, {
      method: "delete",
      headers: {
        "x-user-id": getUserId(),
      },
    })
      .then(async (response) => {
        const res = response;
        const textContent = await res.text();
        console.log(textContent);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      <div className={`${hpCss["user-data-container"]}`}>
        {Object.keys(userDataMap).map((userId) => {
          const userData = userDataMap[userId];
          const currentDate = new Date(userData.show.lastDateWatched);
          return (
            <div key={userId} className={`${hpCss["user-data"]}`}>
              <div className={`${hpCss["user-id"]}`}>
                <div>{userId}</div>
                <button onClick={deleteUserData}>
                  <DeleteForeverIcon className={`${hpCss["icon"]}`} />
                </button>
              </div>
              <div className={`${hpCss["show-last-watched"]}`}>
                {userData.show.lastWatched}
              </div>
              <div className={`${hpCss["show-last-watched"]}`}>
                {currentDate.toString()}
              </div>
              <div className={`${hpCss["show-last-watched"]}`}>
                {userData.show.percentLoaded}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;
