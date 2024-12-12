// TODO: ALL ROUTES HERE ARE TO BE REFACTORED INTO THEIR RESPECTIVE FILES LATER ONE
import express from 'express';
import { handleRouteError } from '../utils/Error';
// import {validate, validateWithType} from '../utils/Error';
// import { stringObjectIdSchema } from '../validation/mongo';
import { favoriteArticle, unfavoriteArticle } from '../data/article';
<<<<<<< HEAD
import { stringSchema } from '../validation/common';

=======
>>>>>>> main
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}
const router = express.Router();
router
  .route('/favorite')
  .post(async (req, res) => {
    try {
      if (req.session.userId === undefined) {
        res.status(400).send('User not logged in');
        return;
      }
      const userId = req.session.userId;
      const articleId = req.body.articleId;

<<<<<<< HEAD
      const articleId = validateWithType<string>(
        stringSchema,
        req.body.articleId
      );

=======
      console.log(userId, typeof userId, articleId, typeof articleId);
>>>>>>> main
      const articles = await favoriteArticle(userId, articleId);
      console.log("this is the response from POST /api/article/favorite", articles);
      res.status(200).send({ data: articles });
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
<<<<<<< HEAD
      const articleId = validate(stringSchema, req.body.articleId);

=======
      const articleId = req.body.articleId;
      console.log(userId, typeof userId, articleId, typeof articleId);
      // const articleId = validate(stringObjectIdSchema, req.body.articleId);
>>>>>>> main
      const articles = await unfavoriteArticle(userId, articleId);
      console.log("this is the response from DELETE /api/article/favorite", articles);
      res.status(200).send({ data: articles });
    } catch (error) {
      handleRouteError(error, res);
    }
    return;
  });

export { router as articleRouter };
