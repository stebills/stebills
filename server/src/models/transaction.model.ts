import { ObjectId } from 'mongodb';
import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export enum TransactionType {
  DataServices = 'Data-Services',
  AirtimeRecharge = 'Airtime-Recharge',
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
  Airtime = 'Airtime',
  ElectricityBill = 'Electricity-Bill',
  Cable = 'cable',
  TVSubscription = 'TV-Subscription',
  Education = 'Education',
  Funding = 'Wallet-Funding',
}

export enum TransactionStatus {
  successful = 'successful',
  Delivered = 'delivered',
  Pending = 'pending',
  Failed = 'failed',
}

export interface ITransaction extends Document {
  user: ObjectId;
  transactionType: TransactionType;
  transactionId: string;
  details: string;
  status: TransactionStatus;
  amount: number;
  date: Date;
  token?: string;
  commission: number;
}

const TransactionSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    transactionType: {
      type: String,
      enum: [
        'Data-Services',
        'Airtime-Recharge',
        'Deposit',
        'Withdraw',
        'Airtime',
        'Electricity-Bill',
        'Cable',
        'TV-Subscription',
        'Education',
        'Fund-Wallet',
      ],
      required: true,
    },
    transactionId: { type: String, required: true },
    details: { type: String, required: true },
    status: {
      type: String,
      enum: ['success', 'delivered', 'pending', 'failed'],
      required: true,
    },
    amount: { type: Number, required: true },
    commission: { type: String },
    token: { type: String },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

TransactionSchema.plugin(mongoosePaginate);

const Transactions: PaginateModel<ITransaction> = mongoose.model<
  ITransaction,
  PaginateModel<ITransaction>
>('Transactions', TransactionSchema);

export default Transactions;
