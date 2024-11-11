import express from 'express';
import axios from 'axios';
import { handleRouteError } from '../utils/Error';

const router = express.Router();

router.route('/login').post(async (req, res) => {
  try {
    res.json({ results: 'Implement' });
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});

router.route('/register').post(async (req, res) => {
  try {
    res.json({ results: 'Implement' });
  } catch (error) {
    handleRouteError(error, res);
  }
  return;
});

export { router as authRouter };
