import mongoose from 'mongoose';
import { IUser } from './user.model';

export interface IProfile extends Document {
  _id: string;
  name: string;
  address: string;
  phone: String;
  user: IUser
}

const profileScheme = new mongoose.Schema(
  {
    name: String,
    image: String,
    address: String,
    phone: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model<IProfile>('Profile', profileScheme);
export default Profile;
