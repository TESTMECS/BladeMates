import express from "express";
import { handleRouteError } from "../utils/Error";
import { getArticlesByTags } from "../data/articles";
import { getUserById } from "../data/user";

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

    const user = await getUserById(req.session.userId);
    const articles = await getArticlesByTags(user.trends);

    res.status(200).json(articles);
  } catch (error) {
    handleRouteError(error, res);
  }

  return;
});

export { router as personalArticlesRouter };
