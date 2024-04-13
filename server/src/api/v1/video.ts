import { Router } from "express";
import path from "path";
import { loadShowsPathsJson } from "../../utils";
import { stat } from "fs/promises";
import { createReadStream } from "fs";

const video = Router();

video.get("/", (req, res, next) => {
  return res.send("api/v1/video");
});

video.get("/:showPath(*)?", async (req, res, next) => {
  const queries = req.query;
  const parent = queries["parent"] || null;
  const watch = queries["watch"] || null;
  const showPath = req.params["showPath"] || null;
  try {
    const showsJson = await loadShowsPathsJson();
    const range = req.headers.range as string;
    if (!range) {
      return res.status(400).send("Requires Range header");
    }
    // Check if the video has a valid path and name.
    if (
      showsJson !== null &&
      typeof parent === "string" &&
      showsJson[parent] &&
      typeof showPath === "string" &&
      typeof watch === "string"
    ) {
      const fullPath = path.join(showsJson[parent], showPath, watch);
      const video = await stat(fullPath);
      const videoSize = video.size;
      const CHUNK_SIZE = 1_000_000;
      const start = Number(range.replace(/\D/g, ""));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };
      const videoStream = createReadStream(fullPath, { start, end });
      res.writeHead(206, headers);
      return videoStream.pipe(res);
    }
  } catch (error: any) {
    return res.status(500).send(error.message);
  }

  return res.send("api/v1/video");
});

export default video;
