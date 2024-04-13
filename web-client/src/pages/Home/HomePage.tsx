import { useState } from "react";
import { serverEndpoint } from "../../config";
import { getUserId } from "../../util";
import hpCss from "./HomePage.module.css";

function HomePage() {
  const [ticking, setTicking] = useState(true);

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
    <div className={`${hpCss["main"]}`}>
      <div>Home page, nothing to see here</div>
    </div>
  );
}

export default HomePage;
