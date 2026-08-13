import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { ObjectId } from 'mongodb';
import { USER_PRIVATE_FIELDS } from '../utils/constants';

class UserService {
  static async checkThatUserExistWithPhoneNumber(number: number) {
    try {
      const user = await User.findOne({ number })
        .lean()
        .sort({ createdAt: -1 });
      return user;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  static async checkThatUserExistWithEmail(email: string) {
    try {
      const user = await User.findOne({ email })
        .lean()
        .sort({ createdAt: -1 })
        .populate({ path: 'wallet', select: 'balance' })
        .select('firstName lastName email number');

      return user;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  static async checkThatPasswordIsValid(email: string, password: string) {
    try {
      const user = await User.findOne({ email }).lean().sort({ createdAt: -1 });

      if (!user || !user.password) {
        return false;
      }

      const isMatch = await bcrypt.compare(password, user.password);

      return isMatch;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  static async isValidEmail(email: string) {
    // Regular expression for basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static async isValidPhoneNumber(phoneNumber: string) {
    // Regular expression for basic phone number format validation
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phoneNumber);
  }

  static async getAllUser() {
    try {
      const users = User.find({})
        .lean()
        .sort({ createdAt: -1 })
        .populate({ path: 'wallet', select: 'balance _id' })
        .select(USER_PRIVATE_FIELDS);
      return users;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  static async suspendedUser() {
    try {
      const users = User.find({ isSuspended: true })
        .populate({ path: 'wallet', select: 'balance _id' })
        .lean()
        .sort({ createdAt: -1 })
        .select(USER_PRIVATE_FIELDS);
      return users;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  static async allAgents() {
    try {
      const agents = User.find({ role: 'agent' })
        .populate({ path: 'wallet', select: 'balance _id' })
        .lean()
        .sort({ createdAt: -1 })
        .select(USER_PRIVATE_FIELDS);
      return agents;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  static async isUserSuspended(userId: string) {
    try {
      const user = await User.findById(userId).lean().select('isSuspended');

      if (!user) throw new Error('User not found 😒');

      // Toggle the isSuspended status
      const updatedUser = await this.updateUserById(userId, {
        isSuspended: !user.isSuspended,
      });

      return updatedUser?.isSuspended;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  static async getUserById(id: any) {
    try {
      const users = User.findOne({ _id: new ObjectId(id) })
        .lean()
        .select(USER_PRIVATE_FIELDS);
      return users;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  static async updateUserById(id: any, updateData: object) {
    try {
      // const User = db.collection("users");
      const users = await User.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (!users) throw new Error('No users found🥲');

      const updatedUser = await User.findOne({ _id: new ObjectId(id) }).select(
        USER_PRIVATE_FIELDS
      );
      return updatedUser;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  static async updateUserByEmail(email: string, updateData: object) {
    try {
      // const User = db.collection("users");
      const users = User.updateOne({ email }, { $set: updateData });

      if (!users) throw new Error('No users found🥲');

      const updatedUser = await User.findOne({ email }).select(
        USER_PRIVATE_FIELDS
      );

      return updatedUser;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  static async getCurrentAmountByEmail(email: string) {
    try {
      const user = await User.findOne({ email }).populate('wallet');
      if (!user) {
        throw new Error('User or wallet not found');
      }

      // const balance = user.wallet.balance;
      // return balance;
    } catch (error) {
      console.error('Error fetching user amount:', error);
      throw error;
    }
  }

  static async getUserRoleById(id: string) {
    try {
      const role = User.findOne({ _id: new ObjectId(id) })
        .lean()
        .select('role');
      return role;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}

export default UserService;
