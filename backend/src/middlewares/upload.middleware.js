import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const uploadsDirectory = path.resolve(currentDirectory, "../../public/uploads");

fs.mkdirSync(uploadsDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    callback(null, uploadsDirectory);
  },
  filename(_req, file, callback) {
    const extension = path.extname(file.originalname) || ".jpg";
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    callback(null, safeName);
  },
});

const imageUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(_req, file, callback) {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
      return;
    }

    callback(new Error("Only image uploads are allowed"));
  },
});

export { imageUpload, uploadsDirectory };
