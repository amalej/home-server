import { Router } from "express";
import { getParentDirectory, readPathInParentDir } from "../../utils";
import path from "path";

const subtitles = Router();

subtitles.get("/", (req, res) => {
  return res.send("api/v1/subtitles");
});

subtitles.get("/file/:filePath(*)?", async (req, res) => {
  const queries = req.query;
  const filePath = req.params["filePath"];
  const parent = queries["parent"] || null;
  if (typeof parent !== "string") {
    return res.status(400).send(`Missing "parent" parameter`);
  }
  const parentPath = await getParentDirectory(parent);
  const fullPath = path.join(parentPath, filePath);
  console.log(fullPath)
  return res.sendFile(fullPath);
});

subtitles.get("/:showPath(*)?", async (req, res) => {
  const queries = req.query;
  const parent = queries["parent"] || null;
  const showPath = req.params["showPath"];
  const watch = queries["watch"] || null;
  try {
    if (
      typeof showPath !== "string" ||
      typeof parent !== "string" ||
      typeof watch !== "string"
    ) {
      return res
        .status(400)
        .send(`Missing "showPath" parameter, "parent" query, "watch" query`);
    }

    const epName = watch.split(".").slice(0, -1).join(".");
    const showPathArray = showPath.split(/\\|\//g);
    const showParentPath = showPathArray.join(path.sep);
    const children = await readPathInParentDir(parent, showParentPath);
    const subtitleFiles: any[] = [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!child.includes(epName)) continue;
      const label =
        child
          .replace(epName, "")
          .replace(/\.vtt|\.srt/g, "")
          .replaceAll("-", "") || "Default";

      if (child.endsWith(".vtt") || child.endsWith(".srt")) {
        subtitleFiles.push({
          label,
          path: `/api/v1/subtitles/file/${[showPath, child].join(
            "/"
          )}?parent=${parent}`,
        });
      }
    }

    return res.json({
      files: subtitleFiles,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

export default subtitles;
