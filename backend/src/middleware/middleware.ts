import express from 'express';

/**
 *
 * @param {express.Express} app
 */
export function createMiddlewaresWith(app: express.Express) {
  app.use((req, res, next) => {
    // Template middleware for root level
    next();
  });
}
