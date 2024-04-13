import { Router } from "express";
import { multerUpload } from "../../multer-upload";

const upload = Router();

upload.get("/", (req, res) => {
  return res.send("api/v1/upload");
});

upload.post("/", multerUpload.single("file"), (req, res) => {
  res.json({ message: "File uploaded successfully!" });
});

export default upload;
