import express from 'express';
import { handleRouteError, validate, validateWithType } from '../utils/Error';
import { getArticlesByTags } from '../data/articles';
import { redisConnection } from "../config/redisConnection";
// import { redisTagSearch } from '../middleware/middleware';

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
    // for the sake of creating a redis key later on
    // for redising, stringify the array of tags
    const client = await redisConnection();
    let exists = await client?.exists(`articleWithTag:${req.query.tags}`);

    if (exists) {
        let cachedArticle = await client?.get(`articleWithTag:${req.query.tags}`);
        if (cachedArticle) {
            res.status(200).send({ data: JSON.parse(cachedArticle) });
        }
    }
    
    let tags: string[] = [];
    console.log(`tags1: ${req.query.tags}`);
    if (!req.query.tags) {
        res.status(400).send('Tags not supplied');
        return;
    } 
    if (typeof req.query.tags === 'string') {
        tags = req.query.tags.split(',').map(tag => tag.trim());
    } else if (Array.isArray(req.query.tags)) {
        tags = (req.query.tags as string[]).map(tag => tag.trim());
    }
    if (tags.some(tag => tag === '')) {
        res.status(400).send('Tags cannot be empty');
        return;
    }
    tags = tags.sort();
    console.log(`tags2: ${tags}`);
    // since tags are sorted here, you can stringify and use as a redis key when we get there

    try {
        const articles = await getArticlesByTags(tags);
        let cachedArticle = await client?.set(`articleWithTag:${tags}`, JSON.stringify(articles));
        res.status(200).send({ data: articles });
    } catch (error) {
        handleRouteError(error, res);
    }
    return;
})

export { router as tagSearchRouter };