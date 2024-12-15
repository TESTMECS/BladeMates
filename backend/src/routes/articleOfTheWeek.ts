import express from "express";
import { handleRouteError } from "../utils/Error";
import { getArticleOfTheWeek } from "../data/articles";
// import { redisConnection } from "../config/redisConnection";
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}
const router = express.Router();
router.route("/").get(async (_, res) => {
  try {
    // const client = await redisConnection();
    // const articleOTWCached = await client?.get("articleOTW");
    // if (articleOTWCached) {
    //   res.status(200).json(JSON.parse(articleOTWCached));
    //   return;
    // }
    const article = await getArticleOfTheWeek();
    //create articleOTW with an expiration date of next week
    // await client?.set("articleOTW", JSON.stringify(article));
    // await client?.expireAt(
    //   "articleOTW",
    //   Math.floor(new Date().setDate(new Date().getDate() + 7) / 1000),
    // );
    res.status(200).send({ data: article });
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});
export { router as articleOTWRouter };
