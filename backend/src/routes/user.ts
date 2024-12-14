import express from "express";
import { handleRouteError, validate } from "../utils/Error";
import { getUserProfileData, getFavoriteArticles } from "../data/user";
import { stringObjectIdSchema } from "../validation/mongo";
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}
const router = express.Router();
// maybe should be GET?
// router.route("/notifications").post(async (req, res) => {
//   try {
//     const userIdData = validate(stringObjectIdSchema, req.session.userId);
//     const notifications = await getNotifications(userIdData);
//     res.status(200).send({ notifications });
//   } catch (error) {
//     handleRouteError(error, res);
//   }
//   return;
// });
router.route("/profileData/:id").get(async (req, res) => {
  try {
    const userIdData = validate(stringObjectIdSchema, req.params.id);
    const user = await getUserProfileData(userIdData);
    res.status(200).send({ user });
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});
router.route("/favorites/:id").get(async (req, res) => {
  try {
    const userId = validate(stringObjectIdSchema, req.params.id);
    const articles: string[] = await getFavoriteArticles(userId);

    res.status(200).send({ articles });
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});

export { router as userRouter };
