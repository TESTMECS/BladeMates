import { Express } from 'express';

import { authRouter } from './auth';

export function createRoutesWith(app: Express) {
  // app.use('/api/example', exampleRouter);

  app.use('/api/auth', authRouter);

  app.use('*', (_, res) => {
    res.status(404).json({ error: 'Not found' });
  });
}
