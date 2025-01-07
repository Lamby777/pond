import bsql3 from "better-sqlite3";
import fs from "fs";

import { APP_FOLDER, UPLOAD_ID_LEN, DB_PATH } from "./consts.js";

fs.mkdirSync(APP_FOLDER, { recursive: true });
const database = new bsql3(DB_PATH);
database.pragma('journal_mode = WAL');

export namespace db {
    /// Check the database for the name of a file associated with a token
    export function getFilenameFromToken(token: string) {
        return database.prepare(`SELECT filename FROM uploads WHERE token = ?;`)
            .get(token);
    }

    /// Insert a token and filename pair
    export async function push(token: string, filename: string) {
        // check if the token already exists
        if (getFilenameFromToken(token)) {
            console.error(`Token \`${token}\` already exists! Either you got extremely unlucky or there's a bug.`);
            return;
        }

        database.prepare(`INSERT INTO uploads(token, filename) VALUES(?, ?);`)
            .run(token, filename);
    }
}

async function initTables() {
    // database.prepare(`DROP TABLE IF EXISTS uploads;`).run();

    database.prepare(`
        CREATE TABLE IF NOT EXISTS uploads(
            token           TEXT        PRIMARY KEY,
            filename        TEXT        NOT NULL
        );
    `).run();
}

await initTables();
export default db;
