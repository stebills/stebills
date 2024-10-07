import { ObjectId } from 'mongoose';
import { generateAccountNumber } from '../utils/accountNumberGen';
import { Wallets } from '../models/wallet.model';
import TransactionService from './transaction.service';
import { log } from 'console';
import ReferralService from './referral.service';

export async function updateWallet(user: string, amount: number, type: string) {
  try {
    const userWallet = await Wallets.findOne({ user: user });

    if (!userWallet) throw new Error('Wallet not found');

    let newBalance;
    // add amount to walletbalance if type income
    if (type === 'INCOME') {
      newBalance = userWallet.balance + amount;
    }

    // reduct payment from wallet balance if type payment
    if (type === 'EXPENSE') {
      if (amount > userWallet.balance) {
        throw new Error("payment can't be greater than current wallet balance");
      }
      newBalance = userWallet.balance - amount;
    }
    //update wallet balance
    await Wallets.updateOne({ user: user }, { $set: { balance: newBalance } });
  } catch (error: any) {
    log(error);
    throw new Error(error.message);
  }
}


class WalletService {

  static async createWallet(user: string, firstName: string, lastName: string) {
    try {
      const walletName = ` ${firstName} ${lastName}`;
      const billPointAccountNum = generateAccountNumber();
      let walletData = {
        user,
        walletName,
        billPointAccountNum,
      };

      const newWallet = await Wallets.create(walletData);

      return newWallet;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  static async addMoneyToWalet(user: string, amount: number) {
    try {
      await updateWallet(user, amount, 'INCOME');
      await ReferralService.rewardReferrer(user);

      return 'success';
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  static async subtractMoneyFromWalet(user: string, amount: number) {
    try {
      await updateWallet(user, amount, 'EXPENSE');

      return 'success';
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}

export default WalletService;
