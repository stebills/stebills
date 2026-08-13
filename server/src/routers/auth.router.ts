import express from 'express';
import Auth from '../controllers/auth.controller';
import isAuth from '../middlewares/Authenticate';

const router = express.Router();

router.post('/auth/google', Auth.googleSignIn);
router.post('/auth/send-otp', Auth.checkIfEmailExistAndSendToken);
router.post('/auth/resend-otp', Auth.resendOtp);
router.post('/auth/verify-otp', Auth.verifyOtp);
router.post('/auth/verify-email', Auth.verifyEmail);
router.post('/auth/set-password', Auth.setPassword);
router.post('/auth/set-transaction-pin', isAuth, Auth.setTransactionPin);
router.post('/auth/verify-transaction-pin', isAuth, Auth.verifyTransactionPin);

export default router;
