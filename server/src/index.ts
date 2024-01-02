import express from "express";
import path from "path";
import cors from "cors";
import fs from "fs";
import {
  loadShowPosterPath,
  loadShowsInParentDirectory,
  loadShowsParentDirectories,
  loadShowsPathsJson,
  logToTerminal,
} from "./utils";
import "dotenv/config";
import { corsOptions, hostAddress, serverEnv, webClientPath } from "./config";
import { multerUpload } from "./multer-upload";
import { stat } from "fs/promises";

const app = express();

app.use(express.static(webClientPath));
app.use(cors(corsOptions));

app.get("/api/v1/shows", cors(corsOptions), async (req, res) => {
  const api = "/api/v1/shows";
  logToTerminal(api, "START");
  const userId = req.headers["x-user-id"] || null;
  logToTerminal(api, "userId:", userId);
  try {
    const showsJson = await loadShowsPathsJson();
    if (showsJson === null) {
      res.status(404).send("No 'shows.json' file found.");
    } else {
      const files = await loadShowsParentDirectories(showsJson);
      const sorted = files.sort((a, b) => {
        if (a.relativePath < b.relativePath) {
          return -1;
        }
        if (a.relativePath < b.relativePath) {
          return 1;
        }
        return 0;
      });
      res.type("json").send(sorted);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error");
  }
});

app.get("/api/v1/shows(/*)?", cors(corsOptions), async (req, res) => {
  const api = "/api/v1/shows(/*)";
  logToTerminal(api, "START");
  const userId = req.headers["x-user-id"] || null;
  logToTerminal(api, "userId:", userId);
  try {
    const mainPath = decodeURIComponent(req.path.replace("/api/v1/shows/", ""));
    const queries = req.query;
    const parent = queries["parent"] as string;
    logToTerminal(api, "mainPath:", mainPath);
    logToTerminal(api, "parent:", parent);
    const files = await loadShowsInParentDirectory(mainPath, parent);
    const sorted = files.sort((a, b) => {
      if (a.relativePath < b.relativePath) {
        return -1;
      }
      if (a.relativePath < b.relativePath) {
        return 1;
      }
      return 0;
    });
    res.type("json").send(sorted);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error");
  }
});

app.get("/api/v1/shows-poster(/*)?", cors(corsOptions), async (req, res) => {
  const api = "/api/v1/poster(/*)?";
  logToTerminal(api, "START");
  const showsJson = await loadShowsPathsJson();
  const queries = req.query;
  const showName = decodeURIComponent(queries["name"] as string);
  const parent = queries["parent"] as string;
  const showRootDirPath = path.join(showsJson![parent], showName);
  const posterPath = await loadShowPosterPath(showRootDirPath);
  logToTerminal(api, "showName:", showName);
  logToTerminal(api, "posterPath:", posterPath);
  if (posterPath === null) {
    res.status(404).send("file-not-found");
  } else {
    try {
      const imageStream = fs.createReadStream(posterPath);
      imageStream.pipe(res);
    } catch (error) {
      res.status(404).send("file-not-found");
    }
  }
});

app.get("/api/v1/video(/*)?", cors(corsOptions), async (req, res) => {
  const api = "/api/v1/video(/*)?";
  logToTerminal(api, "START");
  const startDate = new Date();
  logToTerminal(api, "startDate", startDate);
  const showsJson = await loadShowsPathsJson();
  const range = req.headers.range as string;
  logToTerminal(api, "range:", range);
  if (!range) {
    res.status(400).send("Requires Range header");
    return;
  }
  const queries = req.query;
  const parent = queries["parent"] as string;
  const relativePath = queries["relativePath"] as string;
  const videoPath = path.join(showsJson![parent], relativePath);
  try {
    const video = await stat(videoPath);
    const videoSize = video.size;
    const CHUNK_SIZE = 1048576; // 1 Mb
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
    const endDate = new Date();
    logToTerminal(api, "relativePath:", relativePath);
    logToTerminal(api, "videoPath:", videoPath);
    logToTerminal(api, "endDate:", endDate);
    logToTerminal(api, "range:", range);
    logToTerminal(api, "chunks:", `${start}`, " => ", `${end}`);
    logToTerminal(api, "chunkSize:", `${contentLength}`);
    logToTerminal(api, "percentage:", `${end / videoSize}`);
    logToTerminal(
      api,
      "duration:",
      `${endDate.getTime() - startDate.getTime()}`
    );
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  } catch (error) {
    res.status(404).send("file-not-found");
  }
});

app.post("/api/v1/watching(/*)?", cors(corsOptions), (req, res) => {
  const api = "/api/v1/watching(/*)?";
  const userId = req.headers["x-user-id"] || null;
  const queries = req.query;
  const relativePath = decodeURIComponent(queries["relativePath"] as string);
  const parent = queries["parent"] as string;
  logToTerminal(api, "START");
  logToTerminal(api, "userId:", userId);
  logToTerminal(api, "relativePath:", relativePath);
  logToTerminal(api, "parent:", parent);
  res.json({ message: "File uploaded successfully!" });
});

app.post(
  "/api/v1/upload",
  cors(corsOptions),
  multerUpload.single("file"),
  (req, res) => {
    const api = "/api/v1/upload";
    logToTerminal(api, "START");
    res.json({ message: "File uploaded successfully!" });
  }
);

app.get("*", cors(corsOptions), (req, res) => {
  const api = "*";
  logToTerminal(api, "START");
  res.sendFile(path.join(webClientPath, "index.html"));
});

app.listen(5000, () => {
  console.log("server env:", serverEnv);
  console.log(`server started on ${hostAddress}:5000`);
});
