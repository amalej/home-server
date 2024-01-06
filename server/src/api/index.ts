import express from "express";
import v1 from "./v1";

const api = express();
const router = express.Router();

api.get("/api", function (req, res, next) {
  return res.send("api");
});
api.use("/api/v1", v1);

export default api;
