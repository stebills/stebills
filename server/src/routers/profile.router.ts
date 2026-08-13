import express from 'express';
import ProfileController from '../controllers/profile.controller';
import isAuth from '../middlewares/Authenticate';
import isAdmin from '../middlewares/isAdmin';

const router = express.Router();

router.get('/profile', isAuth, ProfileController.getProfile);
router.get('/profiles', isAuth, isAdmin, ProfileController.postProfile);

export default router;
