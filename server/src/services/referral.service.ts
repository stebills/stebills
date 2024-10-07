import { Referral } from '../models/referralModel';
import User from '../models/user.model';
import crypto from 'crypto';
import UserService from './user.service';

class ReferralService {
  static async createReferral(user: string, referrer: string | undefined) {
    // Generate a unique referral code
    const referralCode = crypto.randomBytes(4).toString('hex');

    const referral = await Referral.create({
      user,
      referrer,
      referralCode,
    });

    console.log('referral:', referral);

    const updateData: any = {
      referral: referral._id,
    };

    await UserService.updateUserById(user, updateData);

    return referral;
  }

  static async rewardReferrer(user: string) {
    const userInfo = await User.findById(user);
    if (!userInfo) throw new Error('user not found');

    //getting the new user referral info
    const referralInfo = await Referral.findOne({
      referral: userInfo.referral,
    });

    if (!referralInfo) throw new Error('Referrer info not found');

    // condition this only run when the referal status is pending
    const referrer = referralInfo.referrer;

    // getting referrer info
    const referrerInfo = await Referral.findOne({ referralCode: referrer });

    if (!referrerInfo) throw new Error('referrerInfo not found 😢');
    // Define your reward logic here
    // get reward amount from admin settings
    const rewardAmount = 100; // TODO: Set initial reward, can be updated later..... you can add it to admin settings so that you can set the reward value

    // Update referrer wallet
    referrerInfo.bonus += rewardAmount;
    await referrerInfo.save();

    return 'success';
  }

  static async getReferalDetailsByUserId(userId: string) {
    const data = await Referral.findOne({ user: userId });
    if (!data) throw new Error('referal not found 🥲');
    return data;
  }
}

export default ReferralService;

// async function main(userId: string) {
//   await ReferralService.createReferral(userId, undefined);
// }

// main('668803b13cb05985191e2e87');
