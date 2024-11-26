import express from 'express';
import { handleRouteError, validate } from '../utils/Error';
// import { authSchema } from '../validation/auth';
import { getNotifications } from '../data/user';
import { stringObjectIdSchema } from '../validation/mongo';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

const router = express.Router();

router.route('/notifications').get(async (req, res) => {
  try {
    const userIdData = validate(stringObjectIdSchema, req.session.userId);
    const notifications = await getNotifications(userIdData);
    res.status(200).send(notifications);
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});

export { router as userRouter };
