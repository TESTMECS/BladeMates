import express from 'express';
import { createMiddlewaresWith } from './middleware/middleware';
import { createRoutesWith } from './routes/routes';

const app = express();

createMiddlewaresWith(app);
createRoutesWith(app);

export default app;
