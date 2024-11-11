import { Express } from 'express';

export function createRoutesWith(app: Express) {
  // app.use('/api/example', exampleRouter);

  app.use('*', (_, res) => {
    res.status(404).json({ error: 'Not found' });
  });
}
