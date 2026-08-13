import mongoose, { Schema, Document } from 'mongoose';

enum BeneficiaryType {
  Transfer = 'transfer',
  Deposit = 'deposit',
  Airtime = 'airtime',
  Data = 'data',
  Electricity = 'electricity',
  Cable = 'cable',
}

interface IBeneficiary extends Document {
  _id: string;
  user: string;
  type: BeneficiaryType;
  name?: string;
  accountNumber?: string;
  bankName?: string;
  phoneNumber?: string;
  network?: string;
  meterNumber?: string;
  customerName?: string;
  billingType?: string;
  smartcardNumber?: string;
  providerName?: string;
}

const beneficiarySchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId },
    type: {
      type: String,
      enum: Object.values(BeneficiaryType),
      required: true,
    },
    name: { type: String },
    accountNumber: { type: String },
    bankName: { type: String },
    phoneNumber: { type: String },
    network: { type: String },
    meterNumber: { type: String },
    customerName: { type: String },
    billingType: { type: String },
    smartcardNumber: { type: String },
    providerName: { type: String },
  },
  { timestamps: true }
);

const Beneficiary = mongoose.model<IBeneficiary>(
  'Beneficiary',
  beneficiarySchema
);

export default Beneficiary;
