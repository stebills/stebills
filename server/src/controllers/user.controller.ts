import { Request, Response } from 'express';
import User from '../models/user.model';
import UserService from '../services/user.service';
import Profile from '../models/profile.model';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import WalletService from '../services/wallet.service';
import Referral from '../models/referral.model';
import ReferralService from '../services/referral.service';
import JwtHelper from '../utils/JwtHelper';
import Wallet from '../models/wallet.model';
import BankDetails from '../models/bankDetails.model';
import Notification from '../models/notification.model';
import Beneficiary from '../models/beneficiaries.model';
import Transactions from '../models/transaction.model';
import catchAsync from '../utils/catchAsync';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { USER_PRIVATE_FIELDS } from '../utils/constants';
import { getPaginationParams, buildPaginationMeta } from '../utils/paginate';

class UserController {
  static postUser = catchAsync(async (req: Request, res: Response) => {
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
      return sendError(res, 400, 'Invalid email address');
    }

    const emailExist = await UserService.checkThatUserExistWithEmail(email);
    const numberExist = await UserService.checkThatUserExistWithPhoneNumber(
      number
    );

    if (emailExist) {
      return sendError(res, 409, `User ${email} already exists`);
    }

    if (numberExist) {
      return sendError(res, 409, `User ${number} already exists`);
    }

    if (password !== confirmPassword) {
      return sendError(res, 400, 'Passwords mismatch');
    }

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

    return sendSuccess(res, 201, 'User created successfully', {
      user: createdUser,
      token,
    });
  });

  static login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'All fields must be filled');
    }

    const user = await UserService.checkThatUserExistWithEmail(email);

    if (!user) {
      return sendError(res, 404, 'User does not exist');
    }

    const passwordMatched = await UserService.checkThatPasswordIsValid(
      email,
      password
    );

    if (!passwordMatched) {
      return sendError(res, 401, 'Incorrect password');
    }

    const expiresIn = '30m';
    const payload = {
      userId: user._id,
    };

    const token = JwtHelper.generateToken(payload, expiresIn);

    return sendSuccess(res, 200, 'Login successful', { user, token });
  });

  static getUsers = catchAsync(async (req: Request, res: Response) => {
    const searchQuery = req.query.q as string | undefined;

    const searchCondition = searchQuery
      ? { email: { $regex: searchQuery, $options: 'i' } }
      : {};

    const { page, pageSize, skip } = getPaginationParams(req.query);

    const total = await User.countDocuments(searchCondition);

    const result = await User.find(searchCondition)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .select('-password')
      .lean();

    return res.status(200).json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      ...buildPaginationMeta(page, pageSize, skip, total),
      data: result,
    });
  });

  static getUserById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findById(id)
      .lean()
      .sort({ createdAt: -1 })
      .select(USER_PRIVATE_FIELDS);

    if (!user) return sendError(res, 404, 'User not found');

    return sendSuccess(res, 200, 'User fetched successfully', user);
  });

  static getSuspendedUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await UserService.suspendedUser();

    return sendSuccess(res, 200, 'Suspended users fetched successfully', users);
  });

  static getAllAgents = catchAsync(async (req: Request, res: Response) => {
    const agents = await UserService.allAgents();

    return sendSuccess(res, 200, 'Agents fetched successfully', agents);
  });

  static toggleUserSuspension = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;

    const toggleResponse = await UserService.isUserSuspended(userId);

    return sendSuccess(res, 200, 'User suspension toggled successfully', toggleResponse);
  });

  static updateUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateData = req.body;

    if (updateData.password) {
      return sendError(res, 400, 'Authentication required to update or set password');
    }

    const user = await UserService.updateUserById(id, updateData);

    return sendSuccess(res, 200, 'User updated successfully', user);
  });

  static deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return sendError(res, 404, 'User not found');

    await Promise.all([
      Profile.findOneAndDelete({ user: user._id }),
      Wallet.findOneAndDelete({ user: user._id }),
      BankDetails.findOneAndDelete({ user: user._id }),
      Beneficiary.findOneAndDelete({ user: user._id }),
      Notification.findOneAndDelete({ userId: user._id }),
      Referral.findOneAndDelete({ user: user._id }),
      Transactions.findOneAndDelete({ user: user._id }),
    ]);

    await User.deleteOne({ _id: user._id });

    return sendSuccess(res, 200, `User ${user.firstName} ${user.lastName} removed successfully`);
  });
}

export default UserController;
