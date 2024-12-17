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
          console.log('articleOTW found in cache');
          res.status(200).send({ data: JSON.parse(cachedArticle) });
          return;
      }
  } else{
    console.log('articleOTW not found in cache');
  }

  try {
    const article = await getArticleOfTheWeek();
    if(!exists){
      await client?.set('articleOTW', JSON.stringify(article));
      await client?.expireat('articleOTW', Math.floor(new Date().setDate(new Date().getDate() + 7) / 1000));
    }
    res.status(200).send({ data: article });
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});
export { router as articleOTWRouter };
