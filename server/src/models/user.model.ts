// import crypto from 'crypto';
import mongoose, { Schema } from 'mongoose';
import { IWallet } from './wallet.model';
import { IReferral } from './referral.model';

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  password: string;
  wallet: IWallet;
  email: string;
  phone: number;
  isSuspended: boolean;
  verified: boolean;
  verificationOTP: number;
  transactionPin?: string;
  status: string;
  otpCreationTime?: Date;
  role: string;
  referral: IReferral;
  googleId?: string;
  authProvider: 'local' | 'google';
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: {
      type: String,
      required: function (this: { authProvider?: string }) {
        return this.authProvider !== 'google';
      },
    },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String, unique: true, sparse: true },
    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: Number },
    transactionPin: { type: String },
    role: { type: String, enum: ['user', 'admin', 'agent'], default: 'user' },
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallets' },
    isSuspended: { type: Boolean, default: false },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Inactive',
    },
    referral: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Referral',
    },
    isBlocked: { type: Boolean, default: false },
    otpCreationTime: { type: Date },
  },
  { timestamps: true }
);

// userScheme.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // encrypt password before saving into mongoDB
// userScheme.methods.encryptPassword = async function (password) {
//   const salt = await bcrypt.genSalt(10);
//   return await bcrypt.hash(password, salt);
// };

// userScheme.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userScheme.methods.getResetPasswordToken = function () {
//   const resetToken = crypto.randomBytes(20).toString('hex');

//   this.resetPasswordToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes

//   return resetToken;
// };

const User = mongoose.model<IUser>('User', userSchema);
export default User;
