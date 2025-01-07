import express from "express";
import ViteExpress from "vite-express";
import multer from "multer";
import fs from "fs";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { version } from '../../package.json';
import { PORT, FILE_UPLOAD_LIMIT, FILE_UPLOAD_DEST, FILE_UPLOAD_PASSWORD_HASH, UPLOAD_ID_LEN } from "./consts";
import { db } from "./db";

// make the temp upload directory if it doesn't exist
if (!fs.existsSync(FILE_UPLOAD_DEST)) {
    fs.mkdirSync(FILE_UPLOAD_DEST);
}

// clear the temp upload directory on startup
fs.readdir(FILE_UPLOAD_DEST, (err, files) => {
    if (err) {
        console.error("Error reading upload directory: ", err);
        return;
    }

    for (const file of files) {
        fs.unlink(FILE_UPLOAD_DEST + file, (err) => {
            if (err) {
                console.error("Error deleting file: ", err);
            }
        });
    }
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initialize multer for file upload handling
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, FILE_UPLOAD_DEST);
        },

        filename: (req, file, cb) => {
            const newname = Date.now() + "-" + file.originalname;
            cb(null, newname);
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
    if (!!FILE_UPLOAD_PASSWORD_HASH) {
        const password = req.body.password;

        if (!password) {
            console.log(`Rejected an upload: no password provided`);
            return res.status(400).json({ error: "nopassword" });
        }

        if (!bcrypt.compareSync(password, FILE_UPLOAD_PASSWORD_HASH)) {
            console.log(`Rejected an upload: invalid password \`${password}\` provided`);
            return res.status(403).json({ error: "badpassword" });
        }
    }

    if (!req.files) {
        return res.status(400).json({ error: "nofilesuploaded" });
    }

    console.log("Received files:");
    for (const file of req.files) {
        const token = generateToken();
        db.push(token, file.filename);

        console.log(` - ${file.filename}\n   (saved as ${token})`);
    }

    res.send("File uploaded successfully.");
});

/// Create a securely random token to use for a file upload's ID
function generateToken() {
    return crypto.randomBytes(UPLOAD_ID_LEN / 8).toString("hex");
}

ViteExpress.listen(app, PORT, () =>
    console.log(`Listening on port ${PORT}...`),
);
