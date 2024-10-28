import express from "express";
import ViteExpress from "vite-express";
import multer from "multer";
import fs from "fs";

import { version } from '../../package.json';
import { PORT, FILE_UPLOAD_LIMIT, FILE_UPLOAD_DEST, FILE_UPLOAD_PASSWORD_HASH } from "./consts";

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

app.get("/api/instance", (req, res) => {
    res.json({
        /// Is the ability to upload files locked behind a password prompt?
        secured: !!FILE_UPLOAD_PASSWORD_HASH,

        /// Version of the `pond` backend.
        backendVersion: version,

        /// The maximum file size allowed for uploads in bytes.
        fileUploadLimit: FILE_UPLOAD_LIMIT,
    });
});

app.post("/api/upload", upload.array("files"), (req, res) => {
    if (!req.files) {
        return res.status(400).send("No files uploaded.");
    }

    console.log("Received files:");
    console.log(req.files);

    res.send("File uploaded successfully.");
});

ViteExpress.listen(app, PORT, () =>
    console.log(`Listening on port ${PORT}...`),
);
