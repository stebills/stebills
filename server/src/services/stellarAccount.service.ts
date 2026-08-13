import StellarAccount from '../models/stellarAccount.model';

class StellarAccountService {
  static async registerAccount(
    user: string,
    publicKey: string,
    accountIndex: number,
    label: string,
    network: 'testnet' | 'mainnet' = 'testnet'
  ) {
    try {
      const existing = await StellarAccount.findOne({ publicKey });
      if (existing) {
        throw new Error('This Stellar account is already registered');
      }

      const account = await StellarAccount.create({
        user,
        publicKey,
        accountIndex,
        label,
        network,
        isFunded: true,
      });

      return account;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  static async listAccountsForUser(user: string) {
    try {
      return await StellarAccount.find({ user }).sort({ accountIndex: 1 }).lean();
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  static async renameAccount(user: string, id: string, label: string) {
    try {
      const account = await StellarAccount.findOneAndUpdate(
        { _id: id, user },
        { $set: { label } },
        { new: true }
      );

      if (!account) throw new Error('Account not found');

      return account;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  static async deleteAccount(user: string, id: string) {
    try {
      const account = await StellarAccount.findOneAndDelete({ _id: id, user });

      if (!account) throw new Error('Account not found');

      return account;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  static async nextAccountIndex(user: string) {
    try {
      const lastAccount = await StellarAccount.findOne({ user })
        .sort({ accountIndex: -1 })
        .lean();

      return lastAccount ? lastAccount.accountIndex + 1 : 0;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}

export default StellarAccountService;
