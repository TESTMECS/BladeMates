import express from 'express';
import { handleRouteError, validate, validateWithType } from '../utils/Error';
import { getArticleOfTheWeek } from '../data/articles';
import { redisConnection } from '../config/redisConnection';
declare module 'express-session' {
    interface SessionData {
        userId: string;
    }
}


const router = express.Router();

router.route('/').get(async (req, res) => {
    // maybe redisify to expire at the next monday 12AM?
    try {
        const client = await redisConnection();
        const articleOTWCached = await client?.get('articleOTW');

        if (articleOTWCached) {
            res.status(200).json(JSON.parse(articleOTWCached));
            return;
        }

        const article = await getArticleOfTheWeek();
        await client?.set('articleOTW', JSON.stringify(article));
        res.status(200).send({ data: article });
    } catch (error) {
        handleRouteError(error, res);
    }
    return;
})

export { router as articleOTWRouter };