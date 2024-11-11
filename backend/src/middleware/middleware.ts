import express from 'express';
import session from 'express-session';

/**
 *
 * @param {express.Express} app
 */
export function createMiddlewaresWith(app: express.Express) {
  app.use(
    session({
      secret: 'Unemployment-Gang',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );

  app.use((req, res, next) => {
    // Template middleware for root level
    next();
  });
}
