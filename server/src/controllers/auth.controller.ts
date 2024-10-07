import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/authService';
import { log } from 'console';
import UserService from '../services/user.service';
import {
  generateRandomToken,
  generateAndSaveOTP,
} from '../utils/GenerateRandomToken';
import bcrypt from 'bcrypt';
import EmailSender from '../services/mail.service'

class Auth {
  static verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, verificationCode } = req.body;

      if (!email || !verificationCode) {
        throw new Error('Missing fields: Email and OTP required');
      }

      try {
        await AuthService.verifyEmail(email, verificationCode);
      } catch (error: any) {
        console.error('Error verifying email:', error);
        throw new Error(error.message);
      }

      return res
        .status(200)
        .json({ error: false, message: 'User verification successful😁' });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  };

  static setTransactionPin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { newPin } = req.body;
      const email = (req as any).user.email;

      if (!newPin) {
        res.status(400).json({
          error: true,
          message: 'Missing fields: Email and newPin required',
        });
      }

      try {
        await AuthService.setTransactionPin(email, newPin);
      } catch (error: any) {
        console.error('Error setting transaction pin:', error);
        throw new Error(error.message);
      }

      console.log('Transaction Pin set successfully.');

      res.status(200).json({
        error: false,
        message: 'User transaction pin set successfully😁',
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  };

  static verifyTransactionPin = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    const { newPin } = req.body;
    const email = (req as any).user.email;
    try {
      const user = await UserService.checkThatUserExistWithEmail(email);

      if (!user) throw new Error('user does not exist😒');

      const userId = user._id as string;

      await AuthService.verifyTransactionPin(userId, newPin);

      res.status(200).json({
        error: false,
        message: 'Transaction pin verified successfully',
      });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: true, message: error.message });
    }
  };

  static async checkIfEmailExistAndSendToken(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    try {
      // generate reset token
      const token = await generateRandomToken();

      const email = req.body.email;

      // check if user exist
      const userExist = await UserService.checkThatUserExistWithEmail(email);

      if (!userExist) {
        throw new Error(`User with email: ${email} does not exist`);
      }

      // updating the user with otp
      const updateData = {
        verificationOTP: token,
        otpCreationTime: Date.now(),
      };
      await UserService.updateUserById(userExist._id, updateData);

      // sending email verification otp
      const emailSender = new EmailSender(
        process.env.SENDER_EMAIL,
        process.env.SENDER_PASSWORD
      );
      await emailSender.send(
        email,
        'Your OTP Code',
        `Your OTP code is: ${token}`
      );
      return res
        .status(200)
        .json({ error: false, message: `token sent successfully to ${email}` });
    } catch (error: any) {
      log({ error: true, message: error.message });
      res.status(500).json({ error: true, message: error.message });
    }
  }

  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, verificationCode } = req.body;

      const verifyCode = await AuthService.verifyOTP(email, verificationCode);

      if (verifyCode === true) {
        return res.status(200).json({
          error: false,
          data: email,
          message: 'OTP verification successful😁',
        });
      }

      return res.status(200).json({
        error: true,
        message: 'OTP verification unsuccessful 😢',
      });
    } catch (error: any) {
      console.error(error.message);
      res.status(400).json({ error: true, message: error.message });
    }
  }

  static async setPassword(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const updateData = { password: hash };
      // updating user by email
      await UserService.updateUserByEmail(email, updateData);

      res.status(200).json({ error: false });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: true, message: error.message });
    }
  }

  static async resendOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await UserService.checkThatUserExistWithEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate and save a new OTP
      await generateAndSaveOTP(email);

      res
        .status(200)
        .json({ error: false, message: `email successful sent to ${email}` });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: true, message: error.message });
    }
  }
}

export default Auth;
