import { homedir } from "os";
import path from "path";
import bcrypt from "bcrypt";

import dotenv from "dotenv";
dotenv.config();

export const APP_FOLDER = process.env.NODE_ENV === "production" ? "/srv/pond/" :
    path.join(homedir(), "pond/");
export const DB_PATH = path.join(APP_FOLDER, "pond.db");

export const PORT = 1998;
export const FILE_UPLOAD_LIMIT = 1_000_000_000; // 1 GB
export const FILE_UPLOAD_DEST = "/tmp/uploads/";
export const FILE_UPLOAD_PASSWORD_HASH = generatePasswordHash();

/// Number of bits in the ID part of the URL for an uploaded file.
export const UPLOAD_ID_LEN = 256;

function generatePasswordHash() {
    const plaintext = process.env.PASSWORD;
    process.env.PASSWORD = "";

    if (!plaintext) {
        console.warn("Running in insecure mode! Provide a password using the PASSWORD environment variable to prevent internet trolls and weirdos from potentially getting you in legal trouble.");
        return null;
    }

    return bcrypt.hashSync(plaintext, 10);
}
