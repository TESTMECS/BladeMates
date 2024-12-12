// TODO: ALL ROUTES HERE ARE TO BE REFACTORED INTO THEIR RESPECTIVE FILES LATER ONE

import express from 'express';
import { handleRouteError, validate } from '../utils/Error';
import { stringObjectIdSchema } from '../validation/mongo';
import { getComments } from '../data/comments';
import { stringSchema } from '../validation/common';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

const router = express.Router();

router.route('/:articleId').get(async (req, res) => {
  try {
    const articleIdData = validate(stringSchema, req.params.articleId);
    const comments = await getComments(articleIdData);
    res.status(200).send({ data: comments });
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});

export { router as commentsRouter };
