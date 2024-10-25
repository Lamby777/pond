import { homedir } from "os";
import path from "path";

export const HOME_DIR = homedir();
export const APP_FOLDER = process.env.NODE_ENV === "production" ? "/srv/pond/" :
    path.join(HOME_DIR, "pond/");

