import express from "express";
import ViteExpress from "vite-express";

const PORT = 1998;

const app = express();

ViteExpress.listen(app, PORT, () =>
    console.log(`Server is listening on port ${PORT}...`),
);
