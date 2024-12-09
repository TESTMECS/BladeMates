import express from "express";
import { createMiddlewaresWith } from "./middleware/middleware";
import { createRoutesWith } from "./routes/routes";
import cors from "cors";
import { initializeSocket } from "./socket";

export const app = express();


app.use(cors());
app.use(express.json());

createMiddlewaresWith(app);
createRoutesWith(app);

export const server = initializeSocket(app);
