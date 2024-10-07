import { BankDetails, IBankDetails } from '../models/bankDetails.model';
import Transactions from '../models/transactionModel';
import { IUser } from '../models/user.model';
import { IWallet, Wallets } from '../models/wallet.model';
import PaystackService from './paystack.service';
import MonnifyService from './monnify.service';
import WalletService, { updateWallet } from './wallet.service';

class TransactionService {
  static async createTransaction(data: object) {
    await Transactions.create(data);
  }

  // Sending money to a billspoint account
  static async sendMoney(
    senderId: string,
    walletNumber: number,
    amount: number
  ) {
    const senderWallet = await Wallets.findOne({ user: senderId });
    const receiverWallet = await Wallets.findOne({
      billPointAccountNum: walletNumber,
    }).populate({
      path: 'user',
      select: '_id',
    });
    if (senderWallet && receiverWallet) {
      if (senderWallet.balance < amount) {
        throw new Error('insufficient balance');
      }
      // update sender wallet balance
      await updateWallet(senderId, amount, 'EXPENSE');

      //update receiver wallet balance
      const receiverUserId = (receiverWallet.user as IUser)._id;
      await updateWallet(receiverUserId, amount, 'INCOME');

      return true;
    }
  }

  static async initiateTransaction(bankName: string, accountNumber: string) {
    const response = await PaystackService.createRecipient(
      bankName,
      accountNumber
    );

    return response.data;
  }

  // Paystack
  // static async withdrawWalletBalance(
  //   userId: string,
  //   amount: number,
  //   reason: string,
  //   recipient: string
  // ) {
  //   const userWallet = await Wallets.findOne({ user: userId });
  //   const userBank = await BankDetails.findOne({ user: userId });
  //   if (!userWallet) {
  //     throw new Error("User wallet not found");
  //   }

  //   if (!userBank) {
  //     throw new Error("add bank account");
  //   }

  //   if (userWallet.balance < amount) {
  //     throw new Error("insufficient balance");
  //   }

  //   const withdrawal = await PaystackService.makePayment(
  //     amount,
  //     reason,
  //     recipient
  //   );

  //   if (withdrawal) {
  //     // update sender wallet balance
  //     await updateWallet(userId, amount, "EXPENSE");

  //     return withdrawal;
  //   }
  // }

  // Monnify
  static async withdrawWalletBalance(
    userId: string,
    amount: number,
    narration: string
  ) {
    try {
      const userWallet = await Wallets.findOne<IWallet>({
        user: userId,
      }).populate<{ user: IUser }>({
        path: 'user',
        select: 'firstName lastName',
      });

      const userBank = await BankDetails.findOne<IBankDetails>({
        user: userId,
      });

      if (!userWallet) {
        throw new Error('User wallet not found');
      }

      if (!userBank) {
        throw new Error('Bank account not added');
      }

      if (userWallet.balance < amount) {
        throw new Error('Insufficient balance');
      }

      const firstName = userWallet.user.firstName;
      const lastName = userWallet.user.lastName;
      const destinationAccountName = `${firstName} ${lastName}`;

      const transferData = {
        amount,
        narration,
        destinationBankCode: userBank.bankCode,
        destinationAccountNumber: userBank.accountNumber,
        sourceAccountNumber: '1554898284',
        destinationAccountName,
      };

      const withdrawal = await MonnifyService.initiateTransfer(transferData);

      if (withdrawal) {
        await updateWallet(userId, amount, 'EXPENSE');
        return withdrawal;
      }
    } catch (error: any) {
      console.error('Error during withdrawal:', error.message);
      throw new Error(error.message);
    }
  }

  static async sendMoneyToBank(
    userId: string,
    amount: number,
    reason: string,
    recipient: string
  ) {
    const userWallet = await Wallets.findOne({ user: userId });

    if (!userWallet) throw new Error('user wallet not found');
    if (userWallet.balance < amount) {
      throw new Error('insufficient balance');
    }

    const sentMoney = await PaystackService.makePayment(
      amount,
      reason,
      recipient
    );

    if (sentMoney) {
      // update sender wallet balance
      await updateWallet(userId, amount, 'EXPENSE');

      return sentMoney;
    }
  }
}

export default TransactionService;
