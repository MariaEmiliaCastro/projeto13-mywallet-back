import express from 'express';
import { signUpUser, signInUser, logoutUser } from '../Controllers/authController.js'

const router = express.Router();

router.post('/signup', signUpUser);
router.post('/signin', signInUser);
router.delete('/signout', logoutUser);

export default router;