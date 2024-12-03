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
    const userToFollow = validate(stringObjectIdSchema, req.body.userId);
    console.log(userToFollow);
    console.log(req.session.userId);

    if (req.session.userId === undefined) {
      res.status(400).send('User not logged in');
      return;
    }

    if (req.session.userId === userToFollow) {
      res.status(400).send('Cannot follow yourself');
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
    const userToUnfollow = validate(stringObjectIdSchema, req.body.userId);
    console.log(userToUnfollow);

    if (req.session.userId === undefined) {
      res.status(400).send('User not logged in');
      return;
    }

    if (req.session.userId === userToUnfollow) {
      res.status(400).send('Cannot unfollow yourself');
      return;
    }

    await unfollow(req.session.userId, userToUnfollow);

    res.status(200).send('Unfollow Successful');
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});

export { router as friendRouter };
