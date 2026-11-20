import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(
    express.json({
        limit: "16kb",
    }),
);
app.use(
    urlencoded({
        extended: true,
        limit: "16kb",
    }),
);
app.use(cookieParser());

app.use(errorHandler);

export { app };
