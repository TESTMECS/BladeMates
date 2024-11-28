import express from 'express';
import { handleRouteError, validate } from '../utils/Error';
import { stringObjectIdSchema } from '../validation/mongo';
import { follow, unfollow } from '../data/friend';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

const router = express.Router();

router.route('/follow').post(async (req, res) => {
  try {
    const followInformation = validate(stringObjectIdSchema, req.body);
    console.log(followInformation);

    const userId = await follow(
      followInformation.userID,
      followInformation.friendID
    );

    if (userId) {
      req.session.userId = userId;
      res.status(200).send('Follow Successful');
    } else {
      res.status(500).send('Follow Failed');
    }
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});

router.route('/unfollow').post(async (req, res) => {
  try {
    const unfollowInformation = validate(stringObjectIdSchema, req.body);
    console.log(unfollowInformation);

    const userId = await unfollow(
      unfollowInformation.userID,
      unfollowInformation.friendID
    );

    if (userId) {
      req.session.userId = userId;
      res.status(200).send('Unfollow Successful');
    } else {
      res.status(500).send('Unfollow Failed');
    }
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});

export { router as friendRouter };
