import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { frontendConfig } from '../config/settings';
import { credentials } from 'amqplib';
/**
 *
 * @param {express.Express} app
 */
export function createMiddlewaresWith(app: express.Express) {
  app.use(
    cors({
      origin: frontendConfig.url,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(
    session({
      secret: 'Unemployment-Gang',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    })
  );

  // Middleware to log the requester's URL
  app.use((req, res, next) => {
    // console.log(`Request URL: ${req.url}`);
    next();
  });

  app.use((req, res, next) => {
    // Template middleware for root level
    next();
  });
}

// export const redisTagSearch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//   let client = await redisConnection();
//   let exists = await client?.exists(`articleWithTag:${req.query.tags}`);
//   if (exists) {
//     let cachedArticle = await client?.get(
//       `articleWithTag:${req.query.tags}`
//     );
//     if (cachedArticle) {

//       res.status(200).send({ data: JSON.parse(cachedArticle) });
//     }
//     else{
//       next();
//     }
//   }
//   else{
//     next();
//   }
// }
