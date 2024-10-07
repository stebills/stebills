import mongoose, { Schema, Document } from 'mongoose';

export interface IReferral extends Document {
  _id: string;
  referrer?: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  referralCode: string;
  status: 'pending' | 'completed';
  createdAt: Date;
  bonus: number;
}

const ReferralSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    referralCode: { type: String, required: true, unique: true },
    bonus: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Referral = mongoose.model<IReferral>('Referral', ReferralSchema);

export default Referral;
