import express from "express";
import path from "path";
import cors from "cors";
import "dotenv/config";
import { corsOptions, hostAddress, serverEnv, webClientPath } from "./config";
import api from "./api";
import bodyParser from "body-parser";

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static(webClientPath));

app.use("/api", api);

app.get("*", (req, res) => {
  res.sendFile(path.join(webClientPath, "index.html"));
});

app.listen(5000, () => {
  console.log("server env:", serverEnv);
  console.log(`server started on ${hostAddress}:5000`);
});
