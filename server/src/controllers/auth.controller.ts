import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import {
  generateRandomToken,
  generateAndSaveOTP,
} from '../utils/GenerateRandomToken';
import bcrypt from 'bcrypt';
import EmailSender from '../services/mail.service';
import catchAsync from '../utils/catchAsync';
import { sendSuccess, sendError } from '../utils/apiResponse';

class Auth {
  static verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return sendError(res, 400, 'Missing fields: Email and OTP required');
    }

    await AuthService.verifyEmail(email, verificationCode);

    return sendSuccess(res, 200, 'User verification successful');
  });

  static setTransactionPin = catchAsync(async (req: Request, res: Response) => {
    const { newPin } = req.body;
    const email = (req as any).user.email;

    if (!newPin) {
      return sendError(res, 400, 'Missing fields: Email and newPin required');
    }

    await AuthService.setTransactionPin(email, newPin);

    return sendSuccess(res, 200, 'User transaction pin set successfully');
  });

  static verifyTransactionPin = catchAsync(async (req: Request, res: Response) => {
    const { newPin } = req.body;
    const email = (req as any).user.email;

    const user = await UserService.checkThatUserExistWithEmail(email);

    if (!user) return sendError(res, 404, 'User does not exist');

    const userId = user._id as string;

    await AuthService.verifyTransactionPin(userId, newPin);

    return sendSuccess(res, 200, 'Transaction pin verified successfully');
  });

  static checkIfEmailExistAndSendToken = catchAsync(async (req: Request, res: Response) => {
    const token = await generateRandomToken();
    const email = req.body.email;

    const userExist = await UserService.checkThatUserExistWithEmail(email);

    if (!userExist) {
      return sendError(res, 404, `User with email: ${email} does not exist`);
    }

    const updateData = {
      verificationOTP: token,
      otpCreationTime: Date.now(),
    };
    await UserService.updateUserById(userExist._id, updateData);

    const emailSender = new EmailSender(
      process.env.SENDER_EMAIL,
      process.env.SENDER_PASSWORD
    );
    await emailSender.send(email, 'Your OTP Code', `Your OTP code is: ${token}`);

    return sendSuccess(res, 200, `token sent successfully to ${email}`);
  });

  static verifyOtp = catchAsync(async (req: Request, res: Response) => {
    const { email, verificationCode } = req.body;

    const verified = await AuthService.verifyOTP(email, verificationCode);

    if (!verified) {
      return sendError(res, 400, 'OTP verification unsuccessful');
    }

    return sendSuccess(res, 200, 'OTP verification successful', email);
  });

  static setPassword = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await UserService.updateUserByEmail(email, { password: hash });

    return sendSuccess(res, 200, 'Password set successfully');
  });

  static resendOtp = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await UserService.checkThatUserExistWithEmail(email);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    await generateAndSaveOTP(email);

    return sendSuccess(res, 200, `email successfully sent to ${email}`);
  });
}

export default Auth;
