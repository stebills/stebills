import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./user.model";

export interface IWallet extends Document {
  _id: string;
  walletName: string;
  balance: number;
  stebillsAccountNum: string;
  monnifyAccountNum: string[];
  user: Types.ObjectId | IUser;
}

const WalletSchema: Schema = new Schema({
  walletName: { type: String, required: true },
  balance: { type: Number, default: 0, required: true },
  stebillsAccountNum: { type: String },
  monnifyAccountNum: {
    type: [
      {
        bankCode: { type: String },
        bankName: { type: String },
        accountNumber: { type: String },
        accountName: { type: String },
      },
    ],
    default: [],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Wallet = mongoose.model<IWallet>("Wallet", WalletSchema);
export default Wallet;