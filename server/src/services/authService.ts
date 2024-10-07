import UserService from '../services/user.service';
import User from '../models/user.model';
import { ObjectId } from 'mongodb';
import { checkIfOtpIsExpired } from '../utils/checkIfOtpExpire';
import { comparePin, hashPin } from '../utils/hashPin';

class AuthService {
  static async verifyEmail(email: string, verificationCode: string) {
    try {
      const user = await UserService.checkThatUserExistWithEmail(email);

      if (!user) {
        throw new Error(`User with email: ${email} does not exist`);
      }

      const isExpired = await this.verifyOTP(email, verificationCode);

      if (isExpired === false) {
        const updateData = {
          verified: true,
          verificationOTP: '',
          otpCreationTime: '',
        };
        await UserService.updateUserById(user._id, updateData);
      }
    } catch (error: any) {
      console.error('Error verifying email:', error);
      throw new Error(error.message);
    }
  }

  static async setTransactionPin(email: string, transactionPin: string) {
    try {
      const user = await UserService.checkThatUserExistWithEmail(email);

      if (!user) {
        throw new Error('User not found');
      }

      const hashedPin = await hashPin(transactionPin);

      const updateData = { transactionPin: hashedPin, status: 'active' };
      await UserService.updateUserById(user._id, updateData);

      console.log('Transaction pin set successfully.');
    } catch (error: any) {
      console.error('Error verifying email:', error);
      throw new Error(error.message);
    }
  }

  static async verifyTransactionPin(userId: string, transactionPin: string) {
    const user = await UserService.getUserById(userId);

    if (!user || !user.transactionPin) {
      throw new Error('User or transaction pin not found');
    }

    const match = await comparePin(transactionPin, user.transactionPin);
    if (!match) {
      throw new Error('Incorrect transaction pin');
    }

    return true;
  }

  static async verifyOTP(email: string, verificationCode: string) {
    try {
      const user = await UserService.checkThatUserExistWithEmail(email);

      if (!user) {
        throw new Error(`User with email: ${email} does not exist`);
      }

      const UserOtp = user.verificationOTP.toString();

      if (verificationCode === UserOtp) {
        const otpCreationTime = user.otpCreationTime;

        if (!otpCreationTime) {
          throw new Error('OTP creation time is not available');
        }

        const isExpired = checkIfOtpIsExpired(otpCreationTime);

        // setting the verificationOTP
        if (isExpired === false) {
          const updateData = { verificationOTP: '', otpCreationTime: '' };
          await UserService.updateUserById(user._id, updateData);
          return true;
        }
        return false;
      } else {
        console.log({ error: true, message: 'Incorrect OTP😢' });
        throw new Error('Incorrect OTP😢');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  // static async logout(email: string, verificationCode: string) {
  //   try {
  //     const signout = catchAsync(async (req, res) => {
  //       //get the token from req header
  //       const token = req.header("Authorization");
  //       console.log(token);
  //       if (!token) {
  //         return res.status(400).json({ error: "No token provided" });
  //       }

  //       const tokenDoc = await UserToken.findOneAndUpdate(
  //         { token: token },
  //         { blacklisted: true }
  //       );
  //       console.log(tokenDoc);
  //       res.json({ message: "Logout successfully😊" });
  //     });
  //   } catch (error: any) {
  //     throw new Error(error)
  //   }
  // }
}

export default AuthService;
