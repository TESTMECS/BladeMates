import express from "express";
import { handleRouteError, validate } from "../utils/Error";
import { stringObjectIdSchema } from "../validation/mongo";
import { follow, unfollow } from "../data/friend";
import { emitFollow, emitUnfollow } from "../services/emit";
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}
const router = express.Router();
router.route("/follow").post(async (req, res) => {
  try {
    const followeeId = validate(stringObjectIdSchema, req.body.followeeId);
    const followerId = validate(stringObjectIdSchema, req.body.followerId);
    if (followerId !== req.session.userId) {
      res.status(400).send("User not logged in");
      return;
    }
    if (req.session.userId === followeeId) {
      res.status(400).send("Cannot follow yourself");
      return;
    }
    await follow(followeeId, followerId);
    // send notification
    emitFollow(followerId, followeeId);
    res.status(200).send("Follow Successful");
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});
router.route("/unfollow").post(async (req, res) => {
  try {
    const unfolloweeId = validate(stringObjectIdSchema, req.body.unfolloweeId);
    const unfollowerId = validate(stringObjectIdSchema, req.body.unfollowerId);
    if (unfollowerId === undefined) {
      res.status(400).send("User not logged in");
      return;
    }
    if (unfollowerId === unfolloweeId) {
      res.status(400).send("Cannot unfollow yourself");
      return;
    }
    await unfollow(unfollowerId, unfolloweeId);
    // send notification
    emitUnfollow(unfollowerId, unfolloweeId);
    res.status(200).send("Unfollow Successful");
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});
export { router as friendRouter };
