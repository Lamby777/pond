import express from "express";
import ViteExpress from "vite-express";
import multer from "multer";
import fs from "fs";

import { PORT, FILE_UPLOAD_LIMIT, FILE_UPLOAD_DEST } from "./consts";

// make the temp upload directory if it doesn't exist
if (!fs.existsSync(FILE_UPLOAD_DEST)) {
    fs.mkdirSync(FILE_UPLOAD_DEST);
}

const app = express();

// initialize multer for file upload handling
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, FILE_UPLOAD_DEST);
        },

        filename: (req, file, cb) => {
            cb(null, Date.now() + "-" + file.originalname);
        },
    }),

    limits: { fileSize: FILE_UPLOAD_LIMIT },
});

app.post("/api/upload", upload.array("files"), (req, res) => {
    if (!req.files) {
        return res.status(400).send("No file uploaded.");
    }

    res.send("File uploaded successfully.");
});

ViteExpress.listen(app, PORT, () =>
    console.log(`Listening on port ${PORT}...`),
);
