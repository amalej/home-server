import { Router } from "express";
import v1 from "./v1";

const api = Router();

api.get("/", function (req, res, next) {
  return res.send("api");
});

api.use("/v1", v1);

export default api;
