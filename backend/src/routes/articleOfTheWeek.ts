import express from 'express';
import { handleRouteError } from '../utils/Error';
import { getArticleOfTheWeek } from '../data/articles';
import { redisConnection } from '../config/redisConnection';
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}
const router = express.Router();
router.route('/').get(async (req, res) => {

  try {
    if (req.session.userId === undefined) {
        res.status(400).send('User not logged in');
        return;
    }
  } catch (error) {
      handleRouteError(error, res);
  }

  const client = await redisConnection();
  let exists = await client?.exists('articleOTW');

  if (exists) {
      let cachedArticle = await client?.get('articleOTW');
      if (cachedArticle) {
          res.status(200).send({ data: JSON.parse(cachedArticle) });
          return;
      }
  }


  try {
    const article = await getArticleOfTheWeek();
    res.status(200).send({ data: article });
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
})
export { router as articleOTWRouter };

