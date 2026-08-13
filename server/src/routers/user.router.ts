import express from 'express';
import UserController from '../controllers/user.controller';
import isAuth from '../middlewares/Authenticate';
import isAdmin from '../middlewares/isAdmin';

const router = express.Router();

router.post('/users', UserController.postUser);
router.post('/users/login', UserController.login);
router.get('/users', isAuth, isAdmin, UserController.getUsers);
router.get('/users/suspended', isAuth, isAdmin, UserController.getSuspendedUsers);
router.get('/users/agents', isAuth, isAdmin, UserController.getAllAgents);
router.get('/users/:id', isAuth, UserController.getUserById);
router.put('/users/:id', isAuth, UserController.updateUser);
router.patch('/users/:id/toggle-suspension', isAuth, isAdmin, UserController.toggleUserSuspension);
router.delete('/users/:id', isAuth, isAdmin, UserController.deleteUser);

export default router;
