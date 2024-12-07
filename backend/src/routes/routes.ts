import { Express } from 'express';

import { authRouter } from './auth';
import { articleRouter } from './article';
import { userRouter } from './user';
import { friendRouter } from './friend';
import { searchRouter } from './globalSearch';
import { globalArticlesRouter } from './globalArticles';

export function createRoutesWith(app: Express) {
  // app.use('/api/example', exampleRouter);

  app.use('/api/auth', authRouter);
  app.use('/api/friend', friendRouter);

  app.use('/api/article', articleRouter);

  app.use('/api/user', userRouter);
  app.use('/api/global', globalArticlesRouter);

  app.use('/api/search', searchRouter);

  app.use('*', (_, res) => {
    res.status(404).json({ error: 'Not found' });
  });
}
