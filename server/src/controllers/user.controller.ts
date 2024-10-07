import { NextFunction, Request, Response } from 'express';
import User, { IUser } from '../models/user.model';
import UserService from '../services/user.service';
import Profile from '../models/profile.model';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import WalletService from '../services/wallet.service';
import Referral from '../models/referralModel';
import ReferralService from '../services/referral.service';
import JwtHelper from '../utils/JwtHelper';
import Wallet from '../models/wallet.model';
import BankDetails from '../models/bankDetails.model';
import Notification from '../models/notification.model';
import Beneficiary from '../models/beneficiaries.model';
import Transactions from '../models/transactionModel';

class userController {
  static async postUser(req: Request, res: Response) {
    const {
      firstName,
      lastName,
      email,
      number,
      password,
      confirmPassword,
      referrer,
      role,
    } = req.body;

    const isValidEmail = await UserService.isValidEmail(email);

    if (!isValidEmail) {
      throw new Error('Invalid company email address');
    }

    const emailExist = await UserService.checkThatUserExistWithEmail(email);
    const numberExist = await UserService.checkThatUserExistWithPhoneNumber(
      number
    );

    if (emailExist) {
      console.log(`User ${email} already exists`);
      throw new Error(`User ${email} already exists`);
    }

    if (numberExist) {
      console.log(`User ${number} already exists`);
      throw new Error(`User ${number} already exists`);
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: true, message: 'passwords mismatch🥱' });
    }

    // hashing of password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      number,
      role,
      password: hashedPassword,
      verified: false,
    });

    await Profile.create({
      user: newUser._id,
      phone: newUser.phone,
      name: `${newUser.firstName} ${newUser.lastName}`,
      image: `https://ui-avatars.com/api/?uppercase=true&name=${newUser.firstName} ${newUser.lastName}&background=random&color=random&size=128`,
    });

    const user = newUser._id;

    const newWallet = await WalletService.createWallet(
      user,
      firstName,
      lastName
    );

    const walletId = newWallet._id;

    let referral_Id;

    if (referrer) {
      const referrerData = await Referral.findOne({
        referralCode: referrer,
      });

      if (referrerData) {
        const referrerId = referrerData._id;

        const referral = await ReferralService.createReferral(user, referrerId);

        // await ReferralService.rewardReferrer(referrer);

        referral_Id = referral._id;
      }
    } else {
      const referral = await ReferralService.createReferral(user, undefined);

      referral_Id = referral._id;
    }

    await User.updateOne(
      { _id: user },
      {
        $set: {
          wallet: new ObjectId(walletId),
          referral: new ObjectId(referral_Id),
        },
      }
    );

    const expiresIn = '30m';
    const payload = {
      userId: newUser._id,
    };
    const token = JwtHelper.generateToken(payload, expiresIn);

    const createdUser = await User.findById(newUser._id).select(
      '-password -transactionPin -__v'
    );

    res.status(201).json({
      error: false,
      message: 'User created successfully',
      data: createdUser,
      token,
    });
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw Error('All fields must be filled');
      }

      const user = await UserService.checkThatUserExistWithEmail(email);

      if (!user) {
        return res
          .status(404)
          .json({ error: true, message: 'User does not exist😒' });
      }

      const passwordMatched = await UserService.checkThatPasswordIsValid(
        email,
        password
      );

      if (!passwordMatched) {
        return res
          .status(401)
          .json({ error: true, message: 'Incorrect Password 😢' });
      }

      const expiresIn = '30m';
      const payload = {
        userId: user._id,
      };

      const token = JwtHelper.generateToken(payload, expiresIn);

      res.status(200).json({
        error: false,
        data: user,
        token: token,
        message: 'login successful',
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const searchQuery = req.query.q as string | undefined;

      const searchCondition = searchQuery
        ? { email: { $regex: searchQuery, $options: 'i' } }
        : {};

      const page = Math.max(parseInt(req.query.page as string) || 1, 1);
      const pageSize = Math.min(parseInt(req.query.limit as string) || 25, 100);
      const skip = (page - 1) * pageSize;

      const total = await User.countDocuments(searchCondition);
      const pages = Math.ceil(total / pageSize);

      // Query for users with pagination, sorting, and field selection
      const usersQuery = User.find(searchCondition)
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .select('-password')
        .lean(); // Return plain JS objects

      const result = await usersQuery;

      res.status(200).json({
        startIndex: skip + 1,
        endIndex: skip + result.length,
        count: result.length,
        page,
        pages,
        total,
        data: result,
      });
    } catch (error: any) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const objects = await User.findById(id)
        .lean()
        .sort({ createdAt: -1 })
        .select('-password -verificationOTP -transactionPin');

      if (!objects) return res.status(404).json({ error: `user not found` });
      res.status(200).send(objects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSuspendedUsers(req: Request, res: Response) {
    try {
      const users = await UserService.suspendedUser();

      res.status(200).send(users);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  static async getAllAgents(req: Request, res: Response) {
    try {
      const agents = await UserService.allAgents();

      res.status(200).send(agents);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  static async toggleUserSuspension(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.params.id;

      const toggleResponse = await UserService.isUserSuspended(userId);
      res.status(200).send(toggleResponse);
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: false, message: error.message });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateData = req.body;

      if (updateData.password) {
        return res.status(400).json({
          error: true,
          message: 'Authentication required to update or set password',
        });
      }

      const user = await UserService.updateUserById(id, updateData);

      return res.status(200).send(user);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) return res.status(400).json({ error: `User not found` });

      const deletionPromises = [
        Profile.findOneAndDelete({ user: user._id }),
        Wallet.findOneAndDelete({ user: user._id }),
        BankDetails.findOneAndDelete({ user: user._id }),
        Beneficiary.findOneAndDelete({ user: user._id }),
        Notification.findOneAndDelete({ userId: user._id }),
        Referral.findOneAndDelete({ user: user._id }),
        Transactions.findOneAndDelete({ user: user._id }),
      ];

      await Promise.all(deletionPromises);

      await User.deleteOne({ _id: user._id });

      res.status(200).json({
        message: `User ${user.firstName} ${user.lastName} removed succesfully`,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }
}

export default userController;
