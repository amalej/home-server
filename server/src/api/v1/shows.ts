import { Router } from "express";
import { readPathInParentDir } from "../../utils";

const shows = Router();

shows.get("/", (req, res, next) => {
  return res.send("api/v1/shows");
});

shows.get("/:showPath(*)?", async (req, res, next) => {
  const showPath = req.params["showPath"];
  const showPathArray = showPath.split("/");
  const showName = showPathArray[0];
  const queries = req.query;
  const parent = queries["parent"] || null;
  try {
    if (typeof parent !== "string") {
      return res.status(400).send(`Missing "parent" param`);
    }
    const children = await readPathInParentDir(parent, showPath);
    return res.json({
      exists: true,
      showPath: showPath,
      showName: showName,
      parent: parent,
      children: children,
    });
  } catch (error) {
    return res.json({
      exists: false,
      showPath: showPath,
      showName: showName,
      parent: parent,
      children: [],
    });
  }
});

export default shows;
