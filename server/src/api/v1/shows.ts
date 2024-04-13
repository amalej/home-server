import { Router } from "express";
import {
  getIgnoredFiles,
  readPathInParentDir,
  traverseThenRead,
  wait,
} from "../../utils";
import { readdir } from "fs/promises";

const shows = Router();

shows.get("/", async (req, res, next) => {
  try {
    const showsJsonText = await traverseThenRead("shows-paths.json");
    if (showsJsonText === null) {
      return res.status(404).send("No 'shows.json' file found.");
    } else {
      const showsJson = JSON.parse(showsJsonText);
      const pathKeys: string[] = Object.keys(showsJson);
      const showsParentList = [];
      const ignoredFiles = await getIgnoredFiles();
      for (let pathKey of pathKeys) {
        const pathValue = showsJson[pathKey];
        try {
          const filesInDir = await readdir(pathValue);
          for (let file of filesInDir) {
            if (ignoredFiles.includes(file)) continue;
            showsParentList.push({
              name: file,
              parent: pathKey,
            });
          }
        } catch (error) {}
      }
      await wait(1000);
      return res.type("json").send({ shows: showsParentList });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server error");
  }
});

shows.get("/:showPath(*)?", async (req, res, next) => {
  const showPath = req.params["showPath"];
  const showPathArray = showPath.split(/\\|\//g);
  const showName = showPathArray[0];
  const queries = req.query;
  const parent = queries["parent"] || null;
  try {
    if (typeof parent !== "string") {
      return res.status(400).send(`Missing "parent" param`);
    }
    let children = await readPathInParentDir(parent, showPath);
    const ignoredFiles = await getIgnoredFiles();
    const ignoredPattterns = new RegExp([".jpg", ".vtt", ".srt"].join("|"));
    children = children.filter(
      (child) => !ignoredFiles.includes(child) && !child.match(ignoredPattterns)
    );
    await wait(1000);
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
