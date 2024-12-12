import express from 'express';
import { handleRouteError } from '../utils/Error';
import { getArticleOfTheWeek } from '../data/articles';
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}
const router = express.Router();
router.route('/').get(async (req, res) => {
  try {
    const article = await getArticleOfTheWeek();
    res.status(200).send({ data: article });
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
})
export { router as articleOTWRouter };

