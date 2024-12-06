import express from "express";
import { handleRouteError } from "../utils/Error";
import { getAllDocuments, getDocumentByID } from "../data/articles";

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

    const articles = await getAllDocuments();

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

    const article = await getDocumentByID(req.params.id);

    if (article === undefined) {
      res.status(404).send("Article not found");
      return;
    }

    res.status(200).json(article);
  } catch (error) {
    handleRouteError(error, res);
  }

  return;
});

export { router as globalArticlesRouter };
