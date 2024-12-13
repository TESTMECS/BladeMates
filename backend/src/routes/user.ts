import express from 'express';
import { handleRouteError, validate } from '../utils/Error';
// import { authSchema } from '../validation/auth';
import { getNotifications, getUserProfileData, getFavoriteArticles, getUserById, addTrend, removeTrend, getFollowingFeed } from '../data/user';
import { stringObjectIdSchema } from '../validation/mongo';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

const router = express.Router();

router.route('/notifications').post(async (req, res) => {
  try {
    const userIdData = validate(stringObjectIdSchema, req.session.userId);
    const notifications = await getNotifications(userIdData);
    res.status(200).send({ notifications });
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});

router.route('/profileData/:id').get(async (req, res) => {
  try {
    const userIdData = validate(stringObjectIdSchema, req.params.id);
    const user = await getUserProfileData(userIdData);
    res.status(200).send({ user });
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
})

router.route('/favorites/:id').get(async (req, res) => {
  try {
    const userId = validate(stringObjectIdSchema, req.params.id);
    const articles: string[] = await getFavoriteArticles(userId);

    res.status(200).send({ articles });
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});

router.route('/trends').get(async (req, res) => {
  try {
    if (req.session.userId === undefined) {
      res.status(400).send("User not logged in");
      return;
    }

    const user = await getUserById(req.session.userId);

    res.status(200).send(user.trends);
  } catch (error) {
    handleRouteError(error, res);
  }

  return;
})
.post(async (req, res) => {
  try {
    if (req.session.userId === undefined) {
      res.status(400).send("User not logged in");
      return;
    }
    if (req.body.trend === undefined) {
      res.status(400).send("Trend not provided");
      return;
    }

    const trends = await addTrend(req.session.userId, req.body.trend);

    res.status(200).send(trends);
  } catch (error) {
    handleRouteError(error, res);
  }

  return;
})
.delete(async (req, res) => {
  try {
    if (req.session.userId === undefined) {
      res.status(400).send("User not logged in");
      return;
    }
    if (req.body.trend === undefined) {
      res.status(400).send("Trend not provided");
      return;
    }

    const trends = await removeTrend(req.session.userId, req.body.trend);

    res.status(200).send(trends);
  } catch (error) {
    handleRouteError(error, res);
  }

  return;
});

router.route('/followingFeed').get(async (req, res) => {
  try {
    if (req.session.userId === undefined) {
      res.status(400).send("User not logged in");
      return;
    }

    const user = await getUserById(req.session.userId);

    const articles = await getFollowingFeed(req.session.userId);

    res.status(200).send(articles);
  } catch (error) {
    handleRouteError(error, res);
  }

  return;
});

export { router as userRouter };
