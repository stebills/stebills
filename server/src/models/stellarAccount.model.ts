import mongoose, { Schema, Types } from 'mongoose';
import { IUser } from './user.model';

export interface IStellarAccount extends Document {
  _id: string;
  user: Types.ObjectId | IUser;
  publicKey: string;
  label: string;
  accountIndex: number;
  network: 'testnet' | 'mainnet';
  isFunded: boolean;
}

const StellarAccountSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    publicKey: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    accountIndex: { type: Number, required: true },
    network: { type: String, enum: ['testnet', 'mainnet'], default: 'testnet' },
    isFunded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

StellarAccountSchema.index({ user: 1, accountIndex: 1, network: 1 }, { unique: true });

const StellarAccount = mongoose.model<IStellarAccount>('StellarAccount', StellarAccountSchema);
export default StellarAccount;
