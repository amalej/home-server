import path from "path";
import { findHostAddress } from "../utils";

export const serverEnv = process.env.SERVER_ENVIRONMENT || "development";
export const isProd = serverEnv === "production";

export const corsOptions = {
  origin: "*",
  methods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
};

export const webClientPath = isProd
  ? path.join(__dirname, "..", "..", `${process.env.WEB_CLIENT_BUILD_DIR}`)
  : path.join(__dirname, "..", "..", "..", "web-client", "build");
export const uploadPath = isProd
  ? path.join(__dirname, "..", "..", "uploads/")
  : path.join(__dirname, "..", "..", "..", "uploads/");

export const hostAddress = findHostAddress();
