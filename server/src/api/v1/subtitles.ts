import { Router } from "express";
import { readPathInParentDir } from "../../utils";
import path from "path";

const subtitles = Router();

subtitles.get("/", (req, res, next) => {
  return res.send("api/v1/subtitles");
});

subtitles.get("/file(*)?", async (req, res, next) => {
  const queries = req.query;
  const parent = queries["parent"] || null;
  const showPath = queries["showPath"] || null;
  try {
    if (typeof showPath !== "string" || typeof parent !== "string") {
      return res.status(400).send(`Missing "showPath" and/or "parent" query`);
    }

    const showPathArray = showPath.split(/\\|\//g);
    showPathArray.pop();
    const showParentPath = showPathArray.join(path.sep);
    const children = await readPathInParentDir(parent, showParentPath);
    const subtitleFiles: any[] = [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const label = child.split("-").at(-1)?.replace(".vtt", "") || "";

      if (child.endsWith(".vtt")) {
        subtitleFiles.push({
          label,
          path: child,
        });
      }
    }

    return res.json({
      files: subtitleFiles,
    });
  } catch (error) {
    console.log(error);
  }
});

export default subtitles;
