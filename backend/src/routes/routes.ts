import { Express } from 'express';

import { authRouter } from './auth';
import { friendRouter } from './friend';

export function createRoutesWith(app: Express) {
  // app.use('/api/example', exampleRouter);

  app.use('/api/auth', authRouter);
  app.use('/api/friend', friendRouter);

  app.use('*', (_, res) => {
    res.status(404).json({ error: 'Not found' });
  });
}
