// TODO: ALL ROUTES HERE ARE TO BE REFACTORED INTO THEIR RESPECTIVE FILES LATER ONE

import express from 'express';
import { handleRouteError, validate, validateWithType } from '../utils/Error';
import { stringObjectIdSchema } from '../validation/mongo';
import { addComment, deleteComment, editComment } from '../data/comment';
import { stringSchema } from '../validation/common';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

const router = express.Router();

router
  .route('/:articleId')
  .post(async (req, res) => {
    try {
      if (req.session.userId === undefined) {
        res.status(400).send('User not logged in');
        return;
      }
      const userId = req.session.userId;

      const articleId = validateWithType<string>(
        stringObjectIdSchema,
        req.params.articleId
      );

      const contentData = validateWithType<string>(
        stringSchema,
        req.body.content
      );

      const comment = await addComment(articleId, userId, contentData);

      res.status(200).send({ data: comment });
    } catch (error) {
      handleRouteError(error, res);
    }
    return;
  })
  .put(async (req, res) => {
    try {
      if (req.session.userId === undefined) {
        res.status(400).send('User not logged in');
        return;
      }
      const userId = req.session.userId;

      const commentId = validate(stringObjectIdSchema, req.body.commentId);
      const content = validate(stringSchema, req.body.content);

      const comment = await editComment(commentId, userId, content);

      res.status(200).send({ data: comment });
    } catch (error) {
      handleRouteError(error, res);
    }
    return;
  })
  .delete(async (req, res) => {
    try {
      if (req.session.userId === undefined) {
        res.status(400).send('User not logged in');
        return;
      }
      const userId = req.session.userId;

      const commentId = validate(stringObjectIdSchema, req.body.commentId);

      await deleteComment(commentId, userId);

      res.status(200).send({ commentId });
    } catch (error) {
      handleRouteError(error, res);
    }
    return;
  });

export { router as commentRouter };
