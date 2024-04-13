import { Router } from "express";
import { traverseThenRead } from "../../utils";
import path from "path";
import { readdir } from "fs/promises";

const poster = Router();

poster.get("/", async (req, res) => {
  const queries = req.query;
  const parent = queries["parent"] || null;
  const showPath = queries["show-path"] || null;
  const missingQueries = [];
  if (parent === null) missingQueries.push("'parent'");
  if (showPath === null) missingQueries.push("'show-path'");
  if (missingQueries.length !== 0) {
    return res
      .status(400)
      .send(`Missing queries: ${missingQueries.join(", ")}`);
  }

  try {
    const showsJsonText = await traverseThenRead("shows-paths.json");
    if (showsJsonText === null) {
      return res.status(404).send("No 'shows.json' file found.");
    } else {
      const showsJson = JSON.parse(showsJsonText);
      const parentPath: string = showsJson[parent as string] || null;
      if (parentPath) {
        const dirPath = path.join(parentPath, showPath as string);
        const files = await readdir(dirPath);
        const posterFile =
          files.filter((file: string) => file.includes("poster"))[0] || null;
        if (posterFile) {
          const fullPath = path.join(dirPath, posterFile);
          return res.sendFile(fullPath);
        }
      }
      return res.status(200).send(null);
    }
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return res
        .status(400)
        .send("Path does not exist. Request may be malformed");
    }
    return res.status(500).send("Internal server error");
  }
});

export default poster;
