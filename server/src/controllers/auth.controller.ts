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
import GoogleAuthService from '../services/googleAuth.service';
import JwtHelper from '../utils/JwtHelper';
import User from '../models/user.model';
import Profile from '../models/profile.model';
import ReferralService from '../services/referral.service';
import WalletService from '../services/wallet.service';

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

  static googleSignIn = catchAsync(async (req: Request, res: Response) => {
    const { idToken } = req.body;

    if (!idToken) {
      return sendError(res, 400, 'Missing field: idToken required');
    }

    const { googleId, email, name } = await GoogleAuthService.verifyIdToken(idToken);

    let user = await User.findOne({ googleId });
    let isNewUser = false;

    if (!user) {
      user = await User.findOne({ email });
    }

    if (!user) {
      isNewUser = true;
      const [firstName, ...rest] = name.split(' ');
      const lastName = rest.join(' ') || firstName;

      user = await User.create({
        name,
        email,
        phone: '',
        authProvider: 'google',
        googleId,
        isVerified: true,
        status: 'Active',
      });

      await Profile.create({
        user: user._id,
        phone: '',
        name,
        image: `https://ui-avatars.com/api/?uppercase=true&name=${firstName} ${lastName}&background=random&color=random&size=128`,
      });

      const referral = await ReferralService.createReferral(user._id as string, undefined);
      const wallet = await WalletService.createWallet(user._id as string, firstName, lastName);

      await User.updateOne(
        { _id: user._id },
        { $set: { referral: referral._id, wallet: wallet._id } }
      );
    } else if (!user.googleId) {
      await User.updateOne({ _id: user._id }, { $set: { googleId } });
    }

    const expiresIn = '30m';
    const token = JwtHelper.generateToken({ userId: user._id }, expiresIn);

    const authenticatedUser = await User.findById(user._id).select(
      '-password -transactionPin -__v'
    );

    return sendSuccess(res, 200, 'Google sign-in successful', {
      user: authenticatedUser,
      token,
      isNewUser,
    });
  });
}

export default Auth;
