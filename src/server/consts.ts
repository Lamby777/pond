import { homedir } from "os";
import path from "path";
import bcrypt from "bcrypt";

export const HOME_DIR = homedir();
export const APP_FOLDER = process.env.NODE_ENV === "production" ? "/srv/pond/" :
    path.join(HOME_DIR, "pond/");


export const PORT = 1998;
export const FILE_UPLOAD_LIMIT = 1_000_000_000; // 1 GB
export const FILE_UPLOAD_DEST = "/tmp/uploads/";
export const FILE_UPLOAD_PASSWORD_HASH = generatePasswordHash();

function generatePasswordHash() {
    const plaintext = process.env.PASSWORD;
    if (!plaintext) {
        console.warn("Running in insecure mode! Provide a password using the PASSWORD environment variable to prevent internet trolls and weirdos from potentially getting you in legal trouble.");
        return null;
    }

    return bcrypt.hashSync(plaintext, 10);
}
