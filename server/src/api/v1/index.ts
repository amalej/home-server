import express from "express";
import shows from "./shows";
import subtitles from "./subtitles";
import video from "./video";
import poster from "./poster";
import issues from "./issues";

const v1 = express.Router();

v1.get("/", function (req, res, next) {
  return res.send("api/v1");
});

v1.use("/shows", shows);
v1.use("/subtitles", subtitles);
v1.use("/video", video);
v1.use("/poster", poster);
v1.use("/issues", issues);

export default v1;
