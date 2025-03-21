import express from "express";
import ViteExpress from "vite-express";
import multer from "multer";
import fs from "fs";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { version } from '../../package.json';
import { PORT, FILE_UPLOAD_LIMIT, FILE_UPLOAD_DEST, FILE_UPLOAD_PASSWORD_HASH, UPLOAD_ID_LEN } from "./consts.js";
import { db } from "./db.js";

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
        destination: function(_req, _file, cb) {
            cb(null, FILE_UPLOAD_DEST);
        },

        filename: (_req, _file, cb) => {
            const newname = Date.now() + "-" + generateToken();
            cb(null, newname);
        },
    }),

    limits: { fileSize: FILE_UPLOAD_LIMIT },
});

app.get("/api/instance", (_req, res) => {
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

    if (!Array.isArray(req.files)) {
        // this won't happen because we used `upload.array` above.
        // please stfu, typescript
        return;
    }

    console.log("Received files:");
    for (const file of req.files) {
        db.push(file.filename, file.originalname);

        console.log(` - ${file.originalname}\n   (saved as ${file.filename})`);
    }

    res.status(200).json({
        filenamePairs: req.files.map((file) => ({
            filename: file.originalname,
            token: file.filename,
        })),
    });
});

app.get("/api/get/:token", (req, res) => {
    const { token } = req.params;
    const filename = db.getFilenameFromToken(token);

    if (!filename) {
        // TODO rate limiting
        return res.status(404).json({ error: "notfound" });
    }

    res.download(FILE_UPLOAD_DEST + token, filename);
});

/// Create a securely random token to use for a file upload's ID
function generateToken() {
    return crypto.randomBytes(UPLOAD_ID_LEN / 8).toString("hex");
}

ViteExpress.listen(app, PORT, () =>
    console.log(`Listening on port ${PORT}...`),
);
