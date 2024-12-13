import express from 'express';
import { createMiddlewaresWith } from './middleware/middleware';
import { createRoutesWith } from './routes/routes';
import { initializeSocket } from './socket';

export const app = express();

createMiddlewaresWith(app);
createRoutesWith(app);

export const server = initializeSocket(app);
