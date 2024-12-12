// TODO: ALL ROUTES HERE ARE TO BE REFACTORED INTO THEIR RESPECTIVE FILES LATER ONE
import express from 'express';
import { handleRouteError } from '../utils/Error';
// import {validate, validateWithType} from '../utils/Error';
// import { stringObjectIdSchema } from '../validation/mongo';
import { favoriteArticle, unfavoriteArticle } from '../data/article';
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

      console.log(userId, typeof userId, articleId, typeof articleId);
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
      const articleId = req.body.articleId;
      console.log(userId, typeof userId, articleId, typeof articleId);
      // const articleId = validate(stringObjectIdSchema, req.body.articleId);
      const articles = await unfavoriteArticle(userId, articleId);
      console.log("this is the response from DELETE /api/article/favorite", articles);
      res.status(200).send({ data: articles });
    } catch (error) {
      handleRouteError(error, res);
    }
    return;
  });

export { router as articleRouter };
