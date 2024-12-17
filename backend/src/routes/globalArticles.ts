import express from "express";
import { handleRouteError } from "../utils/Error";
import { getAllDocuments, getDocumentByID, searchHeadlinesAndDesc} from "../data/articles";
import { redisConnection } from "../config/redisConnection";
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}
const router = express.Router();
router.route("/articles").get(async (req, res) => {
  try {
    if (req.session.userId === undefined) {
      res.status(400).send("User not logged in");
      return;
    }
    const client = await redisConnection();
    const articlesCached = await client?.get("articles");
    if (articlesCached) {
      res.status(200).json(JSON.parse(articlesCached));
      return;
    }
    const articles = await getAllDocuments();
    await client?.set("articles", JSON.stringify(articles));
    res.status(200).json(articles);
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});
router.route("/article/:id").get(async (req, res) => {
  try {
    if (req.session.userId === undefined) {
      res.status(400).send("User not logged in");
      return;
    }
    const client = await redisConnection();
    const articleCached = await client?.get(`article:${req.params.id}`);
    if (articleCached) {
      res.status(200).json(JSON.parse(articleCached));
      return;
    }
    const article = await getDocumentByID(req.params.id);
    if (article === undefined) {
      res.status(404).send("Article not found");
      return;
    }
    await client?.set(`article:${req.params.id}`, JSON.stringify(article));
    res.status(200).json(article);
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});
router.route("/search/:query").get(async (req, res) => {
  try {
    if (req.session.userId === undefined) {
      res.status(400).send("User not logged in");
      return;
    }
    const client = await redisConnection();
    const searchCached = await client?.get(`search:${req.params.query}`);
    if (searchCached) {
      res.status(200).json(JSON.parse(searchCached));
      return;
    }
    const searchResults = await searchHeadlinesAndDesc(req.params.query);
    await client?.set(`search:${req.params.query}`, JSON.stringify(searchResults));
    res.status(200).json(searchResults);
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});

export { router as globalArticlesRouter };
