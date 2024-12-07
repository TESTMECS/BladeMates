import express from 'express'
import { handleRouteError, validate, validateWithType } from '../utils/Error';
import {
    elasticConnection,
    closeElasticConnection,
} from '../config/elasticConnection';
import { getDocumentsByTag } from "../data/articles"

declare module 'express-session' {
    interface SessionData {
        userId: string;
    }
}

const router = express.Router();

router.route('/').get(async (req, res) => {
    const tag = req.query.tag as string;
    if (!tag) {
        res.status(400).json({ error: 'Tag query parameter is required' });
        return;
    }

    const client = await elasticConnection();
    if (!client) {
        res.status(500).json({ error: 'Failed to connect to Elasticsearch' });
        return;
    }

    try {
        const articles = await getDocumentsByTag(tag);
        res.status(200).json({ data: articles });
    } catch (error) {
        console.error('Error during Elasticsearch operation:', error);
        res.status(500).json({ error: 'Failed to search for articles' });
    }
    await closeElasticConnection();
});

export { router as searchRouter };