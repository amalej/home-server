import express from "express";
import shows from "./shows";
import subtitles from "./subtitles";

const v1 = express.Router();

v1.get("/", function (req, res, next) {
  return res.send("api/v1");
});

v1.use("/shows", shows);
v1.use("/subtitles", subtitles);

export default v1;
