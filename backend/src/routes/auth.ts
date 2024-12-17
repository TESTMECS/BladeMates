import express from "express";
import { handleRouteError, validate } from "../utils/Error";
import { authSchema } from "../validation/auth";
import {
  login,
  register,
  getUsernameFromId,
  getFriendsFromId,
} from "../data/auth";
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}
const router = express.Router();
router.route("/login").post(async (req, res) => {
  try {
    const loginCredentials = validate(authSchema, req.body);
    const userId = await login(
      loginCredentials.username,
      loginCredentials.password,
    );
    if (userId) {
      req.session.userId = userId;

      res.json({ userId });
    } else {
      res.status(500).send("Login Failed");
    }
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});
router.route("/register").post(async (req, res) => {
  try {
    const registerCredentials = validate(authSchema, req.body);
    const userId = await register(
      registerCredentials.username,
      registerCredentials.password,
    );
    if (userId) {
      req.session.userId = userId;
      res.json({ userId });
    } else {
      res.status(500).send("Register Failed");
    }
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});
router.route("/checkAuth").get(async (req, res) => {
  try {
    if (req.session.userId) {
      const username = await getUsernameFromId(req.session.userId);
      const friends = await getFriendsFromId(req.session.userId);
      res.json({ userId: req.session.userId, username, friends });
    }
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});
export { router as authRouter };
