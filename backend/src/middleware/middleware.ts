import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { frontendConfig } from '../config/settings';
/**
 *
 * @param {express.Express} app
 */
export function createMiddlewaresWith(app: express.Express) {
  app.use(cors({
    origin: frontendConfig.url,
    credentials: true
  }));
  app.use(express.json());
  app.use(
    session({
      secret: 'Unemployment-Gang',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }
    })
  );
  app.use((req, res, next) => {
    // Template middleware for root level
    next();
  });
}
