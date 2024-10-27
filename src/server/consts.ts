import { homedir } from "os";
import path from "path";

export const HOME_DIR = homedir();
export const APP_FOLDER = process.env.NODE_ENV === "production" ? "/srv/pond/" :
    path.join(HOME_DIR, "pond/");


export const PORT = 1998;
export const FILE_UPLOAD_LIMIT = 1_000_000_000; // 1 GB
export const FILE_UPLOAD_DEST = "/tmp/uploads/";

