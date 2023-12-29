import multer from "multer";
import { uploadPath } from "../config";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
export const multerUpload = multer({ storage: storage });
