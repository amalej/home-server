import express from "express";
import path from "path";
import cors from "cors";
import fs from "fs";
import {
  findHostAddress,
  loadShowsInParentDirectory,
  loadShowsParentDirectories,
  loadShowsPathsJson,
} from "./utils";
import multer from "multer";
import "dotenv/config";

const hostAddress = findHostAddress();
const app = express();

console.log("--------");

const isProd = process.env.SERVER_ENVIRONMENT === "production";
console.log("Server Env:", process.env.SERVER_ENVIRONMENT);

const webClientPath = isProd
  ? path.join(__dirname, "..", `${process.env.WEB_CLIENT_BUILD_DIR}`)
  : path.join(__dirname, "..", "..", "web-client", "build");
const uploadPath = isProd
  ? path.join(__dirname, "..", "uploads/")
  : path.join(__dirname, "..", "..", "uploads/");

app.use(
  express.static(path.join(__dirname, "..", "..", "web-client", "build"))
);

app.get("/api/v1/shows", cors(), async (req, res) => {
  console.log("/api/v1/shows");
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

app.get("/api/v1/shows(/*)?", cors(), async (req, res) => {
  try {
    console.log("/api/v1/shows(/*)");
    const mainPath = decodeURIComponent(req.path.replace("/api/v1/shows/", ""));
    const queries = req.query;
    const parent = queries["parent"] as string;
    console.log(mainPath);
    console.log("parent");
    console.log(parent);
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

app.get("/watch", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/video(/*)?", cors(), async (req, res) => {
  const startDate = new Date();
  console.log(startDate);
  const showsJson = await loadShowsPathsJson();
  console.log("/video(/*)?");
  const range = req.headers.range as string;
  if (!range) {
    res.status(400).send("Requires Range header");
  }
  const queries = req.query;
  const parent = queries["parent"] as string;
  const relativePath = queries["relativePath"] as string;
  const videoPath = path.join(showsJson![parent], relativePath);
  const videoSize = fs.statSync(videoPath).size;
  // const CHUNK_SIZE = 81920;
  const CHUNK_SIZE = 1638400;
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
  console.log(endDate);
  console.log("chunks:", start, " => ", end);
  console.log("percentage:", end / videoSize);
  console.log("duration:", endDate.getTime() - startDate.getTime());
  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
app.post("/api/v1/upload", cors(), upload.single("file"), (req, res) => {
  console.log("/api/v1/upload");
  res.json({ message: "File uploaded successfully!" });
});

app.get("*", cors(), (req, res) =>
  res.sendFile(path.join(webClientPath, "index.html"))
);

app.listen(5000, () => {
  console.log(`server started on ${hostAddress}:5000`);
});
