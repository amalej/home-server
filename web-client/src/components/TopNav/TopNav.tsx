import { Link, useNavigate } from "react-router-dom";
import cmnCss from "../../common/common.module.css";
import tnCss from "./TopNav.module.css";
import Tabs from "@mui/material/Tabs/Tabs";
import Tab from "@mui/material/Tab/Tab";
import Box from "@mui/material/Box/Box";
import { useEffect, useState } from "react";

function TopNav() {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getActiveLink = (): string => {
    return window.location.pathname.split("/")[1];
  };

  function navigateTo(route: string) {
    navigate(route);
  }

  useEffect(() => {
    const activeLink = getActiveLink();
    switch (activeLink) {
      case "home":
        setValue(0);
        break;
      case "shows":
        setValue(1);
        break;
      case "upload":
        setValue(2);
        break;
      case "issues":
        setValue(3);
        break;
      default:
        setValue(0);
        break;
    }
  }, []);

  return (
    <div className={`${tnCss["top-nav"]}`}>
      <Box sx={{ borderBottom: 3, borderColor: "divider", width: "100%" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab
            label="Home"
            className={`${tnCss["header-tab"]} ${
              getActiveLink() === "" || getActiveLink() === "home"
                ? tnCss["active"]
                : ""
            }`}
            onClick={() => {
              navigateTo("/home");
            }}
          ></Tab>
          <Tab
            label="Shows"
            className={`${tnCss["header-tab"]} ${
              getActiveLink() === "shows" ? tnCss["active"] : ""
            }`}
            onClick={() => {
              navigateTo("/shows");
            }}
          ></Tab>
          <Tab
            label="Upload"
            className={`${tnCss["header-tab"]} ${
              getActiveLink() === "upload" ? tnCss["active"] : ""
            }`}
            onClick={() => {
              navigateTo("/upload");
            }}
          ></Tab>
          <Tab
            label="Issues"
            className={`${tnCss["header-tab"]} ${
              getActiveLink() === "issues" ? tnCss["active"] : ""
            }`}
            onClick={() => {
              navigateTo("/issues");
            }}
          ></Tab>
        </Tabs>
      </Box>
      {/* <Tabs>
        <Tab
          sx={{ padding: 0, margin: 0 }}
          label={
            <Link
              to={"/"}
              className={`${cmnCss["link-button"]} ${tnCss["links"]} ${
                getActiveLink() === "" ? tnCss["active"] : ""
              }`}
            >
              Home
            </Link>
          }
        ></Tab>
        <Tab
          sx={{ padding: 0, margin: 0 }}
          label={
            <Link
              to={"/shows"}
              className={`${cmnCss["link-button"]} ${tnCss["links"]} ${
                getActiveLink() === "shows" ? tnCss["active"] : ""
              }`}
            >
              Shows
            </Link>
          }
        ></Tab>
        <Tab
          sx={{ padding: 0, margin: 0 }}
          label={
            <Link
              to={"/upload"}
              className={`${cmnCss["link-button"]} ${tnCss["links"]} ${
                getActiveLink() === "upload" ? tnCss["active"] : ""
              }`}
            >
              Upload
            </Link>
          }
        ></Tab>
      </Tabs> */}
    </div>
  );
}

export default TopNav;
