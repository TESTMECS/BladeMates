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
    const userToFollow = validate(stringObjectIdSchema, req.body);
    console.log(userToFollow);

    if (req.session.userId === undefined) {
      res.status(500).send('User not logged in');
      return;
    }

    if (req.session.userId === userToFollow) {
      res.status(500).send('Cannot follow yourself');
      return;
    }

    await follow(req.session.userId, userToFollow);

    res.status(200).send('Follow Successful');
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});

router.route('/unfollow').post(async (req, res) => {
  try {
    const unfollowInformation = validate(stringObjectIdSchema, req.body);
    console.log(unfollowInformation);

    await unfollow(unfollowInformation.userID, unfollowInformation.friendID);

    res.status(200).send('Unfollow Successful');
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});

export { router as friendRouter };
